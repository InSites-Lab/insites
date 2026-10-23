FROM node:22-bookworm-slim

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server ./server
COPY shared ./shared
COPY fixtures ./fixtures
COPY web/dist/viewer.html ./web/dist/viewer.html

ENV NODE_ENV=production BIND_HOST=0.0.0.0
USER node
CMD ["node", "server/http.mjs"]
