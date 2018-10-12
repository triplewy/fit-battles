const url = 'http://localhost:8081'

export function follow(userId) {
  return new Promise(function(resolve, reject) {
    fetch(url + '/api/profile/follow', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        followingUserId: userId,
      })
    })
    .then(res => res.json())
    .then(data => {
      return resolve(data.message)
    })
    .catch(function(err) {
      return reject(err);
    })
  })
}

export function unfollow(userId) {
  return new Promise(function(resolve, reject) {
    fetch(url + '/api/profile/unfollow', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        followingUserId: userId,
      })
    })
    .then(res => res.json())
    .then(data => {
      return resolve(data.message)
    })
    .catch(function(err) {
      return reject(err)
    })
  })
}
