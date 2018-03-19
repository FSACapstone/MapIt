import React, { Component } from 'react';
import firebase, {auth} from '~/fire'

class Login extends Component {
  constructor() {
    super()
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  logOut() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      })
      .catch(err => console.error(err));
  }

  logIn() {
    const google = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(google)
    .then((result) => {
      const user = result.user;
      this.setState({
        user
      });
    })
    .catch(err => console.error(err));
  }

  render() {
  
    return (
      <div>
        <button onClick={this.logIn}>Sign In With Google</button>
        <button onClick={this.logOut}>Logout</button>
      </div>
    )
  }
}

export default Login;
