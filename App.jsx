import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import GoogleMap from './GoogleMap'
import Login from './Login'
import Sidebar from './Sidebar'
import SingleUser from './SingleUser'
import { GoogleApiWrapper } from 'google-maps-react'
import firebase, { auth } from '~/fire'
import NavBar from './Navbar'
import NewMap from './NewMap'
import CircularLoad from './CircularProgress'
import FollowingUsers from './FollowingUsers'
import FollowersUsers from './FollowersUsers'
import CreatedMap from './components/CreatedMap'
import AllMaps from './components/AllMaps'
import Drawer from 'material-ui/Drawer'  
import algoliasearch from 'algoliasearch'

const algolia = algoliasearch(
  '2N7N3I0FJ2', 'd163ceea9b530ca67676dc76cac7ee53'
);

const index = algolia.initIndex('mapstack');
index.setSettings({ hitsPerPage: 3});
import FavoritedMaps from './components/FavoritedMaps'

const db = firebase.firestore()

class App extends Component {
  constructor() {
    super()
    this.state = {
      loading: true,
      user: null,
      users: [],
      documentId: '',
      numFollowers: 0,
      numFollowing: 0,
      left: false,
    }
  }

  logOut = () => {
    auth
      .signOut()
      .then(() => {
        this.setState({
          user: null,
        })
      })
      .catch(err => console.error(err))
  }

  logIn = () => {
    const google = new firebase.auth.GoogleAuthProvider()
    auth
      .signInWithRedirect(google)
      .then(result => {
        const user = result.user
        this.setState({
          user,
        })
      })
      .catch(err => console.error(err))
  }

  handleToggle = () => this.setState({ open: !this.state.open })

  componentDidMount() {
    db
      .collection('users')
      .onSnapshot(querySnapshot => {
        let usersArr = []
        querySnapshot.forEach(doc => {
          const key = doc.id;
          const data = doc.data();
          data.objectID = key;

          usersArr.push(data)
        })
        console.log(usersArr)
        index.saveObjects(usersArr)
        .then(() => console.log('users saved to algolia'))
      })
      

    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user })
      } else {
        this.setState({ loading: false })
        return
      }
      db
        .collection('relationships')
        .where('following', '==', user.uid)
        .onSnapshot(querySnapshot => {
          let relationships = []
          querySnapshot.forEach(doc => {
            relationships.push(doc.data())
          })
          this.setState({ numFollowers: relationships.length })
        })

      db
        .collection('relationships')
        .where('follower', '==', user.uid)
        .onSnapshot(querySnapshot => {
          let relationships = []
          querySnapshot.forEach(doc => {
            relationships.push(doc.data())
          })
          this.setState({ numFollowing: relationships.length })
        })

      db
        .collection('users')
        .where('email', '==', user.email)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            db
              .collection('users')
              .doc(this.state.user.uid)
              .set({
                displayName: this.state.user.displayName,
                email: this.state.user.email,
                photoURL: this.state.user.photoURL,
                uid: this.state.user.uid,
              })
              .then(user => {
                console.log('user added', user)
              })
          }
          this.setState({ documentId: querySnapshot.docs[0].id })
        })
        .then(() => {
          this.setState({ loading: false })
        })
    })
  }

  toggleDrawer = (side, open) => () => {
    console.log(this.state.left)
    this.setState({
      [side]: open,
    })
  }

  render() {
    const { user, documentId, numFollowers, numFollowing } = this.state
    if (this.state.loading === true) return <CircularLoad size={200} color={`secondary`} />
    if (!user) return <Login user={user} />
    return (
      <div>
        <NavBar user={user} toggleDrawer={this.toggleDrawer('left', true)} />
        <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}>
            <Sidebar
              user={user}
              documentId={documentId}
              numFollowers={numFollowers}
              numFollowing={numFollowing}
            />
          </div>
        </Drawer>
        <div className="wrapper">
          <div className="col-1" />
          <div className="col-2">
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <GoogleMap
                    google={{
                      ...this.props.google,
                      loc: { lat: 20, lng: -70 },
                      user: user,
                    }}
                  />
                )}
              />
              )} />
              <Route exact path="/following/:userId" render={() => <FollowingUsers />} />
              <Route
                exact
                path="/favorite-maps"
                render={() => <FavoritedMaps user={user} google={{ ...this.props.google }} />}
              />
              <Route exact path="/followers/:userId" render={() => <FollowersUsers />} />
              <Route
                exact
                path="/:user"
                render={() => <Sidebar user={user} documentId={documentId} />}
              />
              <Route
                exact
                path="/user/:uid"
                render={() => <SingleUser documentId={documentId} signedInUser={user} />}
              />
              <Route
                exact
                path="/newmap/:id"
                render={() => <NewMap google={this.props.google} />}
              />
              <Route exact path="/allmaps/:uid" render={() => <AllMaps signedInUser={user} />} />
              <Route
                exact
                path="/map/:id"
                render={() => (
                  <CreatedMap google={this.props.google} followerUserId={this.state.user.uid} />
                )}
              />
              <Route
                path="/"
                render={() => (
                  <GoogleMap
                    google={{
                      ...this.props.google,
                      loc: { lat: 20, lng: -70 },
                      user: user,
                    }}
                  />
                )}
              />
              )} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBNO9SHxnyzMG6J1FCDYcle7DjXMjg6jBU',
})(App)
