import React from 'react'
import { View, AsyncStorage, AppState, PushNotificationIOS } from 'react-native'
import { createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator, NavigationActions } from 'react-navigation'
// import PushNotification from 'react-native-push-notifications'
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

const url = global.API_URL

export default class TabNavigator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: null
    };

    this.sessionLogin = this.sessionLogin.bind(this)
    // this.configureNotifications = this.configureNotifications.bind(this)
    // this.handleAppStateChange = this.handleAppStateChange.bind(this)
    // this.fetchLastVisit = this.fetchLastVisit.bind(this)
    // this.storeVisit = this.storeVisit.bind(this)
    this.setUserId = this.setUserId.bind(this)
  }

  componentDidMount() {
    // this.fetchLastVisit()
    // this.configureNotifications()
    // AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this.handleAppStateChange)
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

  // fetchLastVisit() {
  //   AsyncStorage.getItem('lastVisit')
  //   .then(value => {
  //     this.storeVisit()
  //     if (value !== null) {
  //       const lastVisit = new Date(parseInt(value, 10))
  //       const now = new Date()
  //       if (lastVisit.getUTCDate() === now.getUTCDate()) {
  //         this.navigator.dispatch(NavigationActions.navigate({routeName: 'Modal'}))
  //       }
  //     }
  //   })
  //   .catch(e => {
  //     console.log(e);
  //   })
  // }
  //
  // storeVisit() {
  //   AsyncStorage.setItem('lastVisit', JSON.stringify(Date.now()))
  //   .then(() => {
  //     console.log("success");
  //   })
  //   .catch(e => {
  //     console.log(e);
  //   })
  // }

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

    const BattleNavigation = createStackNavigator(
      {
        Battle: Battles,
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
          screen: props => <Profile {...props} selfProfile />
        },
        UserProfile: {
          screen: props => <Profile {...props} selfProfile />
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
            Battles: BattleSwitchNavigator,
            Leaderboard: {
              screen: LeaderboardNavigator,
              navigationOptions: {
                tabBarLabel: 'Rankings'
              }
            },
            Upload: UploadNavigator,
            // Feed: FeedNavigator,
            Profile: ProfileNavigator,
          },
          {
            tabBarPosition: 'bottom',
            animationEnabled: true,
            activeTintColor: '#2EC4B6',
            inactiveTintColor: '#666',
            tabBarOptions: {
              tabStyle: {
                flex: 1,
                alignItems: 'center'
              },
              labelStyle: {
                fontSize: 14,
                textAlign: 'center'
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
