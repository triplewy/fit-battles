import { AsyncStorage } from 'react-native'
import CookieManager from 'react-native-cookies'

export function setCookie(cookie) {
  return new Promise(function(resolve, reject) {
    AsyncStorage.setItem('cookie', cookie).then(() => {
      CookieManager.set({
        name: 'connect.sid',
        value: cookie.substring(12),
        domain: '10.38.17.49',
        origin: '10.38.17.49',
        // domain: 'ec2-18-223-124-212.us-east-2.compute.amazonaws.com',
        // origin: 'ec2-18-223-124-212.us-east-2.compute.amazonaws.com',
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
      if (value !== null) {
        const lastVisit = new Date(parseInt(value, 10))
        const now = new Date()
        if (lastVisit.getUTCDate() === now.getUTCDate()) {
          return resolve({lastVisit: 'today'})
        } else {
          return resolve({lastVisitToday: 'not today'})
        }
      } else {
        return resolve({lastVisitToday: 'never'})
      }
    }).catch(e => {
      console.log(e);
    })
  })
}

export function storeLastVisit() {
  return new Promise(function(resolve, reject) {
    AsyncStorage.setItem('lastVisit', JSON.stringify(Date.now())).then(() => {
      return resolve('success')
    }).catch(err => {
      return reject(err)
    })
  })
}

export function getLatestDate(dateTime) {
  return new Promise(function(resolve, reject) {
    AsyncStorage.getItem('latestDatetime').then(value => {
      return resolve(value)
    })
    .catch(err => {
      return reject(err)
    })
  })
}

export function storeLatestDate(dateTime) {
  return new Promise(function(resolve, reject) {
    AsyncStorage.setItem('latestDatetime', dateTime).then(() => {
      return resolve({message: 'success'})
    })
    .catch(err => {
      return reject(err)
    })
  })
}
