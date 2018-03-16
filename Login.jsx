import React, { Component } from 'react';
import firebase, {auth} from '~/fire'

class Login extends Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {

  }

  handleClick() {
    const google = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(google);
  
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Sign In With Google</button>
      </div>
    )
  }
}

export default Login;