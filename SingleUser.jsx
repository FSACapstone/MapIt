import React, { Component } from "react";
import AddFollower from "./AddFollower";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";

const db = firebase.firestore();

class SingleUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      userDocId: ''
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.uid;
    db
      .collection("users")
      .where("uid", "==", userId)
      .get()
      .then(querySnapshot => {
        this.setState({ userDocId: querySnapshot.docs[0].id})
        querySnapshot.forEach(user => this.setState({ user: user.data() }));
      });
  }

  render() {
    const user = this.state.user;
    const signedInUser = this.props.signedInUser
    const documentId = this.props.documentId;
    const userDocId = this.state.userDocId
    
    if (!user) return <div>Loading...</div>;
    return (
      <div>
        <img src={user.photoURL} />
        <h1>{user.displayName}</h1>
        <h2>{user.email}</h2>
        <AddFollower signedInUser={signedInUser} user={user} documentId={documentId} userDocId={userDocId} />
      </div>
    );
  }
}

export default withRouter(SingleUser);
