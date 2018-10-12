module.exports = function(conn, loggedIn) {
    'use strict';
    var feedRoutes = require('express').Router();

    feedRoutes.get('/', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/feed');
      const userId = req.user
      conn.query('SELECT a.*, b.followers, ' +
      '(a.userId = :userId) AS isPoster, '  +
      '((SELECT COUNT(*) FROM votes WHERE userId = :userId AND (winMediaId = a.mediaId OR lossMediaId = a.mediaId)) > 0) AS voted ' +
      'FROM posts AS a ' +
      'JOIN users AS b ON b.userId = a.userId ' +
      'WHERE a.userId IN (SELECT followingUserId FROM following WHERE followerUserId=:userId UNION ALL SELECT :userId AS followingUserId) ORDER BY a.dateTime',
      {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    return feedRoutes;

};
