import React, { Component } from "react";
import Follow from "./Follow";
import UsersCreatedMaps from "./components/users/UsersCreatedMaps";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";

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
        querySnapshot.forEach( map => {
          mapTitleArr.push(map.data().title);
        });
        this.setState({
          createdMaps: mapTitleArr
        });
      });
  }

  render() {
    const { user, createdMaps } = this.state;
    const signedInUser = this.props.signedInUser;
    const userId = this.props.match.params.uid;

    return !user ? (
      <div>Loading...</div>
    ) : (
      <div className="text-align-center">
        <img src={user.photoURL} className="margin-top-5" />
        <h1>{user.displayName}</h1>
        <Follow followerId={signedInUser.uid} followingId={userId} />
        <div className="text-align-center">
          <h3>UID: {userId}</h3>
          <h4>Maps created:</h4>
          {
            createdMaps.length && createdMaps.map( mapTitle => {
              return <p>{mapTitle}</p>;
            })
          }
        </div>
      </div>
    );
  }
}

export default withRouter(SingleUser);
