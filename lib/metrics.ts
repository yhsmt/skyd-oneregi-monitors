import { Metric } from 'aws-cdk-lib/aws-cloudwatch';

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

   logsLambdaErrorLogCount: Metric[],
};