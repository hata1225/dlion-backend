#!/bin/bash

# Prisma Studioをバックグラウンドで起動
npx prisma studio &

# Expressサーバーを起動
npm start
