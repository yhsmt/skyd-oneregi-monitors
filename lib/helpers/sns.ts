import {Construct} from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscription from 'aws-cdk-lib/aws-sns-subscriptions';

import { SNS } from 'params'
import {name} from 'utils'

export const createSNSTopic = (construct: Construct): sns.Topic => {
    const topic = new sns.Topic(construct, name('oneregi-alert-topic'), {
        displayName: name('Topic for oneregi alerts', ' '),
        topicName: name('oneregi-alert-topic'),
    });


    // 有効なメールアドレスを設定したらコメントアウトを外す
    /*
    SNS.alertEmails.map(
        emailAddr => topic.addSubscription(new subscription.EmailSubscription(emailAddr))
    )
    */

    return topic;
}
