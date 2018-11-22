import React, { Component } from 'react';
import initStore from './app/redux/store'
import { Provider } from 'react-redux'
import Home from './app/index';

const store = initStore()

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}

export default App
