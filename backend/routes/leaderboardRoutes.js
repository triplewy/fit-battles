module.exports = function(conn, loggedIn) {
    'use strict';
    var leaderboardRoutes = require('express').Router();

    leaderboardRoutes.get('/header', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/leaderboard/header');
      const userId = req.user
      Promise.all([getDailyRank(userId), getWeeklyRank(userId), getAllTimeRank(userId)])
      .then(function(allData) {
        res.send({dailyRank: allData[0].dailyRank, weeklyRank: allData[1].weeklyRank, allTimeRank: allData[2].allTimeRank})
      })
      .catch(e => {
        console.log(e);
      })
    })

    leaderboardRoutes.get('/:userId/header', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/leaderboard/header');
      const userId = req.params.userId
      Promise.all([getDailyRank(userId), getWeeklyRank(userId), getAllTimeRank(userId)])
      .then(function(allData) {
        res.send({dailyRank: allData[0].dailyRank, weeklyRank: allData[1].weeklyRank, allTimeRank: allData[2].allTimeRank})
      })
      .catch(e => {
        console.log(e);
      })
    })

    function getDailyRank(userId) {
      return new Promise(function(resolve, reject) {
        conn.query('SELECT COUNT(*) AS dailyRank FROM posts WHERE (wins * 1.0 / matches) > ' +
        '(SELECT (wins * 1.0 / matches) FROM posts WHERE userId = :userId AND dateTime >= CURRENT_DATE() AND dateTime <= NOW() ORDER BY (wins * 1.0 / matches) DESC LIMIT 1) LIMIT 1',
        {userId: userId}, function(err, result) {
          if (err) {
            return reject(err);
          } else {
            return resolve(result[0])
          }
        })
      })
    }

    function getWeeklyRank(userId) {
      return new Promise(function(resolve, reject) {
        conn.query('SELECT COUNT(*) AS weeklyRank FROM users WHERE (SELECT SUM(wins) FROM posts WHERE userId = users.userId AND YEARWEEK(dateTime) = YEARWEEK(NOW()) GROUP BY userId) > ' +
        '(SELECT SUM(wins) FROM posts WHERE userId = :userId AND YEARWEEK(dateTime) = YEARWEEK(NOW()) GROUP BY userId) LIMIT 1',
        {userId: userId}, function(err, result) {
          if (err) {
            return reject(err);
          } else {
            return resolve(result[0])
          }
        })
      })
    }

    function getAllTimeRank(userId) {
      return new Promise(function(resolve, reject) {
        conn.query('SELECT COUNT(*) AS allTimeRank FROM users WHERE (SELECT SUM(wins) FROM posts WHERE userId = users.userId GROUP BY userId) > ' +
        '(SELECT SUM(wins) FROM posts WHERE userId = :userId GROUP BY userId) LIMIT 1',
        {userId: userId}, function(err, result) {
          if (err) {
            return reject(err);
          } else {
            return resolve(result[0])
          }
        })
      })
    }

    leaderboardRoutes.get('/daily/page=:page', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/leaderboard/daily/page=' + req.params.page);
      const start = req.params.page * 10
      conn.query('SELECT a.*, b.*, true AS postedToday, (SELECT COUNT(*) FROM posts WHERE (wins * 1.0 / matches) > (CASE WHEN a.matches = 0 THEN 0 ELSE a.wins * 1.0 / a.matches END)) AS dailyRank ' +
      'FROM posts AS a JOIN users AS b ON b.userId = a.userId WHERE a.dateTime >= CURRENT_DATE() AND a.dateTime <= NOW() ORDER BY a.wins * 1.0 / a.matches DESC LIMIT ' + start + ', 10', [], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    leaderboardRoutes.get('/weekly/page=:page', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/leaderboard/weekly/page=' + req.params.page);
      const start = req.params.page * 20
      conn.query('SELECT *, (SELECT SUM(wins) FROM posts WHERE userId = users.userId AND YEARWEEK(dateTime) = YEARWEEK(NOW()) GROUP BY userId) AS wins ' +
      'FROM users WHERE userId IN (SELECT userId FROM posts WHERE YEARWEEK(dateTime) = YEARWEEK(NOW())) ORDER BY wins DESC LIMIT ' + start + ', 20', [], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    leaderboardRoutes.get('/allTime/page=:page', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/leaderboard/allTime/page=' + req.params.page);
      const start = req.params.page * 20
      conn.query('SELECT *, (SELECT SUM(wins) FROM posts WHERE userId = users.userId GROUP BY userId) AS wins ' +
      'FROM users WHERE userId IN (SELECT userId FROM posts) ORDER BY wins DESC LIMIT ' + start + ', 20', [], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })


    return leaderboardRoutes;

};
