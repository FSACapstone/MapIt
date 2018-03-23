import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import GoogleMap from './GoogleMap';
import Login from './Login';
import Sidebar from './Sidebar';
import SingleUser from './SingleUser';
import { GoogleApiWrapper } from 'google-maps-react';
import firebase, { auth } from '~/fire';
import NavBar from './Navbar';
import NewMap from "./NewMap";

const db = firebase.firestore();

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      users: [],
      documentId: '',
      numFollowers: 0,
      numFollowing: 0
    }
  }

  handleToggle = () => this.setState({open: !this.state.open});

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        db
        .collection("relationships")
        .where("following", "==", user.uid)
        .onSnapshot(querySnapshot => {
          let relationships = []
          querySnapshot.forEach(doc => {
            relationships.push(doc.data())
          })
          this.setState({ numFollowers: relationships.length })
      })

      db
        .collection("relationships")
        .where("follower", "==", user.uid)
        .onSnapshot(querySnapshot => {
          let relationships = []
          querySnapshot.forEach(doc => {
            relationships.push(doc.data())
          })
          this.setState({ numFollowing: relationships.length })
      })
    }

      db
        .collection("users")
        .where("email", "==", user.email)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            db
              .collection("users")
              .doc(this.state.user.uid)
              .set({
                displayName: this.state.user.displayName,
                email: this.state.user.email,
                photoURL: this.state.user.photoURL,
                uid: this.state.user.uid,
              })
              .then(user => {
                console.log("user added", user);
              });
          }
          this.setState({ documentId: querySnapshot.docs[0].id });
        });
    });
  }

  render() {
    const {user, documentId, numFollowers, numFollowing } = this.state;

    if (!user) return <Login />;
    return (
      <div>

        <NavBar />

            <div className="position-fixed">
              <Sidebar user={user} documentId={documentId} numFollowers={numFollowers} numFollowing={numFollowing} />
            </div>
        <div className="wrapper">
          <div className="col-1"></div>
          <div className="col-2">
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <GoogleMap
                    google={{
                      ...this.props.google,
                      loc: { lat: 20, lng: 0 },
                      user: user
                    }}
                  />
                )}
              />
              )} />
              <Route exact path="/login" component={Login} />
              <Route
                exact
                path="/:user"
                render={() => <Sidebar user={user} documentId={documentId} />}
              />
              <Route
                exact
                path="/user/:uid"
                render={() => (
                  <SingleUser documentId={documentId} signedInUser={user} />
                )}
              />
              <Route
                exact
                path="/newmap/:id"
                render={() => <NewMap google={this.props.google} />}
              />
            </Switch>
            </div>
            </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBNO9SHxnyzMG6J1FCDYcle7DjXMjg6jBU"
})(App);
