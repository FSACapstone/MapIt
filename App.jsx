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
import CircularLoad from './CircularProgress';
import CreatedMap from './components/CreatedMap'

const db = firebase.firestore();

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      user: null,
      users: [],
      documentId: '',
      numFollowers: 0,
      numFollowing: 0
    }
  }

    logOut = () => {
      auth
        .signOut()
        .then(() => {
          this.setState({
            user: null
          });
        })
        .catch(err => console.error(err));
    }

    logIn = () =>  {
      const google = new firebase.auth.GoogleAuthProvider();
      auth
        .signInWithRedirect(google)
        .then(result => {
          const user = result.user;
          this.setState({
            user
          });
        })
        .catch(err => console.error(err));
    }

  handleToggle = () => this.setState({open: !this.state.open});

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ loading: false})
        return;
      }
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
        })
        .then(() => {
          this.setState({ loading: false});
        });
  });
}

  render() {
    const {user, documentId, numFollowers, numFollowing } = this.state;
    if (this.state.loading === true) return <CircularLoad />
    if (!user) return <Login user={user} />;
    return (
      <div>
        <NavBar user={user}/>
        <div className="position-fixed">
          <Sidebar user={user} documentId={documentId} numFollowers={numFollowers} numFollowing={numFollowing}/>
        </div>
        <div className="wrapper">
          <div className="col-1" />
          <div className="col-2">
            <Switch>
              <Route
                exact path="/"
                render={() => (
                  <GoogleMap
                    google={{
                      ...this.props.google,
                      loc: { lat: 20, lng: -70 },
                      user: user
                    }}
                  />
                )}
              />
              )} />
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
              <Route
                exact
                path="/map/:id"
                render={() => <CreatedMap google={this.props.google}  />}
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
