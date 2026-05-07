FROM node:24-alpine

WORKDIR /app

# Install deps first (layer cache)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

# Koyeb / Cloud Run / Fly will inject PORT; server.js already reads process.env.PORT
CMD ["node", "server.js"]
