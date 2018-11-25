module.exports = function(conn, loggedIn) {
    'use strict';
    var winnerRoutes = require('express').Router();

    winnerRoutes.get('/', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/winner');
      var userId = null;
      if (req.user) {
        userId = req.user
      }

      conn.query('SELECT *, 0 AS dailyRank FROM posts WHERE dateTime < CURRENT_DATE() AND dateTime >= SUBDATE(CURRENT_DATE(), 1) ORDER BY wins * 1.0 / matches DESC LIMIT 1', [], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    return winnerRoutes;

};
