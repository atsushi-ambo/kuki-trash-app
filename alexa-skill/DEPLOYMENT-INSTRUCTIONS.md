# 🚀 Alexa スキルデプロイメント手順

## 1. ローカルテスト結果

✅ **全てのハンドラーが正常に動作することを確認済み**
- Launch Request (スキル開始)
- GarbageSearchIntent (ゴミ検索)
- CollectionDayIntent (収集日確認)
- RegionSettingIntent (地域設定)

## 2. AWS Lambda にデプロイ

### ステップ 1: Lambda 関数の更新

1. AWS Lambda コンソールにアクセス
2. 既存の Lambda 関数を選択
3. **Code** タブで **Upload from** → **.zip file** を選択
4. `kuki-trash-alexa-skill.zip` をアップロード
5. **Deploy** をクリック

### ステップ 2: 設定の確認

```javascript
// Handler 設定が正しいことを確認
Runtime: Node.js 18.x or later
Handler: index.handler
Timeout: 30 seconds
Memory: 512 MB
```

## 3. Alexa Developer Console でテスト

### ステップ 1: スキルのビルド

1. Alexa Developer Console にアクセス
2. 久喜市ゴミ分別スキルを選択
3. **Build** タブ → **Save Model** → **Build Model**

### ステップ 2: シミュレーターでテスト

**テストフレーズ例:**

```
🗣️ "アレクサ、久喜市ゴミ分別を開いて"
期待される応答: "こんにちは！久喜市ゴミ分別アシスタントです..."

🗣️ "ペットボトルの分別方法を教えて"
期待される応答: "ペットボトルはびん・缶・ペットボトルです..."

🗣️ "地域を久喜地区Aブロックに設定して"
期待される応答: "久喜地区Aブロックに設定しました..."

🗣️ "今日のゴミは何"
期待される応答: 現在の日付に基づいた収集情報
```

## 4. トラブルシューティング

### CloudWatch Logs の確認方法

1. AWS Lambda コンソール → **Monitor** タブ
2. **View CloudWatch logs** をクリック
3. 最新のログストリームを確認

### よくある問題と解決策

#### Problem: "There was a problem with the requested skill's response"
**Solution**: CloudWatch Logs でエラーの詳細を確認

#### Problem: セッション情報が保存されない
**Solution**: `shouldEndSession: false` の設定を確認

#### Problem: 音声認識の精度が低い
**Solution**: Interaction Model の同義語を追加

## 5. 本番環境での検証

### Device Testing (実機テスト)

1. Amazon Echo デバイスで音声テスト
2. Alexa アプリでスキルの有効化確認
3. 異なる発音パターンでのテスト

### Performance Testing

- 応答時間: < 3秒
- 音声認識精度: > 90%
- エラー率: < 1%

## 6. デプロイメント完了チェックリスト

- [ ] ZIPファイルをLambdaにアップロード
- [ ] スキルモデルをビルド
- [ ] シミュレーターで基本動作確認
- [ ] 全てのインテントをテスト
- [ ] CloudWatch Logsでエラーなし
- [ ] 実機でのテスト完了

---

## 🎯 次のステップ

デプロイメント完了後:
1. **スキル認定申請** (Amazon Developer Portalで申請)
2. **ユーザーフィードバック収集**
3. **継続的改善とアップデート**
