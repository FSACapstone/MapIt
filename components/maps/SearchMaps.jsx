import React, { Component } from "react";
import firebase, { auth } from "~/fire";
import { withRouter } from "react-router-dom";

const db = firebase.firestore();

class SearchMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapResults: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    let tag = event.target.tag.value.toLowerCase();
    this.fetchMapResults(tag);
  }

  fetchMapResults(tag) {
    const searchResults = [];
    db
      .collection("tags")
      .doc(tag)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.exists) {
          Object.keys(querySnapshot.data()).forEach(map => {
            searchResults.push(map);
          });
        }
      })
      .then( () => {
        this.setState({
          mapResults: searchResults
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className="google-map-input"
          name="tag"
          type="text"
          placeholder="Search Map Tags"
        />
      </form>
    );
  }
}

export default withRouter(SearchMaps);
