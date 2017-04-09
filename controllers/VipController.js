
var model = require("../models/vip.js");
var async = require("async");

// ///////////////////////// R E P E R T O I R E    D E S     S T A R S

module.exports.Repertoire = function(request, response){
   response.title = 'Répertoire des stars';
   model.getLetters(function(err, result){
       if (err) {
           console.log(err);
           return;
       }
      response.letters = result;
      response.render('repertoireVips', response);
  } );
}

module.exports.RepertoireLetter = 	function(request, response){
  var letter = request.params.letter;

  response.title = 'Répertoire des stars';
  async.parallel ([
      function(callback){
          model.getVipFromLetter(letter,function(err, result){
            if (err) {
              console.log(err);
              return;
            }
            callback(null,result);
          });
      },
      function(callback){
          model.getLetters(function(err, result){
              if (err) {
                  console.log(err);
                  return;
              }
              callback(null,result);
         });
      }
  ],function(err,result){
      if (err) {
          console.log(err);
          return;
      }
  response.letters = result[1];
  response.vips = result[0];
  response.render('repertoireVips', response);
  }
);
}

module.exports.detailsVip = function(request, response){
  var idVip = request.params.idVip;

  response.title = 'Détails d\'un VIP';
  async.parallel([
      function(callback){
          model.getVip(idVip,function(err, result){
            if (err) {
              console.log(err);
              return;
            }
            callback(null,result[0]);
        });
      },
      function(callback){
          model.getLetters(function(err, result){
              if (err) {
                  console.log(err);
                  return;
              }
              callback(null,result);
         });
     },
     function(callback){
         model.getPhotosVip(idVip,function(err,result){
             if(err){
                 console.log(err);
                 return;
             }
             callback(null,result);
         });
     },
     function(callback){
         model.getMariagesVip(idVip,function(err,result){
             if(err){
                 console.log(err);
                 return;
             }
             callback(null,result);
         })
     },
     function(callback){
         model.getLiaisonsVip(idVip,function(err,result){
             if(err){
                 console.log(err);
                 return;
             }
             callback(null,result);
         })
     },
     function(callback){model.getActeur(idVip,function(err,result){callback(null,result)})},
     function(callback){model.getMannequin(idVip,function(err,result){callback(null,result)})},
     function(callback){model.getChanteur(idVip,function(err,result){callback(null,result)})},
     function(callback){model.getCouturier(idVip,function(err,result){callback(null,result)})},
     function(callback){model.getRealisateur(idVip,function(err,result){callback(null,result)})}
  ],function(err,result){
      response.vip = result[0]
      response.letters = result[1]
      response.photos = result[2]
      response.mariages = result[3]
      response.liaisons = result[4]
      response.acteur = result[5]
      response.mannequin = result[6]
      response.chanteur = result[7]
      response.couturier = result[8]
      response.realisateur = result[9]
      response.render('detailsVip', response)
  }
  );
}
