var express = require("express");

var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");

// Create app variable to initialize Express
var app = express();

const checkNodeEnv = require("./configService");

var config = checkNodeEnv();

const {
    app: { port },
    mongodb: { url }
} = config;

// Enable Cross-origin resource sharing (CORS)  for app.
app.use(cors());
app.use(express.json());

//Helper Operations
var _init_odata = require("./helper/ODataInitHelper");
var _odata_configurator = require("./lib/ODataConfigurationService");
const _db_operations = require("./helper/db");

var _model_register = {};

//Helper Functions
var _init_bind = async function (db) {
  try {
    var output = await _db_operations.fetch(db);

    for (var counter in output) {
      if (output[counter].app && output[counter].workspace) {
        try {
          //checksum is same as  the collection same
          var checksum = output[counter].workspace + "_" + output[counter].app;
          var schema = output[counter].mapping;

          _model_register[checksum] = _odata_configurator.configureModel(
            schema,
            db,
            checksum
          );
        } catch (e) {
          console.log(
            "Configuration failed for " +
              output[counter].workspace +
              " " +
              checksum
          );
          throw e;
        }
      }
    }
  } catch (e) {
    console.log("Initial binding failed due to following error");
    console.log(e);
  }
};

//DB connection to the k1 database(store configuration database)
const STORE_CONNECTION_URL =
  "mongodb://" + url + "/k1?authSource=admin";
MongoClient.connect(STORE_CONNECTION_URL, function (err, db) {
  if (err) {
    console.error("Unable to  connect to database");
  } else {
    console.log("DB Connection successful");
    _init_bind(db);

    //
    console.log(JSON.stringify(_model_register));
  }
});

//API Endpoint to register data model for OData operations
app.post("/register/:workspace/:app/", function (req, res) {
  var workspace = req.params.workspace;
  var app = req.params.app;

  console.log("Proceeding with checksum " + workspace + " app " + app);
  //1. Generate checksum using workspace and app
  var checksum = workspace + "_" + app;
  //2. get the schema details from POST api
  var mappings = req.body;
  var schema = mappings.models;
  //3. create entry in database

  //4. register the model into odataserver.model
  _model_register[checksum] = _odata_configurator(schema, db, checksum);

  // console.log(JSON.stringify(_model_register));

  _db_operations.register(db, mappings);

  res.status(201).send({ message: "Schema Created" });
});

//API Endpoint to query data using OData Construct
app.use("/query/:workspace/:app/", function (req, res, next) {
  var workspace = req.params.workspace;
  var app = req.params.app;
  //checksum also serves as the collection name
  var checksum = workspace + "_" + app;

  if (_model_register[checksum]) {
    _model_register[checksum].handle(req, res);
  } else {
    res.status(404).send({ message: "No Data Found" });
    return;
  }
});


app.listen(port, function () {
  _init_odata.init();
  console.log("Server running at ", port);
});
