module.exports = function(passport, conn, loggedIn) {
    'use strict';
    var authRoutes = require('express').Router();
    var LocalStrategy = require('passport-local').Strategy
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var RedditStrategy = require('passport-reddit').Strategy
    var bcrypt = require('bcrypt');
    var validator = require('validator');
    var randomstring = require('randomstring')
    var shortId = require('shortid');

    passport.use('local-login', new LocalStrategy(
     function(email, password, done) {
       conn.query('SELECT * FROM logins WHERE email=?', [email], function(err, result) {
          if (err) {
            return done(err)
          }
          if (result.length == 0) {
            return done(null, false)
          }
          bcrypt.compare(password, result[0].passwordHash, (err, isValid) => {
            if (err) {
              return done(err)
            }
            if (!isValid) {
              return done(null, false)
            }
            return done(null, result[0].userId)
          })
        })
      }
    ))

    passport.use('local-signup', new LocalStrategy({
      passReqToCallback : true
    },
      function(req, email, password, done) {
        if (!validator.isEmail(email)) {
          console.log("email is invalid");
          return done(null, false, { message: 'Email is invalid' })
        }
        bcrypt.hash(password, 10, function(err, passwordHash) {
          bcrypt.hash(randomstring.generate(), 10, function(err, verificationHash) {
            conn.query('INSERT INTO users (profileName) VALUES (?)', [shortId.generate()], function(err, result) {
              if (err) {
                return done(err)
              } else {
                var userId = result.insertId
                conn.query('INSERT INTO logins (email, passwordHash, verificationHash, userId) VALUES (?,?,?,?)',
                  [email, passwordHash, verificationHash, userId], function(err, result) {
                  if (err) {
                    return done(err)
                  } else {
                    return done(null, userId)
                    // var link = "localhost:3000/verify?id=" + verificationHash;
                    // var mailOptions={
                    //   to : email,
                    //   subject : "Please confirm your Email account",
                    //   html : "Hello,<br> Please click on the link to verify your email.<br><a href="+ link +">" + link + "</a>"
                    // }
                    // smtpTransport.sendMail(mailOptions, function(err, response) {
                    //   if (err) {
                    //     return done(err)
                    //   } else {
                    //     console.log("Message sent");
                    //     return done(null, {userId: userId, username: username.toLowerCase()})
                    //   }
                    // })
                  }
                })
              }
            })
          })
        })
      }
    ))

    // passport.use(new GoogleStrategy({
    //     clientID: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //     callbackURL: process.env.SERVER_DNS + "/auth/google/callback"
    //   },
    //   function(accessToken, refreshToken, profile, done) {
    //     conn.query('SELECT * FROM logins WHERE networkId=?', [profile.id], function(err, result) {
    //        if (err) {
    //          return done(err)
    //        }
    //        if (result.length > 0) {
    //          return done(null, result[0].userId)
    //        }
    //        var username = profile.displayName.replace(/\s+/g, '').toLowerCase();
    //        generateUsername(username)
    //        .then(function(data) {
    //          conn.query('INSERT INTO users (username, profileName) VALUES (?,?)',
    //          [data, profile.displayName], function(err, result) {
    //            if (err) {
    //              return done(err)
    //            }
    //            var userId = result.insertId
    //            conn.query('INSERT INTO logins (networkId, network, accessToken, username, email, verified, userId) VALUES (?,?,?,?,?,?,?)',
    //            [profile.id, profile.provider, accessToken, data, profile.emails[0].value, true, userId], function(err, result) {
    //              if (err) {
    //                return done(err)
    //              }
    //              return done(null, userId)
    //            })
    //          })
    //        })
    //      })
    //    }
    // ))
    //
    // passport.use(new RedditStrategy({
    //     clientID: process.env.REDDIT_CLIENT_ID,
    //     clientSecret: process.env.REDDIT_CLIENT_SECRET,
    //     callbackURL: process.env.SERVER_DNS + "/auth/reddit/callback"
    //   },
    //   function(accessToken, refreshToken, profile, done) {
    //     conn.query('SELECT * FROM logins WHERE networkId=?', [profile.id], function(err, result) {
    //        if (err) {
    //          return done(err)
    //        }
    //        if (result.length > 0) {
    //          return done(null, result[0].userId)
    //        }
    //        var username = profile.name.replace(/\s+/g, '').toLowerCase();
    //        generateUsername(username)
    //        .then(function(data) {
    //          conn.query('INSERT INTO users (username, profileName) VALUES (?,?)',
    //          [data, profile.name], function(err, result) {
    //            if (err) {
    //              return done(err)
    //            }
    //            const userId = result.insertId
    //            conn.query('INSERT INTO logins (networkId, network, accessToken, username, verified, userId) VALUES (?,?,?,?,?,?)',
    //            [profile.id, "reddit", accessToken, data, true, userId], function(err, result) {
    //              if (err) {
    //                return done(err)
    //              }
    //              return done(null, userId)
    //            })
    //          })
    //        })
    //      })
    //    }
    // ))

    authRoutes.post('/signup', passport.authenticate('local-signup'), (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/signup');
      const userId = req.user
      res.send({userId: userId});
    })

    authRoutes.post('/signin', passport.authenticate('local-login'), function(req, res) {
      console.log('- Request received:', req.method.cyan, '/api/signin');
      const userId = req.user
      res.send({userId: userId});
    });

    authRoutes.post('/logout', loggedIn, function(req, res) {
      console.log('- Request received:', req.method.cyan, '/api/logout');
      req.logout()
      req.session.destroy();
      res.send({message: 'success'})
    })

    return authRoutes;


};
