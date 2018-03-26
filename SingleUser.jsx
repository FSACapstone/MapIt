import React, { Component } from "react";
import Follow from "./Follow";
import UsersCreatedMaps from "./components/users/UsersCreatedMaps";
import { withRouter, Link } from "react-router-dom";
import firebase from "~/fire";
import Count from "./Count";
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
      relationshipDocId: "",
      relationshipExists: false,
      createdMaps: {}
    };
  }

  componentDidMount() {
    this.updateUserView(this.props);
  }

  componentWillReceiveProps(props) {
    this.setState({ loading: true });
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
        querySnapshot.forEach(map => {
          mapObj[map.id] = map.data();
        });
        this.setState({
          createdMaps: mapObj
        });
      })
      .then(() => this.setState({ loading: false }));
  }

  get followers() {
    const userId = this.props.match.params.uid;
    return db.collection("relationships").where("following", "==", userId);
  }

  get following() {
    const userId = this.props.match.params.uid;
    return db.collection("relationships").where("follower", "==", userId);
  }

  get mapsCreated() {
    const userId = this.props.match.params.uid;
    return db.collection("maps").where("uid", "==", userId);
  }

  render() {
    const {
      user,
      numFollowing,
      numFollowers,
      loading,
      createdMaps
    } = this.state;
    const signedInUser = this.props.signedInUser;
    const userId = this.props.match.params.uid;

    return loading ? (
      <CircularLoad color={`secondary`} size={100} />
    ) : (
      <div className="single-user-flex">
        <div className="map-container">
          <div className="map-flex-outer">
          {Object.keys(createdMaps).length &&
            Object.keys(createdMaps).map(mapId => {
              return (
                    <div className="map-flex">
                      <div className="map-flex-inner map-flex-color">
                      <Link to={`/map/${mapId}`} key={mapId}>
                        <p>
                          {createdMaps[mapId].title} (<Count
                            of={db
                              .collection("favoritedMaps")
                              .where("mapId", "==", mapId)}
                          /> Pins)
                        </p>
                      </Link>
                      </div>
                    </div>
              );
            })}
            </div>
        </div>
        {signedInUser.uid === userId ? (
          <div />
        ) :
        <div className="single-user-info-flex map-container">
          <div className="text-align-center">
            <img src={user.photoURL} />
            <h1>{user.displayName}</h1>
            <div className="follow-flex">
              <div className="follow-flex-inner">
                <Link to={`/followers/${userId}`}>
                  <p>
                    Followers
                  </p>
                  <p>
                    <Count of={this.followers} />
                  </p>
                </Link>
              </div>
              <div className="follow-flex-inner">
                <Link to={`/following/${userId}`}>
                  <p>
                    Following
                  </p>
                  <p>
                    <Count of={this.following} />
                  </p>
                </Link>
              </div>
              <div className="follow-flex-inner">
                <Link to={`/`}><p>Maps </p> 
                <p><Count of={this.mapsCreated} /></p>
                </Link>
              </div>
            </div>           
              <Follow followerId={signedInUser.uid} followingId={userId} />           
          </div>
        
        </div>
      }
      </div>
    );
  }
}

export default withRouter(SingleUser);
