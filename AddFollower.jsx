import React, { Component } from "react";
import firebase, { auth } from "~/fire";

const db = firebase.firestore();

class AddFollower extends Component {
  constructor(props) {
    super(props);

    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd(event) {
    event.preventDefault();
    const { user, documentId, userDocId, signedInUser } = this.props;
    console.log(user);
    console.log(signedInUser)
    db
      .collection("users")
      .doc(documentId)
      .collection("following")
      .add(user)
      .then(user => console.log("user followed", user));

    db
      .collection("users")
      .doc(userDocId)
      .collection("followers")
      .add({
        displayName: signedInUser.displayName,
        email: signedInUser.email,
        photoURL: signedInUser.photoURL,
        uid: signedInUser.uid
      })
      .then(user => console.log("user is a follower", user));
  }

  render() {
    return <button onClick={this.handleAdd}>Follow Button</button>;
  }
}

export default AddFollower;
