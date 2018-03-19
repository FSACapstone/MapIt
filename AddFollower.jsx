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
    const { user, documentId } = this.props;
    db
      .collection("users")
      .doc(documentId)
      .collection("followers")
      .add(user)
      .then(user => console.log("user followed", user));
  }

  render() {
    return <button onClick={this.handleAdd}>Follow Button</button>;
  }
}

export default AddFollower;
