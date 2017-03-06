var model = require("../models/admin.js");
var async = require("async");
const crypto = require('crypto');

module.exports.Connexion = function(request, response){
        response.title = 'Album des stars';
        response.render('Connexion', response);
};

module.exports.Accueil = function(request, response){
        var login = request.body.login;
        var passwd = request.body.motdepasse;
        const hash = crypto.createHmac('sha256',secret)
                   .update('OnTheRoadAgain')
                   .digest('hex');
        console.log(hash);
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
            response.title = 'Accueil';
            response.render('resCo', response);
        });
};
