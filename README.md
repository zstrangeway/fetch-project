 # fetch-take-home

This app was created with [Vite](https://vitejs.dev/).

The hosting infrastructure was created with AWS CDK.  It contains a Pipeline that observes my code repository and automatically deploys changes to three stages: dev, preprod and prod.  The react app itself is hosted in an s3 bucket behind a CloudFormation CDN.  This may be tricky to deploy on your own for the first time, but I have provided basic instructions in the "AWS Deployment" section if you wish to do so.

Site URLs:

- dev: https://d2o97t0g5l2bbg.cloudfront.net/
- preprod: https://d1t9yla8pmzann.cloudfront.net/
- prod: https://d18fv3y3ojlte5.cloudfront.net/

## Local Development

### Instructions

1. Update env vars in `.env.local`, see Environment Variable files section
2. `npm i`
3. `npm run dev`

### Available Scripts

In the project directory, you can run:

#### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

#### `npm test`

(No tests are written yet)
Launches the test runner in the interactive watch mode.

#### `npm run build`

Builds the app for production to the `dist` folder.

## AWS Deployment

### Pre-requisites

- [AWS CLI](https://aws.amazon.com/cli/)
- [CDK CLI]()
- Bootstrap your AWS environment(s) that will host your stacks ([Instructions](https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html#cdk_pipeline_bootstrap))
    - You will need to have four bootstrapped environments for this stack.
        - An enironment is a unique account/region combination.  All four environments can be in the same account, or spread across several.  In order to deploy across accounts, the policy used in the example script below must grant access to do so.
        - Example (replace ACCOUNT_NUMBER and REGION): `npx cdk bootstrap aws://<ACCOUNT_NUMBER>/<REGION> --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess`
            - Best practice is to define a policy with more minimal access.

### Instructions

1. Update env vars in `.env.local` and `.env.aws.cdk`, see Environment Variable files section
2. `npm i`
3. `npm run build -- --outDir=dist-dev`
4. `npm run build -- --outDir=dist-dev`
5. `npm run build -- --outDir=dist-dev`
6. Store github access token in AWS Secret
    1. Create Github access token
        1. settings > Developer Settings > Personal access tokens (classic)
        2. generate new token with 'admin:repo_hook' and 'admin:repo_hook' scopes
    2. Create a new plaintext secret in the region that will host your pipeline
        1. Example via AWS CLI (replace REGION and GITHUB_TOKEN): `aws secretsmanager create-secret --region <REGION> --name github-token --secret-string "<GITHUB_TOKEN>"`
7. `source .env.aws-cdk && npx aws-cdk deploy FetchProject-PipelineStack`
8. Note: You may need to restart the `Assets` Step.  This because AWS has a defualt limit of one concurrent build and this template requires four.  It is a simple matter to request an increase to prevent the need for human intervention.

### Environment Variable files

`.env.local` (Required for local development)

```
VITE_DEBUG_MODE=false
VITE_APP_STAGE=local
VITE_APP_API_URL=https://frontend-take-home-service.fetch.com
```

`.env.aws-cdk` (Only required to deploy cdk pipeline)

```
export APP_NAME=fetch-project
export REPO=zstrangeway/fetch-project
export BRANCH=master
export BASE_BUCKET_NAME=fetch-project

export PIPELINE_ACCOUNT=<YOUR ACCOUNT NUMBER>
export PIPELINE_REGION=us-west-1

export DEV_ACCOUNT=<YOUR ACCOUNT NUMBER>
export DEV_REGION=us-west-2
export DEV_API_URL=https://frontend-take-home-service.fetch.com

export PREPROD_ACCOUNT=<YOUR ACCOUNT NUMBER>
export PREPROD_REGION=us-east-2
export PREPROD_API_URL=https://frontend-take-home-service.fetch.com

export PROD_ACCOUNT=<YOUR ACCOUNT NUMBER>
export PROD_REGION=us-east-1
export PROD_API_URL=https://frontend-take-home-service.fetch.com
```

## Thnigs to improve

- Needs tests
- Should cache data rather than constantly repeating requests
- Should display error messages to user when requests fail
