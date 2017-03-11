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

module.exports.getNationalites = function(callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var sql = "SELECT nationalite_numero, nationalite_nom from nationalite;";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.ajouterVip = function(nom,prenom,nationalite_numero,sexe,dateNaissance,commentaire,callback){
    db.getConnection(function(err,connexion){
        if(!err){
            var sql = "INSERT INTO VIP(vip_nom,vip_prenom,nationalite_numero,vip_sexe,vip_naissance,vip_texte,vip_date_insertion) VALUES ('"+nom+"','"+prenom+"',"+nationalite_numero+",'"+sexe+"','"+dateNaissance+" 00:00:00',\""+commentaire+"\",NOW());";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getVips = function(callback){
        db.getConnection(function(err,connexion){
            var sql = "SELECT vip_numero, vip_nom, vip_prenom from vip order by vip_nom;";
            connexion.query(sql, callback);
            connexion.release();
        })
};
