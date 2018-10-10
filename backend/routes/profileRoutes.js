module.exports = function(conn, loggedIn) {
    'use strict';
    var profileRoutes = require('express').Router();

    profileRoutes.get('/:userId', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/' + req.params.userId);
      var userId = null;
      if (req.user) {
        userId = req.user
      }
      //FOR CYANURA TO DO

    })

    //OTHER API ENDPOINTS FOR PROFILE
    
    return profileRoutes;

};
