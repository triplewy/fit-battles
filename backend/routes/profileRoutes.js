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

      conn.query('SELECT * FROM users WHERE userId = :profileId LIMIT 1', {userId: userId, profileId: profileId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result[0])
        }
      })

    })

    profileRoutes.get('/feed/page=:page', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/feed/page=' + req.params.page);
      const userId = req.user
      const start = req.params.page * 10
      conn.query('SELECT a.*, b.*, true AS isPoster, DAY(a.dateTime) = DAY(NOW()) AS postedToday, ' +
      '(SELECT COUNT(*) FROM posts WHERE DAY(dateTime) = DAY(a.dateTime) AND (wins * 1.0 / matches) > (CASE WHEN a.matches = 0 THEN 0 ELSE a.wins * 1.0 / a.matches END)) AS dailyRank ' +
      'FROM posts AS a JOIN users AS b ON b.userId = a.userId WHERE a.userId = ? ORDER BY a.dateTime DESC LIMIT ?, 10', [userId, start], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    profileRoutes.get('/:userId/feed/page=:page', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/' + req.params.userId + '/feed/page=' + req.params.page);
      var userId = null;
      if (req.user) {
        userId = req.user
      }
      const profileId = req.params.userId
      const start = req.params.page * 10
      conn.query('SELECT a.*, b.*, a.userId = ? AS isPoster, DAY(a.dateTime) = DAY(NOW()) AS postedToday, ' +
      '(SELECT COUNT(*) FROM posts WHERE DAY(dateTime) = DAY(a.dateTime) AND (wins * 1.0 / matches) > (CASE WHEN a.matches = 0 THEN 0 ELSE a.wins * 1.0 / a.matches END)) AS dailyRank ' +
      'FROM posts AS a JOIN users AS b ON b.userId = a.userId WHERE a.userId = ? ORDER BY a.dateTime DESC LIMIT ?, 10', [userId, profileId, start], function(err, result) {
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
      conn.query('SELECT b.*, c.*, DAY(b.dateTime) = DAY(NOW()) AS postedToday, ' +
      '(SELECT COUNT(*) FROM posts WHERE DAY(dateTime) = DAY(b.dateTime) AND (wins * 1.0 / matches) > (CASE WHEN b.matches = 0 THEN 0 ELSE b.wins * 1.0 / b.matches END)) AS dailyRank ' +
      'FROM votes AS a JOIN posts AS b ON b.mediaId = a.winMediaId JOIN users AS c ON c.userId = b.userId WHERE a.userId = :userId ORDER BY dateTime DESC LIMIT 10', {userId: userId}, function(err, result) {
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

      conn.query('SELECT b.*, c.*, DAY(b.dateTime) = DAY(NOW()) AS postedToday, ' +
      '(SELECT COUNT(*) FROM posts WHERE DAY(dateTime) = DAY(b.dateTime) AND (wins * 1.0 / matches) > (CASE WHEN b.matches = 0 THEN 0 ELSE b.wins * 1.0 / b.matches END)) AS dailyRank ' +
      'FROM votes AS a JOIN posts AS b ON b.mediaId = a.winMediaId JOIN users AS c ON c.userId = b.userId WHERE a.userId = :profileId ORDER BY dateTime DESC LIMIT 10', {profileId: profileId}, function(err, result) {
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
      conn.query('UPDATE users SET profileName = :profileName, location = :location WHERE userId = :userId',
      {userId: userId, profileName: req.body.profileName, location: req.body.location}, function(err, result) {
        if (err) {
          console.log(err);
          res.send({message: 'fail'})
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
