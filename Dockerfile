FROM node:16-alpine
ARG PROFILE
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
COPY ./override/mongoAdapter.js /usr/src/app/node_modules/simple-odata-server-mongodb/lib/mongoAdapter.js
#COPY . .
EXPOSE 31513
ENV NODE_ENV=$PROFILE
RUN echo "$NODE_ENV"
CMD ["node" , "app.js"]