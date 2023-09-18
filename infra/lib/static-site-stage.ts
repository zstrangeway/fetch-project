import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StaticSiteStack, StaticSiteStackProps } from './static-site-stack';
import addMetaTags from './add-meta-tags';

export default class StaticSiteStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    const staticSiteStack = new StaticSiteStack(this, 'FetchProject-StaticSiteStack', props);
    addMetaTags(staticSiteStack, props.appName, props.service, props.stage);
  }
}
