import {GraphWidget, GraphWidgetView, Metric} from 'aws-cdk-lib/aws-cloudwatch';
import {IDatabaseCluster} from 'aws-cdk-lib/aws-rds';
import {Duration} from 'aws-cdk-lib';

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
    const metrics = params.RDS.clusters.flatMap(
        cluster => roles.map(
            role => new Metric({
                namespace: 'AWS/RDS',
                metricName: metricName,
                dimensionsMap: {
                    Role: role,
                    DBClusterIdentifier: cluster.id
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

export const rdsCpuUtilization = (clusters: IDatabaseCluster[]): GraphWidget => {
    return rdsWidgetWithInstances(
        clusters,
        'RDS CPU使用率',
        'CPUUtilization',
        {max: 100, min: 0},
    )
}

export const rdsFreeableMemory = (clusters: IDatabaseCluster[]): GraphWidget => {
    return rdsWidgetWithInstances(
        clusters,
        'RDS 空きメモリ量',
        'FreeableMemory',
        {max: undefined, min: 0},
    )
}

const rdsWidgetWithInstances = (
    clusters: IDatabaseCluster[],
    title: string,
    metricName: string,
    leftYAxis: {max: number|undefined, min: number|undefined},
): GraphWidget => {
    const metrics = clusters.flatMap(
        instance => instance.instanceIdentifiers.map(
            instanceId => new Metric({
                namespace: 'AWS/RDS',
                metricName: metricName,
                dimensionsMap: {
                    DBInstanceIdentifier: instanceId
                },
            })
        )
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
    const metrics = params.RDS.clusters.map(
        cluster => new Metric({
            namespace: 'AWS/Logs',
            metricName: 'IncomingLogEvents',
            dimensionsMap: {
                LogGroupName: '/aws/rds/cluster/' + cluster.id + '/slowquery'
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
