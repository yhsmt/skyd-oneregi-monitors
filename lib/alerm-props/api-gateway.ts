import { CreateAlarmOptions, ComparisonOperator, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { name } from 'utils';

export const apiLatency = (m: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 1,  // min
        threshold: 3000,       // ms
        comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
        alarmName: name(`API Gateway ${m.label} Latency`, ' '),
    }
};

export const error5XX = (m: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 1,  // min
        threshold: 3000,       // ms
        comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
        alarmName: name(`API Gateway ${m.label} 5XX Error`, ' '),
    }
};