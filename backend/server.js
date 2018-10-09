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
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var uuidv1 = require('uuid/v1');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var Redis = require('redis')
var bcrypt = require('bcrypt');
var fs = require('fs')
var validator = require('validator');
var cors = require('cors')

var app = express();
var server = http.createServer(app)


app.use(cors({credentials: true, origin: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var storage =  multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv1() + '.jpg')
  }
})

var upload = multer({
  storage: storage,
  limits: {fileSize: 10000000, files: 1},
  fileFilter: function(request, file, callback) {
     var ext = path.extname(file.originalname)
     if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.JPG') {
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
conn.query('DROP TABLE IF EXISTS posts')
conn.query('SET foreign_key_checks = 1')

conn.query('CREATE TABLE IF NOT EXISTS users (userId INTEGER AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, profileName TEXT NOT NULL, location TEXT, followers INTEGER NOT NULL DEFAULT 0, following INTEGER NOT NULL DEFAULT 0, numPosts INTEGER NOT NULL DEFAULT 0, about TEXT, createdDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)')
conn.query('CREATE TABLE IF NOT EXISTS posts (mediaId INTEGER AUTO_INCREMENT PRIMARY KEY, userId INTEGER NOT NULL, url VARCHAR(255) NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL, username VARCHAR(255) NOT NULL, profileName TEXT NOT NULL, leftSwipes INTEGER DEFAULT 0, rightSwipes INTEGER DEFAULT 0, dateTime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (userId) REFERENCES users(userId), FOREIGN KEY (username) REFERENCES users(username) ON UPDATE CASCADE);')

conn.query('INSERT INTO users (username, profileName, location, about) VALUES (?, ?, ?, ?)', ['yushuf', 'YUSHUF', 'Boston', 'Yuh'], function(err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log("Inserted successfully");
  }
})

app.get('/api/battles', (req, res) => {
  console.log('- Request received:', req.method.cyan, '/api/battles');

  conn.query('SELECT * FROM posts', [], function(err, result) {
    if (err) {
      console.log(err);
      res.send({message: 'error'})
    } else {
      res.send(result)
    }
  })
})

app.post('/api/upload', (req, res) => {
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

server.listen(8081, function(){
    console.log('- Server listening on port 8081');
});

function uploadImageMetadata(req) {
  return new Promise(function(resolve, reject) {
    const body = req.body
    console.log(req.files);
    conn.query('INSERT INTO posts (userId, url, width, height) VALUES (:userId, :url, :width, :height)', {userId: 1, url: req.file.path, width: body.width, height: body.height}, function(err, result) {
      if (err) {
        return reject(err)
      } else {
        return resolve(result.insertId)
      }
    })
  })
}
