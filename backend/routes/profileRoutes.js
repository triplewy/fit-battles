module.exports = function(conn, loggedIn) {
    'use strict';
    var profileRoutes = require('express').Router();

    profileRoutes.get('/info', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/info');
      const userId = req.user
      conn.query('SELECT * FROM users WHERE userId = :userId LIMIT 1', {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result[0])
        }
      })
    })

    profileRoutes.get('/:userId/info', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/' + req.params.userId + '/info');
      var userId = null;
      if (req.user) {
        userId = req.user
      }
      const profileId = req.params.userId

      conn.query('SELECT *, ' +
      '((SELECT COUNT(*) FROM following WHERE followingUserId = :profileId AND followerUserId = :userId) > 0) AS following, ' +
      '((SELECT COUNT(*) FROM following WHERE followingUserId = :userId AND followerUserId = :profileId) > 0) AS followsYou ' +
      'FROM users WHERE userId = :profileId LIMIT 1', {userId: userId, profileId: profileId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result[0])
        }
      })

    })

    profileRoutes.get('/feed', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/feed');
      const userId = req.user
      conn.query('SELECT a.*, ' +
      '((SELECT COUNT(*) FROM votes WHERE userId = :userId AND (winMediaId = a.mediaId OR lossMediaId = a.mediaId)) > 0) AS voted, ' +
      '(SELECT COUNT(*) FROM posts WHERE (wins * 1.0 / matches) > (SELECT (wins * 1.0 / matches) FROM posts WHERE mediaId = a.mediaId LIMIT 1)) AS dailyRank ' +
      'FROM posts AS a WHERE a.userId = :userId ORDER BY a.dateTime DESC', {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    profileRoutes.get('/:userId/feed', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/' + req.params.userId + '/feed');
      var userId = null;
      if (req.user) {
        userId = req.user
      }
      const profileId = req.params.userId

      conn.query('SELECT a.*, ' +
      '((SELECT COUNT(*) FROM votes WHERE userId = :userId AND (winMediaId = a.mediaId OR lossMediaId = a.mediaId)) > 0) AS voted, ' +
      '(SELECT COUNT(*) FROM posts WHERE (wins * 1.0 / matches) > (SELECT (wins * 1.0 / matches) FROM posts WHERE mediaId = a.mediaId LIMIT 1)) AS dailyRank ' +
      'FROM posts AS a WHERE a.userId = :profileId ORDER BY a.dateTime DESC', {userId: userId, profileId: profileId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    profileRoutes.get('/votes', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/votes');
      const userId = req.user
      conn.query('SELECT b.*, true AS voted, ' +
      '(SELECT COUNT(*) FROM posts WHERE (wins * 1.0 / matches) > (SELECT (wins * 1.0 / matches) FROM posts WHERE mediaId = b.mediaId LIMIT 1)) AS dailyRank ' +
      'FROM votes AS a JOIN posts AS b ON b.mediaId = a.winMediaId WHERE a.userId = :userId ORDER BY dateTime DESC', {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    profileRoutes.get('/:userId/votes', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/' + req.params.userId + '/votes');
      var userId = null;
      if (req.user) {
        userId = req.user
      }
      const profileId = req.params.userId

      conn.query('SELECT b.*, ' +
      '((SELECT COUNT(*) FROM votes WHERE userId = :userId AND (winMediaId = a.winMediaId OR lossMediaId = a.winMediaId)) > 0) AS voted, ' +
      '(SELECT COUNT(*) FROM posts WHERE (wins * 1.0 / matches) > (SELECT (wins * 1.0 / matches) FROM posts WHERE mediaId = b.mediaId LIMIT 1)) AS dailyRank ' +
      'FROM votes AS a JOIN posts AS b ON b.mediaId = a.winMediaId WHERE a.userId = :profileId ORDER BY dateTime DESC', {userId: userId, profileId: profileId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    profileRoutes.post('/follow', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/follow');
      const userId = req.user

      if (userId == parseInt(req.body.followingUserId, 10)) {
        res.send({message: 'fail'})
      } else {
        conn.query('INSERT IGNORE INTO following (followerUserId, followingUserId) VALUES (:userId, :followingUserId)', {userId: userId, followingUserId: req.body.followingUserId}, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            if (result.affectedRows) {
              console.log("Followed successfully");
              res.send({message: "success"})
            } else {
              res.send({message: "fail"})
            }
          }
        })
      }
    })

    profileRoutes.post('/unfollow', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/follow');
      const userId = req.user

      if (userId == parseInt(req.body.followingUserId)) {
        res.send({message: 'fail'})
      } else {
        conn.query('DELETE FROM following WHERE followingUserId=:followingUserId AND followerUserId=:userId', {userId: userId, followingUserId: req.body.followingUserId}, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            if (result.affectedRows) {
              console.log("Unfollowed successfully");
              res.send({message: "success"})
            } else {
              res.send({message: "fail"})
            }
          }
        })
      }
    })

    profileRoutes.get('/checkProfileName/:profileName', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/checkProfileName/' + req.params.profileName);
      const profileName = req.params.profileName
      conn.query('SELECT 1 FROM users WHERE profileName = :profileName', {profileName: profileName}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.length > 0) {
            res.send({message: 'exists'})
          } else {
            res.send({message: 'unique'})
          }
        }
      })
    })

    profileRoutes.post('/edit', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/edit');
      const userId = req.user
      conn.query('UPDATE users SET profileName = :profileName, location = :location, about = :about WHERE userId = :userId',
      {userId: userId, profileName: req.body.profileName, location: req.body.location, about: req.body.about}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.affectedRows) {
            console.log("Edited successfully");
            res.send({message: "success"})
          } else {
            res.send({message: "fail"})
          }
        }
      })
    })

    return profileRoutes;

};
