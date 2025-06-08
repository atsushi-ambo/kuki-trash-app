# Alexaスキル フリーズ問題 解決ガイド

## 🆘 緊急対処法（フリーズした場合）

### ステップ1: ブラウザの問題排除
1. **ブラウザを完全にリフレッシュ**
   - `Cmd+Shift+R` (Mac) または `Ctrl+Shift+R` (Windows)
   - キャッシュクリア付きリロード

2. **新しいタブで開き直し**
   - [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
   - スキル一覧から「kuki-trash-app」を選択

3. **ブラウザを変更**
   - Chrome → Safari または Firefox
   - シークレットモード/プライベートブラウジングを試す

### ステップ2: Console の操作方法変更

#### 🎯 現在推奨: Manual JSON入力方式
フリーズを避けるため、音声入力ではなくJSON入力を使用：

1. **Testタブ** → **Manual JSON** タブを選択
2. 以下のJSONを貼り付けてテスト：

```json
{
  "version": "1.0",
  "session": {
    "new": true,
    "sessionId": "amzn1.echo-api.session.test",
    "application": {
      "applicationId": "amzn1.ask.skill.your-skill-id"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.test"
    }
  },
  "context": {
    "System": {
      "application": {
        "applicationId": "amzn1.ask.skill.your-skill-id"
      },
      "user": {
        "userId": "amzn1.ask.account.test"
      },
      "device": {
        "deviceId": "test",
        "supportedInterfaces": {}
      }
    }
  },
  "request": {
    "type": "LaunchRequest",
    "requestId": "amzn1.echo-api.request.test",
    "timestamp": "2025-01-01T00:00:00Z",
    "locale": "ja-JP"
  }
}
```

3. **「Invoke skill」ボタンをクリック**

### ステップ3: コードの最適化

現在のコードにタイムアウト対策を追加：

#### A. ResponseBuilder の明示的な完了
```javascript
// 各ハンドラーの最後で必ず以下を実行
return handlerInput.responseBuilder
    .speak(speechText)
    .getResponse();
```

#### B. 非同期処理の適切な処理
```javascript
// Promiseの適切な処理
async handle(handlerInput) {
    try {
        // 処理内容
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    } catch (error) {
        console.error('Error:', error);
        return handlerInput.responseBuilder
            .speak('申し訳ございません。エラーが発生しました。')
            .getResponse();
    }
}
```

## 🔍 フリーズの主な原因

### 1. Alexa Simulator の負荷
- 音声入力時の処理負荷
- ブラウザのマイク権限問題
- 長時間のセッション維持

### 2. コードの問題
- 無限ループ
- 未処理のPromise
- メモリリーク

### 3. Developer Consoleの制限
- 同時セッション数の制限
- タイムアウト設定

## ✅ 推奨テスト手順

### Phase 1: Manual JSONテスト
1. LaunchRequest テスト
2. GarbageSearchIntent テスト（JSON入力）
3. エラーハンドリング テスト

### Phase 2: 音声テスト（Phase 1成功後）
1. 「久喜市ゴミ分別アプリを開いて」
2. 「ペットボトルの分別方法を教えて」
3. 「今日のゴミは何ですか」

### Phase 3: 実機テスト
1. Echo デバイスでのテスト
2. Alexaアプリでのテスト

## 🚨 緊急回避方法

もしConsoleが完全にフリーズした場合：

1. **ブラウザを完全に終了**
2. **5分間待機**
3. **新しいブラウザセッションで再開**
4. **Manual JSONテストのみ実行**

## 📞 サポート情報

問題が解決しない場合：
- Amazon Developer Support に問い合わせ
- 現在のスキルID: `amzn1.ask.skill.xxxxx`
- エラーの発生時刻を記録
- ブラウザとOSの情報を準備
