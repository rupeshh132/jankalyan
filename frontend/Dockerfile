# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies (copying package files first for layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the production bundle
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Remove the default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the build stage to Nginx's serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
