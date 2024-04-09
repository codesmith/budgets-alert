# AWS Budgetsと異常検知を作成

一度の実行でAWS Budgetsに複数予算を作成できるツールです。AWS CDKで実装しています。

## 参考にしたサイト

以下のQiita記事を参考にさせていただきました。ありがとうございました。

- [【CDK】Cost Anomaly DetectionがChatbotと統合されたのでCDKで実装してみた【アップデート】](https://qiita.com/hedgehog051/items/5e22846d6b8b7b895073)

### 修正した箇所

- 1つのbudget-stackで複数の予算を作成できるように修正しました。
- SlackのワークスペースIDなどを環境変数から読み取るように修正しました。

## 準備1(環境変数設定)

このプロジェクトを実行する前に、適切な環境変数を設定する必要があります。
`.env.example`ファイルを`.env`としてコピーし、ファイル内の指示に従って
必要な値を設定してください。

```bash
cp .env.example .env
```

## 準備2(cdk.jsonの修正)

適宜、cdk.jsonの以下の記述において、
アラート通知を受け取りたいAWS利用料(ドル)をリストで設定してください。
（複数設定できますが、AWSの仕様としてBudgetが無料になるのは2つまでのようです。
　正確な情報はAWS公式ページを参照してください。）

```json
    "amounts": [0.1, 0.5]
```

## 準備3(npmの操作)

```bash
npm install -g aws-cdk
npm install
npm run build
```

## 準備4(対象リージョンでbootstrap)

`~/.aws/confing`で以下のように修正した後、

```md
[default]
region=ap-northeast-1
```

```bash
cdk bootstrap
```

## リソース作成手順

上記の準備1～準備4を実施した後に以下コマンドを実行してください。

```bash
cdk deploy --all
```

## リソース削除手順

```bash
cdk destory --all
```

## Useful commands

- npm run build TypeScriptをJavaScriptにコンパイルします。
- npm run watch 変更を監視し、コンパイルします。
- npm run test jestユニットテストを実行します。
- npx cdk deploy このスタックをデフォルトのAWSアカウント/リージョンにデプロイします。
- npx cdk diff デプロイ済みのスタックと現在の状態を比較します。
- npx cdk synth 合成されたCloudFormationテンプレートを出力します。
