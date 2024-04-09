var ODataServer = require("advance-odata-server");
var Adapter = require("simple-odata-server-mongodb");

module.exports.configureModel = function (_model, db, collection) {
  // Instantiates ODataServer and assigns to odataserver variable.
  var odataServer = ODataServer().model(_model);

  odataServer.adapter(
    Adapter(function (cb) {
      cb(null, db.db(collection));
    })
  );

  return odataServer;
};
