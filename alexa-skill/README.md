# 久喜市ゴミ分別 Alexaスキル

このディレクトリには、Webアプリを元にしたAmazon Alexaスキルのコードが含まれています。

## 📁 ファイル構成

```
alexa-skill/
├── interactionModel.json   # 音声インタラクションモデル
├── skill.json             # スキル設定
├── lambda/
│   ├── index.js           # メインのLambda関数
│   └── package.json       # Node.js依存関係
└── README.md             # このファイル
```

## 🚀 デプロイ手順

### 1. 前提条件

- AWS アカウント
- Amazon Developer アカウント
- ASK CLI (Alexa Skills Kit CLI) のインストール

```bash
npm install -g ask-cli
ask configure
```

### 2. Lambda関数のデプロイ

```bash
cd lambda
npm install
```

Lambda関数をAWSにデプロイし、ARNを取得してください。

### 3. スキルの作成とデプロイ

```bash
# alexa-skillディレクトリから実行
ask deploy
```

または、Amazon Developer Consoleで手動で設定：

1. [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)にログイン
2. 「スキルの作成」をクリック
3. スキル名: 「久喜市ゴミ分別」
4. 言語: 「日本語（日本）」
5. モデル: 「カスタム」
6. `interactionModel.json`の内容をインタラクションモデルにコピー
7. `skill.json`の設定を参考にスキル設定を行う
8. Lambda関数のARNをエンドポイントに設定

## 🎯 対話例

```
ユーザー: 「アレクサ、久喜市ゴミ分別を開いて」
Alexa: 「こんにちは！久喜市ゴミ分別アシスタントです。どのようなゴミについて知りたいですか？」

ユーザー: 「ペットボトルの分別方法を教えて」
Alexa: 「ペットボトルは資源ゴミ（プラスチック類）です。汚れを落として水洗いし、プラマークを確認してから透明・半透明の袋に入れて出してください。収集日は週1回、水曜日です。」

ユーザー: 「可燃ゴミの収集日はいつ」
Alexa: 「可燃ゴミの収集日は週2回、月曜日と木曜日、または火曜日と金曜日です。お住まいの地区により収集曜日が異なります。」
```

## 🛠️ カスタマイズ

### 新しいゴミ項目の追加

1. `lambda/index.js`の`garbageDatabase`に新しい項目を追加
2. `interactionModel.json`の`GARBAGE_ITEMS`スロットタイプに項目を追加
3. 必要に応じて`GarbageSearchIntent`のサンプル発話を追加

### 新しいインテントの追加

1. `interactionModel.json`にインテントを定義
2. `lambda/index.js`にハンドラーを実装
3. `exports.handler`のハンドラーリストに追加

## 📋 テスト

### シミュレーター

Amazon Developer Consoleのテストタブでスキルをテストできます。

### 実機テスト

デプロイ後、Amazon Echo等の実機でテストが可能です。

```
「アレクサ、久喜市ゴミ分別を開いて」
```

## 🔧 トラブルシューティング

### よくある問題

1. **Lambda関数のタイムアウト**
   - AWS Lambdaのタイムアウト設定を確認（推奨: 10秒）

2. **音声認識エラー**
   - `interactionModel.json`のサンプル発話を追加
   - スロットタイプの同義語を設定

3. **エンドポイントエラー**
   - Lambda関数のARNが正しく設定されているか確認
   - Lambda関数にAlexaトリガーが設定されているか確認

## 🔗 参考リンク

- [Alexa Skills Kit 日本語ドキュメント](https://developer.amazon.com/ja-JP/docs/alexa/ask-overviews/what-is-the-alexa-skills-kit.html)
- [ASK CLI ドキュメント](https://developer.amazon.com/ja-JP/docs/alexa/smapi/ask-cli-intro.html)
- [Lambda関数のデプロイ](https://developer.amazon.com/ja-JP/docs/alexa/custom-skills/host-a-custom-skill-as-an-aws-lambda-function.html)
