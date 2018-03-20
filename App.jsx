<<<<<<< HEAD
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import GoogleMap from "./GoogleMap";
import Login from "./Login";
import Sidebar from "./Sidebar";
import SingleUser from "./SingleUser";
import { GoogleApiWrapper } from "google-maps-react";
import firebase, { auth } from "~/fire";
=======
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import GoogleMap from './GoogleMap';
import Login from './Login';
import Sidebar from './Sidebar';
import SingleUser from './SingleUser';
import { GoogleApiWrapper } from 'google-maps-react'
import firebase, { auth } from '~/fire';
import NewMap from './NewMap'
>>>>>>> 687b91e9d62ba427f1b6d3fe9de57f9823a6b609

const db = firebase.firestore();

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      users: [],
      documentId: ""
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
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
                uid: this.state.user.uid
              })
              .then(user => {
                console.log("user added", user);
              });
          }
          this.setState({ documentId: querySnapshot.docs[0].id });
        });
    });

    db
      .collection("users")
      .get()
      .then(querySnapshot => {
        const arrayOfUsers = [];
        querySnapshot.forEach(doc => arrayOfUsers.push(doc.data()));
        this.setState({ users: arrayOfUsers });
      });
  }

  render() {
    const user = this.state.user;
    const documentId = this.state.documentId;
    console.log(documentId);

    if (!user) return <Login />;
    return (
      <div>
        <div className="flex-container">
          <Sidebar user={user} documentId={documentId} />
          <div>
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
<<<<<<< HEAD
              <Route exact path="/login" component={Login} />
              <Route
                exact
                path="/user/:uid"
                render={() => (
                  <SingleUser documentId={documentId} signedInUser={user} />
                )}
              />
            </Switch>
          </div>
=======
            )}
          />
          <Route
            exact path="/login"
            component={Login}
          />
          <Route
            exact path="/:user"
            render={() => <Sidebar user={user} documentId={documentId} />}
          />
          <Route
            exact path="/user/:uid"
            render={() =>
              <SingleUser documentId={documentId} signedInUser={user} />
            }
          />
          <Route
            exact path="/newmap/:id"
            render={() =>
              <NewMap google = {this.props.google}/>
            }
          />
        </Switch>
        </div>
>>>>>>> 687b91e9d62ba427f1b6d3fe9de57f9823a6b609
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBNO9SHxnyzMG6J1FCDYcle7DjXMjg6jBU"
})(App);
