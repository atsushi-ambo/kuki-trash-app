# 🚀 久喜市ゴミ分別アプリ - デプロイメントガイド

## 📋 概要

この文書では、久喜市ゴミ分別音声アプリを本番環境にデプロイする手順を説明します。

## 🌐 ウェブアプリのデプロイメント

### Option 1: Netlify (推奨)

1. **GitHubにコードをプッシュ**
```bash
git add .
git commit -m "完成版アプリ"
git push origin main
```

2. **Netlifyでデプロイ**
   - [Netlify](https://netlify.com)にサインアップ
   - "New site from Git"をクリック
   - GitHubリポジトリを選択
   - Build settings:
     - Build command: `(empty)`
     - Publish directory: `./`
   - "Deploy site"をクリック

3. **カスタムドメイン設定**（オプション）
   - サイト設定 > Domain management
   - カスタムドメインを追加

### Option 2: Vercel

1. **Vercel CLIインストール**
```bash
npm install -g vercel
```

2. **デプロイ**
```bash
vercel --prod
```

### Option 3: GitHub Pages

1. **GitHub Pagesを有効化**
   - リポジトリの Settings > Pages
   - Source: Deploy from a branch
   - Branch: main / (root)

## 📱 Alexaスキルのデプロイメント

### 前提条件
- Amazon Developer Accountが必要
- AWS Accountが必要

### ステップ1: AWS Lambdaにデプロイ

1. **Lambda関数の作成**
```bash
cd alexa-skill/lambda
zip -r kuki-garbage-skill.zip .
```

2. **AWS Lambdaコンソール**
   - 新しい関数を作成
   - ランタイム: Node.js 18.x
   - zipファイルをアップロード
   - トリガーを追加: Alexa Skills Kit

3. **環境変数設定**（必要に応じて）
   - NODE_ENV: production

### ステップ2: Alexa Developer Consoleでスキル作成

1. **新しいスキルの作成**
   - [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
   - "Create Skill"をクリック
   - Skill name: "久喜市ゴミ分別"
   - Primary locale: Japanese (JP)
   - Model: Custom
   - Hosting method: Provision your own

2. **インタラクションモデルのインポート**
   - JSON Editor
   - `alexa-skill/interactionModel.json`の内容をコピー&ペースト
   - "Save Model" > "Build Model"

3. **エンドポイント設定**
   - Endpoint > AWS Lambda ARN
   - LambdaのARNを入力
   - 地域: Asia Pacific (Tokyo)

4. **テスト**
   - Test タブで動作確認

### ステップ3: 認定・公開

1. **スキル情報の入力**
   - Distribution > Skill Preview
   - 必要な情報を全て入力

2. **プライバシー・コンプライアンス**
   - Distribution > Privacy & Compliance
   - 必要な項目にチェック

3. **認定提出**
   - "Submit for review"をクリック

## 🔧 本番環境設定

### パフォーマンス最適化

1. **画像最適化**
```bash
# PNG icons の生成（canvas がインストールされている場合）
node convert-icons.js
```

2. **Gzip圧縮** (Netlify/Vercelでは自動)

3. **CDN設定** (Netlify/Vercelでは自動)

### セキュリティ設定

1. **HTTPS** (Netlify/Vercelでは自動)

2. **CSP Headers** (netlify.toml に追加可能)
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
```

### 監視・分析

1. **Google Analytics**
```html
<!-- Google Analytics タグをindex.htmlに追加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

2. **Netlify Analytics** (有料プラン)

## 📊 デプロイ後の確認事項

### ウェブアプリ

- [ ] PWA として正常にインストール可能
- [ ] 音声認識が動作
- [ ] 音声合成が動作
- [ ] 検索機能が正常動作
- [ ] オフライン機能が動作
- [ ] モバイルレスポンシブ

### Alexaスキル

- [ ] 基本的な挨拶応答
- [ ] ゴミ分別検索が動作
- [ ] 収集日情報が正確
- [ ] エラーハンドリングが適切

## 🔄 継続的デプロイメント

### GitHub Actions の設定

`.github/workflows/deploy.yml`を作成:

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📞 サポート・メンテナンス

### 定期的な更新

1. **ゴミ分別ルールの更新**
   - `garbageData.js`を定期的にレビュー
   - 久喜市公式サイトとの同期

2. **依存関係の更新**
```bash
npm audit fix
```

3. **ブラウザ互換性の確認**

### 問題対応

1. **ログ監視**
   - ブラウザのコンソールエラー
   - Netlify/Vercelのデプロイログ
   - AWS CloudWatch (Alexa)

2. **ユーザーフィードバック**
   - 問い合わせフォームの設置
   - GitHub Issues の活用

## 🎯 成功指標

- **ウェブアプリ**: 月間アクティブユーザー数
- **Alexaスキル**: スキル使用回数
- **ユーザー満足度**: レビュー評価
- **技術指標**: ページ読み込み速度、エラー率

---

## 📝 追加リソース

- [Netlify Documentation](https://docs.netlify.com/)
- [Alexa Skills Kit Documentation](https://developer.amazon.com/en-US/docs/alexa/ask-overviews/what-is-the-alexa-skills-kit.html)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [久喜市公式サイト](https://www.city.kuki.lg.jp/)
