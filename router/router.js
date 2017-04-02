var HomeController = require('./../controllers/HomeController');
var VipController = require('./../controllers/VipController');
var AlbumController = require('./../controllers/AlbumController');
var TestController = require('./../controllers/TestController');
var ArticlesController = require('./../controllers/ArticlesController');



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


// Articles
    app.get('/articles', ArticlesController.Article);
    app.get('/articles/:idVip', ArticlesController.ArticleVip)

 // albums
   app.get('/album/:page', AlbumController.ListerAlbum);
   app.get('/album/:page/:vip/:numPhoto', AlbumController.ListerAlbumDetails);


// tout le reste
  app.get('*', HomeController.Index);
  app.post('*', HomeController.Index);

};
