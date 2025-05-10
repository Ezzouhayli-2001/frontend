# Stage 1: Build Angular application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

ARG PROFILE=prod
ENV PROFILE=${PROFILE}

# Create necessary directories
RUN mkdir -p /etc/nginx/ssl /etc/nginx/conf.d

# Copy build output
COPY --from=build /app/dist/sakai-ng /usr/share/nginx/html

# Copy Nginx configs
COPY src/zyn/nginx/${PROFILE}/nginx.conf /etc/nginx/nginx.conf
COPY src/zyn/nginx/${PROFILE}/default.conf /etc/nginx/conf.d/default.conf

# SSL certificates (only for production)
COPY src/zyn/ssl/${PROFILE}/cert.pem /etc/nginx/ssl/cert.pem
COPY src/zyn/ssl/${PROFILE}/key.pem /etc/nginx/ssl/key.pem

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
