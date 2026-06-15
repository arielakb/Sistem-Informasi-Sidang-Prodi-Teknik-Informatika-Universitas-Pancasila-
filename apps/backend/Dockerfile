# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

# Production stage
FROM node:22-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY .env .
EXPOSE 5000
CMD ["node", "dist/server.js"]