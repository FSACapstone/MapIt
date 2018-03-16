import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import GoogleMap from './GoogleMap';
import Login from './Login';
import Sidebar from './Sidebar';
import firebase, { auth } from '~/fire';

export default class App extends Component {
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
    console.log(this.state.user);
    const user = this.state.user;

    return (
      <div>
        <Switch>
          { (user) ?
          <div>
          <Route exact path="/" component={GoogleMap} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/sidebar" render={() => <Sidebar user={user} />} />
          </div>
          :
          <div><h1>Loading...</h1></div>
          }
        </Switch>
      </div>
    )
  }
}
