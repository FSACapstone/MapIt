import React, { Component } from 'react'
import firebase, { auth } from '~/fire'
import { withRouter } from 'react-router-dom'
// import { QuerySnapshot } from "@google-cloud/firestore";

const db = firebase.firestore()

class SearchMaps extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    let tag = event.target.tag.value.toLowerCase()

    db
      .collection('tags')
      .doc(tag)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.exists) {
          Object.keys(querySnapshot.data()).forEach(map => {
            console.log('map -->', map)
          })
        } else {
          console.log('Tag not found')
        }
        // this.props.history.push(`/user/${data.uid}`);
        // });
      })
      .catch(err => console.error(err))
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input className="google-map-input" name="tag" type="text" placeholder="Search Map Tags" />
      </form>
    )
  }
}

export default withRouter(SearchMaps)
