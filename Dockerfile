FROM node:lts

RUN mkdir /app
WORKDIR /app
COPY src src
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
EXPOSE 3000
ENTRYPOINT npm run-script start

