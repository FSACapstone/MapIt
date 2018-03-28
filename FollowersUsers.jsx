import React, { Component } from "react";
import { Link } from "react-router-dom";
import Follow from "./Follow";
import UsersCreatedMaps from "./components/users/UsersCreatedMaps";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";
import Count from "./Count";
import CircularLoad from "./CircularProgress";

const db = firebase.firestore();

class FollowersUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: [],
      userPage: {},
      loading: true
    };

    this.findFollowers = this.findFollowers.bind(this);
  }

  componentDidMount() {
    this.findFollowers();
  }

  //   componentWillUnmount() {
  //     this.unsubscribe()
  //   }

  findFollowers() {
    const user = this.props.match.params.userId;

    db.collection("users")
    .where("uid", "==", user)
    .get()
    .then(querySnapshot => querySnapshot.forEach(doc => this.setState({userPage: doc.data()})));

    db
      .collection("relationships")
      .where("following", "==", user)
      .get()
      .then(querySnapshot => {
        let followerUser = {};
        querySnapshot.forEach(doc => {
          let followerId = doc.data().follower;
          db
            .collection("users")
            .doc(followerId)
            .get()
            .then(follower => {
              followerUser[followerId] = follower.data();
            })
            .then(() => this.setState({ followers: followerUser }));
        });
      })
      .then(() => this.setState({loading: false}));
  }

  render() {
    const { followers, userPage } = this.state;
    if (this.state.loading === true) return <CircularLoad size={200} color={`secondary`} />;
    return (
      <div className="text-align-center">
      <h1>{userPage.displayName}</h1>
      <h2>Followers</h2>
      <div className="following-page-flex">
        {Object.keys(followers).length &&
          Object.keys(followers).map(followersId => {
            return (
              <div key={followersId}>
                <Link to={`/user/${followersId}`}>
                  <img
                    src={followers[followersId].photoURL}
                    className="margin-top-5"
                  />
                </Link>
                <p>{followers[followersId].displayName}</p>
              </div>
            );
          })}
          </div>
      </div>
    );
  }
}

export default withRouter(FollowersUsers);


