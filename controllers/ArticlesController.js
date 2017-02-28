// ARTICLES
var model = require("../models/vip.js");
var async = require("async");


module.exports.Article = function(request, response){
    response.title = "Articles";
    async.parallel([
        function(callback){
            model.getAllVips(function(err, result){
              if (err) {
                console.log(err);
                return;
              }
              callback(null,result);
          });
        }
    ],function(err,result) {
        response.vips = result[0]
        console.log(result)
        response.render('Article', response);
    });
};

module.exports.ArticleVip = function(request, response){
    var idVip = request.params.idVip;
    response.title = "Articles"
    async.parallel([
        function(callback){
            model.getArticleVip(idVip,function(err,result){
                if(err){
                    console.log(err);
                    return;
                }
                callback(null,result);
            });
        }
    ],function(err,result){
        response.articles = result[0];
        console.log(result[0])
        response.render('Article',response);
    });
}
