import React, { Component } from "react";
import Follow from "./Follow";
import UsersCreatedMaps from "./components/users/UsersCreatedMaps";
import { withRouter,Link } from "react-router-dom";
import firebase from "~/fire";
import Count from './Count'

const db = firebase.firestore();

class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      numFollowers: 0,
      numFollowing: 0,
      user: {},
      relationshipDocId: '',
      relationshipExists: false,
      createdMaps: {}
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
        const mapObj = {};
        querySnapshot.forEach( map => {
          mapObj[map.id] = map.data();
        });
        this.setState({
          createdMaps: mapObj
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

  // Get the maps this user has favorited:
  // get favoritedMaps() {
  //   const userId = this.props.match.params.uid;
  //   return db.collection("favoritedMaps").where("userId", "==", userId);
  // }

  render() {
    const { user, numFollowing, numFollowers, loading } = this.state;
    const { createdMaps } = this.state;
    const signedInUser = this.props.signedInUser;
    const userId = this.props.match.params.uid;

    return !user ? (
      <div>Loading...</div>
    ) : (
      <div className="text-align-center">
        <img src={user.photoURL} className="margin-top-5" />
        <h1>{user.displayName}</h1>
        <Follow followerId={signedInUser.uid} followingId={userId} />
        <div>
          <h2>Following: <Count of={this.following} /></h2>
          <h2>Followers: <Count of={this.followers} /></h2>
        </div>

        <div className="text-align-center">
          <h2>Maps Created (favorited)</h2>
          {
            Object.keys(createdMaps).length && Object.keys(createdMaps).map( mapId => {
              return (
                <Link to ={`/map/${mapId}`} key = {mapId}>
                  <p>
                    {createdMaps[mapId].title} (<Count of={db.collection("favoritedMaps").where("mapId", "==", mapId)} />)
                  </p>
                </Link>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default withRouter(SingleUser);
