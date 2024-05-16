# backend/Dockerfile
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY ./src .


EXPOSE 4000
CMD [ "node", "/usr/src/app/app.js" ]