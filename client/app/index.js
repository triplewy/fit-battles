import React from 'react'
import { SafeAreaView, AppState } from 'react-native'
import Navigation from './navigation/navigation.js'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };

    this.handleAppStateChange = this.handleAppStateChange.bind(this)

  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange(appState) {
    if (appState === 'background') {
      console.log("app is in background");
    }
  }

  render () {
    return (
      <Navigation />
    )
  }
}
