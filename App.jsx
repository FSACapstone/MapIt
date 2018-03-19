import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import GoogleMap from './GoogleMap';
import Login from './Login';
import Sidebar from './Sidebar';
import { GoogleApiWrapper } from 'google-maps-react'
import firebase, { auth } from '~/fire';


const db = firebase.firestore();

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null,
      users: []
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }

      db.collection('users').where('email', '==', user.email)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
            db.collection('users').add({
              displayName: this.state.user.displayName,
              email: this.state.user.email,
              photoURL: this.state.user.photoURL,
              uid: this.state.user.uid
            })
            .then((user) => {
              console.log('user added', user)
            })
        }
      })
    });

    db.collection('users').get().then(querySnapshot => {
      const arrayOfUsers = []
      querySnapshot.forEach( doc => arrayOfUsers.push(doc.data()))
      this.setState({users: arrayOfUsers})
    })
  }

  render() {
    const user = this.state.user;    

    if (!user) return <Login />;
    return (
      <div>
        <Switch>         
            <Route
            exact path="/" render={() => (
            <GoogleMap google={{...this.props.google, loc: {lat: 40.2549, lng: -75.0890}}} />
            )}
            />
            <Route exact path="/login" component={Login} />
            <Route exact path="/:user" render={() => <Sidebar user={user} />} />
            <Route exact path="/:userId" render={() => <SingleUser users={users} />} />
        </Switch>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBNO9SHxnyzMG6J1FCDYcle7DjXMjg6jBU',
})(App)
