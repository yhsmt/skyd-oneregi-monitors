import { Metric } from 'aws-cdk-lib/aws-cloudwatch';

import { ApiGateway } from 'params';

export const countMetrics = (): Metric[] => {
    return apiGatewayMetrics('Count')
}

export const latencyMetrics = (): Metric[] => {
    return apiGatewayMetrics('Latency')
}

export const error5XXMetrics = (): Metric[] => {
    return apiGatewayMetrics('5XXError')
}

const apiGatewayMetrics = (metricName: string): Metric[] => {
    return ApiGateway.apis.map(
        api => new Metric({
            namespace: 'AWS/ApiGateway',
            metricName: metricName,
            dimensionsMap: {
                ApiName: api.name,
            },
            label: api.name,
        })
    );
}
