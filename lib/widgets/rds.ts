import {GraphWidget, GraphWidgetView, Metric} from 'aws-cdk-lib/aws-cloudwatch';
import {Duration} from 'aws-cdk-lib';

import * as params from 'params'

export const rdsProxyConnections = (metrics: Metric[]): GraphWidget => {
    return new GraphWidget({
        title: 'RDS Proxy 接続数',
        region: params.Region.TKO,
        left: metrics,
        width: 6,
        statistic: 'Average',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.minutes(1),
    });
}

export const rdsConnections = (metrics: Metric[]): GraphWidget => {
    return graphWidget('RDS 接続数', metrics);
}

export const rdsDmlLatency = (metrics: Metric[]): GraphWidget => {
    return graphWidget('RDS DML実行タイム', metrics);
}

const graphWidget = (title: string, metrics: Metric[]): GraphWidget => {
    return new GraphWidget({
        title: title,
        region: params.Region.TKO,
        left: metrics,
        width: 6,
        statistic: 'Average',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.minutes(1),
    })
}

export const rdsCpuUtilization = (metrics: Metric[]): GraphWidget => {
    return graphWidgetWithBounds(
        'RDS CPU使用率',
        metrics,
        {max: 100, min: 0},
    )
}

export const rdsFreeableMemory = (metrics: Metric[]): GraphWidget => {
    return graphWidgetWithBounds(
        'RDS 空きメモリ量',
        metrics,
        {max: undefined, min: 0},
    )
}

const graphWidgetWithBounds = (
    title: string,
    metrics: Metric[],
    leftYAxis: {max: number|undefined, min: number|undefined},
): GraphWidget => {
    return new GraphWidget({
        title: title,
        region: params.Region.TKO,
        left: metrics,
        leftYAxis: leftYAxis,
        width: 6,
        statistic: 'Average',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.minutes(1),
    })
}

export const rdsSlowQueryLogCount = (metrics: Metric[]): GraphWidget => {
    return new GraphWidget({
        title: 'RDS スロークエリログ発生数',
        region: params.Region.TKO,
        left: metrics,
        width: 6,
        statistic: 'SampleCount',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.minutes(1),
    })
}
