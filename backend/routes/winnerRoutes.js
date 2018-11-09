module.exports = function(conn, loggedIn) {
    'use strict';
    var winnerRoutes = require('express').Router();

    winnerRoutes.get('/', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/winner');
      var userId = null;
      if (req.user) {
        userId = req.user
      }

      conn.query('SELECT a.*, b.*, (a.userId = :userId) AS isPoster,  '  +
      '((SELECT COUNT(*) FROM following WHERE followingUserId = a.userId AND followerUserId = :userId) > 0) AS following, ' +
      '((SELECT COUNT(*) FROM following WHERE followingUserId = :userId AND followerUserId = a.userId) > 0) AS followsYou ' +
      'FROM posts AS a JOIN users AS b ON b.userId = a.userId ' +
      'WHERE a.dateTime < CURRENT_DATE() AND a.dateTime >= SUBDATE(CURRENT_DATE(), 1) ORDER BY a.wins / a.matches DESC LIMIT 1',
      {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    return winnerRoutes;

};
