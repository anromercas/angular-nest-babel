# -------------------------------------------------------------------
# Stage 1: “builder” that installs dependencies and generates the Angular build
# -------------------------------------------------------------------
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to cache npm install
COPY package*.json ./

RUN npm install

# Copy all project files (source code)
COPY . .

# Run tests and fail if there are errors
RUN npm run test -- --ci --coverage=false

# Generate the production build of Angular
RUN npm run build --prod

# -------------------------------------------------------------------
# Stage 2: “serve” with Nginx to deliver static files
# -------------------------------------------------------------------
FROM nginx:1.23-alpine AS production

# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular compiled files from the “builder” stage
COPY --from=builder /usr/src/app/dist/candidate-frontend /usr/share/nginx/html

# Copy minimal Nginx configuration for rewrites (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to serve the site
EXPOSE 80

# Default command: start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
