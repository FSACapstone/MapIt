import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Map from './components/maps/Map';
import Login from "./Login";
import Sidebar from "./Sidebar";
import SingleUser from "./SingleUser";
import firebase, { auth } from "~/fire";
import NavBar from "./Navbar";
import NewMap from "./NewMap";
import CircularLoad from "./CircularProgress";
import FollowingUsers from "./FollowingUsers";
import FollowersUsers from "./FollowersUsers";
import CreatedMap from "./components/CreatedMap";
import AllMaps from "./components/AllMaps";
import MapView from "./components/MapView"

const db = firebase.firestore();
const maps = db.collection('maps')

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      user: null,
      users: [],
      documentId: "",
      numFollowers: 0,
      numFollowing: 0
    };
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
  };

  logIn = () => {
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
  };

  handleToggle = () => this.setState({ open: !this.state.open });

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ loading: false });
        return;
      }
      db
        .collection("relationships")
        .where("following", "==", user.uid)
        .onSnapshot(querySnapshot => {
          let relationships = [];
          querySnapshot.forEach(doc => {
            relationships.push(doc.data());
          });
          this.setState({ numFollowers: relationships.length });
        });

      db
        .collection("relationships")
        .where("follower", "==", user.uid)
        .onSnapshot(querySnapshot => {
          let relationships = [];
          querySnapshot.forEach(doc => {
            relationships.push(doc.data());
          });
          this.setState({ numFollowing: relationships.length });
        });

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
        })
        .then(() => {
          this.setState({ loading: false });
        });
    });
  }

  render() {
    const { user, documentId, numFollowers, numFollowing } = this.state;
    if (this.state.loading === true)
      return <CircularLoad size={200} color={`secondary`} />;
    if (!user) return <Login user={user} />;
    return (
      <div>
        <NavBar user={user} />
        <div className="position-fixed">
          <Sidebar
            user={user}
            documentId={documentId}
            numFollowers={numFollowers}
            numFollowing={numFollowing}
          />
        </div>
        <div className="wrapper">
          <div className="col-1" />
          <div className="col-2">
            <Switch>
              <Route
                exact path="/"
                render={() => (
                  <Map
                    google={this.props.google}
                    defaultCenter={{lat: 40.7050758, lng: -74.0113437}}
                    defaultZoom={10}
                  />
                )}
              />
              <Route
                exact
                path="/following/:userId"
                render={() => <FollowingUsers />}
              />
              <Route
                exact
                path="/followers/:userId"
                render={() => <FollowersUsers />}
              />
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
                path="/allmaps/:uid"
                render={() => <AllMaps signedInUser={user} />}
              />
              <Route
                exact
                path="/map/:id"
                component={
                  ({match: {params: {id}}}) =>
                    <MapView of={maps.doc(id)} />
                }
              />
              )} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
