// use strict compiling
"use strict";
require('dotenv').config()
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var named = require('named-placeholders')();
var path = require('path');
var colors = require('colors');
var cookieParser = require('cookie-parser')
var mysql = require('mysql')
var aws = require('aws-sdk')
var multer = require('multer');
var multerS3 = require('multer-s3')
var passport = require('passport');
var uuidv1 = require('uuid/v1');
var bcrypt = require('bcrypt');
var fs = require('fs')
var validator = require('validator');
var cors = require('cors')
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var Redis = require('redis')
var client = Redis.createClient();

var sessionStore = new RedisStore({
  host: process.env.REDIS_HOST,
  port: 6379,
  client: client
})

var s3 = new aws.S3()
var app = express();
var server = http.createServer(app)

app.use(cors({credentials: true, origin: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var sessionMiddleware = session({
  store: sessionStore,
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
    secure: false
  }
})

var passportInit = passport.initialize();
var passportSession = passport.session();

app.use(sessionMiddleware)
app.use(passportInit)
app.use(passportSession)

passport.serializeUser(function(user, done) {
  console.log("serializeUser userId is", user);
	done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user);
})

// var storage =  multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/images/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, uuidv1() + '.jpg')
//   }
// })

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    key: function (req, file, cb) {
      cb(null, uuidv1() + '.jpg')
    }
  }),
  limits: {fileSize: 10000000, files: 1},
  fileFilter: function(request, file, callback) {
     var mime = file.mimetype
     if (mime !== 'image/png' && mime !== 'image/jpg' && mime !== 'image/jpeg') {
          return callback(new Error('Only images are allowed'), false);
      }
      callback(null, true)
  }
}).single('image');

const originalQuery = require('mysql/lib/Connection').prototype.query;

require('mysql/lib/Connection').prototype.query = function (...args) {
    if (Array.isArray(args[0]) || !args[1]) {
        return originalQuery.apply(this, args);
    }
    ([
        args[0],
        args[1]
    ] = named(args[0], args[1]));

    return originalQuery.apply(this, args);
};

var conn = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE,
  timezone: 'utc'
});

conn.query('SET foreign_key_checks = 0')
conn.query('DROP TABLE IF EXISTS users')
conn.query('DROP TABLE IF EXISTS logins')
conn.query('DROP TABLE IF EXISTS posts')
conn.query('DROP TABLE IF EXISTS votes')
conn.query('DROP TABLE IF EXISTS following')
conn.query('SET foreign_key_checks = 1')

conn.query('CREATE TABLE IF NOT EXISTS users (userId INTEGER AUTO_INCREMENT PRIMARY KEY, profileName VARCHAR(255) NOT NULL UNIQUE, location TEXT, followers INTEGER NOT NULL DEFAULT 0, following INTEGER NOT NULL DEFAULT 0, about TEXT, createdDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)')
conn.query('CREATE TABLE IF NOT EXISTS logins (loginId INTEGER AUTO_INCREMENT PRIMARY KEY, userId INTEGER NOT NULL, network TEXT, networkId TEXT, accessToken TEXT, email VARCHAR(255) UNIQUE, passwordHash CHAR(60), verificationHash CHAR(60), verified BOOLEAN NOT NULL DEFAULT FALSE, FOREIGN KEY (userId) REFERENCES users(userId));')
conn.query('CREATE TABLE IF NOT EXISTS posts (mediaId INTEGER AUTO_INCREMENT PRIMARY KEY, userId INTEGER NOT NULL, imageUrl VARCHAR(255) NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL, profileName TEXT NOT NULL, wins INTEGER DEFAULT 0, matches INTEGER DEFAULT 0, dateTime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (userId) REFERENCES users(userId));')
conn.query('CREATE TABLE IF NOT EXISTS votes (voteId INTEGER AUTO_INCREMENT PRIMARY KEY, userId INTEGER, winMediaId INTEGER NOT NULL, winUserId INTEGER NOT NULL, lossMediaId INTEGER, lossUserId INTEGER, dateTime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (winMediaId) REFERENCES posts(mediaId), FOREIGN KEY (lossMediaId) REFERENCES posts(mediaId), ' +
'FOREIGN KEY (winUserId) REFERENCES users(userId), FOREIGN KEY (lossUserId) REFERENCES users(userId), FOREIGN KEY (userId) REFERENCES users(userId), UNIQUE(userId, winMediaId));')
conn.query('CREATE TABLE IF NOT EXISTS following (followingId INTEGER AUTO_INCREMENT PRIMARY KEY, followerUserId INTEGER NOT NULL, followingUserId INTEGER NOT NULL, dateTime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (followerUserId) REFERENCES users(userId), FOREIGN KEY (followingUserId) REFERENCES users(userId), UNIQUE(followerUserId, followingUserId))')

conn.query('CREATE TRIGGER before_posts_insert BEFORE INSERT ON posts FOR EACH ROW BEGIN ' +
'DECLARE newProfileName TEXT; ' +
'SELECT profileName INTO newProfileName FROM users WHERE userId = NEW.userId; ' +
'SET NEW.profileName = newProfileName; END;')

conn.query('CREATE TRIGGER after_votes_insert AFTER INSERT ON votes FOR EACH ROW BEGIN ' +
'DECLARE winPostWins INTEGER; DECLARE winPostMatches INTEGER; DECLARE lossPostMatches INTEGER; ' +
'SELECT SUM(CASE WHEN winMediaId = NEW.winMediaId THEN 1 ELSE 0 END), COUNT(*) INTO @winPostWins, @winPostMatches FROM votes WHERE winMediaId = NEW.winMediaId OR lossMediaId = NEW.winMediaId; ' +
'SELECT COUNT(*) INTO @lossPostMatches FROM votes WHERE winMediaId = NEW.lossMediaId OR lossMediaId = NEW.lossMediaId; ' +
'UPDATE posts SET wins = @winPostWins, matches = @winPostMatches WHERE mediaId = NEW.winMediaId; ' +
'UPDATE posts SET matches = @lossPostMatches WHERE mediaId = NEW.lossMediaId; END;')

conn.query('CREATE TRIGGER after_following_insert AFTER INSERT ON following FOR EACH ROW BEGIN ' +
'UPDATE users SET followers = (SELECT COUNT(*) FROM following WHERE followingUserId=NEW.followingUserId) WHERE userId=NEW.followingUserId; ' +
'UPDATE users SET following = (SELECT COUNT(*) FROM following WHERE followerUserId=NEW.followerUserId) WHERE userId=NEW.followerUserId; END;')

conn.query('CREATE TRIGGER after_following_delete AFTER DELETE ON following FOR EACH ROW BEGIN ' +
'UPDATE users SET followers = (SELECT COUNT(*) FROM following WHERE followingUserId=OLD.followingUserId) WHERE userId=OLD.followingUserId; ' +
'UPDATE users SET following = (SELECT COUNT(*) FROM following WHERE followerUserId=OLD.followerUserId) WHERE userId=OLD.followerUserId; ' + 'END;')

var uploadRoutes = require('./routes/uploadRoutes')
var authRoutes = require('./routes/authRoutes')
var profileRoutes = require('./routes/profileRoutes')
var battleRoutes = require('./routes/battleRoutes')
var leaderboardRoutes = require('./routes/leaderboardRoutes')
var feedRoutes = require('./routes/feedRoutes')
var cardRoutes = require('./routes/cardRoutes')
var winnerRoutes = require('./routes/winnerRoutes')
var testData = require('./routes/testData')

app.get('/api/sessionLogin', loggedIn, (req, res) => {
  console.log('- Request received:', req.method.cyan, '/api/sessionLogin');
  res.send({userId: req.user})
})

testData(conn)

app.use('/api/upload', uploadRoutes(upload, conn, loggedIn))

app.use('/api/auth', authRoutes(passport, conn, loggedIn))

app.use('/api/profile', profileRoutes(conn, loggedIn))

app.use('/api/battles', battleRoutes(conn, loggedIn))

app.use('/api/leaderboard', leaderboardRoutes(conn, loggedIn))

app.use('/api/feed', feedRoutes(conn, loggedIn))

app.use('/api/card', cardRoutes(conn, loggedIn))

app.use('/api/winner', winnerRoutes(conn, loggedIn))

server.listen(8082, function(){
    console.log('- Server listening on port 8082');
});

function loggedIn(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.send({message: 'not logged in'})
  }
}
