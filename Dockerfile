FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN npx prisma generate

RUN pnpm run build

EXPOSE 8080

CMD ["node", "dist/main"]