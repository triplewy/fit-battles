module.exports = function(conn, loggedIn) {
    'use strict';
    var cardRoutes = require('express').Router();

    cardRoutes.post('/vote', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/card/vote');
      const userId = req.user
      conn.query('INSERT IGNORE INTO votes (userId, winMediaId, winUserId) VALUES (:userId, :mediaId, :mediaUserId)',
      {userId: userId, mediaId: req.body.mediaId, mediaUserId: req.body.mediaUserId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.affectedRows) {
            console.log("voted successfully");
            res.send({message: 'success'})
          } else {
            console.log("voted failed");
            res.send({message: 'fail'})
          }
        }
      })
    })

    cardRoutes.post('/unvote', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/card/unvote');
      const userId = req.user
      conn.query('DELETE FROM votes WHERE userId = :userId AND winMediaId = :mediaId', {userId: userId, mediaId: req.body.mediaId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.affectedRows) {
            console.log("unvoted successfully");
            res.send({message: 'success'})
          } else {
            console.log("unvoted failed");
            res.send({message: 'fail'})
          }
        }
      })
    })

    cardRoutes.post('/delete', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/card/delete');
      const userId = req.user
      conn.query('DELETE FROM posts WHERE userId = :userId AND mediaId = :mediaId', {userId: userId, mediaId: req.body.mediaId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.affectedRows) {
            console.log("deleted successfully");
            res.send({message: 'success'})
          } else {
            console.log("deleted failed");
            res.send({message: 'fail'})
          }
        }
      })
    })

    return cardRoutes;

};
