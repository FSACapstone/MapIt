import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import firebase from "~/fire";
import Count from "./Count";

const db = firebase.firestore();

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
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

  get followers() {
    const { user } = this.props;
    return db.collection("relationships").where("following", "==", user.uid);
  }

  get following() {
    const { user } = this.props;
    return db.collection("relationships").where("follower", "==", user.uid);
  }

  render() {
    const { user } = this.props;

    return (
      <div id="sidebar">
        <div className="sidebar-margin">
          <div>
            <img src={user.photoURL} />
          </div>

          <div>
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="displayName" />
            </form>
            <p>{user.displayName}</p>
            
              <p>
                Following: <Count of={this.following} />
              </p>
            
            <p>
              Followers: <Count of={this.followers} />
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);
