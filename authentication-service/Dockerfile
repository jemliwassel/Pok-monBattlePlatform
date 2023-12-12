# create image from the official nodejs image tag 16.18.0-alpine
FROM node:16.18.0-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

#RUN npm rebuild better-sqlite3 --build-from-source

CMD [ "node", "dist/index.js" ]

EXPOSE 5001
