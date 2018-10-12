module.exports = function(conn, loggedIn) {
    'use strict';
    var leaderboardRoutes = require('express').Router();

    leaderboardRoutes.get('/daily', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/leaderboard/daily');
      conn.query('SELECT * FROM posts WHERE dateTime >= CURRENT_DATE() AND dateTime <= NOW() ORDER BY wins * 1.0/matches DESC LIMIT 20', [], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    leaderboardRoutes.get('/weekly', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/leaderboard/weekly');
      conn.query('SELECT *, (SELECT SUM(wins) FROM posts WHERE userId = users.userId AND YEARWEEK(dateTime) = YEARWEEK(NOW()) GROUP BY userId) AS wins ' +
      'FROM users ORDER BY wins DESC LIMIT 20', [], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    leaderboardRoutes.get('/allTime', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/leaderboard/allTime');
      conn.query('SELECT *, (SELECT SUM(wins) FROM posts WHERE userId = users.userId GROUP BY userId) AS wins FROM users ORDER BY wins DESC LIMIT 20', [], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })


    return leaderboardRoutes;

};
