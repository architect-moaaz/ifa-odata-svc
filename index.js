var express = require('express');
var ODataServer = require("advance-odata-server");
var MongoClient = require('mongodb').MongoClient;
var cors = require("cors");
var Adapter = require('simple-odata-server-mongodb');

// Create app variable to initialize Express 
var app = express();

// Enable Cross-origin resource sharing (CORS)  for app.
app.use(cors());

// Define Odata model of the resource entity i.e. Product. 
// The metadata is defined using OData type system called the Entity Data Model (EDM),
// consisting of EntitySets, Entities, ComplexTypes and Scalar Types.
var model = {
    namespace: "demo",
    entityTypes: {
        "Product": {
            "_id": { "type": "Edm.String", key: true },
            "ProductNum": { "type": "Edm.Int32" },
            "Name": { "type": "Edm.String" },
            "Description": { "type": "Edm.String" },
            "ReleaseDate": { "type": "Edm.DateTime" },
            "DiscontinuedDate": { "type": "Edm.DateTime" },
            "Rating": { "type": "Edm.Int32" },
            "Price": { "type": "Edm.Double" }
        },
        "Asset": {
            "_id": { "type": "Edm.String", key: true },

            "Name": { "type": "Edm.String" },

        }
    },
    entitySets: {
        "products": {
            entityType: "demo.Product"
        },
        "assets": {
            entityType: "demo.Asset"
        },
    }
};



// Instantiates ODataServer and assigns to odataserver variable.
var odataServer = ODataServer()
    .model(model);

// Connection to demo database in MongoDB
MongoClient.connect("mongodb://127.0.0.1:27017/demo", function (err, db) {

    console.log(err);

    odataServer.adapter(Adapter(function (cb) {
        console.log("Adapter function");

        cb(err, db.db("demo"));
    }));


});

// The directive to set app route path.
app.use("/odata", function (req, res) {
    odataServer.handle(req, res);

});

// The app listens on port 3010 and prints the endpoint URI in console window.
var server = app.listen(3010, function () {
    console.log('Server running at http://127.0.0.1:3010/');
});