

// ///////////////////// L I S T E R     A L B U M S
var model = require("../models/vip.js");
var async = require("async");


module.exports.ListerAlbum = 	function(request, response){
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
              model.getAllPhotosVips(page,function(err, result){
                if (err) {
                  console.log(err);
                  return;
                }
                callback(null,result);
            });
        },
    ],function(err,result) {
          response.vips = result[0]
          response.title = 'Album des stars';
          response.render('listerAlbum', response);
      });
    } ;
