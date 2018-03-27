import React, { Component } from "react";
import { Link } from "react-router-dom";
import Follow from "./Follow";
import UsersCreatedMaps from "./components/users/UsersCreatedMaps";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";
import Count from "./Count";

const db = firebase.firestore();

class FollowersUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: [],
      userPage: {}
    };

    this.findFollowers = this.findFollowers.bind(this);
  }

  componentDidMount() {
    this.findFollowers();
    
  }


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
      });
  }

  render() {
    const { followers, userPage } = this.state;
    console.log(this.state);

    return (

        <div className="following-page-flex">
        <h1>{userPage.displayName}</h1> 
        <h1>Followers</h1>
          { Object.keys(followers).length ?
            Object.keys(followers).map(followerId => {
              return (
                <div key={followerId}>
                  <Link to={`/user/${followers[followerId].uid}`}>
                    <img
                      src={followers[followerId].photoURL}
                      className="margin-top-5"
                    />
                  </Link>
                  <h1 className="text-align-center">{followers[followerId].displayName}</h1>
                </div>
              );
            })
            : <div>No followers</div>
          }
        </div>
      );
  }
}

export default withRouter(FollowersUsers);


