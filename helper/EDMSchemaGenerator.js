function generateEntityType() {

}

exports.module.generate = function (data) {

    var namespace = data.namespace;
    var entityTypes = {};
    var entitySets = {};

    var _data = {
        "namespace": "io.intelliflow",
        "entityTypes": {

            "Recruitment": {
                "_id": { "type": "Edm.String", "key": true },

                "Name": { "type": "Edm.String" }
            }
        },
        "entitySets": {

            "Recruitment": {
                "entityType": "Recruitment"
            },
            "Rec": {
                "entityType": "Recruitment"
            }
        }
    };


    return _data;
};