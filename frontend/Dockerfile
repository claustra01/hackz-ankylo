FROM node:22-slim AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM nginx:alpine

WORKDIR /usr/share/nginx/html

ADD nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/index.html .
COPY --from=builder /app/dist/assets/ ./assets/
COPY --from=builder /app/dist/vite.svg .

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
