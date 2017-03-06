var AdminController = require('./../controllers/AdminController');

// Routes
module.exports = function(app){

// Main Routes
    app.get('/', AdminController.Connexion);
    app.post('/accueil', AdminController.Accueil)

// tout le reste
  app.get('*', AdminController.Connexion);
  app.post('*', AdminController.Connexion);

};
