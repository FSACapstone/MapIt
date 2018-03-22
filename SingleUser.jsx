import React, { Component } from "react";
import Follow from "./Follow";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";
import Count from './Count'

const db = firebase.firestore();

class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numFollowers: 0,
      numFollowing: 0,
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
    // this.setFollowerFollowingState(props);
    // this.updateNumFollowers(props);
    // this.updateNumFollowing(props);
  }

  // componentWillUnmount() {
  //   this.unsubscribe && this.unsubscribe()
  // }


  // updateNumFollowers(props) {
  //   const userId = props.match.params.uid;
  //   const { initialNumFollwer } = this.state;
  //   db
  //     .collection("relationships")
  //     .where("following", "==", userId)
  //     .onSnapshot(querySnapshot => {
  //       querySnapshot.docChanges.forEach(change => {
  //         if (change.type === "added") {
  //           this.setState({ numFollowers: this.state.numFollowers + 1 });
  //         }
  //         if (change.type === "removed") {
  //           // this.setState(prevState => {
  //           //   return { numFollowers: prevState.numFollowers - 1 };
  //           // });
  //           this.setState({ numFollowers: this.state.numFollowers - 1})
  //         }
  //       });
  //     });
  // }

  // updateNumFollowing(props) {
  //   const userId = props.match.params.uid;
  //   db
  //     .collection("relationships")
  //     .where("follower", "==", userId)
  //     .onSnapshot(querySnapshot => {
  //       querySnapshot.docChanges.forEach(change => {
  //         if (change.type === "added") {
  //           // this.setState(prevState => {
  //           //   return { numFollowing: prevState.numFollowing + 1 };
  //           // });
  //           this.setState({ numFollowing: this.state.numFollowing + 1 })
  //         }
  //         if (change.type === "removed") {
  //           // this.setState(prevState => {
  //           //   return { numFollowing: prevState.numFollowing - 1 };
  //           // });
  //           this.setState({ numFollowing : this.state.numFollowing - 1 })
  //         }
  //       });
  //     });
  // }

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

  get followers() {
    const userId = this.props.match.params.uid;
    return db.collection("relationships").where("following", "==", userId)
  }

  get following() {
    const userId = this.props.match.params.uid;
    return db.collection("relationships").where("follower", "==", userId)
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
        <h2>Following: <Count of={this.following} /></h2>
        <h2>Followers: <Count of={this.followers} /></h2>
        <Follow followerId={signedInUser.uid} followingId={userId} />
      </div>
    );
  }
}

export default withRouter(SingleUser);
