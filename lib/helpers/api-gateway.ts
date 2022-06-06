import {Construct} from 'constructs';
import {RestApi, IRestApi} from 'aws-cdk-lib/aws-apigateway';

import * as params from 'params'
import {name} from 'utils'

export type ImportedApi = {
    api: IRestApi,
    name: string
}

export const importRestApis = (construct: Construct): ImportedApi[] => {
    return params.ApiGateway.apis.map(
        api => {
            return {
                api: RestApi.fromRestApiId(
                    construct,
                    name('imported-restapi-' + api.apiId),
                    api.apiId
                ),
                name: api.name
            }
        }
    )
}
