import React, { Component } from "react";
import Follow from "./Follow";
import UsersCreatedMaps from "./components/users/UsersCreatedMaps";
import { withRouter, NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import firebase from "~/fire";
import Count from './Count';
import CircularLoad from "./CircularProgress";

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
    this.setState({loading: true});
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
      })
    
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
      })
      .then(() => this.setState({ loading: false}));
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

    return (loading) ? (
      <div className="text-align-center">
      <CircularLoad color={`secondary`} size={100} />
      </div>
    ) : 
      (
      <div className="text-align-center">
        <img src={user.photoURL} className="margin-top-5" />
        <h1>{user.displayName}</h1>
        <h2>{user.email}</h2>
        {
          signedInUser.uid === userId
          ? <div />
          : <Follow followerId={signedInUser.uid} followingId={userId} />
        }
        <NavLink to={`/following/${userId}`}>
          <h2>
            Following: <Count of={this.following} />
          </h2>
        </NavLink> 
        <NavLink to={`/followers/${userId}`}>
          <h2>
            Followers: <Count of={this.followers} />
          </h2>
        </NavLink>
       
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
