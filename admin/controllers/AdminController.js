
var model = require("../models/admin.js");
var async = require("async");
const crypto = require('crypto');
const formidable = require('formidable');
const fs = require('fs');
module.exports.Connexion = function(request, response){
    response.title = 'Connexion';
    response.render('Connexion', response);
};

module.exports.Accueil = function(request, response){
    var login = request.body.login;
    var passwd = request.body.motdepasse;
    const hash = crypto.createHash("sha256").update(passwd,"utf8").digest('hex');
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
    if(!request.session.connection){
      response.title = 'Connexion';
      response.render('Connexion', response);
      return;
    }
    response.title = 'Photos';
    response.render('Photos', response);
};

module.exports.PhotosAjouter = function(request, response){
  if(!request.session.connection){
    response.title = 'Connexion';
    response.render('Connexion', response);
    return;
  }
  async.parallel([
      function(callback){
          model.getVips(function(err, result){
              if(err){
                  console.log(err);
                  return;
              }
              callback(null,result);
          });
      }
  ],function(err,result){
      response.vips = result[0];
      response.title = 'Ajouter une photo';
      response.render('PhotosAjouter', response);
  });
}

module.exports.Vips = function (request, response){
    if(!request.session.connection){
      response.title = 'Connexion';
      response.render('Connexion', response);
      return;
    }
    response.title = 'Vips';
    response.render('Vips', response);
};

module.exports.VipsAjouter = function(request, response){
    if(!request.session.connection){
      response.title = 'Connexion';
      response.render('Connexion', response);
      return;
    }
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
    if(!request.session.connection){
      response.title = 'Connexion';
      response.render('Connexion', response);
      return;
    }
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
    if(!request.session.connection){
      response.title = 'Connexion';
      response.render('Connexion', response);
      return;
    }
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
        response.title = 'Supprimer un VIP';
        response.render('VipsSupprimer', response);
    });
};

module.exports.VipsSupprimerPost = function(request, response){
    if(!request.session.connection){
      response.title = 'Connexion';
      response.render('Connexion', response);
      return;
    }
    var idVip = request.body.vip;
        requetes = []
        tables = ['comporte','joue','film','acteur','photo','realisateur','composer','chanteur','apouragence','mannequin','defiledans','defile','couturier','apoursujet','liaison','mariage','vip'];
        for(var table in tables){
            console.log(tables[table]);
            requetes.push(function(){
                model.suppVipTable(idVip, tables[table], function(err,result){
                    if(err){
                        console.log(err);
                        return;
                    }
                })
            })
        }

        requetes.push(function(){
            model.getVips(function(err,result){
                console.log(result);
                response.vips = result;
                response.title = 'Supprimer un VIP';
                response.render('VipsSupprimer', response);
            });
        })

        async.series(requetes);
};

module.exports.PhotosAjouterPost = function(request, response){
  if(!request.session.connection){
    response.title = 'Connexion';
    response.render('Connexion', response);
    return;
  }
  var dataPhoto = {
      photo_numero:1,
      vip_numero:0,
      photo_sujet:"",
      photo_commentaire:"",
      photo_adresse:""
  };
  var form = new formidable.IncomingForm();

  async.parallel([
      function(callback){
          form.parse(request, function(err, fields, files){
              dataPhoto.photo_adresse = files.image.name;
              dataPhoto.photo_sujet = fields.titre;
              dataPhoto.photo_commentaire = fields.commentaireImage;
              dataPhoto.vip_numero = fields.vip;
          });

          form.on('fileBegin', function (name, file){
              file.path = __dirname + '/../../public/images/vip/' + file.name;
              console.log(file.path);
          });

          form.on('file', function (name, file){
              console.log('Uploaded ' + file.name);
              callback(null);
          });

      },
      function(callback){
          model.getVips(function(err, result){
              if(err){
                  console.log(err);
                  return;
              }
              callback(null,result);
          });
      }
  ],function(err,result){
      response.vips = result[1];
      model.getPhotoNumeroVip(dataPhoto.vip_numero, function(err, result){
        if(err){
          console.log(err);
          return;
        }
        console.log(result[0].photo_numero);
        dataPhoto.photo_numero = result[0].photo_numero+1;
        model.ajouterPhoto(dataPhoto, function(err, results){
            if(err){
                console.log(err);
                return;
            }
            response.message = 'Insertion réussie';
            response.title = 'Ajouter une photo';
            response.render('PhotosAjouter', response);
        });
      })
  });
}

module.exports.VipsAjouterPost = function(request, response){
        if(!request.session.connection){
          response.title = 'Connexion';
          response.render('Connexion', response);
          return;
        }
        /**
         * Gestion de l'upload du fichier
         */
        var data = {
            vip_nom:"",
            vip_prenom:"",
            nationalite_numero:0,
            vip_sexe:"",
            vip_naissance:"",
            vip_texte:"",
            vip_date_insertion:(new Date()).toISOString().substring(0, 19).replace('T', ' ')
        };

        var dataPhoto = {
            photo_numero:1,
            vip_numero:0,
            photo_sujet:"",
            photo_commentaire:"",
            photo_adresse:""
        };

        var form = new formidable.IncomingForm();

        async.parallel([
            function(callback){
                form.parse(request, function(err, fields, files){
                    data.vip_nom = fields.nom;
                    data.vip_prenom = fields.prenom;
                    data.vip_sexe = fields.sexe;
                    data.vip_naissance = fields.dateNaissance + ' 00:00:00';
                    data.nationalite_numero = fields.nationalite;
                    data.vip_texte = fields.commentaire;
                    dataPhoto.photo_adresse = files.image.name;
                    dataPhoto.photo_sujet = fields.sujetImage;
                    dataPhoto.photo_commentaire = fields.commentaireImage;


                });

                form.on('fileBegin', function (name, file){
                    file.path = __dirname + '/../../public/images/vip/' + file.name;
                    console.log(file.path);
                });

                form.on('file', function (name, file){
                    console.log('Uploaded ' + file.name);
                    callback(null);
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
            response.nationalite = result[1];
            model.ajouterVip(data,function(err,result){
                if(err){
                    console.log(err);
                    return;
                }
                dataPhoto.vip_numero = result['insertId'];
                console.log(result['insertId']);
                console.log(dataPhoto);
                model.ajouterPhoto(dataPhoto, function(err, results){
                    if(err){
                        console.log(err);
                        return;
                    }
                });
                response.message = 'Insertion réussie';
                response.title = 'Ajouter un VIP';
                response.render('VipsAjouter', response);
            });
        });
};

module.exports.VipsModifierPost = function(request,response){
    if(!request.session.connection){
      response.title = 'Connexion';
      response.render('Connexion', response);
      return;
    }
    var idVip = request.body.vip;
    async.parallel([
        function(callback){
            model.getVip(idVip, function(err, result){
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
    ],function(err, result){
        request.session.idVip = idVip;
        response.vip = result[0];
        response.nationalite = result[1];
        response.title = 'Modifier un VIP';
        response.render('VipsModifierPost', response);
    });
};

module.exports.VipsModifierPostDonnees = function(request,response){
    if(!request.session.connection){
      response.title = 'Connexion';
      response.render('Connexion', response);
      return;
    }
    var idVip = request.session.idVip;
    var data = {
        vip_nom:request.body.nom,
        vip_prenom:request.body.prenom,
        nationalite_numero:request.body.nationalite,
        vip_sexe:request.body.sexe,
        vip_naissance:request.body.dateNaissance+' 00:00:00',
        vip_texte:request.body.commentaire
    };
    console.log(data);
    async.parallel([
        function(callback){
            model.updateVip(idVip, data, function(err, result){
                if(err){
                    console.log(err);
                    return;
                }
                callback(null,result);
            });
        },
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
        response.vips = result[1];
        response.title = 'Modifier un VIP';
        response.render('VipsModifier', response);
    });
};



module.exports.PhotosSupprimer = function(request,response){
    if(!request.session.connection){
      response.title = 'Connexion';
      response.render('Connexion', response);
      return;
    }
    async.parallel([
        function(callback){
            model.getVipPlsPhotos(function(err,result){
                if(err){
                    console.log(err);
                    return;
                }
                callback(null,result);
            });
        }
    ],function(err, result){
        response.vips = result[0];
        response.title = 'Supprimer une photo';
        response.render('PhotosSupprimer', response);
    });
};

module.exports.PhotosSupprimerPost = function (request,response) {
  if(!request.session.connection){
    response.title = 'Connexion';
    response.render('Connexion', response);
    return;
  }
  var idVip = request.body.vip;
  request.session.vip = idVip;
  console.log(idVip)
  async.parallel([
      function(callback){
          model.getPhotoSujet(idVip, function(err,result){
            if(err){
              console.log(err);
              return;
            }
            callback(null, result);
          });
      },
      function(callback){
          model.getVip(idVip, function(err, result){
              if(err){
                  console.log(err);
                  return;
              }
              callback(null,result);
          });
      }
  ], function(err,result){
      response.photo = result[0];
      response.vip = result[1];
      response.title = 'Supprimer une photo';
      response.render('PhotosSupprimerPost', response);
  });
};

module.exports.PhotosSupprimerPostDonnees = function (request,response) {
  if(!request.session.connection){
    response.title = 'Connexion';
    response.render('Connexion', response);
    return;
  }
  var idVip = request.session.vip;
  console.log(idVip)
  var idPhoto = request.body.photo;
  console.log(idPhoto);
  async.parallel([
      function(callback){
        model.supPhoto(idVip, idPhoto, function(err, result){
            if(err){
                console.log(err);
                return;
            }
            callback(null,result);
        });
      },
      function(callback){
          model.getVipPlsPhotos(function(err,result){
              if(err){
                  console.log(err);
                  return;
              }
              callback(null,result);
          });
      }
  ], function(err,result){
      fs.unlink('public/images/vip/'+idPhoto);
      response.result = result[0];
      response.vips = result[1]
      response.title = 'Supprimer une photo';
      response.render('PhotosSupprimer', response);
  });
};
