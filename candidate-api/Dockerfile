# -------------------------------------------------------------------
# Stage 1: “builder” that installs dependencies and generates the Nest build
# -------------------------------------------------------------------
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
# and then run npm install to reduce layers and cache dependencies
COPY package*.json ./

# Install production and development dependencies (if you have devDependencies needed for build)
RUN npm install

# Copy the rest of the source code
COPY . .

# Run tests and fail if there are errors
RUN npm run test


# Generate the production build
RUN npm run build

# -------------------------------------------------------------------
# Stage 2: “runtime” with only the compiled files
# -------------------------------------------------------------------
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Only copy the dependencies needed for production
COPY package*.json ./
RUN npm install --production

# Copy the compiled output from the “builder” stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port that the NestJS server uses by default (3000)
EXPOSE 3000

# Specify the command to start the app in production mode
CMD ["node", "dist/main.js"]
