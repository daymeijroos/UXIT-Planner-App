##### DEPENDENCIES

FROM --platform=linux/amd64 node:20-alpine3.16 AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

# COPY prisma ./

# Install dependencies using NPM

COPY package.json package-lock.json* ./

RUN npm ci

##### BUILDER

FROM --platform=linux/amd64 node:20-alpine3.16 AS builder
ARG DATABASE_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_PORT
ARG NEXTAUTH_URL
WORKDIR /app
COPY . .
COPY ./.env ./

RUN npx prisma generate
RUN SKIP_ENV_VALIDATION=1 npm run build

##### RUNNER

FROM --platform=linux/amd64 node:20-alpine3.16 AS runner
WORKDIR /app

ENV NODE_ENV production

# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/prisma ./prisma

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
