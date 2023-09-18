import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { AppStage, getConfig } from './get-config';
import addMetaTags from './add-meta-tags';
import StaticSiteStage from './static-site-stage';

const config = getConfig();

interface PipelineStackProps extends cdk.StackProps {
  appName: string;
  service: string;
  baseBucketName: string;
}

export default class PipelineStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: PipelineStackProps) {
    super(parent, name, props);

    const getBuildCmd = (stage: AppStage) => `VITE_DEBUG_MODE=${false} \\
      VITE_APP_STAGE=${stage} \\
      VITE_APP_API_URL=${config.appStages[stage].apiUrl} \\
      npm run build -- --outDir=dist-${stage}`;

    const pipeline = new pipelines.CodePipeline(this, 'FetchProject-Pipeline', {
      pipelineName: 'FetchProject-Pipeline',
      synth: new pipelines.CodeBuildStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub(config.repo, config.branch),
        installCommands: [
          'npm install -g aws-cdk',
        ],
        commands: [
          'npm ci',
          getBuildCmd(AppStage.Dev),
          getBuildCmd(AppStage.PreProd),
          getBuildCmd(AppStage.Prod),
          'npx cdk synth',
        ],
        env: {
          // Note, changing environment variables may require you to
          // deploy the stack manually the first time
          APP_NAME: config.appName,
          REPO: config.repo,
          BRANCH: config.branch,
          BASE_BUCKET_NAME: config.appStages.infra.region,

          PIPELINE_ACCOUNT: config.appStages.infra.account,
          PIPELINE_REGION: config.appStages.infra.region,

          DEV_ACCOUNT: config.appStages.dev.account,
          DEV_REGION: config.appStages.dev.region,
          DEV_API_URL: config.appStages.dev.apiUrl,

          PREPROD_ACCOUNT: config.appStages.preprod.account,
          PREPROD_REGION: config.appStages.preprod.region,
          PREPROD_API_URL: config.appStages.preprod.apiUrl,

          PROD_ACCOUNT: config.appStages.prod.account,
          PROD_REGION: config.appStages.prod.region,
          PROD_API_URL: config.appStages.prod.apiUrl,
        },
      }),
    });

    // Add Stages for Dev, ProProd and Prod
    const devStage = new StaticSiteStage(this, 'Dev', {
      env: {
        account: config.appStages.dev.account,
        region: config.appStages.dev.region,
      },
      appName: props.appName,
      baseBucketName: props.baseBucketName,
      service: props.service,
      stage: AppStage.Dev,
    });
    const preprodStage = new StaticSiteStage(this, 'PreProd', {
      env: {
        account: config.appStages.preprod.account,
        region: config.appStages.preprod.region,
      },
      appName: props.appName,
      baseBucketName: props.baseBucketName,
      service: props.service,
      stage: AppStage.PreProd,
    });
    const prodStage = new StaticSiteStage(this, 'Prod', {
      env: {
        account: config.appStages.prod.account,
        region: config.appStages.prod.region,
      },
      appName: props.appName,
      baseBucketName: props.baseBucketName,
      service: props.service,
      stage: AppStage.Prod,
    });

    pipeline.addStage(devStage);
    pipeline.addStage(preprodStage);
    pipeline.addStage(prodStage, {
      // Prod contains a manual review step before deploying
      pre: [
        new pipelines.ManualApprovalStep('PromoteToProd'),
      ],
    });

    // Tagging
    [pipeline, devStage, preprodStage, prodStage]
      .forEach((construct) => addMetaTags(construct, props.appName, props.service, AppStage.Infra));

    addMetaTags(pipeline, props.appName, props.service, AppStage.Infra);
  }
}
