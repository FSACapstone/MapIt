import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import GoogleMap from './GoogleMap';
import Login from './Login';
import Sidebar from './Sidebar';
import { GoogleApiWrapper } from 'google-maps-react'
import firebase, { auth } from '~/fire';

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null
    }
  }





  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  render() {

    const user = this.state.user;
    if (!user) return <Login />;
    return (
      <div>
        <Switch>
          <Route
            exact path="/" render={() => (
              <GoogleMap google={{ ...this.props.google, loc: { lat: 20, lng: 0 } }} />
            )}
          />
          <Route exact path="/newmap" render={() => (
            <GoogleMap />
          )} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/sidebar" render={() => <Sidebar user={user} />} />
        </Switch>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBNO9SHxnyzMG6J1FCDYcle7DjXMjg6jBU',
})(App)



