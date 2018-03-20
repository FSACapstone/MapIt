import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AddFollower from "./AddFollower";
import firebase from "~/fire";

const db = firebase.firestore();

class Sidebar extends Component {
  constructor(props) {
    super(props);

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
          let data = doc.data()
          this.props.history.push(`/user/${data.uid}`);
        });      
      })
      .catch(err => console.error(err));
  }

  render() {
    const {user, documentId} = this.props;
    console.log(user);

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="displayName" />
        </form>
        <img src={user.photoURL} />
        <h1>{user.displayName}</h1>
        <h2>{user.email}</h2>
        <AddFollower user={user} documentId={documentId} />
      </div>
    );
  }
}

export default withRouter(Sidebar);
