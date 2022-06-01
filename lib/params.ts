const appStage = process.env.CDK_APP_STAGE || "";
const stackName = appStage + '-oneregi-monitors-stack';
const prod = 'prod';
const stg = 'stg';

export const Common = {
    stackName: stackName,
    appStage: appStage,
    appStageProd: prod,
    appStageStg: stg,
    appStageIsProd: (appStage == prod),
    appStageIsStg: (appStage == stg),
    tags: {
        StackName: stackName,
        Environment: appStage,
    }
};

export const Lambda = {
    functionArn: 'arn:aws:lambda:ap-northeast-1:034569540981:function:oneregi-app-api-dev-app',
}
