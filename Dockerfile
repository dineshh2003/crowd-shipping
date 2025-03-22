FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the Expo dev server port
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start Expo
CMD ["npm", "start"]