import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import GoogleMap from './GoogleMap';
import Login from './Login';
import Sidebar from './Sidebar';
import SingleUser from './SingleUser';
import { GoogleApiWrapper } from 'google-maps-react'
import firebase, { auth } from '~/fire';

const db = firebase.firestore();

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null,
      users: [],
      documentId: ''
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
                uid: this.state.user.uid
              .then((user) => {
                console.log('user added', user)
              })
            }
            this.setState({ documentId: querySnapshot.docs[0].id });
        })
    });

    db.collection('users').get().then(querySnapshot => {
      const arrayOfUsers = []
      querySnapshot.forEach(doc => arrayOfUsers.push(doc.data()))
      this.setState({ users: arrayOfUsers })
    })
  }

  render() {
    const user = this.state.user;
    const documentId = this.state.documentId;
    console.log(documentId)

    if (!user) return <Login />;
    return (
      <div>
        <div className="flex-container">
            <Sidebar user={user} documentId={documentId} />
          <div>
            <Switch>
              <Route
                exact path="/" render={() => (
                  <GoogleMap
                    google=
                    {{
                      ...this.props.google,
                      loc: { lat: 20, lng: 0 },
                      user: user
                    }}
                  />
                )}
              />
              <Route
                exact path="/login"
                component={Login}
              />
              <Route
                exact path="/user/:uid"
                render={() =>
                  <SingleUser documentId={documentId} signedInUser={user} />
                }
              />
            </Switch>
            </div>
          </div>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBNO9SHxnyzMG6J1FCDYcle7DjXMjg6jBU',
})(App);
