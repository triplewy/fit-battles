import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'
import Battles from '../views/Battles.js'
import Leaderboard from '../views/Leaderboard.js'
import Upload from '../views/Upload.js'
import Feed from '../views/Feed.js'
import Profile from '../views/Profile.js'


export default createBottomTabNavigator(
  {
    Battles: {
      screen: Battles
    },
    Leaderboard: {
      screen: Leaderboard
    },
    Upload: {
      screen: Upload
    },
    Feed: {
      screen: Feed
    },
    Profile: {
      screen: Profile
    }
  },
  {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    activeTintColor: '#2EC4B6',
    inactiveTintColor: '#666',
    tabBarOptions: {
      tabStyle: {
        // flex: 1,
        // flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'center'
      },
      labelStyle: {
        fontSize: 14
      }
    }
  }
)
