# Etapa de construcción
FROM node:20.16 AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm run build

# Etapa de producción
FROM nginx:alpine

# Copia los archivos estáticos generados
COPY --from=build /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx si es necesario
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]