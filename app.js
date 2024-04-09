var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");


// Create app variable to initialize Express
var app = express();

const checkNodeEnv = require("./configService");

var config = checkNodeEnv();

const {
  mongodb: { url, name },
  app: { port }
} = config;

// Enable Cross-origin resource sharing (CORS)  for app.
app.use(cors());
app.use(express.json());

var _checksum = require("./lib/checksum");
var _odata_configurator = require("./lib/ODataConfigurator");

const _db_operations = require("./helper/db");

var _model_register = {};

// Connection to demo database in MongoDB

var _init_bind = async function (db, collection) {
  try {
    var output = await _db_operations.fetch(db,collection);
    console.log(JSON.stringify(output));


    for (var counter in output) {
      if (output[counter].app && output[counter].workspace) {
        try {
          console.log(" counter : " + JSON.stringify(output[counter]));

          var checksum = output[counter].workspace + "_" + output[counter].app;

          var schema = output[counter].mapping;

          _model_register[checksum] = _odata_configurator(
            schema,
            db,
            output[counter].workspace + "-" + output[counter].app
          );
          console.log("Re Register Success for " + output[counter].workspace + " " + output[counter].app);
        } catch (e) {
          console.log(
            "Configuration failed for " +
            output[counter].workspace +
            " " +
            output[counter].app
          );
        }
      }
    }
  } catch (e) {
    console.log("Initial binding failed due to following error");
    console.log(e);
  }
};

const configurations = [
  //   {
  //     connection:
  //       "mongodb://admin:admin123@ns3172713.ip-151-106-32.eu:27017/k1?authSource=admin",
  //     workspace: "k1",
  //     },
  {
    connection: "mongodb://" + url,
    workspace: name
  },
];

for (var index in configurations) {
  var configuration = configurations[index];
  MongoClient.connect(configuration.connection, function (err, db) {
    console.log(err);

    console.log("Hello One");
    _init_bind(db, configuration.workspace);

    if (err) {
      console.error("Unable to  connect to database");
    }
    {
      console.log("DB connection to " + configuration.connection + " successful, registering api");
      try {
        //on start load the configuration from the db

        app.post("/register/:workspace/:app/", function (req, res) {
          var workspace = req.params.workspace;
          var app = req.params.app;

          console.log("Proceeding with checksum " + workspace + " app " + app);
          //1. Generate checksum using workspace and app
          var checksum = workspace + "_" + app;
          //2. get the schema details from POST api
          var mappings = req.body;
          var schema = mappings.models;
          console.log("*********************************************");
          console.log(schema);
          console.log(mappings);
          //3. create entry in database

          //4. register the model into odataserver.model
          _model_register[checksum] = _odata_configurator(
            schema,
            db,
            workspace + "-" +app
          );

          _db_operations.register(db, mappings);

          res.status(201).send({ message: "Schema Created" });
        });

        // The directive to set app route path.
        app.use("/query/:workspace/:app/", function (req, res) {
          var workspace = req.params.workspace;
          var app = req.params.app;
          // var checksum = _checksum(workspace, app);
          var checksum = workspace + "_" + app;
          console.log("check sum value : " + JSON.stringify(_model_register));
          console.log("query for : " + workspace + " " + app);
          console.log("checksum : " + checksum);
          console.log(
            "Model register : " + JSON.stringify(_model_register[checksum])
          );
          if (_model_register[checksum]) {
            _model_register[checksum].handle(req, res);
          } else {
            res.status(404).send({ message: "No Data Found" });
            return;
          }
        });


      } catch (e) {
        console.log(e);
      }
    }
  });
}


// app.get()

// The app listens on port 51513 and prints the endpoint URI in console window.
app.listen(port, function () {
  console.log("Server running at ", port);
});
