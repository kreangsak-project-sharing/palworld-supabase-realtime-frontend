FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]