import {Construct} from 'constructs';
import {RestApi, IRestApi} from 'aws-cdk-lib/aws-apigateway';

import * as params from 'params'
import {name} from 'utils'

export const importRestApis = (construct: Construct): IRestApi[] => {
    return params.ApiGateway.apiIds.map(
        apiId => RestApi.fromRestApiId(
            construct,
            name('imported-restapi-' + apiId),
            apiId
        )
    )
}
