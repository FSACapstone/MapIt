import React, { Component } from "react";
import AddFollower from "./AddFollower";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";

const db = firebase.firestore();

class SingleUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.uid;
    db
      .collection("users")
      .where("uid", "==", userId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(user => this.setState({ user: user.data() }));
      });
  }

  render() {
    const user = this.state.user;
    const documentId = this.props.documentId;

    if (!user) return <div>Loading...</div>;
    return (
      <div>
        <img src={user.photoURL} />
        <h1>{user.displayName}</h1>
        <h2>{user.email}</h2>
        <AddFollower user={user} documentId={documentId} />
      </div>
    );
  }
}

export default withRouter(SingleUser);
