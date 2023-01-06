FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
ADD package.json /usr/src/app/package.json
RUN npm install

# Bundle app source
ADD . /usr/src/app

EXPOSE 3000

CMD ["npm", "run", "dev"]
