import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";

const db = firebase.firestore();

class UsersCreatedMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      createdMaps: []
    };
  }

  componentDidMount() {
    this.fetchUsersCreatedMaps(this.props);
  }

  componentWillReceiveProps(props) {
    this.fetchUsersCreatedMaps(props);
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  fetchUsersCreatedMaps(props) {
    const userId = props.followingId;
    const createdMaps = this.state.createdMaps;
    this.unsubscribe = db
      .collection("maps")
      .where("uid", "==", userId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(map => {
          createdMaps.push(map.data());
        });
      });
  }

  render() {
    const { user, createdMaps } = this.state;
    const userId = this.props.followingId;

    return !user ? (
      <div>Loading...</div>
    ) : (
      <div className="text-align-center">
        <h3>{userId}</h3>
        <h4>Maps created:</h4>
        {createdMaps.length &&
          createdMaps.map(map => {
            console.log(map);
            return <p>{map.title}</p>;
          })}
      </div>
    );
  }
}

export default withRouter(UsersCreatedMaps);
