const appStage = process.env.CDK_APP_STAGE || "";
const stackName = appStage + '-oneregi-monitors-stack';
const prod = 'prod';
const stg = 'stg';

export const Common = {
    StackName: stackName,
    AppStage: appStage,
    AppStageProd: prod,
    AppStageStg: stg,
    AppStageIsProd: (appStage == prod),
    AppStageIsStg: (appStage == stg),
    Tags: {
        'StackName': stackName,
        'Environment': appStage,
    }
};
