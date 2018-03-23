import React, { Component } from "react";
import Follow from "./Follow";
import UsersCreatedMaps from "./components/users/UsersCreatedMaps";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";
import Count from "./Count";

const db = firebase.firestore();

class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      relationshipDocId: "",
      relationshipExists: false,
      createdMaps: []
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
      .collection("maps")
      .where("uid", "==", userId)
      .get()
      .then(querySnapshot => {
        const mapTitleArr = [];
        querySnapshot.forEach(map => {
          mapTitleArr.push(map.data().title);
        });
        this.setState({
          createdMaps: mapTitleArr
        });
      });
  }

  get followers() {
    const userId = this.props.match.params.uid;
    return db.collection("relationships").where("following", "==", userId);
  }

  get following() {
    const userId = this.props.match.params.uid;
    return db.collection("relationships").where("follower", "==", userId);
  }

  render() {
    const { user } = this.state;
    const { createdMaps } = this.state;
    const signedInUser = this.props.signedInUser;
    const userId = this.props.match.params.uid;
    console.log(user.uid, userId);
    // return !user ? (
    //   <div>Loading...</div>
    // ) : (
      return (
      <div className="text-align-center">
        <img src={user.photoURL} className="margin-top-5" />
        <h1>{user.displayName}</h1>
        <h2>{user.email}</h2>
        {
          user.uid !== userId && <Follow followerId={signedInUser.uid} followingId={userId} />
        }
        <h2>
          Following: <Count of={this.following} />
        </h2>
        <h2>
          Followers: <Count of={this.followers} />
        </h2>
        <Follow followerId={signedInUser.uid} followingId={userId} />
        <div className="text-align-center">
          <h3>UID: {userId}</h3>
          <h4>Maps created:</h4>
          {createdMaps.length &&
            createdMaps.map(mapTitle => {
              return <p>{mapTitle}</p>;
            })}
        </div>
      </div>
    );
  }
}

export default withRouter(SingleUser);
