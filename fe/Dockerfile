FROM node:20-alpine as builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Build the app
COPY . .
# We use ARG to pass VITE_API_URL during the build process
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
