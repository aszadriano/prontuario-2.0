FROM node:18-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json
RUN npm install --workspaces --include-workspace-root=false

FROM deps AS build
COPY . .
RUN npm run build --workspace @prontuario/shared \
 && npm run build --workspace api

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/packages/shared ./packages/shared
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/package.json
CMD ["npm", "run", "start", "--workspace", "api"]
