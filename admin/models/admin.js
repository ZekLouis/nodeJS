var db = require('../../configDb');

module.exports.CheckConnection = function(login,passwd,callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            var sql = "SELECT login, passwd from parametres where login=\""+login+"\"and passwd=\""+passwd+"\";";
              // console.log(sql);
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};
