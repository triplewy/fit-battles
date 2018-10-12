module.exports = function(conn, loggedIn) {
    'use strict';
    var profileRoutes = require('express').Router();

    profileRoutes.get('/info', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile');
      const userId = req.user
      conn.query('SELECT * FROM users WHERE userId = :userId LIMIT 1', {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result[0])
        }
      })
    })

    profileRoutes.get('/:userId', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/profile/' + req.params.userId);
      var userId = null;
      if (req.user) {
        userId = req.user
      }
      //FOR CYANURA TO DO

    })

    //OTHER API ENDPOINTS FOR PROFILE
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

    return profileRoutes;

};
