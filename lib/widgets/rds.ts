import {GraphWidget, GraphWidgetView, Metric} from "aws-cdk-lib/aws-cloudwatch";
import {Duration} from "aws-cdk-lib";

import * as params from 'params'

export const rdsProxyConnections = (): GraphWidget => {
    const metrics = params.RDS.proxyNames.map(
        proxyName => new Metric({
            namespace: 'AWS/RDS',
            metricName: 'ClientConnections',
            dimensionsMap: {
                ProxyName: proxyName
            },
        })
    );

    return new GraphWidget({
        title: 'RDS Proxy 接続数',
        region: params.Region.TKO,
        left: metrics,
        width: 6,
        statistic: 'Average',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.seconds(60),
    })
}

export const rdsConnections = (): GraphWidget => {
    return rdsWidgetWithRoles(
        'RDS 接続数',
        'DatabaseConnections',
        ['READER', 'WRITER'],
    )
}

export const rdsDmlLatency = (): GraphWidget => {
    return rdsWidgetWithRoles(
        'RDS DML実行タイム',
        'DMLLatency',
        ['WRITER'],
    )
}

const rdsWidgetWithRoles = (
    title: string,
    metricName: string,
    roles: string[],
    ): GraphWidget => {
    const metrics = params.RDS.clusterNames.flatMap(
        cluster => roles.map(
            role => new Metric({
                namespace: 'AWS/RDS',
                metricName: metricName,
                dimensionsMap: {
                    Role: role,
                    DBClusterIdentifier: cluster
                },
            })
        )
    );

    return new GraphWidget({
        title: title,
        region: params.Region.TKO,
        left: metrics,
        width: 6,
        statistic: 'Average',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.seconds(60),
    })
}

export const rdsCpuUtilization = (): GraphWidget => {
    return rdsWidgetWithInstances(
        'RDS CPU使用率',
        'CPUUtilization',
        {max: 100, min: 0},
    )
}

export const rdsFreeableMemory = (): GraphWidget => {
    return rdsWidgetWithInstances(
        'RDS 空きメモリ量',
        'FreeableMemory',
        {max: undefined, min: 0},
    )
}

const rdsWidgetWithInstances = (
    title: string,
    metricName: string,
    leftYAxis: {max: number|undefined, min: number|undefined},
): GraphWidget => {
    const metrics = params.RDS.dbInstances.map(
            instance => new Metric({
                namespace: 'AWS/RDS',
                metricName: metricName,
                dimensionsMap: {
                    DBInstanceIdentifier: instance
                },
            })
        );

    return new GraphWidget({
        title: title,
        region: params.Region.TKO,
        left: metrics,
        leftYAxis: leftYAxis,
        width: 6,
        statistic: 'Average',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.seconds(60),
    })
}

export const rdsSlowQueryLogCount = (): GraphWidget => {
    const metrics = params.RDS.clusterNames.map(
        clusterName => new Metric({
            namespace: 'AWS/Logs',
            metricName: 'IncomingLogEvents',
            dimensionsMap: {
                LogGroupName: '/aws/rds/cluster/' + clusterName + '/slowquery'
            },
        })
    );

    return new GraphWidget({
        title: 'RDS スロークエリログ発生数',
        region: params.Region.TKO,
        left: metrics,
        width: 6,
        statistic: 'SampleCount',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.seconds(60),
    })
}
