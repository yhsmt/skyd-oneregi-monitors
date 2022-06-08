import { Duration } from 'aws-cdk-lib';
import { Metric } from 'aws-cdk-lib/aws-cloudwatch';
import {IDatabaseCluster} from 'aws-cdk-lib/aws-rds';

import { RDS } from 'params';

export const proxyConnectionMetrics = (): Metric[] => {
    return RDS.proxyNames.map(
        proxyName => new Metric({
            namespace: 'AWS/RDS',
            metricName: 'ClientConnections',
            dimensionsMap: {
                ProxyName: proxyName
            },
            period: Duration.minutes(1),
        })
    );
}

export const connectionMetrics = (): Metric[] => {
    return metricsWithClusters(
        'DatabaseConnections',
        ['READER', 'WRITER'],
    )
}

export const dmlLatencyMetrics = (): Metric[] => {
    return metricsWithClusters(
        'DMLLatency',
        ['WRITER'],
    )
}

const metricsWithClusters = (
    metricName:string, roles: string[]): Metric[] => {
    return RDS.clusters.flatMap(
        cluster => roles.map(
            role => new Metric({
                namespace: 'AWS/RDS',
                metricName: metricName,
                dimensionsMap: {
                    Role: role,
                    DBClusterIdentifier: cluster.id
                },
                period: Duration.minutes(1),
                label: `${cluster.id}-${role}`
            })
        )
    );
}

export const cpuUsageMetrics = (clusters: IDatabaseCluster[]): Metric[] => {
    return metricsWithInstances(clusters, 'CPUUtilization');
}

export const freeMemMetrics = (clusters: IDatabaseCluster[]): Metric[] => {
    return metricsWithInstances(clusters, 'FreeableMemory');
}

const metricsWithInstances = (
    clusters: IDatabaseCluster[],
    metricName:string,
    ): Metric[] => {
    return clusters.flatMap(
        instance => instance.instanceIdentifiers.map(
            instanceId => new Metric({
                namespace: 'AWS/RDS',
                metricName: metricName,
                dimensionsMap: {
                    DBInstanceIdentifier: instanceId
                },
                period: Duration.minutes(1),
                label: instanceId,
            })
        )
    );
}

export const slowQueryLogMetrics = (clusters: IDatabaseCluster[]): Metric[] => {
    return clusters.map(
        cluster => new Metric({
            namespace: 'AWS/Logs',
            metricName: 'IncomingLogEvents',
            dimensionsMap: {
                LogGroupName: `/aws/rds/cluster/${cluster.clusterIdentifier}/slowquery`
            },
            period: Duration.minutes(1),
            label: `${cluster.clusterIdentifier}-slowquery`,
        })
    );
}
