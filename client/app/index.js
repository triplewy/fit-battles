import React, { Component } from 'react'
import { connect } from 'react-redux'
import Navigation from './navigation/navigation.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }
  render () {
    return (
      <Navigation {...this.props}/>
    )
  }
}

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
