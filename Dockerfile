FROM node:20-alpine

# Install OS dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the rest of your app
COPY . .

# Ensure prisma client is generated
RUN npx prisma generate

# Build the app
RUN pnpm run build

# Expose the port (just for clarity; Cloud Run handles this)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]