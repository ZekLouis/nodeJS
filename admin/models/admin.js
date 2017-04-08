
var db = require('../../configDb');

module.exports.CheckConnection = function(login,passwd,callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            var sql = "SELECT login, passwd from parametres where login=\""+login+"\"and passwd=\""+passwd+"\";";
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

module.exports.ajouterVip = function(data,callback){
    db.getConnection(function(err,connexion){
        if(!err){
            var sql = "INSERT INTO vip SET ?";
            connexion.query(sql, data, callback);
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

module.exports.getPhotoNumeroVip = function(idVip, callback){
  db.getConnection(function(err, connexion){
    var sql = "select MAX(PHOTO_NUMERO) as photo_numero from photo where vip_numero="+idVip+";";
    connexion.query(sql, callback);
    connexion.release();
  })
};

module.exports.getPhotoSujet = function (idVip, callback) {
    db.getConnection(function(err, connexion){
      var sql = "select photo_adresse, photo_sujet from photo where vip_numero="+idVip+" and photo_numero <> 1;";
      connexion.query(sql, callback);
      connexion.release();
    })
};

module.exports.ajouterPhoto = function(data,callback){
        db.getConnection(function(err,connexion){
            if(!err){
                console.log(data);
                var sql = "INSERT INTO photo SET ?";
                connexion.query(sql, data, callback);
                connexion.release();
            }else{
                console.log(err);
            }
        })
};

module.exports.getVip = function(idVip,callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            var sql = "select v.vip_prenom, v.vip_nom, v.vip_naissance, v.nationalite_numero,v.vip_texte,v.vip_sexe from vip v join nationalite on v.nationalite_numero=nationalite.nationalite_numero left join liaison on liaison.vip_numero=v.vip_numero inner join photo p on p.vip_numero=v.vip_numero where p.photo_numero=1 and v.vip_numero="+idVip+";";
            // console.log(sql);
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.updateVip = function(idVip,data,callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            var sql = "UPDATE vip SET ? where vip.vip_numero="+idVip+";";
            connexion.query(sql, data, callback);
            connexion.release();
        }
    });
};

module.exports.suppVipPhoto = function(idVip,callback){
  db.getConnection(function(err,connexion){
    if(!err){
      var sql = "DELETE FROM photo where vip_numero="+idVip+";";
      connexion.query(sql,callback);
      connexion.release();
    }
  });
};

module.exports.suppVip = function(idVip,callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
          var sql = "DELETE FROM vip where vip_numero="+idVip+";";
          connexion.query(sql, callback);
          connexion.release();
        }
    });
};

module.exports.suppLiaisonVip = function(idVip, callback){
    db.getConnection(function(err, connexion){
      if (!err){
        var sql = "DELETE FROM liaison where vip_numero="+idVip+" or vip_vip_numero="+idVip+";";
        connexion.query(sql, callback);
        connexion.release();
      }
    });
}

module.exports.suppMariageVip = function (idVip, callback) {
    db.getConnection(function(err, connexion){
      if (!err){
        var sql = "DELETE FROM mariage where vip_numero="+idVip+" or vip_vip_numero="+idVip+";";
        connexion.query(sql, callback);
        connexion.release();
      }
    });
};

module.exports.supPhoto = function (idVip, idPhoto, callback) {
  db.getConnection(function(err, connexion){
    if (!err){
      var sql = "delete from photo where photo_adresse='"+idPhoto+"' and vip_numero="+idVip+";";
      connexion.query(sql, callback);
      connexion.release();
    }
  });
};

module.exports.getVipPlsPhotos = function(callback){
  db.getConnection(function(err, connexion){
    if (!err){
      var sql = "select vip_numero, vip_nom, vip_prenom from vip where vip_numero in(select vip_numero from photo where photo_numero <> 1);";
      connexion.query(sql, callback);
      connexion.release();
    }
  });
}
