FROM node:24-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Inyectamos la variable de entorno al build de Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN VITE_API_URL=$VITE_API_URL npm run build


FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
