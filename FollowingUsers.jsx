import React, { Component } from "react";
import { Link } from "react-router-dom";
import Follow from "./Follow";
import UsersCreatedMaps from "./components/users/UsersCreatedMaps";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";
import Count from "./Count";

const db = firebase.firestore();

class FollowingUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      following: []
    };

    this.findFollowing = this.findFollowing.bind(this);
  }

  componentDidMount() {
    this.findFollowing();
  }

  //   componentWillUnmount() {
  //     this.unsubscribe()
  //   }

  findFollowing() {
    const user = this.props.match.params.userId;
    db
      .collection("relationships")
      .where("follower", "==", user)
      .get()
      .then(querySnapshot => {
        let followingUser = {};
        querySnapshot.forEach(doc => {
          let followingId = doc.data().following;
          db
            .collection("users")
            .doc(followingId)
            .get()
            .then(following => {
              followingUser[followingId] = following.data();
            })
            .then(() => this.setState({ following: followingUser }));
        });
      });
  }

  render() {
    const { following } = this.state;
    const newArr = Object.keys(following);

    return (
      <div className="text-align-center">
        {Object.keys(following).length &&
          Object.keys(following).map(followingId => {
            return (
              <div key={followingId}>
                <Link to={`/user/${followingId}`}>
                  <img
                    src={following[followingId].photoURL}
                    className="margin-top-5"
                  />
                </Link>
                <h1>{following[followingId].displayName}</h1>
                <h2>{following[followingId].email}</h2>
              </div>
            );
          })}
      </div>
    );
  }
}

export default withRouter(FollowingUsers);
