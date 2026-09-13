FROM node:18-alpine

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . ./
RUN npm run build

# Prune dev dependencies to keep image light
RUN npm prune --production || true

EXPOSE 3000

CMD ["npm", "start"]
