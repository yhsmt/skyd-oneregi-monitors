const appStage = process.env.CDK_APP_STAGE || '';
const stackName = appStage + '-oneregi-monitors-stack';
const prod = 'prod';
const stg = 'stg';

export const Common = {
    stackName: stackName,
    appStage: appStage,
    appStageProd: prod,
    appStageStg: stg,
    appStageIsProd: (appStage == prod),
    appStageIsStg: (appStage == stg),
    tags: {
        StackName: stackName,
        Environment: appStage,
    }
};

export const Region = {
    VA: 'us-east-1',
    TKO: 'ap-northeast-1',
}

type typeApiGateway = {
    apis: {
        name: string
        apiId: string,
    }[],
}

type typeRds = {
    proxyNames: string[],
    clusters: {
        id: string,
        instanceIds: string[],
    }[]
}

type typeSns = {
    alertEmails: string[],
}






/***** ここから対象リソース設定 *****/

export const ApiGateway: typeApiGateway = {
    apis: [
        {
            name: 'prod-oneregi-app-api',
            apiId: 'mbwiw2h1m9',
        },{
            name: 'prod-oneregi-backend',
            apiId: 'nb94z4qdph',
        },{
            name: 'prod-oneregi-backend-managementScreen',
            apiId: 'rub5sw5st0',
        }
    ],
}

export const CloudFront = {
    distURLs: [
        'admin.one-regi.net',
    ]
}

export const DynamoDB = {
    tableNames: [
        'prd_visitinformation_table',
        'prd_orderinformation_table',
        'prd_cashcheck_table',
        'prd_businessdayinformation_table',
        'prd_accountinginformation_table',
    ],
};

export const Lambda = {
    functionNames: [
        'oneregi-app-api-prod-app',
        'oneregi-backend-prod-app',
        'oneregi-backend-managementScreen-prod-app',
    ]
}

export const RDS: typeRds = {
    proxyNames: ['oneregi-prd-rdsproxy'],
    clusters: [
        {
            id: 'oneregi-prd-rds-cluster',
            instanceIds: [
                'oneregi-prd-rds-01',
                'oneregi-prd-rds-02',
            ],
        }
    ],
}

export const SNS: typeSns = {
    alertEmails: [
        'hoge@example.com'
    ]
}

export const SQS = {
    queueNames: ['oneregi-prd-app-001']
}

export const WAF = {
    aclNames: [
        'oneregi-app-api-prod',
        'oneregi-backend-api-prod',
        'oneregi-managementScreen-api-prod',
    ]
}
