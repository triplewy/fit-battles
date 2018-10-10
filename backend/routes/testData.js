module.exports = function(conn) {
    'use strict';

    var bcrypt = require('bcrypt')

    conn.query('INSERT INTO users (profileName, location, about) VALUES (?, ?, ?)', ['YUSHUF', 'Boston', 'Yuh'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO users (profileName, location, about) VALUES (?, ?, ?)', ['CYANURA', 'Vancouver', 'yeah'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    bcrypt.hash('password', 10, function(err, hash) {
      conn.query('INSERT INTO logins (email, passwordHash, userId) VALUES (?,?,?)',
        ['the.real.yushuf@gmail.com', hash, 1], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Records successfully added");
        }
      })
    })

    conn.query('INSERT INTO posts (userId, imageUrl, width, height) VALUES (?, ?, ?, ?)', [1, 'https://s3.us-east-2.amazonaws.com/drip.io-images/026bb3d0-c8ec-11e8-9709-7d3cd8d2ea97.jpg', 1080, 1080], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO posts (userId, imageUrl, width, height) VALUES (?, ?, ?, ?)', [2, 'https://s3.us-east-2.amazonaws.com/drip.io-images/f9a3b6e0-c976-11e8-880d-a9d952d8880f.jpg', 1080, 1350], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO posts (userId, imageUrl, width, height) VALUES (?, ?, ?, ?)', [1, 'https://s3.us-east-2.amazonaws.com/drip.io-images/026bb3d0-c8ec-11e8-9709-7d3cd8d2ea97.jpg', 1080, 1080], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO posts (userId, imageUrl, width, height) VALUES (?, ?, ?, ?)', [2, 'https://s3.us-east-2.amazonaws.com/drip.io-images/f9a3b6e0-c976-11e8-880d-a9d952d8880f.jpg', 1080, 1350], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })
};
