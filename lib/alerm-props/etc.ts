import { CreateAlarmOptions, ComparisonOperator, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { name } from 'utils';

export const sqsNumOfVisibleMessages = (m: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 1,
        threshold: 10,        // count
        comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
        alarmName: name(`SQS Visible Messages ${m.label}`, ' '),
    }
};

export const wafBlockedRequests = (m: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 1,
        threshold: 1,        // count
        comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
        alarmName: name(`WAF Blocked Requests ${m.label}`, ' '),
    }
};
