import { CreateAlarmOptions, ComparisonOperator, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { name } from 'utils';

export const concurrentExecs = (_: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 1,  // min
        threshold: 800,        // count
        comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        alarmName: name('Lambda Total Concurrent Execs', ' '),
    }
};

export const errorLogCounts = (m: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 1,  // min
        threshold: 1,        // count
        comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        alarmName: name(`Lambda Error Logs ${m.label}`, ' '),
    }
};
