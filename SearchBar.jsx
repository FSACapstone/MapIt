import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";
const db = firebase.firestore();

class SearchBar extends Component {
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
          let data = doc.data();
          this.props.history.push(`/user/${data.uid}`);
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    

    return (
 
          <form onSubmit={this.handleSubmit}>
            <input type="text" name="displayName" />
          </form>
          
    
    );
  }
}

export default withRouter(SearchBar);
