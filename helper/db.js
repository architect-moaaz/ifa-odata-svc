const checkNodeEnv = require("../configService");
var config = checkNodeEnv();

const {
  mongodb: { name }
} = config;

module.exports.register = async function (client, model) {
  var query = { workspace: model.workspacename, app: model.appname };
  var update = { $set: { mapping: model.mappings } };
  var options = { upsert: true };

  console.log(model);

  const vm_update_result = await client
    .db(name)
    .collection("variable_mapping")
    .updateOne(query, update, options);
  console.log(vm_update_result);

  var update = { $set: { mapping: model.models } };
  const update_result = await client
    .db(name)
    .collection("model_configuration")
    .updateOne(query, update, options);
};

module.exports.fetch = async function (client, _workspace) {
  var query = {};

  const fetch_result = await client
    .db(_workspace)
    .collection("model_configuration")
    .find(query)
    .toArray();

  return fetch_result;
};
