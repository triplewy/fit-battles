module.exports = function(conn, loggedIn) {
    'use strict';
    var battleRoutes = require('express').Router();

    battleRoutes.get('/', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/battles');
      var userId = null;
      if (req.user) {
        userId = req.user
      }

      if (userId) {
        Promise.all([getAllPosts(), getVotedPairs(userId)]).then(allData => {
          const allPairs = allData[0][0]
          const possiblePairs = new Set(getAllPossiblePairs(allData[0][1]))
          const votedPairs = new Set(allData[1])
          const resultSet = new Set([...possiblePairs].filter(x => !votedPairs.has(x)))

          var result = []
          resultSet.forEach((value1, value2, set) => {
            var valueArr = JSON.parse(value1)
            result.push([allPairs[valueArr[0]], allPairs[valueArr[1]]])
          })
          res.send(result)
        })
      } else {
        conn.query('SELECT a.*, b.location FROM posts AS a JOIN users AS b ON b.userId = a.userId ' +
        'WHERE a.dateTime >= CURRENT_DATE() AND a.dateTime <= NOW() ORDER BY a.dateTime ASC LIMIT 20', [], function(err, result) {
          if (err) {
            console.log(err);
            res.send({message: 'error'})
          } else {
            var length = result.length
            if (length % 2 !== 0) {
              length -= 1
            }
            var battleTuples = []
            for (var i = 0; i + 1 < length; i += 2) {
              battleTuples.push([result[i], result[i+1]])
            }
            res.send(battleTuples)
          }
        })
      }
    })

    battleRoutes.get('/:dateTime', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/battles/' + req.params.dateTime);
      conn.query('SELECT a.*, b.* FROM posts AS a JOIN users AS b ON b.userId = a.userId ' +
      'WHERE a.dateTime > :dateTime AND a.dateTime <= NOW() ORDER BY a.dateTime ASC LIMIT 20', {dateTime: req.params.dateTime}, function(err, result) {
        if (err) {
          console.log(err);
          res.send({message: 'error'})
        } else {
          console.log(result);
          var length = result.length
          if (length % 2 !== 0) {
            length -= 1
          }
          var battleTuples = []
          for (var i = 0; i + 1 < length; i += 2) {
            battleTuples.push([result[i], result[i + 1]])
          }
          res.send(battleTuples)
        }
      })
    })

    battleRoutes.post('/vote', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/battles/vote');
      var userId = null;
      if (req.user) {
        userId = req.user
      }

      conn.query('INSERT IGNORE INTO votes (userId, winMediaId, winUserId, lossMediaId, lossUserId) VALUES (:userId, :winMediaId, :winUserId, :lossMediaId, :lossUserId)',
      {userId: userId, winMediaId: req.body.winMediaId, winUserId: req.body.winUserId, lossMediaId: req.body.lossMediaId, lossUserId: req.body.lossUserId},
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.affectedRows) {
            console.log("Recorded vote successfully");
            res.send({message: "success"})
          } else {
            console.log("Vote failed");
            res.send({message: "fail"})
          }
        }
      })
    })

    function getAllPosts() {
      return new Promise(function(resolve, reject) {
        conn.query('SELECT a.*, b.* FROM posts AS a JOIN users AS b ON b.userId = a.userId WHERE DAY(a.dateTime) = DAY(NOW())', [], function(err, result) {
          if (err) {
            return reject(err);
          } else {
            var posts = []
            var mediaIds = []
            for (var i = 0; i < result.length; i++) {
              var row = result[i]
              mediaIds.push(row.mediaId * 1)
              posts[row.mediaId * 1] = {
                mediaId: row.mediaId,
                userId: row.userId,
                imageUrl: row.imageUrl,
                profileName: row.profileName,
                location: row.location,
                wins: row.wins,
                matches: row.matches,
                dateTime: row.dateTime
              }
            }
            return resolve([posts, mediaIds])
          }
        })
      });
    }

    function getVotedPairs(userId) {
      return new Promise(function(resolve, reject) {
        conn.query('SELECT winMediaId, lossMediaId FROM votes WHERE userId = :userId AND DAY(dateTime) = DAY(NOW())', {userId: userId}, function(err, result) {
          if (err) {
            return reject(err)
          } else {
            var pairMediaIds = []
            for (var i = 0; i < result.length; i++) {
              var winMediaId = result[i].winMediaId * 1
              var lossMediaId = result[i].lossMediaId * 1

              if (winMediaId > lossMediaId) {
                pairMediaIds.push(JSON.stringify([lossMediaId, winMediaId]))
              } else {
                pairMediaIds.push(JSON.stringify([winMediaId, lossMediaId]))
              }
            }
            return resolve(pairMediaIds)
          }
        })
      });
    }

    function getAllPossiblePairs(mediaIds) {
      var result = []
      for (var i = 0; i < mediaIds.length - 1; i++) {
        for (var j = i + 1; j < mediaIds.length; j++) {
          result.push(JSON.stringify([mediaIds[i], mediaIds[j]]))
        }
      }
      return result
    }


    return battleRoutes;

};
