# 久喜市ゴミ分別音声アプリ

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps)
[![Alexa](https://img.shields.io/badge/Alexa-Ready-orange.svg)](https://developer.amazon.com/alexa)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

埼玉県久喜市のゴミ分別ルールを音声で案内するProgressive Web Application（PWA）とAmazon Alexaスキルです。久喜市公式ごみ分別辞典サイト「ごみサク」の公開情報に基づき、音声認識と音声案内機能で直感的にゴミの分別方法を検索できます。

![アプリのスクリーンショット](docs/images/app-screenshot.png)

> **⚠️ 重要な注意事項**  
> これは **個人開発のアプリケーション** であり、久喜市公式のアプリではありません。  
> 詳細な免責事項は文末をご確認ください。

## 🏗️ プロジェクト構成

```
kuki-trash-app/
├── src/                           # ソースコード
│   ├── web/                       # Webアプリケーション
│   │   ├── js/                    # JavaScript files
│   │   ├── css/                   # スタイルシート
│   │   └── assets/                # 静的ファイル（アイコン等）
│   └── shared/                    # 共有データファイル
│       ├── garbageData.js         # ゴミ分別データ
│       └── regionData.js          # 地域収集スケジュール
├── alexa-skill/                   # Alexaスキル（Alexa-Hosted）
│   ├── lambda/                    # スキルコード
│   ├── models/                    # 対話モデル
│   ├── README.md                  # Alexaスキル説明
│   └── DEPLOYMENT.md              # デプロイガイド
├── tests/                         # テストファイル
│   └── web/                       # Webアプリテスト
├── tools/                         # 開発ツール
├── docker/                        # Docker設定
└── docs/                          # プロジェクトドキュメント
```

## 🌟 主な機能

### 🏠 地域対応機能
- **14地域対応**: 久喜地区（A-D）、菖蒲地区（A-B）、鷲宮地区（A-D）、栗橋地区（A-D）の全ブロック
- **地域別収集日**: 各地区の詳細な収集スケジュールに完全対応
- **地域選択制**: 初回起動時は地域未選択、ユーザーが選択後は設定を永続保存
- **収集日案内**: 「今日のゴミは何？」で地域別収集情報を音声案内

### 🎤 音声認識機能
- **ハンズフリー検索**: マイクボタンを押してゴミの名前を話すだけ
- **高精度認識**: 日本語音声認識に最適化、自然な質問形式に対応
- **類似語対応**: 方言や言い回しの違い、発音の揺れにも対応
- **収集日音声検索**: 「今日のゴミは何？」「明日のゴミはなんですか？」に対応

### 🔊 音声案内
- **自動読み上げ**: 検索結果を自然な日本語で音声案内
- **詳細説明**: 出し方の注意点も音声で詳しく説明
- **対話型応答**: 自然な会話形式での案内メッセージ

### 🔍 高度な検索機能
- **インテリジェント分別**: プラスチックなど複雑な分別ルールを詳細案内
- **完全一致・部分一致**: 柔軟な検索アルゴリズム
- **キーワードマッピング**: 一般的な表現から正確な分別カテゴリを特定

### 📊 データソース・信頼性
- **公式準拠**: 久喜市公式ごみ分別辞典サイト「ごみサク」（gomisaku.jp）の公開情報に基づく
- **地区別対応**: 久喜・菖蒲・鷲宮・栗橋の4地区すべてに対応
- **10の分別種別**: 燃やせるごみ、燃やせないごみ、資源プラスチック類、びん・缶・ペットボトル等
- **最新情報**: 2025年6月時点の公式情報を反映

### 💻 モダンなWebアプリ + Alexaスキル
- **PWA対応**: ホーム画面に追加してアプリのように使用可能
- **オフライン機能**: Service Workerによるキャッシュ機能
- **レスポンシブ**: PC・タブレット・スマートフォンに完全対応
- **高速**: 軽量設計で素早い動作、Docker対応
- **Alexaスキル**: Amazon Echoデバイスでの音声操作に対応
- **地域連携**: WebアプリとAlexaスキルで同一データソース使用

### 🎯 ユーザビリティ
- **収集カレンダー**: 地区別14日間の収集予定を表示
- **次回収集日表示**: 検索結果に次回収集日も併記
- **クイック検索**: 人気のアイテムをワンクリック検索
- **美しいUI**: グラデーションとアニメーションで視覚的にわかりやすい
- **地域情報表示**: 現在設定されている地域名を常時表示

## 🚀 使い方

### 地域設定（初回のみ）
1. ページ上部の「地域を選択してください」をクリック
2. 居住地区（A-Dブロック）を選択
3. 設定は自動保存され、次回アクセス時も記憶されます

### 音声での検索
1. マイクボタン（🎤）をクリック
2. ゴミの名前を話す（例：「ペットボトル」「プラスチック」「生ゴミ」）
3. 自動で分別方法が表示・音声案内される

### 収集日の確認
1. 「今日のゴミは何？」「明日のゴミはなんですか？」と話す
2. 設定した地域の収集スケジュールで回答される
3. 地域名も一緒に表示されます

### テキストでの検索
1. 入力欄にゴミの名前を入力
2. 検索ボタンをクリックまたはEnterキー
3. 分別方法が表示される

### クイック検索
- よく検索される項目のボタンをクリックして即座に検索

## 📱 対応ブラウザ

- Chrome（推奨）
- Safari
- Firefox
- Edge

※音声認識機能は一部のブラウザでのみ利用可能です

## 🛠️ 開発・実行環境のセットアップ

このアプリケーションは **Docker** を使用して統一的に開発・実行できます。WebアプリとAlexaスキルの両方が含まれています。

### 必要なソフトウェア
- [Docker](https://www.docker.com/get-started) 
- [Docker Compose](https://docs.docker.com/compose/install/)
- Git
- Node.js 18+ (Alexaスキル開発時のみ)

### 🐳 Dockerを使用した開発環境のセットアップ（推奨）

#### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/kuki-trash-app.git
cd kuki-trash-app
```

#### 2. Docker Composeで起動
```bash
# 開発用サーバーを起動（ポート3000）
docker-compose up -d

# ログの確認
docker-compose logs -f

# アプリケーションにアクセス
# http://localhost:3000
```

#### 3. 個別のDockerコマンドでの起動
```bash
# イメージをビルド
docker build -t kuki-trash-app .

# コンテナを起動（ポート3000）
docker run -d --name kuki-trash-app-container -p 3000:80 kuki-trash-app

# アプリケーションにアクセス
# http://localhost:3000
```

### 🎤 Alexaスキル開発環境

```bash
# Alexaスキル開発ディレクトリに移動
cd alexa-skill/lambda

# 依存関係のインストール
npm install

# ローカルテストの実行
npm test

# テスト用のスクリプト実行 
node ../tests/alexa/test-local.js
```

### � 開発時のコマンド

```bash
# Webアプリの開発
# コンテナの停止
docker-compose down

# コンテナの再起動
docker-compose restart

# ログの確認
docker-compose logs kuki-trash-app

# コンテナの状態確認
docker-compose ps

# イメージの再ビルド
docker-compose up -d --build
```

### 🧪 テストの実行

```bash
# Webアプリのテスト
npm test

# またはDockerコンテナでのテスト
docker run --rm -v $(pwd):/app -w /app node:18-alpine npm test

# Alexaスキルのテスト（Alexa Developer Consoleで実行）
# Alexa-Hosted Skills では Console の Test タブでテストします
```

### 🔍 デバッグとトラブルシューティング

```bash
# コンテナ内でシェルを起動
docker exec -it kuki-trash-app-container sh

# コンテナの詳細情報
docker inspect kuki-trash-app-container

# リソース使用量の確認
docker stats kuki-trash-app-container
```

### 📱 ローカル開発用の追加機能

開発時に便利な以下のページも利用できます：

- `http://localhost:3000/tests/web/voice-region-test.html` - 音声認識地域機能のテスト
- `http://localhost:3000/tests/web/test-summary.html` - 実装状況の確認
- `http://localhost:3000/tests/web/debug-region.html` - 地域機能のデバッグ
- `http://localhost:3000/tools/clear-storage.html` - ローカルストレージ管理
- `http://localhost:3000/tools/create-icons.html` - アイコン生成ツール

## 📋 ゴミ分別カテゴリ

### 主要カテゴリ
- **燃やせるごみ**: 生ゴミ、紙くず、布類、革・ゴム製品など
- **燃やせないごみ**: 金属類、ガラス・陶磁器、小型家電など
- **資源プラスチック類**: ペットボトル、プラスチック容器、発泡スチロールなど
- **びん・缶・ペットボトル**: 飲料缶、食品缶、ガラスびんなど
- **紙類**: 新聞、雑誌、ダンボール、紙パックなど
- **布・衣類**: 古着、タオル、シーツなど
- **有害ごみ**: 電池、蛍光灯、体温計など

### 地区別対応
- **久喜地区**: A・B・C・Dブロック
- **菖蒲地区**: A・Bブロック  
- **鷲宮地区**: A・B・C・Dブロック
- **栗橋地区**: E・F・G・Hブロック

### 収集方法
- **定期収集**: 週1〜2回の定期収集
- **回収ボックス**: 常設回収ボックスでの随時回収
- **事前申込**: 粗大ごみ等の事前申込制

## 🗓️ 収集日について

地区・ブロックによって収集日が異なります。アプリで地域を設定すると、音声で「今日のゴミは何？」と聞くだけで収集予定を確認できます。

### 収集頻度
- **燃やせるごみ**: 週2回
- **燃やせないごみ**: 月1回（第2土曜日または第4土曜日）
- **資源プラスチック類**: 週1回
- **びん・缶・ペットボトル**: 週1回
- **紙類**: 月2回（第1・第3火曜日または第2・第4火曜日）
- **布・衣類**: 月1回
- **有害ごみ**: 常設回収ボックス（随時）

### 出し方のルール
- **時間**: 朝8時30分まで
- **場所**: 指定された収集場所
- **袋**: 透明または半透明の袋を使用

## 🔧 技術仕様

### Webアプリケーション
- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **音声認識**: Web Speech API
- **音声合成**: Speech Synthesis API
- **データ管理**: ローカルストレージ + 静的JSONデータ
- **PWA機能**: Service Worker, Web App Manifest
- **コンテナ**: Docker + Nginx
- **地域対応**: 14地域の収集スケジュール対応

### Alexaスキル
- **ランタイム**: Node.js 18+
- **フレームワーク**: Alexa Skills Kit SDK v2
- **ホスティング**: Alexa-hosted Skills（完全無料）
- **データソース**: Webアプリと共通のJSONデータ
- **地域機能**: セッション属性による地域設定
- **対話モデル**: 複数の対話モデル（基本・拡張・複合）

### 共有データ
- **ゴミ分別データ**: `src/shared/garbageData.js`
- **地域スケジュール**: `src/shared/regionData.js`
- **データ形式**: JavaScript modules（CommonJS/ES6両対応）

## 🐳 本番環境でのDocker活用

### 本番デプロイメント
```bash
# 本番用イメージのビルド
docker build -t kuki-trash-app:production .

# 本番環境での起動
docker run -d --name kuki-trash-app-prod \
  -p 80:80 \
  --restart unless-stopped \
  --health-cmd="curl -f http://localhost/ || exit 1" \
  --health-interval=30s \
  kuki-trash-app:production
```

### クラウドデプロイメント例
```bash
# AWS ECS, Azure Container Instances, GCP Cloud Runなどで利用可能
# Docker Hubへのプッシュ
docker tag kuki-trash-app:production atsushi-ambo/kuki-trash-app:latest
docker push atsushi-ambo/kuki-trash-app:latest
```

## 📝 TODO

### Webアプリ
- [x] PWA対応（オフライン機能）
- [x] 地域別収集スケジュール対応
- [x] 音声認識地域情報統合
- [x] Docker環境整備
- [x] ディレクトリ構造の整理・リファクタリング
- [ ] ゴミ出し忘れ通知機能
- [ ] 収集カレンダー表示機能

### Alexaスキル
- [x] Amazon Alexa スキル完成（Alexa-hosted Skills対応）
- [x] 地域対応機能（セッション管理）
- [x] 包括的なゴミ分別データベース統合
- [x] 複数の対話モデル作成
- [x] ローカルテスト環境構築
- [ ] Alexa スキルストア公開
- [ ] より自然な対話フロー改善
- [ ] 定期的な収集日通知機能

### プロジェクト全体
- [x] 共有データファイルの統一
- [x] プロジェクト構成の最適化
- [ ] CI/CD パイプライン構築
- [ ] 自動テストの拡充

## 🎯 Alexaスキル開発

`alexa-skill/` フォルダにAmazon Alexaスキルの完全な実装が含まれています。WebアプリのデータとロジックをAlexaデバイスでも利用できます。

### 主な特徴
- **地域対応**: Webアプリと同等の14地域サポート
- **詳細な分別案内**: 包括的なゴミ分別データベース
- **自然な対話**: 複数の対話モデルによる柔軟な音声認識
- **セッション管理**: ユーザーの地域設定を記憶

### ローカル開発・テスト

```bash
# Alexaスキルのディレクトリに移動
cd alexa-skill/lambda

# 依存関係のインストール
npm install

# テストの実行
npm test

# ローカルテスト（模擬リクエスト）
cd ../../tests/alexa
node test-local.js
```

### 対話モデル

`alexa-skill/models/interactionModel.json` に音声認識用の対話モデルが含まれています。このモデルには地域設定機能と包括的なゴミ分別クエリが含まれています。

### デプロイ方法

#### 🆓 Alexa-hosted Skills（完全無料）

Amazon Alexaが提供する **完全無料のホスティングサービス** を使用します。追加料金なしでAlexaスキルを公開できます。

**手順:**
1. [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) でスキル作成
   - スキル名: 久喜市ゴミ分別
   - 言語: Japanese (JP)
   - モデル: Custom
   - ホスティング: **🆓 Alexa-hosted (Node.js)** ← 完全無料

2. **Code タブ**: `alexa-skill/lambda/index.js` と `package.json` をコピー

3. **Build タブ**: `alexa-skill/models/interactionModel.json` をインポート

4. **Test タブ**: テストして公開

**完全無料で利用可能:**
- ✅ Alexaのホスティングサービスを使用（無料）
- ✅ 追加のAWSアカウント不要
- ✅ セットアップ時間: 約10分
- ✅ 久喜市の利用規模なら十分な無料枠

詳細な手順は [`alexa-skill/DEPLOYMENT.md`](alexa-skill/DEPLOYMENT.md) をご覧ください。

## 🔐 セキュリティ

このプロジェクトはパブリックリポジトリでの公開を想定して設計されています：

- 🔒 APIキーや機密情報は含まれていません
- 🔒 すべてのデータは静的ファイルまたは公開情報です
- 🔒 ユーザーデータはローカルストレージにのみ保存
- 🔒 外部API依存なし（ブラウザAPI以外）

詳細は [SECURITY.md](SECURITY.md) をご覧ください。

## 📄 ライセンス・免責事項

### ライセンス
MIT License

### 免責事項・重要な注意点
> **⚠️ 重要**  
> 本アプリケーションは **個人開発プロジェクト** であり、**久喜市公式のアプリケーションではありません**。  
> ゴミ分別情報の正確性については保証いたしません。最終的な分別判断は利用者の **自己責任** でお願いします。  
> 最新・正確な情報は [久喜市公式サイト](https://www.city.kuki.lg.jp/) でご確認ください。

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します！

### 開発に参加する場合

1. **フォーク**: このリポジトリをフォーク
2. **ブランチ作成**: `git checkout -b feature/your-feature-name`
3. **開発**: 新しい機能やバグ修正を実装
4. **テスト**: `npm test` でテストを実行
5. **コミット**: `git commit -m "Add your feature"`
6. **プッシュ**: `git push origin feature/your-feature-name` 
7. **プルリクエスト**: GitHubでプルリクエストを作成

### 開発のヒント

- **Webアプリ**: `src/web/` でフロントエンド開発
- **Alexaスキル**: `alexa-skill/lambda/` でスキル開発（Alexa-Hosted対応）
- **共有データ**: `src/shared/` でデータ更新
- **テスト**: `tests/` でテストコード作成
- **ツール**: `tools/` で開発用ユーティリティ

### プロジェクト構成の改善

このプロジェクトは最近、保守性と開発効率向上のために大幅なディレクトリ構造の改善を行いました：

- **論理的なグループ化**: 関連ファイルの整理
- **明確な分離**: Web、Alexa、テスト、ツールの分離
- **スケーラブル**: 将来の機能追加に対応
- **保守性**: ファイルの発見と修正が容易

---
