import * as cdk from 'aws-cdk-lib';
import { aws_secretsmanager as secretsmanager } from 'aws-cdk-lib';
import { CertificateValidation, KeyAlgorithm } from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { aws_cloudfront as cloudfront } from 'aws-cdk-lib';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as rds from 'aws-cdk-lib/aws-rds';
import { ARecord, HostedZone, NsRecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { execSync } from 'child_process';
import { Construct } from 'constructs';
import path from 'path';
import { FargateCluster } from 'aws-cdk-lib/aws-eks';

export class CdkTodoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //SECRETS
    const dbCredentials: rds.Credentials = rds.Credentials.fromGeneratedSecret('postgresapi', {
      secretName: 'post-gres-db-connection'
    })
    const aesEncryptionSecrets = new secretsmanager.Secret(this, 'aesEncryptionSecrets', {
      secretName: 'aes-256-cbc-key',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ algorithm: 'aes-256-gcm' }),
        generateStringKey: 'key',
        passwordLength: 44, // Base64-encoded 32 bytes => ceil((32 / 3) * 4) = 44
        excludePunctuation: true,
        includeSpace: false
      }
    })
    const jwtSecret = new secretsmanager.Secret(this, 'JwtSecret', {
      secretName: 'jwt-signing-secret',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: 'jwtSecret',
        passwordLength: 64,
        excludePunctuation: true,
        includeSpace: false
      },
    });

    const hostedZone = new HostedZone(this, 'hostedZone', {
      zoneName: 'acceleratedteamproductivity.shop',
    })

    const certificate = new cdk.aws_certificatemanager.Certificate(this, 'domainCertificate', {
      domainName: '*.acceleratedteamproductivity.shop',
      certificateName: 'acceleratedteamproductivity-cert',
      keyAlgorithm: KeyAlgorithm.RSA_2048,
      validation: CertificateValidation.fromDns(hostedZone),
    })


    if (!process.env.TAKEDOWN) {
      const generalVpc = new ec2.Vpc(this, 'generalVpc', {
        maxAzs: 2,
        // natGateways: 1,
      });


      // //FRONT-END STUFF
      execSync('npm i', { cwd: './../client', stdio: 'inherit' });
      execSync('npm run build', { cwd: './../client', stdio: 'inherit' });

      const toDoAppBucket = new s3.Bucket(this, 'to-do-app-bucket', {
        bucketName: 'to-do-app-bucket-v16',
        versioned: true,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true
      });

      new BucketDeployment(this, 'front-end-bucket-deployment', {
        destinationBucket: toDoAppBucket,
        sources: [Source.asset('./../client/dist')],
        cacheControl: [CacheControl.noCache()]
      })

      const frontEndDistribution = new Distribution(this, 'bucket-distribution', {
        defaultBehavior: {
          origin: S3BucketOrigin.withOriginAccessControl(toDoAppBucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
        },
        defaultRootObject: 'index.html',
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
          }
        ],
        certificate: certificate,
        domainNames: ['app.acceleratedteamproductivity.shop'],
        enableIpv6: false,
      })

      const frontEndRecord = new ARecord(this, 'front-end-aroute', {
        target: RecordTarget.fromAlias(new CloudFrontTarget(frontEndDistribution)),
        zone: hostedZone,
        recordName: 'app'
      })

      // DB STUFF
      const dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSecurityGroup', {
        vpc: generalVpc,
        description: 'Allow DB access',
        allowAllOutbound: true,
        securityGroupName: 'rds-security-group'
      });

      dbSecurityGroup.addIngressRule(
        ec2.Peer.anyIpv4(),
        ec2.Port.allTraffic(),
        'Make the DB Publically accesible'
      )

      const dbInstace = new rds.DatabaseInstance(this, 'to-do-app-postgres-instance', {
        engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_17_5 }),
        instanceIdentifier: 'to-do-app-postgres-instance',
        vpc: generalVpc,
        backupRetention: cdk.Duration.days(0),
        credentials: dbCredentials,
        multiAz: false,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
        deletionProtection: false,
        databaseName: 'todoappdb',
        allocatedStorage: 20,
        maxAllocatedStorage: 20,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        storageEncrypted: true,
        deleteAutomatedBackups: true,
        publiclyAccessible: true, //NOT FOR LONG HOE
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC
        },
        securityGroups: [dbSecurityGroup],
      });

      // // BACK-END STUFF
      const cluster = new ecs.Cluster(this, 'FargateCluster', {
        vpc: generalVpc,
      });

      const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'FargateService', {
        cluster,
        cpu: 256,
        memoryLimitMiB: 512,
        desiredCount: 1,
        publicLoadBalancer: true,
        certificate,
        domainName: 'api.acceleratedteamproductivity.shop',
        domainZone: hostedZone,
        listenerPort: 443,
        protocol: cdk.aws_elasticloadbalancingv2.ApplicationProtocol.HTTPS,
        redirectHTTP: true,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset('./../server', {}),
          containerPort: 3000,
          environment: {
            NODE_ENV: 'production',
            API_PORT: '3000'
          },
        },
      });

      fargateService.taskDefinition.taskRole.addToPrincipalPolicy(
        new cdk.aws_iam.PolicyStatement({
          actions: ['secretsmanager:GetSecretValue'],
          resources: ['*']
        })
      )

      fargateService.taskDefinition.obtainExecutionRole().addManagedPolicy(
        cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly')
      );
    }
  }
}

