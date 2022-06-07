import {Construct} from 'constructs';
import { aws_logs as logs, } from "aws-cdk-lib";
import { MetricFilter } from 'aws-cdk-lib/aws-logs';

import * as params from 'params'
import {name} from 'utils'

export type typeMetricFilter = {
    metricFilter: MetricFilter,
    metricNamespace: string,
    metricName: string,
    label: string,
}

export const importLambdaLogGroups = (construct: Construct): logs.ILogGroup[] => {
    return params.Lambda.functionNames.map(
        _name => logs.LogGroup.fromLogGroupName(
            construct,
            name('imported-lambda-logs-' + _name),
            '/aws/lambda/' + _name,
        )
    )
}
