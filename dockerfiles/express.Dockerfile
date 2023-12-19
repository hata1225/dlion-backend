FROM node:21-slim

RUN apt-get update && apt-get install -y openssl libssl-dev netcat-traditional
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build
RUN chmod +x ./start.sh
CMD ["./start.sh"]
