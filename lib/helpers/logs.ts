import {Construct} from 'constructs';
import { aws_logs as logs, } from "aws-cdk-lib";
import { MetricFilter } from 'aws-cdk-lib/aws-logs';
import {ILogGroup} from 'aws-cdk-lib/aws-logs';

import {createMetricFilter} from 'metrics/logs'

import * as params from 'params'
import {name} from 'utils'

export type MetricFilterWithNames = {
    metricFilter: MetricFilter,
    metricNamespace: string,
    metricName: string,
    label: string,
}

export const getLambdaLogsMetricsFilters = (construct: Construct): MetricFilterWithNames[] => {
    const lambdaLogGroups: ILogGroup[] = importLambdaLogGroups(construct);

    return lambdaLogGroups.map(
        logGroup => {
          const metricNamespace = name('oneregi-logs-metric-filters');
          const metricName = logGroup.logGroupName + '/errors';
          return {
            metricFilter: createMetricFilter(
                construct,
                logGroup,
                metricNamespace,
                metricName,
                'ERROR',
              ),
            metricNamespace: metricNamespace,
            metricName: metricName,
            label: logGroup.logGroupName.split('/').slice(-1)[0],
          };
        }
    );
  }

const importLambdaLogGroups = (construct: Construct): logs.ILogGroup[] => {
    return params.Lambda.functionNames.map(
        _name => logs.LogGroup.fromLogGroupName(
            construct,
            name(`imported-lambda-logs-${_name}`),
            `/aws/lambda/${_name}`,
        )
    )
}
