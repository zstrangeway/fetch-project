import * as env from "env-var";

export enum AppStage {
  Infra = "infra",
  Dev = "dev",
  PreProd = "preprod",
  Prod = "prod",
}

export interface AppConfig {
  account: string;
  region: string;
  apiUrl: string;
}

export interface Config {
  appName: string;
  repo: string;
  branch: string;
  baseBucketName: string;
  appStages: Record<AppStage, AppConfig>;
}

export const getConfig = (): Config => ({
  appName: env.get("APP_NAME").required().asString(),
  repo: env.get("REPO").required().asString(),
  branch: env.get("BRANCH").required().asString(),
  baseBucketName: env.get("BASE_BUCKET_NAME").required().asString(),
  appStages: {
    infra: {
      account: env.get("PIPELINE_ACCOUNT").required().asString(),
      region: env.get("PIPELINE_REGION").required().asString(),
      apiUrl: "", // not needed
    },
    dev: {
      account: env.get("DEV_ACCOUNT").required().asString(),
      region: env.get("DEV_REGION").required().asString(),
      apiUrl: env.get("DEV_API_URL").required().asString(),
    },
    preprod: {
      account: env.get("PREPROD_ACCOUNT").required().asString(),
      region: env.get("PREPROD_REGION").required().asString(),
      apiUrl: env.get("PREPROD_API_URL").required().asString(),
    },
    prod: {
      account: env.get("PROD_ACCOUNT").required().asString(),
      region: env.get("PROD_REGION").required().asString(),
      apiUrl: env.get("PROD_API_URL").required().asString(),
    },
  },
});
