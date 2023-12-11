# ベースイメージの選択
FROM node:21-slim

# 必要なシステムライブラリのインストール
RUN apt-get update && apt-get install -y openssl libssl-dev

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build
RUN chmod +x ./start.sh
CMD ["./start.sh"]
