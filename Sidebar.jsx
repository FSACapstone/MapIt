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
    console.log(this.props)
    this.setNumFollowers()
    this.setNumFollowing()
  }

  setNumFollowers() {
    const { user, numFollowers } = this.props;
    db
      .collection("relationships")
      .where("following", "==", user.uid)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges.forEach(change => {
          if (change.type === "added") {
            this.setState(prevState => { 
              return {numFollowers: prevState.numFollowers + 1}
            })
          }
          if (change.type === "removed") {
            this.setState(prevState => { 
              return {numFollowers: prevState.numFollowers - 1}
            })
          }
        })
      })
  }

  setNumFollowing() {
    const { user, numFollowing } = this.props;
    db
      .collection("relationships")
      .where("follower", "==", user.uid)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges.forEach(change => {
          if (change.type === "added") {
            this.setState(prevState => { 
              return {numFollowing: prevState.numFollowing + 1}
            })
          }
          if (change.type === "removed") {
            this.setState(prevState => { 
              return {numFollowing: prevState.numFollowing - 1 }
            })
          }
        })
      })
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

        <div className="sidebar-margin">
          <div>
            <img src={user.photoURL} />
          </div>
       
        <div>
          <p>{user.displayName}</p>
          <p>{user.email}</p>
          <p>Following: {numFollowing}</p>
          <p>Followers: {numFollowers}</p>
        </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);
