import * as params from './params';

export const lackOfEnvironmentVals = (): boolean => {
    const appStage = params.Common.appStage;
    if (appStage == undefined) {
        return true;
    }

    const regexp = new RegExp('^dev-'),
          isDev = regexp.test(appStage);

    if ([
        params.Common.appStageProd,
        params.Common.appStageStg,
    ].includes(appStage) || isDev) {
        return false;
    } else {
        return true;
    }
};

export const name = (trunk: string): string => {
    return params.Common.appStage + "-" + trunk;
};
