import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import firebase from "~/fire";
const db = firebase.firestore();
import { InstantSearch, Hits, SearchBox } from "react-instantsearch/dom";
// import Input from "material-ui/Input/Input";

class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchInput: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.listen = this.listen.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault()
    const displayName = event.target.displayName.value

    db
      .collection('users')
      .where('displayName', '==', displayName)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data()
          this.props.history.push(`/user/${data.uid}`)
        })
      })
      .catch(err => console.error(err))
  }

  Product({ hit }) {
    return ( 
      <Link to={`/user/${hit.uid}`}>
        <div>{hit.displayName}</div>
      </Link>
    )
  }

  listen(event) {
    this.setState({ searchInput: event.target.value })
  }

  render() {
    const { searchInput } = this.state
    return (
      <InstantSearch
        appId="2N7N3I0FJ2"
        apiKey="e1d7b8a057d7aba7aa839301a7552153"
        indexName="mapstack"
      >

        <SearchBox
          onChange={(event) => this.listen(event)}
          className="google-map-input"
          name="name"
          type="text"
          placeholder="Search Users"
        />
        {
          searchInput !== '' ?
          <div className="absoluteP">
            <Link to="">
              <Hits hitComponent={this.Product} />
            </Link>
          </div>
          : null
        }
      </InstantSearch>
    );
  }
}

export default withRouter(SearchBar)

// <input className='google-map-input' name="displayName" type='text' placeholder='Search Users' />
// <input type="text" name="displayName" />
