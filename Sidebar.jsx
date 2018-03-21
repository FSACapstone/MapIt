import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AddFollower from "./AddFollower";
import firebase from "~/fire";

const db = firebase.firestore();

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const displayName = event.target.displayName.value;

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
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);
