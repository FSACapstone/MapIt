import React, { Component } from "react";
import firebase, { auth } from "~/fire";
import { withRouter } from "react-router-dom";

const db = firebase.firestore();

class Unfollow extends Component {
  constructor(props) {
    super(props);

    this.handleUnfollow = this.handleUnfollow.bind(this);
  }

  // WIP:
  // componentDidMount() {
  //
  // }

  handleUnfollow(event) {
    event.preventDefault();
    const { user, signedInUser } = this.props;
    db
      .collection("relationships")
      .where("follower", "==", signedInUser.uid)
      .where("following", "==", user.uid)
      .get()
      .then(querySnapshot => {
        db
          .collection("relationships")
          .doc(querySnapshot.docs[0].id)
          .delete();
      })
      .then( () => {
        this.props.history.push(`/user/${user.uid}`);
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <button onClick={this.handleUnfollow}>Unfollow</button>
      </div>
    );
  }
}

export default withRouter(Unfollow);
