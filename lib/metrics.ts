import { Metric } from 'aws-cdk-lib/aws-cloudwatch';
import {IDatabaseCluster} from 'aws-cdk-lib/aws-rds';

import * as logsh from 'helpers/logs';
import * as r53h from 'helpers/route53'

import * as r53 from 'metrics/route53';
import * as apigw from 'metrics/api-gateway';
import * as rds from 'metrics/rds';
import * as dynmdb from 'metrics/dynamodb';
import * as lambda from 'metrics/lambda';
import * as logs from 'metrics/logs';
import * as etc from 'metrics/etc';


export type Metrics = {
   cfHealthCheckMetrics:   Metric[],
   apiHealthChecksMetrics: Metric[],

   apiCountMetrics:    Metric[],
   apiLatencyMetrics:  Metric[],
   api5XXErrorMetrics: Metric[],

   rdsProxyConnMetrics:  Metric[],
   rdsConnectionMetrics: Metric[],
   rdsDmlLatencyMetrics: Metric[],
   rdsCpuUsageMetrics:   Metric[],
   rdsFreeMemMetrics:    Metric[],
   rdsSlowQueryLogCount: Metric[],

   dynamoDbReadCapacity: Metric[],
   dynamoDbWriteCapacity: Metric[],

   lambdaConcurrentExecs: Metric[],
   logsLambdaErrorLogCount: Metric[],

   sqsNumOfVisibleMessages: Metric[],
   wafBlockedRequests: Metric[],
};

export const getMetrics = (
   cfHealthChecks: r53h.HealthCheckWithName[],
   apiHealthChecks: r53h.HealthCheckWithName[],
   rdsClusters: IDatabaseCluster[],
   lambdaLogsMetricsFilters: logsh.MetricFilterWithNames[],
): Metrics => {
   return {
      cfHealthCheckMetrics:   r53.getHealthCheckMetrics(cfHealthChecks),
      apiHealthChecksMetrics: r53.getHealthCheckMetrics(apiHealthChecks),
      
      apiCountMetrics:    apigw.countMetrics(),
      apiLatencyMetrics:  apigw.latencyMetrics(),
      api5XXErrorMetrics: apigw.error5XXMetrics(),

      rdsProxyConnMetrics:  rds.proxyConnectionMetrics(),
      rdsConnectionMetrics: rds.connectionMetrics(),
      rdsDmlLatencyMetrics: rds.dmlLatencyMetrics(),
      rdsCpuUsageMetrics:   rds.cpuUsageMetrics(rdsClusters),
      rdsFreeMemMetrics:    rds.freeMemMetrics(rdsClusters),
      rdsSlowQueryLogCount: rds.slowQueryLogMetrics(rdsClusters),

      dynamoDbReadCapacity: dynmdb.readCapacityMetrics(),
      dynamoDbWriteCapacity: dynmdb.writeCapacityMetrics(),

      lambdaConcurrentExecs: lambda.allConcurrentExecsCount(),
      logsLambdaErrorLogCount: logs.lambdaErrorLogCount(lambdaLogsMetricsFilters),
      
      sqsNumOfVisibleMessages: etc.sqsNumOfVisibleMessages(),
      wafBlockedRequests: etc.wafBlockedRequests(),
    };
}