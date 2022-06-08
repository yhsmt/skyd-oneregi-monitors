import {Construct} from 'constructs';
import { aws_logs as logs, Duration, } from "aws-cdk-lib";

import {name} from 'utils'
import { Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { MetricFilterWithNames } from 'helpers/logs';

export const lambdaErrorLogCount = (
    filters: MetricFilterWithNames[],
): Metric[] => {
    return filters.map(
        filter => new Metric({
            namespace: filter.metricNamespace,
            metricName: filter.metricName,
            label: filter.label,
            period: Duration.minutes(1),
        })
    )
}

export const createMetricFilter = (
    construct: Construct,
    logGroup: logs.ILogGroup,
    metricNamespace: string,
    metricName: string,
    filterPattern: string,
): logs.MetricFilter => {
    return new logs.MetricFilter(
        construct,
        name(`oneregi-logs-metric-filters-${metricName}`),
        {
            logGroup: logGroup,
            metricNamespace: metricNamespace,
            metricName: metricName,
            filterPattern: logs.FilterPattern.literal(filterPattern),
            metricValue: '1',
        }
    );
}
