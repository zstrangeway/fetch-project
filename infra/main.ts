import * as cdk from "aws-cdk-lib";
import { AppStage, getConfig } from "./lib/get-config";
import PipelineStack from "./lib/pipeline-stack";
import addMetaTags from "./lib/add-meta-tags";

const service = "front-end";
const config = getConfig();

const app = new cdk.App();

const pipelineStack = new PipelineStack(app, "FetchProject-PipelineStack", {
  env: {
    account: config.appStages.infra.account,
    region: config.appStages.infra.region,
  },
  appName: config.appName,
  baseBucketName: config.baseBucketName,
  service,
});

addMetaTags(pipelineStack, config.appName, service, AppStage.Infra);

app.synth();
