FROM node:latest

RUN apt-get update && apt-get install -y netcat

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
ADD package.json /usr/src/app/package.json
RUN npm install

# Bundle app source
ADD . /usr/src/app

EXPOSE 8080

RUN chmod +x ./scripts/wait-for

CMD ["./scripts/wait-for", "rabbitmq:5672", "--", "npm", "run", "dev"]
