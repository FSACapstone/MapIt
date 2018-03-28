import React, { Component } from 'react'
// import UsersCreatedMaps from "./components/users/UsersCreatedMaps";
import { withRouter, NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import firebase from '~/fire'
import Count from '../Count'

const db = firebase.firestore()

class AllMaps extends Component {
  constructor(props) {
    super(props)

    this.state = {
      createdMaps: {},
    }
    this.deleteMap = this.deleteMap.bind(this)
  }

  componentDidMount() {
    this.getAllUserMaps()
  }

  getAllUserMaps() {
    const { signedInUser } = this.props
    console.log(signedInUser.uid)
    db
      .collection('maps')
      .where('uid', '==', signedInUser.uid)
      .get()
      .then(querySnapshot => {
        const mapObj = {}
        querySnapshot.forEach(map => {
          mapObj[map.id] = map.data()
        })
        this.setState({
          createdMaps: mapObj,
        })
      })
      .then(() => console.log(this.state))
  }

  deleteMap(mapId) {
    const { signedInUser } = this.props
    db
      .collection('maps')
      .doc(mapId)
      .delete()
      .then(() => {
        db
          .collection('favoritedMaps')
          .where('mapId', '==', mapId)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              db
                .collection('favoritedMaps')
                .doc(doc.id)
                .delete()
            })
          })
          .then(() => this.getAllUserMaps())
      })
  }

  get mapsCreated() {
    const { signedInUser } = this.props
    return db.collection('maps').where('uid', '==', signedInUser.uid)
  }

  render() {
    const { createdMaps } = this.state
    console.log(createdMaps)

    return Object.keys(createdMaps).length ? (
      <div className="text-align-center">
        <h2>
          Maps Created: <Count of={this.mapsCreated} />
        </h2>
        {Object.keys(createdMaps).length &&
          Object.keys(createdMaps).map(mapId => {
            return (
              <div key={mapId}>
                <Link to={`/map/${mapId}`} key={mapId}>
                  <p>
                    {createdMaps[mapId].title} (<Count
                      of={db.collection('favoritedMaps').where('mapId', '==', mapId)}
                    />)
                  </p>
                </Link>
                <Link to={`/newmap/${mapId}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => this.deleteMap(mapId)}>Delete</button>
              </div>
            )
          })}
      </div>
    ) : (
      <div className="text-align-center">
        <h2>You currently have no maps. You should make some!</h2>
      </div>
    )
  }
}

export default withRouter(AllMaps)
