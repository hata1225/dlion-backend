# dlion-backend
dlionのバックエンド

### prisma関連のコマンド
- npx prisma migrate dev
    マイグレートする際に使う
- npx prisma generate
    マイグレート後、typescript用に型を自動で生成

### docker関連のコマンド
- docker-compose down --rmi all --volumes
    ボリューム, イメージ全削除

### envの設定
- 以下は例
> MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=database
DATABASE_URL="mysql://root:password@localhost:3306/database"
