import React, { Component } from "react";
import Follow from "./Follow";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";

const db = firebase.firestore();

class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      relationshipDocId: "",
      relationshipExists: false
    };
  }

  componentDidMount() {
    this.updateUserView(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateUserView(props);
  }

  updateUserView(props) {
    const userId = props.match.params.uid;
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
  }

  render() {
    const user = this.state.user;
    const signedInUser = this.props.signedInUser
    const userId = this.props.match.params.uid;
    
    return !user ? (
      <div>Loading...</div>
    ) : (
      <div className="text-align-center">
        <img src={user.photoURL} className="margin-top-5" />
        <h1>{user.displayName}</h1>
        <h2>{user.email}</h2>
        <Follow followerId={signedInUser.uid} followingId={userId} />
      </div>
    );
  }
}

export default withRouter(SingleUser);
