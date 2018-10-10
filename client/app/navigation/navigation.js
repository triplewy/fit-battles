import React from 'react'
import { createBottomTabNavigator, createSwitchNavigator } from 'react-navigation'
import Battles from '../views/Battles.js'
import Leaderboard from '../views/Leaderboard.js'
import Upload from '../views/upload/Upload.js'
import Feed from '../views/Feed.js'
import Profile from '../views/Profile.js'
import Login from '../views/auth/Login.js'
import Signup from '../views/auth/Signup.js'

const url = 'http://localhost:8081'

export default class TabNavigator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: null
    };

    this.sessionLogin = this.sessionLogin.bind(this)
    this.setUserId = this.setUserId.bind(this)
  }

  componentDidMount() {
    console.log("Tab navigator mounted");
  }

  sessionLogin() {
    fetch(url + '/api/sessionLogin', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.message !== 'not logged in') {
        this.setState({userId: data})
      } else {
        this.setState({userId: null})
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  setUserId(userId) {
    this.setState({userId: userId})
  }

  render() {
    const AppNavigator = createSwitchNavigator(
      {
        Login: props => <Login {...props} setUserId={this.setUserId} />,
        Signup: props => <Signup {...props} setUserId={this.setUserId} />,
      }
    );

    const Tabs = createBottomTabNavigator(
      {
        Battles: {
          screen: Battles
        },
        Leaderboard: {
          screen: Leaderboard
        },
        Upload: {
          screen: this.state.userId ? Upload : AppNavigator
        },
        Feed: {
          screen: Feed
        },
        Profile: {
          screen: props => <Profile {...props} setUserId={this.setUserId} userId={this.state.userId}/>
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
            flex: 1,
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

    return (
      <Tabs />
    )
  }
}
