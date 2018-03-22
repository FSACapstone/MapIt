import React, { Component } from "react";
import Follow from "./Follow";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";

const db = firebase.firestore();

class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numFollowing: 0,
      numFollwer: 0,
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

      db
      .collection("relationships")
      .where("following", "==", userId)
      .get()
      .then(res => this.setState({numFollowers: res.size}))

      db
      .collection("relationships")
      .where("follower", "==", userId)
      .get()
      .then(res => this.setState({numFollowing: res.size}))
  }

  render() {
    const { user, numFollowing, numFollowers } = this.state;
    const signedInUser = this.props.signedInUser;
    const userId = this.props.match.params.uid;
    
    return !user ? (
      <div>Loading...</div>
    ) : (
      <div className="text-align-center">
        <img src={user.photoURL} className="margin-top-5" />
        <h1>{user.displayName}</h1>
        <h2>{user.email}</h2>
        <h2>Following: {numFollowing}</h2>
        <h2>Followers: {numFollowers}</h2>
        <Follow followerId={signedInUser.uid} followingId={userId} />
      </div>
    );
  }
}

export default withRouter(SingleUser);
