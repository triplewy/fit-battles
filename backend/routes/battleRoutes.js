module.exports = function(conn, loggedIn) {
    'use strict';
    var battleRoutes = require('express').Router();

    battleRoutes.get('/', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/battleRoutes');
      var userId = null;
      if (req.user) {
        userId = req.user
      }
      conn.query('SELECT * FROM posts', [], function(err, result) {
        if (err) {
          console.log(err);
          res.send({message: 'error'})
        } else {
          res.send(result)
        }
      })
    })


    return battleRoutes;

};
