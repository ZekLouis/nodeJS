var db = require('../configDb');

// ACTEUR : select v.vip_numero, acteur_datedebut,f.film_titre,f.film_daterealisation,v.vip_nom,v.vip_prenom from acteur a inner join joue j on a.vip_numero=j.vip_numero inner join film f on j.film_numero=f.film_numero inner join realisateur r on r.vip_numero=f.vip_numero inner join vip v on v.vip_numero=r.vip_numero where acteur_datedebut is not null and year(acteur_datedebut) <> 0;
// CHANTEUR : select c.vip_numero,c.chanteur_specialite,a.album_titre, year(a.album_date), m.maisondisque_nom from chanteur c inner join composer co on c.vip_numero=co.vip_numero inner join album a on a.album_numero=co.album_numero inner join maisondisque m on m.maisondisque_numero=a.maisondisque_numero;
// MANNEQUIN : select distinct d.defile_lieu,d.defile_date,v.vip_nom,v.vip_prenom from mannequin m inner join defiledans dd on m.vip_numero=dd.vip_numero inner join defile d on d.defile_numero=dd.defile_numero inner join couturier c on c.vip_numero=d.vip_numero inner join vip v on v.vip_numero=c.vip_numero;;
// COUTURIER : select couturier.vip_numero, defile_numero, defile_lieu, defile_date from couturier join defile on couturier.vip_numero=defile.vip_numero;
// REALISATEUR : select film_titre, film_daterealisation from film join realisateur on film.vip_numero=realisateur.vip_numero;;
//
// REQUETE VIP : select vip.vip_prenom, vip.vip_nom, vip.vip_naissance, liaison_motiffin, vip2.vip_numero as numLiaison,vip3.vip_numero as numMariage, mariage_lieu, nationalite_nom from vip  join nationalite on vip.nationalite_numero=nationalite.nationalite_numero left join liaison on liaison.vip_numero=vip.vip_numero join mariage on mariage.vip_numero=vip.vip_numero left join vip vip2 on vip2.vip_numero = liaison.vip_vip_numero left join vip vip3 on vip3.vip_numero=mariage.vip_vip_numero where vip.vip_numero=idVip;
//
// REQUETE PHOTO D'UN VIP : select photo_numero, photo_sujet, photo_commentaire, photo_adresse from photo where photo.vip_numero = 19;
//
//
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
            var sql = "select v.vip_prenom,p.photo_adresse, v.vip_nom, v.vip_naissance, nationalite_nom,v.vip_texte,v.vip_sexe from vip v join nationalite on v.nationalite_numero=nationalite.nationalite_numero left join liaison on liaison.vip_numero=v.vip_numero inner join photo p on p.vip_numero=v.vip_numero where p.photo_numero=1 and v.vip_numero="+idVip+";";
            // console.log(sql);
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getPhotosVip = function(idVip,callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var sql = "select photo_numero, photo_sujet, photo_commentaire, photo_adresse from photo where photo_numero <> 1 and photo.vip_numero ="+idVip+";";
            connexion.query(sql,callback);
            connexion.release();
        }
    })
}

module.exports.getMariagesVip = function(idVip,callback){
    db.getConnection(function(err,connexion){
        if(!err){
            var sql = "select v.vip_numero,p.photo_adresse, LEFT(v.vip_texte,100) as vip_texte, v.vip_nom,v.vip_prenom,m.date_evenement,m.mariage_fin,m.mariage_lieu from mariage m inner join vip v on m.vip_vip_numero=v.vip_numero inner join photo p on p.vip_numero=v.vip_numero where p.photo_numero=1 and m.vip_numero="+idVip+" UNION select v.vip_numero, p.photo_adresse, LEFT(v.vip_texte,100) as vip_texte,v.vip_nom,v.vip_prenom,m.date_evenement,m.mariage_fin,m.mariage_lieu from mariage m inner join vip v on m.vip_numero=v.vip_numero inner join photo p on p.vip_numero=v.vip_numero where p.photo_numero=1 and m.vip_vip_numero="+idVip+";";
            connexion.query(sql,callback);
            connexion.release();
        }
    })
}

module.exports.getLiaisonsVip = function(idVip,callback){
    db.getConnection(function(err,connexion){
        if(!err){
            var sql = "select v.vip_numero,p.photo_adresse, LEFT(v.vip_texte,100) as vip_texte,v.vip_nom,v.vip_prenom,l.date_evenement,l.liaison_motiffin from liaison l inner join vip v on l.vip_vip_numero=v.vip_numero inner join photo p on p.vip_numero=v.vip_numero where p.photo_numero=1 and l.vip_numero="+idVip+" UNION select v.vip_numero,LEFT(v.vip_texte, 100) as vip_texte,p.photo_adresse,v.vip_nom,v.vip_prenom,l.date_evenement,l.liaison_motiffin from liaison l inner join vip v on l.vip_numero=v.vip_numero inner join photo p on p.vip_numero=v.vip_numero where p.photo_numero=1 and l.vip_vip_numero="+idVip+";"
            connexion.query(sql,callback);
            connexion.release();
        }
    })
}

module.exports.getActeur = function(idVip,callback){
    db.getConnection(function(err,connexion){
        if(!err){
            var sql = "select a.vip_numero, p.photo_adresse, LEFT(v.vip_texte,100) as vip_texte, acteur_datedebut,f.film_titre,f.film_daterealisation,r.vip_numero,v.vip_nom,v.vip_prenom from acteur a inner join joue j on a.vip_numero=j.vip_numero inner join film f on j.film_numero=f.film_numero inner join realisateur r on r.vip_numero=f.vip_numero inner join vip v on r.vip_numero=v.vip_numero inner join photo p on v.vip_numero=p.vip_numero where p.photo_numero=1 and acteur_datedebut is not null and year(acteur_datedebut) <> 0 and a.vip_numero="+idVip+";"
            connexion.query(sql,callback);
            connexion.release();
        }
    })
}

module.exports.getChanteur = function(idVip,callback){
    db.getConnection(function(err,connexion){
        if(!err){
            var sql = "select c.vip_numero,c.chanteur_specialite,a.album_titre,a.album_date, m.maisondisque_nom from chanteur c inner join composer co on c.vip_numero=co.vip_numero inner join album a on a.album_numero=co.album_numero inner join maisondisque m on m.maisondisque_numero=a.maisondisque_numero where c.vip_numero="+idVip+";"
            connexion.query(sql,callback);
            connexion.release();
        }
    })
}

module.exports.getMannequin = function(idVip,callback){
    db.getConnection(function(err,connexion){
        if(!err){
            var sql = "select distinct p.photo_adresse,LEFT(v.vip_texte,100) as vip_texte ,d.defile_lieu,d.defile_date,c.vip_numero,v.vip_nom,v.vip_prenom from mannequin m inner join defiledans dd on m.vip_numero=dd.vip_numero inner join defile d on d.defile_numero=dd.defile_numero inner join couturier c on c.vip_numero=d.vip_numero inner join vip v on c.vip_numero=v.vip_numero inner join photo p on p.vip_numero=v.vip_numero where p.photo_numero=1 and m.vip_numero="+idVip+";"
            connexion.query(sql,callback);
            connexion.release();
        }
    })
}

module.exports.getCouturier = function(idVip,callback){
    db.getConnection(function(err,connexion){
        if(!err){
            var sql = "select couturier.vip_numero, defile_numero, defile_lieu, defile_date from couturier join defile on couturier.vip_numero=defile.vip_numero where couturier.vip_numero="+idVip+";"
            connexion.query(sql,callback);
            connexion.release();
        }
    })
}

module.exports.getRealisateur = function(idVip,callback){
    db.getConnection(function(err,connexion){
        if(!err){
            var sql = "select film_titre, film_daterealisation from film join realisateur on film.vip_numero=realisateur.vip_numero where realisateur.vip_numero="+idVip+";"
            connexion.query(sql,callback);
            connexion.release();
        }
    })
}

module.exports.getAllVips = function(callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            var sql = "SELECT vip_numero,vip_nom,vip_prenom FROM vip ;";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getArticleVip = function(idVip,callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var sql = "SELECT v.vip_nom,v.vip_prenom,v.vip_numero,a.article_date_insert,a.article_resume,a.article_titre from vip v inner join apoursujet aps on v.vip_numero = aps.vip_numero inner join article a on a.article_numero=aps.article_numero where v.vip_numero="+idVip+";";
            connexion.query(sql, callback);
            connexion.release();
        }
    })
};
module.exports.getAllPhotosVips = function(page,callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var limit = page*12;
        var sql = "SELECT photo_adresse, vip_numero from photo where photo_numero = 1 LIMIT "+limit+",12;";
            connexion.query(sql, callback);
            connexion.release();
        }
    })
};
module.exports.getNbPhotosVips = function (callback){
    db.getConnection(function(err, connexion){
        if(!err){

            var sql = "SELECT  count(vip_numero) as nbVip from photo where photo_numero=1";
            connexion.query(sql, callback);
            connexion.release();
        }
    })
};
module.exports.getPhotoVip = function(vip, numPhoto, callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var sql = "SELECT v.vip_numero, vip_nom, vip_prenom, photo_adresse, photo_numero, photo_commentaire from vip v inner join photo p on v.vip_numero=p.vip_numero where v.vip_numero="+vip+" and photo_numero="+numPhoto+";";
            connexion.query(sql, callback);
            connexion.release();
        }
    })
};

module.exports.getTabPhotos = function(vip, callback){
    db.getConnection(function(err, connexion){
        if(!err){
            var sql = "SELECT photo_numero from photo where vip_numero="+vip+";"
            connexion.query(sql, callback);
            connexion.release();
        }
    })
};
