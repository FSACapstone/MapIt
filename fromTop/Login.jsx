import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import firebase, { auth } from "~/fire";
import Button from 'material-ui/Button';
import { AccountCircle } from 'material-ui-icons';

class Login extends Component {
  constructor(props) {
    super(props);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  logOut() {
    auth
      .signOut()
      .then(() => {
        this.setState({
          user: null
        });
      })
      .catch(err => console.error(err));
  }

  logIn() {
    const google = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithRedirect(google)
      .then(result => {
        const user = result.user;
        this.setState({
          user
        });
      })
      .then((user) => this.props.history.push(`/user/${user.uid}`))
      .catch(err => console.error(err));
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="login-wrapper">
        <div className="login-container">
          <AccountCircle className={classes.root} />
          <div className="login-buttons">
            <Button variant="raised" color="secondary" onClick={this.logIn}>Sign In With Google</Button>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  root: {
    // 'color': '#cf0662',
    color: 'white',
    'font-size': '6rem'
  }
};

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Login));
