module.exports = function(conn, loggedIn) {
    'use strict';
    var winnerRoutes = require('express').Router();

    winnerRoutes.get('/', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/winner');
      
      conn.query('SELECT a.*, b.*, 0 AS dailyRank FROM posts AS a JOIN users AS b ON b.userId = a.userId ' +
      'WHERE a.dateTime < CURRENT_DATE() AND a.dateTime >= SUBDATE(CURRENT_DATE(), 1) ORDER BY a.wins * 1.0 / a.matches DESC LIMIT 1', [], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    return winnerRoutes;

};
