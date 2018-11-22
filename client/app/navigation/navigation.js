import React from 'react'
import { View, AsyncStorage, AppState, PushNotificationIOS, Image } from 'react-native'
import { createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator, NavigationActions } from 'react-navigation'
import { setCookie, getCookie } from '../Storage'
import { loggedIn } from '../redux/actions/index.actions'
// import PushNotification from 'react-native-push-notifications'
import Splash from '../views/Splash'
import Battles from '../views/battle/Battles.js'
import Daily from '../views/leaderboard/Daily.js'
import Weekly from '../views/leaderboard/Weekly.js'
import AllTime from '../views/leaderboard/AllTime.js'
import Upload from '../views/upload/Upload.js'
import SelectedPhoto from '../views/upload/SelectedPhoto.js'
import Feed from '../views/feed/Feed.js'
import Profile from '../views/profile/Profile.js'
import Settings from '../views/profile/Settings.js'
import Edit from '../views/profile/Edit.js'
import Login from '../views/auth/Login.js'
import Signup from '../views/auth/Signup.js'
import WinnerModal from '../views/winners/Modal.js'
import Welcome from '../views/Instructions/Welcome'
import BattlesInstructions from '../views/Instructions/BattlesInstructions'
import RankingsInstructions from '../views/Instructions/RankingsInstructions'
import Final from '../views/Instructions/Final'
import statsIcon from '../icons/stats-icon.png'
import accountIcon from '../icons/account-icon.png'
import versusIcon from '../icons/versus-icon.png'

export default class TabNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };

    this.sessionLogin = this.sessionLogin.bind(this)
    // this.configureNotifications = this.configureNotifications.bind(this)
    // this.handleAppStateChange = this.handleAppStateChange.bind(this)
  }

  componentDidMount() {
    this.sessionLogin()
    // this.configureNotifications()
    // AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this.handleAppStateChange)
  }

  sessionLogin() {
    fetch(global.API_URL + '/api/sessionLogin', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.message !== 'not logged in') {
        this.setState({loading: false})
        this.props.dispatch(loggedIn(true))
      } else {
        this.setState({loading: false})
        this.props.dispatch(loggedIn(false))
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  // configureNotifications() {
  //   PushNotification.configure({
  //     // (required) Called when a remote or local notification is opened or received
  //     onNotification: function(notification) {
  //       console.log( 'NOTIFICATION:', notification );
  //
  //       // process the notification
  //
  //       // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
  //       notification.finish(PushNotificationIOS.FetchResult.NoData);
  //     },
  //     // IOS ONLY (optional): default: all - Permissions to register.
  //     permissions: {
  //         alert: true,
  //         badge: true,
  //         sound: true
  //     },
  //   })
  // }

  // handleAppStateChange(appState) {
  //   if (appState === 'background') {
  //     console.log("app is in background");
  //     PushNotification.localNotificationSchedule({
  //       message: "My notification message",
  //       date: new Date(Date.now() + (5 * 1000)).toISOString(),
  //       number: 0
  //     })
  //   }
  // }

  render() {
    const AuthNavigator = createStackNavigator(
      {
        Login: Login,
        Signup: Signup,
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

    const BattleNavigation = createStackNavigator(
      {
        Battle: {
          screen: Battles,
          navigationOptions: {
            title: 'Battle'
          }
        },
        UserProfile: {
          screen: props => <Profile {...props} selfProfile />
        }
      },
      {
        cardStyle: {
          backgroundColor: 'white'
        },
        navigationOptions: {
        }
      }
    )

    const InstructionsNavigator = createStackNavigator(
      {
        Welcome: Welcome,
        BattlesInstructions: BattlesInstructions,
        RankingsInstructions: RankingsInstructions,
        Final: Final
      }
    )

    const BattleSwitchNavigator = createSwitchNavigator(
      {
        Battle: BattleNavigation,
        Instructions: InstructionsNavigator
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
        AllTime: {
          screen: AllTimeNavigator,
          navigationOptions: {
            title: 'All Time'
          }
        }
      },
      {
        lazy: true,
        tabBarOptions: {
          indicatorStyle: {
            backgroundColor: '#548EC6'
          },
          labelStyle: {
            color: 'black'
          },
          style: {
            backgroundColor: 'white',
            marginTop: 30
          }
        }
      }
    )

    const UploadNavigator = createStackNavigator(
      {
        Upload: {
          screen: Upload,
          navigationOptions: {
            title: 'Upload'
          }
        },
        SelectedPhoto: {
          screen: SelectedPhoto,
          navigationOptions: {
            title: 'Selected Photo'
          }
        }
      },
      {
        cardStyle: {
          backgroundColor: 'white'
        }
      }
    )

    const ProfileNavigator = createStackNavigator(
      {
        Profile: {
          screen: props => <Profile {...props} selfProfile />,
          navigationOptions: {
            title: 'Profile'
          }
        },
        UserProfile: {
          screen: props => <Profile {...props} selfProfile />
        },
        Settings: {
          screen: Settings,
          navigationOptions: {
            title: 'Settings'
          }
        },
        Edit: {
          screen: Edit,
          navigationOptions: {
            title: 'Edit'
          }
        }
      },
      {
        cardStyle: {
          backgroundColor: 'white'
        },
        navigationOptions: {
        }
      }
    )

    const FeedNavigator = createStackNavigator(
      {
        Feed: Feed,
        UserProfile: {
          screen: props => <Profile {...props} selfProfile />
        }
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
            Leaderboard: {
              screen: LeaderboardNavigator,
              navigationOptions: {
                tabBarLabel: 'Rankings',
                tabBarIcon: () => (<Image source={statsIcon} style={{width: 50, height: 50, alignItems: 'center'}} />)
              }
            },
            Battles: {
              screen: BattleSwitchNavigator,
              navigationOptions: {
                tabBarLabel: 'Battles',
                tabBarIcon: () => (
                  <View style={{width: 50, height: 50, borderRadius: 30, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={versusIcon} style={{width: 40, height: 40, alignItems: 'center'}} />
                  </View>
                )
              }
            },
            Profile: {
              screen: ProfileNavigator,
              navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: () => (<Image source={accountIcon} style={{width: 50, height: 50, alignItems: 'center'}} />)
              }
            },
            // Upload: UploadNavigator,
            // Feed: FeedNavigator,
          },
          {
            initialRouteName: 'Battles',
            tabBarOptions: {
              activeTintColor: '#2EC4B6',
              inactiveTintColor: '#666',
              showIcon: true,
              showLabel: false,
              style: {
                height: 60
              },
              tabStyle: {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 5
              },
              labelStyle: {
                fontSize: 14,
                marginLeft: 0,
                padding: 0
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

    if (this.state.loading) {
      return (
        <Splash />
      )
    } else {
      return (
        <Tabs />
      )
    }
  }
}
