# AWS Budgetsと異常検知を作成

## 環境設定

このプロジェクトを実行する前に、適切な環境変数を設定する必要があります。`.env.example`ファイルを`.env`としてコピーし、ファイル内の指示に従って必要な値を設定してください。

```bash
cp .env.example .env
```

## Useful commands

- npm run build TypeScriptをJavaScriptにコンパイルします。
- npm run watch 変更を監視し、コンパイルします。
- npm run test jestユニットテストを実行します。
- npx cdk deploy このスタックをデフォルトのAWSアカウント/リージョンにデプロイします。
- npx cdk diff デプロイ済みのスタックと現在の状態を比較します。
- npx cdk synth 合成されたCloudFormationテンプレートを出力します。