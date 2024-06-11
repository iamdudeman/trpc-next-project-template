# Install dependencies only when needed
FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /

RUN addgroup -g 1001 -S local-user
RUN adduser -S local-user -u 1001

# copy files from builder
COPY --chown=local-user:local-user / .
COPY --chown=local-user:local-user --from=deps /app/node_modules ./node_modules

RUN mkdir -p /dist
RUN chown local-user /dist
RUN mkdir -p /devStorage
RUN chown local-user /devStorage

USER local-user

EXPOSE 3000

# Environment variables
ENV PGHOST=database
ENV PGPORT=5432
ENV PGDATABASE=local_database
ENV PGUSER=admin
ENV PGPASSWORD=admin
ENV JWT_SECRET=localsecret
ENV NODE_ENV=development
