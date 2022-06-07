import { Metric } from 'aws-cdk-lib/aws-cloudwatch';

import { ApiGateway } from 'params';

export const apiGatewayMetrics = (metricName: string): Metric[] => {
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
