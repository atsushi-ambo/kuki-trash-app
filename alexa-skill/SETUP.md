# 久喜市ゴミ分別 Alexaスキル セットアップガイド（完全無料版）

## 🆓 概要
久喜市のゴミ分別情報を音声で検索できるAmazon Alexaスキルです。
**Amazon Alexa-hosted Skills** を使用して、追加料金なしで完全無料でホスティングできます。

## ⚡ 無料でできること

### 💰 完全無料の理由
- **Alexa-hosted Skills** は Amazon が提供する無料ホスティングサービス
- AWSアカウント不要
- クレジットカード登録不要
- 久喜市の規模（人口約15万人）では無料枠を超える心配なし

### 📊 無料枠の詳細
- **AWS Lambda**: 月間100万リクエスト
- **DynamoDB**: 25GBまで無料
- **S3ストレージ**: 5GBまで無料  
- **データ転送**: 15GB/月まで無料
- **セキュリティ**: SSL/TLS通信無料
- **スケーリング**: 自動拡張無料

### 🎯 久喜市での想定使用量
- 人口: 約15万人
- 仮に1日1000リクエスト → 月間3万リクエスト
- **無料枠100万リクエストの3%程度で運用可能**

## 🚀 ステップバイステップセットアップ

### 1. Amazon Developer Account作成（無料）
1. [developer.amazon.com](https://developer.amazon.com) にアクセス
2. 「アカウントの作成」をクリック
3. Amazonアカウントでサインイン（既存アカウント利用可能）
4. 開発者アカウント情報を入力（住所、電話番号）
5. **支払い情報の入力は不要です**

### 2. Alexa Developer Console でスキル作成
1. [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) にアクセス
2. 「スキルの作成」をクリック
3. 以下を **必ず** 選択：
   - **スキル名**: 久喜市ゴミ分別アプリ
   - **言語**: Japanese
   - **Experience**: Other
   - **Model**: Custom
   - **Hosting**: ⭐️ **Alexa-hosted (Node.js)** ⭐️ ← **重要！無料選択**

### 3. 自動環境セットアップ（待つだけ）
Alexaが自動で以下をセットアップします：
- ✅ AWS Lambda関数が自動作成（無料）
- ✅ DynamoDBデータベース提供（無料）
- ✅ S3ストレージ提供（無料）
- ✅ GitリポジトリもAlexaが用意（無料）
- ⏱️ セットアップ時間: 約2-3分

### 4. コードのデプロイ（2つの方法）

#### 🎯 方法1: Developer Console内のCode Editor（初心者推奨）
1. スキル作成後、上部の **「Code」タブ** に移動
2. 左側のファイルツリーで `lambda/index.js` を選択
3. 右側のエディタで **全選択（Ctrl+A / Cmd+A）→削除**
4. このプロジェクトの `alexa-skill/lambda/index.js` の内容を **全コピー&ペースト**
5. 左側で `lambda/package.json` を選択し、以下に置き換え：
```json
{
  "name": "kuki-trash-alexa-skill",
  "version": "1.0.0", 
  "description": "久喜市ゴミ分別Alexaスキル",
  "main": "index.js",
  "dependencies": {
    "ask-sdk-core": "^2.7.0",
    "ask-sdk-model": "^1.19.0"
  }
}
```
6. 右上の **「Save」→「Deploy」** をクリック
7. ✅ デプロイ完了まで約30秒待つ

#### 🚀 方法2: Git連携（上級者向け）
Alexaが提供するGitリポジトリを使用：
```bash
# 1. Developer ConsoleのCodeタブでGit URLを確認
# 2. ローカルにクローン
git clone <Alexa-provided-git-url>
cd <cloned-repo>

# 3. ファイルをコピー
cp /path/to/alexa-skill/lambda/* lambda/

# 4. プッシュ（自動デプロイされる）
git add .
git commit -m "Add Kuki trash app skill"
git push origin master
```

### 5. Interaction Model の設定
1. 上部の **「Build」タブ** に移動
2. 左側メニューから **「JSON Editor」** を選択
3. 右側のテキストエリアで **全選択（Ctrl+A / Cmd+A）→削除**
4. このプロジェクトの `alexa-skill/interactionModel.json` の内容を **全コピー&ペースト**
5. **「Save Model」** をクリック
6. **「Build Model」** をクリック（約1-2分で完了）
7. ✅ 「Model built successfully」の表示を確認

### 6. テスト実行
1. 上部の **「Test」タブ** に移動
2. 「Skill testing is enabled in:」で **「Development」** を選択
3. 左側のマイク🎤をクリックまたはテキスト入力で以下を試す：

```
「久喜市ゴミ分別アプリを開いて」
↓
「プラスチックは何ゴミ？」
「燃やせるゴミはいつ？」  
「久喜地区のゴミ出し日を教えて」
```

### 7. 実機テスト（オプション）
Alexaデバイス（Echo、Echo Dot等）または Alexaアプリで実際にテスト：
```
「アレクサ、久喜市ゴミ分別アプリを開いて」
```

## 🎤 使用例

```
「アレクサ、久喜市ゴミ分別アプリを開いて」
「プラスチックは何ゴミ？」
「燃やせるゴミはいつ？」
「久喜地区のゴミ出し日を教えて」
```

## 💰 料金について

### Alexa-hosted Skills の無料枠
- **AWS Lambda**: 月間100万リクエスト
- **DynamoDB**: 25GBまで無料
- **S3**: 5GBまで無料
- **データ転送**: 15GB/月まで無料

### 個人利用なら完全無料
- 久喜市の人口: 約15万人
- 1日1000リクエストでも月間3万リクエスト
- **無料枠内で十分に運用可能**

## 🔧 メリット・デメリット

### ✅ メリット
- **完全無料**（AWSアカウント不要）
- 自動スケーリング
- メンテナンス不要
- セキュリティ管理不要
- Developer Console内でコード編集可能

### ⚠️ 制限事項
- 実行時間: 8秒まで
- メモリ: 512MBまで
- パッケージサイズ: 50MBまで
- 外部API呼び出し制限あり

**久喜市ゴミ分別アプリには十分な性能です！**

## 📋 設定済みファイル

### 使用するファイル
- ✅ `lambda/index.js` - メインロジック
- ✅ `lambda/package.json` - 依存関係
- ✅ `interactionModel.json` - 音声インタラクション
- ✅ `skill.json` - スキル設定

### 不要なファイル
- ❌ `Dockerfile` (削除済み)
- ❌ SAMテンプレート
- ❌ AWS設定ファイル

## 🔧 トラブルシューティング

**問題**: ビルドエラー
**解決**: package.jsonの依存関係を確認

**問題**: 音声認識が正確でない
**解決**: interactionModel.jsonのサンプル発話を追加

**問題**: タイムアウト
**解決**: コードの最適化（8秒制限）

## 🚀 公開手順

1. 「Distribution」タブに移動
2. スキル情報を入力：
   - アイコン
   - 説明文
   - カテゴリ: Utilities & Productivity
3. 「Certification」でレビュー申請
4. 承認後、Alexaスキルストアで公開

**完全無料でスキルを世界中に公開できます！**
