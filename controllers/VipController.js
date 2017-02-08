
var model = require("../models/vip.js");

// ///////////////////////// R E P E R T O I R E    D E S     S T A R S

module.exports.Repertoire = 	function(request, response){
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
  model.getVipFromLetter(letter,function(err, result){
    if (err) {
      console.log(err);
      return;
    }
    response.vip = result;
    response.render('repertoireVips', response);
  } );
}

module.exports.detailsVip = 	function(request, response){
  var idVip = request.params.idVip;

  response.title = 'Répertoire des stars';
  model.getVip(idVip,function(err, result){
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
    response.vip = result;
    response.render('detailsVip', response);
  } );
}
