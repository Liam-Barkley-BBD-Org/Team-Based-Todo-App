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
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { execSync } from 'child_process';
import { Construct } from 'constructs';

export class CdkTodoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //SECRETS
    const dbCredentials: rds.Credentials = rds.Credentials.fromGeneratedSecret('postgresapi', { secretName: 'CdkTodoAppStacktodoapppostg' })
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

    //FRONT-END STUFF
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

    const hostedZone = new HostedZone(this, 'hosted-zone-front-end', {
      zoneName: 'acceleratedteamproductivity.shop',
    })

    const certificate = new cdk.aws_certificatemanager.Certificate(this, 'front-end-certificate', {
      domainName: '*.acceleratedteamproductivity.shop',
      certificateName: 'front-end-acceleratedteamproductivity-cert',
      keyAlgorithm: KeyAlgorithm.RSA_2048,
      validation: CertificateValidation.fromDns(hostedZone),
    })

    const cloudFrontFunctionFile: cloudfront.FileCodeOptions = {
      filePath: './src/cloudFrontProcessing.js'
    }

    const cloudFrontFunctions = new cloudfront.Function(this, 'BlockByHostFunction', {
      functionName: 'cloudFrontFunctionProcessing',
      code: cloudfront.FunctionCode.fromFile(cloudFrontFunctionFile)
    })

    const frontEndDistribution = new Distribution(this, 'bucket-distribution', {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(toDoAppBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
        functionAssociations: [
          {
            function: cloudFrontFunctions,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST
          }
        ]
      },
      defaultRootObject: 'index.html',
      certificate: certificate,
      domainNames: ['app.acceleratedteamproductivity.shop'],
      enableIpv6: false,

    })

    const frontEndRecord = new ARecord(this, 'front-end-aroute', {
      target: RecordTarget.fromAlias(new CloudFrontTarget(frontEndDistribution)),
      zone: hostedZone,
      recordName: 'app'
    })

    // //SECURITY STUFF
    const rdsVpc = new ec2.Vpc(this, 'RdsVpc', {
      maxAzs: 2, // Recommended for RDS HA
    });


    //DB STUFF
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSecurityGroup', {
      vpc: rdsVpc,
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
      vpc: rdsVpc,
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

    //BACK-END STUFF
    // const cluster = new ecs.Cluster(this, 'FargateCluster', {
    //   vpc: rdsVpc
    // });

    // const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'FargateService', {
    //   cluster,
    //   cpu: 256,
    //   memoryLimitMiB: 512,
    //   desiredCount: 1,
    //   publicLoadBalancer: true,
    //   certificate,
    //   domainName: 'api.acceleratedteamproductivity.shop',
    //   domainZone: hostedZone,
    //   listenerPort: 443,
    //   protocol: cdk.aws_elasticloadbalancingv2.ApplicationProtocol.HTTPS,
    //   redirectHTTP: true,
    //   taskImageOptions: {
    //     image: ecs.ContainerImage.fromAsset('./../server'), // path to your Dockerfile
    //     containerPort: 3000, // your Express app port
    //     environment: {
    //       NODE_ENV: 'production',
    //       API_PORT: '3000'
    //     },
    //   },
    // });

    // fargateService.taskDefinition.taskRole.addToPrincipalPolicy(
    //   new cdk.aws_iam.PolicyStatement({
    //     actions: ['secretsmanager:GetSecretValue'],
    //     resources: ['*']
    //   })
    // )

    // fargateService.targetGroup.configureHealthCheck({
    //   path: '/',
    //   healthyHttpCodes: '200-399',

    // });
  }
}

