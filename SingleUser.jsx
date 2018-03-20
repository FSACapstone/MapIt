import React, { Component } from "react";
import Follow from "./Follow";
import Unfollow from "./Unfollow";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";

const db = firebase.firestore();

class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      relationshipExists: false
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.uid;
    const signedInUser = this.props.signedInUser.uid;

    db
      .collection("users")
      .where("uid", "==", userId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(user =>
          this.setState({
            user: user.data()
          })
        );
      });

    db
      .collection("relationships")
      .where("follower", "==", signedInUser)
      .where("following", "==", userId)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          this.setState({
            relationshipExists: true
          });
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    const user = this.state.user;
    const signedInUser = this.props.signedInUser;

    return !user ? (
      <div>Loading...</div>
    ) : (
      <div>
        <img src={user.photoURL} />
        <h1>{user.displayName}</h1>
        <h2>{user.email}</h2>
        {this.state.relationshipExists ? (
          <Unfollow signedInUser={signedInUser} user={user} />
        ) : (
          <Follow signedInUser={signedInUser} user={user} />
        )}
      </div>
    );
  }
}

export default withRouter(SingleUser);
