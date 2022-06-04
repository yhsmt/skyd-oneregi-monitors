import {GraphWidget, GraphWidgetView, Metric, Unit} from "aws-cdk-lib/aws-cloudwatch";
import {Function} from "aws-cdk-lib/aws-lambda";
import {Duration} from "aws-cdk-lib";

import * as params from 'params'

export const lambdaConcurrentExecs = (): GraphWidget => {
    return new GraphWidget({
        title: "Lambda関数の同時実行数",
        left: [Function.metricAllConcurrentExecutions({
            unit: Unit.COUNT
        })],
        width: 6
    })
}

export const lambdaErrorLogsCount  = (): GraphWidget => {
    const metrics = params.Lambda.functionNames.map(
        funcName => new Metric({
            namespace: 'Lambda Logs Pattern Filter',
            metricName: 'ERROR (' + funcName + ')',
            label: funcName,
        })
    );

    return new GraphWidget({
        title: 'Lambda Errorログ発生数',
        region: params.Region.TKO,
        left: metrics,
        width: 6,
        statistic: 'SampleCount',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.seconds(60),
    })
}
