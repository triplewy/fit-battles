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

const dbConfig = {
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE,
  timezone: 'utc'
}

var conn;

function handleDisconnect() {
  conn = mysql.createConnection(dbConfig);

  conn.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  conn.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect()

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

// testData(conn)

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
