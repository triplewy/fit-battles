import React from 'react'
import { View, AsyncStorage, AppState, PushNotificationIOS, Image, Text, TouchableOpacity, StatusBar } from 'react-native'
import { createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator, NavigationActions } from 'react-navigation'
import { setCookie, getCookie } from '../Storage'
import { loggedIn } from '../redux/actions/index.actions'
import LinearGradient from 'react-native-linear-gradient'
import Splash from '../views/Splash'
import Loading from '../views/Loading'
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
import Welcome from '../views/Instructions/Welcome'
import BattlesInstructions from '../views/Instructions/BattlesInstructions'
import VoteInstructions from '../views/Instructions/VoteInstructions'
import RankingsInstructions from '../views/Instructions/RankingsInstructions'
import Final from '../views/Instructions/Final'
import leaderboardIconActive from '../icons/leaderboard-icon-active.png'
import leaderboardIconUnactive from '../icons/leaderboard-icon-unactive.png'
import accountIconActive from '../icons/account-icon-active.png'
import accountIconUnactive from '../icons/account-icon-unactive.png'
import versusIconActive from '../icons/versus-icon-active.png'
import versusIconUnactive from '../icons/versus-icon-unactive.png'
import settingsIcon from '../icons/settings-icon.png'
import editIcon from '../icons/edit-icon.png'
import BattleHeader from './BattleHeader'
import cameraIcon from '../icons/camera-icon.png'

export default class TabNavigator extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      loading: true,
      animationEnded: false
    };

    this.sessionLogin = this.sessionLogin.bind(this)
    this.setAnimationEnded = this.setAnimationEnded.bind(this)
  }

  componentDidMount() {
    this.sessionLogin()
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

  setAnimationEnded() {
    this.setState({animationEnded: true})
  }

  render() {
    const AuthNavigator = createStackNavigator(
      {
        Login: props => <Login {...props} {...this.props} />,
        Signup: props => <Signup {...props} {...this.props} />,
      },
      {
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false
        }
      }
    )

    const BattleNavigation = createStackNavigator(
      {
        Battle: {
          screen: props => <Battles {...props} {...this.props} />,
          navigationOptions: ({ navigation }) => ({
            title: 'Battle',
            headerRight: (
              <TouchableOpacity onPress={() => navigation.navigate('Upload')}>
                <Image source={cameraIcon} style={{width: 35, height: 35, marginRight: 15}} />
              </TouchableOpacity>
            )
          })
        },
        UserProfile: {
          screen: props => <Profile {...props} selfProfile />,
          navigationOptions: {
            title: 'Profile'
          }
        },
        Upload: {
          screen: props => <Upload {...props} {...this.props} />,
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
          backgroundColor: '#e6ecf0'
        },
        navigationOptions: {
          header: props => <BattleHeader {...props} />,
          headerStyle: {
            backgroundColor: "transparent"
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            color: "#fff",
            fontWeight: '500',
            fontSize: 18
          },
        }
      }
    )

    const InstructionsNavigator = createStackNavigator(
      {
        Welcome: Welcome,
        BattlesInstructions: BattlesInstructions,
        VoteInstructions: VoteInstructions,
        RankingsInstructions: RankingsInstructions,
        Final: Final
      },
      {
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false,
          cardStack: {
            gesturesEnabled: false,
          },
        }
      }
    )

    // const BattleSwitchNavigator = createSwitchNavigator(
    //   {
    //     Battle: BattleNavigation,
    //     Instructions: InstructionsNavigator
    //   }
    // )

    const LeaderboardNavigator = createStackNavigator(
      {
        Leaderboard: {
          screen: createMaterialTopTabNavigator(
            {
              Daily: Daily,
              Weekly: Weekly,
              AllTime: {
                screen: AllTime,
                navigationOptions: {
                  title: 'All Time'
                }
              }
            },
            {
              lazy: true,
              tabBarOptions: {
                activeTintColor: '#739aff',
                inactiveTintColor: '#66757f',
                indicatorStyle: {
                  backgroundColor: '#739aff'
                },
                labelStyle: {
                  fontWeight: '500'
                },
                style: {
                  backgroundColor: 'white',
                }
              }
            }
          ),
          navigationOptions: {
            title: 'Leaderboard'
          }
        },
        UserProfile: {
          screen: Profile,
          navigationOptions: {
            title: 'Profile'
          }
        }
      },
      {
        cardStyle: {
          backgroundColor: '#e6ecf0'
        },
        navigationOptions: {
          header: props => <BattleHeader {...props} />,
          headerStyle: {
            backgroundColor: "transparent"
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            color: "#fff",
            fontWeight: '500',
            fontSize: 18
          },
        }
      }
    )

    const ProfileNavigator = createStackNavigator(
      {
        Profile: {
          screen: props => <Profile {...props} {...this.props} selfProfile />,
          navigationOptions: ({ navigation }) => ({
            title: 'Profile',
            headerLeft: (this.props.state.auth ?
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Image source={settingsIcon} style={{width: 30, height: 30, marginLeft: 15}} />
              </TouchableOpacity>
              :
              null
            ),
            headerRight: (this.props.state.auth ?
              <TouchableOpacity onPress={() => navigation.navigate('Edit')}>
                <Image source={editIcon} style={{width: 30, height: 30, marginRight: 15}} />
              </TouchableOpacity>
              :
              null
            )
          })
        },
        UserProfile: {
          screen: props => <Profile {...props} selfProfile />
        },
        Settings: {
          screen: props => <Settings {...props} {...this.props} />,
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
          backgroundColor: '#e6ecf0'
        },
        navigationOptions: {
          header: props => <BattleHeader {...props} />,
          headerStyle: {
            backgroundColor: "transparent"
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            color: "#fff",
            fontWeight: '500',
            fontSize: 18
          },
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
                tabBarIcon: ({ focused }) => (<Image source={focused ? leaderboardIconActive : leaderboardIconUnactive} style={{width: 40, height: 40, alignItems: 'center'}} />)
              }
            },
            Battles: {
              screen: BattleNavigation,
              navigationOptions: {
                tabBarLabel: 'Battles',
                tabBarIcon: ({ focused }) => (focused ?
                  <LinearGradient colors={['#54d7ff', '#739aff']} style={{width: 50, height: 50, borderRadius: 30, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={versusIconActive} style={{width: 35, height: 35, alignItems: 'center'}} />
                  </LinearGradient>
                  :
                  <View style={{width: 50, height: 50, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderColor: '#66757f', borderWidth: 1}}>
                    <Image source={versusIconUnactive} style={{width: 35, height: 35, alignItems: 'center'}} />
                  </View>
                )
              }
            },
            Profile: {
              screen: ProfileNavigator,
              navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({ focused }) => (<Image source={focused ? accountIconActive : accountIconUnactive} style={{width: 40, height: 40, alignItems: 'center'}} />)
              }
            },
          },
          {
            initialRouteName: 'Battles',
            tabBarOptions: {
              activeTintColor: '#2EC4B6',
              inactiveTintColor: '#66757f',
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
        Instructions: InstructionsNavigator,
        // UserProfile: Profile
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
        <View style={{flex: 1}}>
          <StatusBar barStyle="light-content" />
          <Loading />
        </View>
      )
    } else {
      if (this.state.animationEnded) {
        return (
          <View style={{flex: 1}}>
            <StatusBar barStyle="light-content" />
            <Tabs />
          </View>
        )
      } else {
        return (
          <View style={{flex: 1}}>
            <StatusBar barStyle="light-content" />
            <Splash setAnimationEnded={this.setAnimationEnded}/>
          </View>
        )
      }
    }
  }
}
