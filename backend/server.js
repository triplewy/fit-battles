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
conn.query('DROP TABLE IF EXISTS posts')
conn.query('SET foreign_key_checks = 1')

conn.query('CREATE TABLE IF NOT EXISTS users (userId INTEGER AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, profileName TEXT NOT NULL, location TEXT, followers INTEGER NOT NULL DEFAULT 0, following INTEGER NOT NULL DEFAULT 0, numPosts INTEGER NOT NULL DEFAULT 0, about TEXT, createdDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)')
conn.query('CREATE TABLE IF NOT EXISTS posts (mediaId INTEGER AUTO_INCREMENT PRIMARY KEY, userId INTEGER NOT NULL, username VARCHAR(255) NOT NULL, profileName TEXT NOT NULL, leftSwipes INTEGER DEFAULT 0, rightSwipes INTEGER DEFAULT 0, dateTime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (userId) REFERENCES users(userId), FOREIGN KEY (username) REFERENCES users(username) ON UPDATE CASCADE);')

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

server.listen(8081, function(){
    console.log('- Server listening on port 8081');
});
