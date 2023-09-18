/* eslint-disable no-new */
import * as cdk from "aws-cdk-lib";
import * as cfn from "aws-cdk-lib/aws-cloudfront";
import * as deployment from "aws-cdk-lib/aws-s3-deployment";
import * as iam from "aws-cdk-lib/aws-iam";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { AppStage } from "./get-config";
import addMetaTags from "./add-meta-tags";

export interface StaticSiteStackProps extends cdk.StackProps {
  appName: string;
  service: string;
  stage: AppStage;
  baseBucketName: string;
}

export class StaticSiteStack extends cdk.Stack {
  constructor(parent: Construct, name: string, props: StaticSiteStackProps) {
    super(parent, name, props);

    const rootBucketName = `${props.baseBucketName}-${props.stage}`;
    const logBucketName = `${props.baseBucketName}-logs-${props.stage}`;

    // Storage
    const logBucket = new s3.Bucket(this, `${name}-RootBucket`, {
      bucketName: logBucketName,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Allows Deletion of bucket by cloudformation
      autoDeleteObjects: true, // Auto-deletes bucket contents when bucket is deleted
    });

    const rootBucket = new s3.Bucket(this, `${name}-LogBucket`, {
      bucketName: rootBucketName,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      serverAccessLogsBucket: logBucket,
      serverAccessLogsPrefix: "cdn/",

      // TODO: Remove after initial development complete, not a best practice in production
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Allows Deletion of bucket by cloudformation
      autoDeleteObjects: true, // Auto-deletes bucket contents when bucket is deleted
    });

    // CDN
    const cloudfrontOAI = new cfn.OriginAccessIdentity(this, `${name}-OAI`, {
      comment: `OAI for ${name}`,
    });

    rootBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [rootBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId,
          ),
        ],
      }),
    );

    const distribution = new cfn.Distribution(this, `${name}-Distribution`, {
      // certificate: certificate, // TODO: unable to provide a cert without a domain
      defaultRootObject: "index.html",
      // domainNames: [siteDomain], // TODO: no domain was harmed during the production of this demo
      minimumProtocolVersion: cfn.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: "/error.html",
          ttl: cdk.Duration.minutes(30),
        },
      ],
      defaultBehavior: {
        origin: new origins.S3Origin(rootBucket, {
          originAccessIdentity: cloudfrontOAI,
        }),
        compress: true,
        allowedMethods: cfn.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cfn.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    // Tagging
    [logBucket, rootBucket, cloudfrontOAI, distribution].forEach((construct) =>
      addMetaTags(construct, props.appName, props.service, props.stage),
    );

    // Upload site to S3
    new deployment.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [deployment.Source.asset(`./dist-${props.stage}`)],
      destinationBucket: rootBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // Outputs
    new cdk.CfnOutput(this, "Root Bucket", { value: rootBucket.bucketName });
    new cdk.CfnOutput(this, "Log Bucket", { value: logBucket.bucketName });
    new cdk.CfnOutput(this, "Domain Name", { value: distribution.domainName });
  }
}
