import {Construct} from 'constructs';
import { aws_logs as logs, } from "aws-cdk-lib";

import {name} from 'utils'

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
