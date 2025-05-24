# 🚀 Alexaスキル クイックスタート（5分で完了）

## 📝 準備
このガイドに従えば、**完全無料** で久喜市ゴミ分別Alexaスキルを公開できます。

## ⏱️ 所要時間: 約5分

### ステップ1: アカウント作成（1分）
1. [developer.amazon.com](https://developer.amazon.com) でAmazonアカウントでサインイン
2. 住所・電話番号を入力（**支払い情報は不要**）

### ステップ2: スキル作成（2分）
1. [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) にアクセス
2. 「スキルの作成」をクリック
3. 設定:
   - スキル名: `久喜市ゴミ分別アプリ`
   - 言語: `Japanese`
   - Experience: `Other`
   - Model: `Custom`
   - ⭐️ Hosting: `Alexa-hosted (Node.js)` ⭐️ **重要！**

### ステップ3: コード設定（2分）
1. 「Code」タブに移動
2. `lambda/index.js` を選択→全削除
3. このプロジェクトの `alexa-skill/lambda/index.js` を **全コピー&ペースト**
4. `lambda/package.json` を以下に置き換え:
```json
{
  "name": "kuki-trash-alexa-skill",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "ask-sdk-core": "^2.7.0",
    "ask-sdk-model": "^1.19.0"
  }
}
```
5. 「Save」→「Deploy」

### ステップ4: 音声設定（1分）
1. 「Build」タブに移動
2. 「JSON Editor」を選択
3. 全削除→ `alexa-skill/interactionModel.json` を **全コピー&ペースト**
4. 「Save Model」→「Build Model」

### ステップ5: テスト（1分）
1. 「Test」タブに移動
2. 「Development」を選択
3. 「久喜市ゴミ分別アプリを開いて」と入力
4. 「プラスチックは何ゴミ？」でテスト

## 🎉 完了！

**「アレクサ、久喜市ゴミ分別アプリを開いて」** で実際のAlexaデバイスでも使用できます。

## 💰 費用
**完全無料**（月間100万リクエストまで無料）

## 📞 サポート
詳細は [SETUP.md](SETUP.md) をご覧ください。
