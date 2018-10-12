import React from 'react'
import { createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator } from 'react-navigation'
import Battles from '../views/battle/Battles.js'
import Daily from '../views/leaderboard/Daily.js'
import Weekly from '../views/leaderboard/Weekly.js'
import AllTime from '../views/leaderboard/AllTime.js'
import Upload from '../views/upload/Upload.js'
import Feed from '../views/feed/Feed.js'
import Profile from '../views/profile/Profile.js'
import Settings from '../views/profile/Settings.js'
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
    this.sessionLogin()
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
    const AuthNavigator = createSwitchNavigator(
      {
        Login: props => <Login {...props} setUserId={this.setUserId} />,
        Signup: props => <Signup {...props} setUserId={this.setUserId} />,
      }
    );

    const LeaderboardNavigator = createStackNavigator(
      {
        Tabs: {
          screen: createMaterialTopTabNavigator(
            {
              Daily: Daily,
              Weekly: Weekly,
              AllTime: AllTime
            }
          ),
          navigationOptions: {
            title: 'User Leaderboard Info'
          }
        }
      },
      {
        navigationOptions:({ navigation }) => ({

        })
      }
    )

    const ProfileNavigator = createStackNavigator(
      {
        Profile: {
          screen: props => <Profile {...props} setUserId={this.setUserId} userId={this.state.userId} />
        },
        Settings: {
          screen: Settings
        }
      }
    )

    const Tabs = createBottomTabNavigator(
      {
        Battles: {
          screen: Battles
        },
        Leaderboard: {
          screen: LeaderboardNavigator
        },
        Upload: {
          screen: this.state.userId ? Upload : AuthNavigator
        },
        Feed: {
          screen: props => <Feed {...props} userId={this.state.userId} />
        },
        Profile: {
          screen: ProfileNavigator
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
