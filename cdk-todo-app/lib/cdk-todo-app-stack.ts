import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class CdkTodoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //FRONT-END STUFF
    new s3.Bucket(this, 'to-do-app-bucket', {
      bucketName: 'to-do-app-bucket-uniqueflairyk',
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });


    //SECURITY STUFF
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

    const dbCredentials: rds.Credentials = rds.Credentials.fromGeneratedSecret('postgresapi', { secretName: 'CdkTodoAppStacktodoapppostg' })

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
  }
}
