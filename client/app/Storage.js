import { AsyncStorage } from 'react-native'
import CookieManager from 'react-native-cookies'

export function setCookie(cookie) {
  return new Promise(function(resolve, reject) {
    AsyncStorage.setItem('cookie', cookie).then(() => {
      CookieManager.set({
        name: 'connect.sid',
        value: cookie.substring(12),
        domain: '192.168.1.14',
        origin: '192.168.1.14',
        path: '/',
        version: '1',
        expiration: '2020-01-01T12:00:00.00-00:00'
      }).then((res) => {
        console.log("connect sid is", res);
        return resolve({message: 'success'})
      })
      .catch(err => {
        return reject(err)
      })
    })
    .catch(err => {
      return reject(err)
    })
  })
}

export function getCookie() {
  return new Promise(function(resolve, reject) {
    AsyncStorage.getItem('cookie').then(value => {
      if (value !== null) {
        return resolve(value)
      } else {
        return resolve('')
      }
    })
    .catch(err => {
      return reject(err)
    })
  })
}

export function clearCookies() {
  return new Promise(function(resolve, reject) {
    CookieManager.clearAll()
    .then((res) => {
      console.log('CookieManager.clearAll =>', res);
      return resolve({message: 'success'})
    })
    .catch(err => {
      return reject(err)
    })
  })
}

export function lastVisit() {
  return new Promise(function(resolve, reject) {
    AsyncStorage.getItem('lastVisit').then(value => {
      AsyncStorage.setItem('lastVisit', JSON.stringify(Date.now())).then(() => {
        if (value !== null) {
          const lastVisit = new Date(parseInt(value, 10))
          const now = new Date()
          if (lastVisit.getUTCDate() === now.getUTCDate()) {
            return resolve({lastVisitToday: true})
          } else {
            return resolve({lastVisitToday: false})
          }
        } else {
          return resolve({lastVisitToday: true})
        }
      }).catch(e => {
        console.log(e);
      })
    }).catch(e => {
      console.log(e);
    })
  })
}
