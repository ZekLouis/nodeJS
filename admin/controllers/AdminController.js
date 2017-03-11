var model = require("../models/admin.js");
var async = require("async");
const crypto = require('crypto');

module.exports.Connexion = function(request, response){
    response.title = 'Connexion';
    response.render('Connexion', response);
};

module.exports.Accueil = function(request, response){
    var login = request.body.login;
    var passwd = request.body.motdepasse;
    const hash = crypto.createHash("sha256").update(passwd,"utf8").digest('hex');
    //console.log(hash);
    async.parallel([
        function(callback){
            model.CheckConnection(login,hash,function(err, result){
                if (err) {
                    console.log(err);
                    return;
                }
                callback(null,result);
            });
        }
    ],function(err,result) {
        console.log(result[0]);
        if(result[0]!=""){
            request.session.connection = true;
            request.session.login = login;
            response.title = 'Accueil';
            response.render('home', response);
        }else{
            request.session.connection = false;
            response.erreur = 'Erreur de connexion';
            response.title = 'Connexion';
            response.render('Connexion', response);
        }
    });
};

module.exports.Deconnexion = function(request, response){
    request.session.connection = false;
    request.session.login = '';
    response.title = 'Connexion';
    response.render('Connexion', response);
};

module.exports.Photos = function(request, response){
    response.title = 'Photos';
    response.render('Photos', response);
};

module.exports.Vips = function (request, response){
    response.title = 'Vips';
    response.render('Vips', response);
};

module.exports.VipsAjouter = function(request, response){
    async.parallel([
        function(callback){
            model.getNationalites(function(err, result){
                if(err){
                    console.log(err);
                    return;
                }
                callback(null,result);
            });
        }
    ],function(err,result){
        response.title = 'Ajouter un VIP';
        response.nationalite = result[0];
        response.render('VipsAjouter', response);
    });
};

module.exports.VipsModifier = function(request, response){
    async.parallel([
        function(callback){
            model.getVips(function(err,result){
                if(err){
                    console.log(err);
                    return;
                }
                callback(null,result);
            });
        }
    ],function(err, result){
        response.vips = result[0];
        response.title = 'Modifier un VIP';
        response.render('VipsModifier', response);
    });
};

module.exports.VipsSupprimer = function(request, response){
    response.title = 'Supprimer un VIP';
    response.render('VipsSupprimer', response);
};

module.exports.VipsAjouterPost = function(request, response){
        var nom = request.body.nom;
        var prenom = request.body.prenom;
        var sexe = request.body.sexe;
        var dateNaissance = request.body.dateNaissance;
        var nationalite = request.body.nationalite;
        var commentaire = request.body.commentaire;
        var image = request.body.image;
        var sujet = request.body.sujetImage;
        var commentaireImage = request.body.commentaireImage;
        console.log(nom,prenom,sexe,dateNaissance,nationalite,commentaire,image,sujet);
        async.parallel([
            function(callback){
                model.ajouterVip(nom,prenom,nationalite,sexe,dateNaissance,commentaire,function(err,result){
                    if(err){
                        console.log(err);
                        return;
                    }
                    callback(null,result);
                });
            },
            function(callback){
                model.getNationalites(function(err, result){
                    if(err){
                        console.log(err);
                        return;
                    }
                    callback(null,result);
                });
            }
        ],function(err,result){
            //Insertion de la photo ici pour être sur que l'insertion dans la table vip soit finie.
            //model.ajouterPhoto(id,image,sujet);
            console.log(result[0]['insertId'],sujet,commentaireImage,image);
            response.nationalite = result[1];
            response.message = 'Insertion réussie';
            response.title = 'Ajouter un VIP';
            response.render('VipsAjouter', response);
        });
};

module.exports.VipsModifierPost = function(request,response){
    response.title = 'Modifier un VIP';
    response.render('VipsModifierPost', response);
}
