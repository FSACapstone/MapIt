import React, { Component } from "react";
import firebase, { auth } from "~/fire";
import { withRouter } from "react-router-dom";

const db = firebase.firestore();

class Follow extends Component {
  constructor(props) {
    super(props);

    this.handleFollow = this.handleFollow.bind(this);
  }

  // WIP:
  // componentDidMount() {
  //
  // }

  handleFollow(event) {
    event.preventDefault();
    const { user, signedInUser } = this.props;
    db
      .collection("relationships")
      .add({
        follower: signedInUser.uid,
        following: user.uid
      })
      .then( () => {
        this.props.history.push(`/user/${user.uid}`);
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <button onClick={this.handleFollow}>Follow</button>
      </div>
    );
  }
}

export default withRouter(Follow);
