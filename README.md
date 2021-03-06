# Oneregi monitors

AWSリソース監視・通知スタック

## セットアップ

### 推奨動作環境

* nodejs >= 16.15
* yarn >= 1.22

### パッケージインストール

```bash
$ yarn
```

### 動作環境設定

開発環境

```bash
$ export CDK_APP_STAGE=dev-hoge
```

ステージング環境

```bash
$ export CDK_APP_STAGE=stg
```

本番環境

```bash
$ export CDK_APP_STAGE=prod
```

監視・通知スタックの環境切り替えに使う接頭辞であるため、後述する監視対象リソースがどの環境のリソースであるかは関知しない。
監視・通知スタック同士でスタック名が重複するとリソースを上書き操作してしまうので、スタックの環境を分離するために設定する。

未設定の場合、デプロイできないので注意する。

## 実行・デプロイ

スタックデプロイ

```bash
$ yarn cdk deploy
```

スタック削除

```bash
$ yarn cdk destroy
```

## 設定

`lib/params.ts` に、監視対象リソースを設定する定数が集約されているので、それを編集する。
監視対象の増減があれば、任意で追加、削除を行うと、必要な監視および通知リソースが作成・削除される。

### ApiGateway.apis

監視対象のAPI Gatewayエンドポイントの`name`および`apiId`をそれぞれ文字列で設定。
1つのエンドポイント毎に1対のオブジェクトを、正しい組み合わせで設定する。

複数指定可。

監視される項目 / 作成されるリソース
* ヘルスチェック（Route53 HealthCheck・ダッシュボード・通知）
* リクエスト数（ダッシュボード）
* レスポンスタイム（ダッシュボード・通知）
* 5XXエラー発生数（ダッシュボード・通知）

### CloudFront.distURLs

監視対象のCloudFrontディストリビューションのエンドポイントURLを、ドメイン名で設定。複数指定可。

監視される項目 / 作成されるリソース
* ヘルスチェック（Route53 HealthCheck・ダッシュボード・通知）

### DynamoDB.tableNames

監視対象のテーブル名を設定。複数指定可。

監視される項目 / 作成されるリソース
* 読み込み・書き込みキャパシティー消費量（ダッシュボード）

### Lambda.functionNames

監視対象のLambda関数名を設定。複数指定可。

監視される項目 / 作成されるリソース
* アカウント全体の同時実行数(ダッシュボード、関数に無関係で1つ)
* Errorログ発生数（MetricFilter・ダッシュボード・通知）

### RDS.proxyNames

監視対象のRDS Proxy名を設定。複数指定可。

監視される項目 / 作成されるリソース
* Proxy接続数（ダッシュボード・通知）

### RDS.clusters

クラスターIDとインスタンスIDを1クラスタずつそれぞれ指定。複数指定可。

監視される項目 / 作成されるリソース
* インスタンスのDB接続数（ダッシュボード）
* DML実行時間（ダッシュボード）
* インスタンスのCPU利用率（ダッシュボード）
* インスタンスの空きメモリ両（ダッシュボード）
* スロークエリログ発生数（ダッシュボード・通知）

### SNS.alertEmails

通知を受けるメールアドレスを設定。複数指定可。

作成されるリソース
* SNSトピック・サブスクリプション

### SQS.queueNames

監視対象のキュー名を設定。複数指定可。

監視される項目 / 作成されるリソース
* 滞留メッセージ数（ダッシュボード・通知）

### WAF.aclNames

監視対象のACL名を設定。複数指定可。

監視される項目 / 作成されるリソース
* ルール適用リクエスト数（ダッシュボード・通知）
