# dlion-backend

dlion のバックエンド

### prisma 関連のコマンド

- npx prisma migrate dev
  マイグレートする際に使う
- npx prisma generate
  マイグレート後、typescript 用に型を自動で生成

### docker 関連のコマンド

- docker-compose down --rmi all --volumes
  ボリューム, イメージ全削除

### env の設定

- 以下は例
  > MYSQL_ROOT_PASSWORD=password
  > MYSQL_DATABASE=database
  > DATABASE_URL="mysql://root:password@localhost:3306/database"
  > SESSION_SECRET=SESSION_SECRET
  > GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID
  > GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET
  > PORT=3000
  > GOOGLE_CALLBACK_PATH=/auth/google/callback
