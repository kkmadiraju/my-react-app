FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html tsconfig.json vite.config.js eslint.config.js ./
COPY public ./public
COPY src ./src

ARG VITE_CALC_API_URL
ENV VITE_CALC_API_URL=${VITE_CALC_API_URL}

RUN npm run build

FROM nginx:1.27-alpine

COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
