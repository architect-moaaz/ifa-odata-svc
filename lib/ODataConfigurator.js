var ODataServer = require("advance-odata-server");
var Adapter = require("simple-odata-server-mongodb");

module.exports = function (_model, db, _source) {
  // Instantiates ODataServer and assigns to odataserver variable.
  var odataServer = ODataServer().model(_model);

  odataServer.adapter(
    Adapter(function (cb) {
      console.log("Adapter function");

      cb(null, db.db(_source));
    })
  );

  return odataServer;
};
