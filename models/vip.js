var db = require('../configDb');


module.exports.test = function(callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            var sql = "SELECT COUNT(*) AS NB FROM vip ;";
              // console.log(sql);
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getLetters = function(callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            var sql = "SELECT distinct LEFT(VIP_NOM,1) as letters FROM vip ORDER BY letters;";
              // console.log(sql);
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getVipFromLetter = function(letter,callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            var sql = "SELECT vip_nom, photo_adresse, v.vip_numero FROM vip v LEFT JOIN photo p on v.VIP_NUMERO = p.VIP_NUMERO where VIP_NOM LIKE '"+letter+"%' AND PHOTO_NUMERO=1;";
              // console.log(sql);
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getVip = function(idVip,callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            var sql = "SELECT vip_nom, vip_prenom FROM vip where vip_numero="+idVip+";";
              // console.log(sql);
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};
