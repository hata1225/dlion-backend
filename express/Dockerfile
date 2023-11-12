# ベースイメージの選択
FROM node:21-slim

# 作業ディレクトリの設定
WORKDIR /usr/src/app

# 依存関係のコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ソースコードのコピー
COPY . .

# TypeScriptのコンパイル
RUN npm run build

# アプリケーションの実行
CMD ["npm", "start"]
