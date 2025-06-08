# Alexaスキル デバッグガイド

## 🐛 問題の特定方法

### 1. CloudWatch Logs確認
1. [AWS CloudWatch Console](https://console.aws.amazon.com/cloudwatch/) にアクセス
2. 左メニュー「Logs」→ 「Log groups」
3. `/aws/lambda/ask-kuki-trash-app-default-skillStack-...` を探す
4. 最新のログストリームをクリック
5. エラーメッセージを確認

### 2. Alexa Developer Console のテスト
1. [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) でスキルを開く
2. 「Test」タブに移動
3. 左上で「Development」を選択
4. 右側の「JSON Input」でリクエストを確認
5. 「JSON Output」でレスポンスを確認

## 🔍 よくある問題と解決方法

### 問題1: スキルが応答しない
**原因**: Lambda関数のARN設定が間違っている
**解決策**: 
1. 「Build」タブ → 「Endpoint」
2. 正しいLambda ARNが設定されているか確認
3. 地域が「Asia Pacific (Tokyo)」になっているか確認

### 問題2: 音声認識がうまくいかない
**原因**: インタラクションモデルの問題
**解決策**:
1. 「Build」タブ → 「JSON Editor」
2. サンプル発話に問題がないか確認
3. モデルを再ビルド

### 問題3: Lambda関数でエラー
**原因**: コードのバグまたは依存関係の問題
**解決策**:
1. CloudWatch Logsでエラーメッセージを確認
2. Lambda関数のコードを見直し
3. 必要に応じてコードを更新

## 🧪 段階別テスト手順

### Level 1: 基本動作テスト
```
「久喜市ゴミ分別アプリを開いて」
```
期待値: ウェルカムメッセージが再生される

### Level 2: 簡単な検索テスト
```
「ペットボトルの分別方法を教えて」
```
期待値: ペットボトルの分別方法が説明される

### Level 3: 収集日テスト
```
「今日のゴミは何ですか」
```
期待値: 地域設定の案内または今日の収集情報

### Level 4: 地域設定テスト
```
「地区をAブロックに設定して」
```
期待値: 地域設定の確認メッセージ

## 📋 チェックリスト

### Alexa Developer Console設定
- [ ] スキル名が正しく設定されている
- [ ] 言語が「Japanese (JP)」になっている
- [ ] インタラクションモデルがインポートされている
- [ ] モデルがビルドされている
- [ ] Lambda ARNが正しく設定されている
- [ ] テスト環境が「Development」になっている

### Lambda関数設定
- [ ] Node.js 18.x以上のランタイム
- [ ] Alexaトリガーが設定されている
- [ ] 正しいコードがデプロイされている
- [ ] タイムアウトが10秒以上に設定されている

## 🔧 トラブルシューティングコマンド

### ローカルテスト
```bash
cd alexa-skill/lambda
npm test
```

### ログ確認（AWS CLI）
```bash
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/ask-"
aws logs get-log-events --log-group-name "/aws/lambda/your-function-name"
```
