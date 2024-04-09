require('dotenv').config();
var config = {
  development: {
    app : {
      port: 51513
    },
    mongodb: {
      url: "root:root@localhost:27017/admin",
      name: "k1"
    }
    
  },
  production: {
    app : {
      port: process.env.DEV_PORT
    },
    mongodb: {
      url: process.env.DEV_MONGO_USERNAME + ":" + process.env.DEV_MONGO_PASSWORD + "@" +
          process.env.DEV_MONGO_HOST + ":" + process.env.DEV_MONGO_PORT,
          name: process.env.DEV_MONGO_NAME
      }
  },
   colo: {
    app : {
      port: process.env.COLO_PORT
    },
    mongodb: {
      url: process.env.COLO_MONGO_USERNAME + ":" + process.env.COLO_MONGO_PASSWORD + "@" +
        process.env.COLO_MONGO_HOST + ":" + process.env.COLO_MONGO_PORT,
      name: process.env.COLO_MONGO_NAME
    }
  },
  uat: {
    app : {
      port: process.env.UAT_PORT
    },
    mongodb: {
      url: process.env.UAT_MONGO_USERNAME + ":" + process.env.UAT_MONGO_PASSWORD + "@" +
        process.env.UAT_MONGO_HOST + ":" + process.env.UAT_MONGO_PORT,
      name: process.env.UAT_MONGO_NAME
    }
  },
};

module.exports = config;