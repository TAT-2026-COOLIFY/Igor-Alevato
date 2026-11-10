FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
# Atenção: "estoque-frontend" deve ser o nome exato do seu projeto Angular no angular.json
COPY --from=build /app/dist/estoque-frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]