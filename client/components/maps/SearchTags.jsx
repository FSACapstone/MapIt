import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Route, Link } from 'react-router-dom'
import firebase from '~/fire'
import { Map as DataMap } from 'fireview'
import Count from '../../Count'

const db = firebase.firestore()

export default class SearchTags extends Component {
  constructor(props) {
    super(props)
    this.state = { value: [] }

    this.handleChange = this.handleChange.bind(this)
  }

  get query() {
    const tag = this.state.value[0]
    let query = db.collection('maps')
    for (const tag of this.state.value) {
      query = query.where(`tags.${tag}`, '==', true)
    }
    return query
  }

  handleChange(evt) {
    const tagsInput = evt.target.value
      .toLowerCase()
      .split(/\s+/)
      .filter(x => x)
    this.setState({ value: tagsInput })
  }

  render() {
    return (
      <div className="text-align-center">
        <h1 className="text-align-center">🌎 Search All Maps 🌍</h1>
        <div className="text-align-center">
          <form>
            <input
              className="controls google-map-input"
              type="text"
              placeholder="Enter tags to search..."
              onChange={this.handleChange}
            />
          </form>
        </div>
        <div className="map-flex-outer text-align-center">
          <DataMap
            from={this.query}
            Render={map => (
              <div className="map-flex-inner" key={map.mid}>
                <Link to={`/map/${map.mid}`}>
                  <img src="/img/pin.png" className="animated bounceInDown" />
                  <h2>{map.title || 'Untitled'}</h2>
                  <h3>
                    <Count of={db.collection('maps').where('mid', '==', map.mid)} /> Likes
                  </h3>
                </Link>
              </div>
            )}
            Empty="No Results"
          />
        </div>
      </div>
    )
  }
}
