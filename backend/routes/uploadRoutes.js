module.exports = function(upload, conn, loggedIn) {
    'use strict';
    var uploadRoutes = require('express').Router();

    uploadRoutes.post('/', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/upload');
      upload(req, res, function(err) {
        if (err) {
          console.log(err);
          res.send({message: err.message})
        } else {
          uploadImageMetadata(req).then(function(data) {
            console.log("Records added successfully");
            res.send({insertId: data})
          })
          .catch(e => {
            console.log(e);
            res.send({message: 'fail'})
          })
        }
      })
    })

    return uploadRoutes;

    function uploadImageMetadata(req) {
      return new Promise(function(resolve, reject) {
        const body = req.body
        conn.query('INSERT INTO posts (userId, imageUrl) VALUES (:userId, :url)', {userId: req.user, url: req.file.location}, function(err, result) {
          if (err) {
            return reject(err)
          } else {
            return resolve(result.insertId)
          }
        })
      })
    }
};
