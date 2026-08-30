FROM node:22-slim AS deps
WORKDIR /app
# Outils de compilation au cas où un module natif (better-sqlite3, sharp)
# n'aurait pas de binaire précompilé pour cette version de Node.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
# Épingler la version de npm qui a généré le lockfile : les versions de npm
# divergent sur les dépendances optionnelles (wasm) et déclarent sinon le
# lockfile désynchronisé.
RUN npm install -g npm@11.19.1 && npm ci

FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Valeurs factices pour le build seulement (les vraies viennent de l'environnement Render)
ENV SESSION_SECRET=build-placeholder-secret-32-characters!!
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/drizzle ./drizzle
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
