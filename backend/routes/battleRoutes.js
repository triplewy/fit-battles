module.exports = function(conn, loggedIn) {
    'use strict';
    var battleRoutes = require('express').Router();

    battleRoutes.get('/', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/battles');
      var userId = null;
      if (req.user) {
        userId = req.user
      }

      if (userId) {
        conn.query('SELECT *, ' +
        '((SELECT COUNT(*) FROM following WHERE followingUserId = posts.userId AND followerUserId = :userId) > 0) AS following, ' +
        '((SELECT COUNT(*) FROM following WHERE followingUserId = :userId AND followerUserId = posts.userId) > 0) AS followsYou, ' +
        '(posts.userId = :userId) AS isPoster '  +
        'FROM posts WHERE dateTime >= CURRENT_DATE() AND dateTime <= NOW() ORDER BY NOW() - dateTime ASC LIMIT 10', {userId: userId}, function(err, result) {
          if (err) {
            console.log(err);
            res.send({message: 'error'})
          } else {
            var length = result.length
            if (length % 2 !== 0) {
              length -= 1
            }
            var battleTuples = []
            for (var i = 0; i + 1 < length; i += 2) {
              battleTuples.push([result[i], result[i+1]])
            }
            res.send(battleTuples)
          }
        })
      } else {
        conn.query('SELECT * FROM posts WHERE dateTime >= CURRENT_DATE() AND dateTime <= NOW() ORDER BY NOW() - dateTime ASC LIMIT 10', [], function(err, result) {
          if (err) {
            console.log(err);
            res.send({message: 'error'})
          } else {
            var length = result.length
            if (length % 2 !== 0) {
              length -= 1
            }
            var battleTuples = []
            for (var i = 0; i + 1 < length; i += 2) {
              battleTuples.push([result[i], result[i+1]])
            }
            res.send(battleTuples)
          }
        })
      }
    })

    battleRoutes.post('/vote', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/battles/vote');
      var userId = null;
      if (req.user) {
        userId = req.user
      }

      conn.query('INSERT IGNORE INTO votes (winMediaId, winUserId, lossMediaId, lossUserId) VALUES (:winMediaId, :winUserId, :lossMediaId, :lossUserId)',
      {winMediaId: req.body.winMediaId, winUserId: req.body.winUserId, lossMediaId: req.body.lossMediaId, lossUserId: req.body.lossUserId},
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.affectedRows) {
            console.log("Recorded vote successfully");
            res.send({message: "success"})
          } else {
            console.log("Vote failed");
            res.send({message: "fail"})
          }
        }
      })
    })


    return battleRoutes;

};
