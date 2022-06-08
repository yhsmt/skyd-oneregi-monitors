import { CreateAlarmOptions, ComparisonOperator, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { name } from 'utils';

export const proxyConnections = (m: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 1,  // min
        threshold: 72,         // ms
        comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        alarmName: name(`RDS ${m.label} Connections`, ' '),
    }
};

export const slowQueryLogCounts = (m: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 1,  // min
        threshold: 3,          // count
        comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        alarmName: name(`RDS ${m.label} Count`, ' '),
    }
};
