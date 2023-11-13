#!/bin/bash

# MySQL が起動するまで待機
until mysqladmin ping -h localhost --silent; do
    echo "Waiting for MySQL to be up..."
    sleep 1
done

# カスタムの初期化スクリプトを実行
mysql -u root -p"$MYSQL_ROOT_PASSWORD" < /docker-entrypoint-initdb.d/init.sql

# MySQL のデフォルトエントリポイントスクリプトを実行
exec docker-entrypoint.sh mysqld
