var AdminController = require('./../controllers/AdminController');

// Routes
module.exports = function(app){

// Main Routes
    app.get('/', AdminController.Connexion);
    app.post('/accueil', AdminController.Accueil);
    app.get('/deconnexion', AdminController.Deconnexion);
    app.get('/photos', AdminController.Photos);
    app.get('/vips', AdminController.Vips);
    app.get('/vips/ajouter', AdminController.VipsAjouter);
    app.post('/vips/ajouter', AdminController.VipsAjouterPost);
    app.get('/vips/modifier', AdminController.VipsModifier);
    app.post('/vips/modifier', AdminController.VipsModifierPost);
    app.post('/vips/modifierDonnees', AdminController.VipsModifierPostDonnees);
    app.get('/vips/supprimer', AdminController.VipsSupprimer);
    app.post('/vips/supprimer', AdminController.VipsSupprimerPost);

// tout le reste
  app.get('*', AdminController.Connexion);
  app.post('*', AdminController.Connexion);

};
