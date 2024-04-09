var crypto = require('crypto');

module.exports = function (workspace, app) {
    var str = `${workspace}|${app}`;
    var generatedCheckSum = crypto.createHash('md5').update(str).digest("hex");
    return generatedCheckSum;
};

