FROM node:20-alpine

# Fix Prisma's glibc issues
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy and install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy app
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the app
RUN pnpm run build

# Cloud Run requires this
EXPOSE 8080

# Start app
CMD ["node", "dist/main"]