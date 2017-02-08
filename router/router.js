var HomeController = require('./../controllers/HomeController');
var VipController = require('./../controllers/VipController');
var AlbumController = require('./../controllers/AlbumController');
var TestController = require('./../controllers/TestController');



// Routes
module.exports = function(app){

  // tests à supprimer
    app.get('/test', TestController.Test);

// Main Routes
    app.get('/', HomeController.Index);

// VIP
    app.get('/repertoire', VipController.Repertoire);
    app.get('/repertoire/:letter', VipController.RepertoireLetter);
    app.get('/repertoire/detailsVip/:idVip', VipController.detailsVip);

 // albums
   app.get('/album', AlbumController.ListerAlbum);

// tout le reste
  app.get('*', HomeController.Index);
  app.post('*', HomeController.Index);

};
