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
import Edit from '../views/profile/Edit.js'
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
    const AuthNavigator = createStackNavigator(
      {
        Login: props => <Login {...props} setUserId={this.setUserId} />,
        Signup: props => <Signup {...props} setUserId={this.setUserId} />,
      },
      {
        cardStyle: {
          backgroundColor: 'white'
        },
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false
        }
      }
    )

    const DailyNavigator = createStackNavigator(
      {
        Daily: Daily,
        UserProfile: Profile
      },
      {
        cardStyle: {
          backgroundColor: 'white'
        },
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false
        }
      }
    )

    const WeeklyNavigator = createStackNavigator(
      {
        Weekly: Weekly,
        UserProfile: Profile
      },
      {
        cardStyle: {
          backgroundColor: 'white'
        },
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false
        }
      }
    )

    const AllTimeNavigator = createStackNavigator(
      {
        AllTime: AllTime,
        UserProfile: Profile
      },
      {
        cardStyle: {
          backgroundColor: 'white'
        },
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false
        }
      }
    )

    const LeaderboardNavigator = createMaterialTopTabNavigator(
      {
        Daily: DailyNavigator,
        Weekly: WeeklyNavigator,
        AllTime: AllTimeNavigator
      },
      {
        lazy: true,
        tabBarOptions: {
          labelStyle: {
            color: 'blue'
          },
          style: {
            backgroundColor: 'white',
            marginTop: 10
          }
        }
      }
    )

    const ProfileNavigator = createStackNavigator(
      {
        Profile: {
          screen: Profile
        },
        Settings: {
          screen: props => <Settings {...props} setUserId={this.setUserId} />
        },
        Edit: Edit
      },
      {
        cardStyle: {
          backgroundColor: 'white'
        },
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false
        }
      }
    )

    const FeedNavigator = createStackNavigator(
      {
        Feed: props => <Feed {...props} userId={this.state.userId} />,
        UserProfile: Profile
      },
      {
        cardStyle: {
          backgroundColor: 'white'
        },
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false
        }
      }
    )

    const Tabs = createStackNavigator(
      {
        Tabs: createBottomTabNavigator(
          {
            Battles: {
              screen: Battles
            },
            Leaderboard: {
              screen: LeaderboardNavigator
            },
            Upload: {
              screen: props => <Upload {...props} userId={this.state.userId} />
            },
            Feed: {
              screen: FeedNavigator
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
                justifyContent: 'center'
              },
              labelStyle: {
                fontSize: 14
              }
            }
          }
        ),
        Auth: AuthNavigator,
        UserProfile: Profile
      },
      {
        headerMode: 'none',
        cardStyle: {
          backgroundColor: 'white'
        },
        navigationOptions: {
          headerVisible: false
        }
      }
    )

    return (
      <Tabs />
    )
  }
}
