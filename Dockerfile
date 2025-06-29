# 久喜市ゴミ分別アプリ - Docker設定
FROM nginx:alpine

# メタデータの追加
LABEL maintainer="Kuki Trash App Team"
LABEL description="久喜市ゴミ分別音声アプリ"
LABEL version="1.0.0"

# 作業ディレクトリの設定
WORKDIR /usr/share/nginx/html

# アプリケーションファイルをコピー
COPY index.html .
COPY src/ ./src/
COPY manifest.json .

# Nginxの設定ファイルをコピー
COPY docker/nginx.conf /etc/nginx/nginx.conf

# ポート80を公開
EXPOSE 80

# ヘルスチェックの追加
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]
