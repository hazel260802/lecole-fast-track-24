

FROM node:20-alpine AS frontend-dependencies-env
WORKDIR /app
COPY package.json yarn.lock ./ 
RUN yarn install

COPY . .

FROM node:20-alpine AS frontend-build-env
WORKDIR /app
COPY --from=frontend-dependencies-env /app /app
RUN yarn build

FROM node:20-alpine AS backend-dependencies-env
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --omit=dev
COPY . .

FROM node:20-alpine
WORKDIR /app

COPY --from=frontend-build-env /app/build /app/build

COPY --from=backend-dependencies-env /app /app


EXPOSE 3000 5173

CMD ["sh", "-c", "yarn dev --port 5173 & yarn dev:server --port 3000"]
