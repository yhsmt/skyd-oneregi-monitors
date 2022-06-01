import * as params from './params';

export const lackOfEnvironmentVals = (): boolean => {
    const appStage = params.Common.AppStage;
    if (appStage == undefined) {
        return true;
    }

    const regexp = new RegExp('^dev-'),
          isDev = regexp.test(appStage);

    if ([
        params.Common.AppStageProd,
        params.Common.AppStageStg,
    ].includes(appStage) || isDev) {
        return false;
    } else {
        return true;
    }
};

export const name = (trunk: string): string => {
    return params.Common.AppStage + "-" + trunk;
};
