import React, { Component } from "react";
import firebase, { auth } from "~/fire";

const db = firebase.firestore();

class AddFollower extends Component {
  constructor(props) {
    super(props);

    this.state = {
      following: false
    };
    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
  }

  // WIP:
  // componentDidMount() {
  //   const { user, documentId, userDocId, signedInUser } = this.props;
  // }

  handleFollow(event) {
    event.preventDefault();

    const { user, documentId, userDocId, signedInUser } = this.props;

    db
      .collection("users")
      .doc(documentId)
      .collection("following")
      .doc(user.uid)
      .set({ uid: user.uid });

    db
      .collection("users")
      .doc(userDocId)
      .collection("followers")
      .doc(signedInUser.uid)
      .set({ uid: signedInUser.uid });
  }

  handleUnfollow(event) {
    event.preventDefault();

    const { user, documentId, userDocId, signedInUser } = this.props;

    db
      .collection("users")
      .doc(documentId)
      .collection("following")
      .doc(user.uid)
      .delete();

    db
      .collection("users")
      .doc(userDocId)
      .collection("followers")
      .doc(signedInUser.uid)
      .delete();
  }

  render() {
    return (
      <div>
        <button onClick={this.handleFollow}>Follow Button</button>
        <button onClick={this.handleUnfollow}>Unfollow Button</button>
      </div>
    );
  }
}

export default AddFollower;
