FROM node:22-alpine AS build
WORKDIR /workspace
COPY package*.json ./
COPY apps/control-plane-api/package.json apps/control-plane-api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/adapters/package.json packages/adapters/package.json
RUN npm ci --ignore-scripts
COPY apps/control-plane-api apps/control-plane-api
COPY packages/contracts packages/contracts
COPY packages/adapters packages/adapters
RUN npm run build --workspace @cloudforge/control-plane-api

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/apps/control-plane-api/dist ./dist
COPY --from=build /workspace/apps/control-plane-api/package.json ./package.json
EXPOSE 4000
USER node
CMD ["node", "dist/main.js"]
