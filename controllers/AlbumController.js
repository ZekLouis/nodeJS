

// ///////////////////// L I S T E R     A L B U M S
var model = require("../models/vip.js");
var async = require("async");

module.exports.ListerAlbum = function(request, response){
    var page = request.params.page;
    async.parallel([
        function(callback){
            model.getAllPhotosVips(page,function(err, result){
              if (err) {
                console.log(err);
                return;
              }
              callback(null,result);
          });
      },
      function(callback){
          model.getNbPhotosVips(function(err, result){
                if (err) {
                  console.log(err);
                  return;
                }
                callback(null,result);
            });
        }
  ],function(err,result) {
        response.vips = result[0]
        response.title = 'Album des stars';
        response.prevPage = parseInt(page)-1;
        response.page = parseInt(page);
        response.nextPage = parseInt(page)+1;
        response.endPage = Math.floor(result[1][0].nbVip/12);
        response.render('listerAlbum', response);
    });
  } ;

  module.exports.ListerAlbumDetails = function(request, response){
      var page = request.params.page;
      var vip = request.params.vip;
      var numPhoto = request.params.numPhoto;
      async.parallel([
          function(callback){
              model.getPhotoVip(vip,numPhoto, function(err, result){
                if (err) {
                  console.log(err);
                  return;
                }
                callback(null,result);
            });
        },
        function(callback){
            model.getNbPhotosVips(function(err, result){
                  if (err) {
                    console.log(err);
                    return;
                  }
                  callback(null,result);
              });
          },
          function(callback){
              model.getAllPhotosVips(page,function(err, result){
                if (err) {
                  console.log(err);
                  return;
                }
                callback(null,result);
            });
        },
        function(callback){
            model.getTabPhotos(vip, function(err,result){
                if(err){
                    console.log(err);
                    return;
                }
                callback(null,result);
            });
        }
    ],function(err,result) {
        var tab = result[3];
        var tabPhoto = [];
        for(var i = 0; i < tab.length; i++){
            if(parseInt(numPhoto)+1 == tab[i]['photo_numero']){
                response.nextPhoto = parseInt(numPhoto)+1;
            }
            if(parseInt(numPhoto)-1 == tab[i]['photo_numero']){
                response.prevPhoto = parseInt(numPhoto)-1;
            }
        }
          response.vips = result[2];
          response.photo = result[0];
          response.prevPage = parseInt(page)-1;
          response.page = parseInt(page);
          response.nextPage = parseInt(page)+1;
          response.endPage = Math.floor(result[1][0].nbVip/12);
          response.title = 'Album des stars';
          response.render('listerAlbum', response);
      });
} ;
