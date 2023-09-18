import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AppStage } from "./get-config";

export default function addMetaTags(
  construct: Construct,
  appName: string,
  service: string,
  stage: AppStage,
) {
  cdk.Tags.of(construct).add("APPLICATION_NAME", appName);
  cdk.Tags.of(construct).add("SERVICE", service);
  cdk.Tags.of(construct).add("STAGE", stage);
}
