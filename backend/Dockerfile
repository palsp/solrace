FROM node:12 AS builder
WORKDIR /app
RUN yarn global add typescript
COPY package.json .
COPY yarn.lock .
RUN yarn --pure-lockfile
COPY . .
RUN yarn build

FROM node:12-alpine
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn --pure-lockfile --production
COPY config config
COPY ormconfig.js .
COPY --from=builder /app/dist dist
ENV NODE_PATH="dist/src"
EXPOSE 8080
COPY start.sh .
COPY tsconfig.json .
COPY public/ dist/public
RUN chmod +x ./start.sh
ENTRYPOINT  ["sh", "./start.sh"]