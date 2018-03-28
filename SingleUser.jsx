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
    this.updateUserView(props);
  }

  updateUserView(props) {
    const userId = props.match.params.uid;
    db
      .collection("users")
      .where("uid", "==", userId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(user => {
          this.setState({
            user: user.data()
          })
        }
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
    if (!user.uid) return <CircularLoad size={200} color={`secondary`} />
    return (
      <div className="single-user-flex">
      <div className="">
        <div className="single-user-info-flex">
          <div className="single-user-pic-flex">
            <img src={user.photoURL} />
          </div>
          <div className="single-user-info-secondary-flex">
            <div className="single-user-info-inner-flex">
              <div>
              <h1>{user.displayName}</h1>
              </div>
              <div>
              { (signedInUser.uid !== user.uid) ?
              <Follow followerId={signedInUser.uid} followingId={userId} />
              : <div />
              }
              </div>
            </div>
            <div className="follow-flex animated fadeIn">
              <div>
                <Link to={`/followers/${userId}`}>
                  <p>Followers</p>
                  <p className="text-bold"><Count of={this.followers} /></p>
                </Link>
              </div>
              <div>
                <Link to={`/following/${userId}`}>
                  <p>Following</p>
                  <p className="text-bold"><Count of={this.following} /></p>
                </Link>
              </div>
              <div>
                <Link to="/"><p>Maps </p>
                  <p className="text-bold"><Count of={this.mapsCreated} /></p>
                </Link>
              </div>
            </div>
          </div>
       </div>
      </div>

          <div className="map-flex-outer text-align-center">

          
          {Object.keys(createdMaps).length ?
            Object.keys(createdMaps).map(mapId => {
              return (
                    <div className="map-flex-inner" key={mapId}>
                    <img src="/img/pin.png" className="animated bounceInDown" />
                      <Link to={`/map/${mapId}`}>
                        <h2>
                          {createdMaps[mapId].title}
                        </h2>
                        <h3><Count
                          of={db
                            .collection("favoritedMaps")
                            .where("mapId", "==", mapId)}
                        /> Likes</h3>
                      </Link>

                    </div>
              );
            })
          : <h1>No Maps</h1>
          }
            </div>
      </div>
    )
  }
}
export default withRouter(SingleUser);
