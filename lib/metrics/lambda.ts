import { Duration } from 'aws-cdk-lib';
import {Metric, Unit} from 'aws-cdk-lib/aws-cloudwatch';
import {Function} from 'aws-cdk-lib/aws-lambda';

export const allConcurrentExecsCount = (): Metric[] => {
    return [
        Function.metricAllConcurrentExecutions({ 
            unit: Unit.COUNT,
            period: Duration.minutes(1),
        })
    ]
}
