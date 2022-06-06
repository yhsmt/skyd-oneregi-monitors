import {Construct} from 'constructs';
import { aws_logs as logs, } from "aws-cdk-lib";

import * as params from 'params'
import {name} from 'utils'

export const importLambdaLogGroups = (construct: Construct): logs.ILogGroup[] => {
    return params.Lambda.functionNames.map(
        _name => logs.LogGroup.fromLogGroupName(
            construct,
            name('imported-lambda-logs-' + _name),
            '/aws/lambda/' + _name,
        )
    )
}
