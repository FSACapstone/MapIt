import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";

const db = firebase.firestore();

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numFollowing: 0,
      numFollowers: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;
    db
      .collection("relationships")
      .where("following", "==", user.uid)
      .get()
      .then(res => this.setState({ numFollowers: res.size }));

    db
      .collection("relationships")
      .where("follower", "==", user.uid)
      .get()
      .then(res => this.setState({ numFollowing: res.size }));
  }

  handleSubmit(event) {
    event.preventDefault();
    const displayName = event.target.displayName.value;
    const { user } = this.props;

    db
      .collection("users")
      .where("displayName", "==", displayName)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();
          this.props.history.push(`/user/${data.uid}`);
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { numFollowing, numFollowers } = this.state;
    const { user } = this.props;

    return (
      <div id="sidebar">
        <div className="sidebar-1">
          <img src={user.photoURL} />
        </div>
        <div className="sidebar-2">
          <form onSubmit={this.handleSubmit}>
            <input type="text" name="displayName" />
          </form>
          <p>{user.displayName}</p>
          <p>{user.email}</p>
          <p>Following: {numFollowing}</p>
          <p>Followers: {numFollowers}</p>
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);
