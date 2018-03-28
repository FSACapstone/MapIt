import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import firebase from '~/fire'
import Checkbox from 'material-ui/Checkbox'
import ReactDOM from 'react-dom'
import CirclularProgress from '../CircularProgress'

const db = firebase.firestore()

class FavoritedMaps extends Component {
  constructor(props) {
    super(props)
    this.state = {
      maps: [],
      checkedMaps: [],
      loading: true,
      center: {},
    }
  }

  onSaveClick = e => {
    e.preventDefault()
    console.log(this.state.checkedMaps)
    let places = {}
    for (var i = 0; i < this.state.checkedMaps.length; i++) {
      places[this.state.checkedMaps[i].title] = {
        places: this.state.checkedMaps[i].places,
      }
    }
    db.collection('layeredMaps').add({
      places: places,
      uid: this.props.user.uid,
    })
  }

  onLayerClick = e => {
    e.preventDefault()
    var { google } = this.props
    let newCenter = {
      lat: 0,
      lng: 0,
    }
    this.state.checkedMaps.map(map => {
      newCenter.lat += map.center.lat
      newCenter.lng += map.center.lng
    })
    newCenter = {
      lat: newCenter.lat / this.state.checkedMaps.length,
      lng: newCenter.lng / this.state.checkedMaps.length,
    }
    this.setState({ center: newCenter })
    const mapRef = this.refs.newmap
    const node = ReactDOM.findDOMNode(mapRef)
    const mapConfig = Object.assign(
      {},

      {
        center: newCenter, // sets center of google map to NYC.
        zoom: 12, // sets zoom. Lower numbers are zoomed further out.
        mapTypeId: 'roadmap', // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
      }
    )
    var infowindow = new google.maps.InfoWindow()

    this.map = new google.maps.Map(node, mapConfig)
    this.state.checkedMaps.map(map => {
      var places = map.places
      for (var place in places) {
        ;(() => {
          var internalPlaceObj = places[place]
          var latLng = {
            lat: internalPlaceObj.lat,
            lng: internalPlaceObj.lng,
          }
          var placeName = internalPlaceObj.name
          var placeAddress = internalPlaceObj.address
          var marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            map: this.map,
            position: latLng,
            icon: 'https://www.google.com/mapfiles/marker_green.png',
          })
          //marker.id = placeName
          //addedMarkersArr.push(marker)
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(
              '<div><strong>' +
                placeName +
                '</strong><br>Address:' +
                placeAddress +
                '<br> From:' +
                map.title +
                '</div> '
            )
            infowindow.open(this.map, this)
          })
        })()
      }
    })
  }

  onCheckClick = (event, checked) => {
    if (checked) {
      let filtered = this.state.maps
      filtered = filtered.filter(map => {
        return map.mid === event.target.value
      })
      this.setState({ checkedMaps: [...this.state.checkedMaps, ...filtered] })
    } else {
      let filt = this.state.checkedMaps
      filt = filt.filter(map => {
        return map.mid !== event.target.value
      })
      console.log(filt)
      this.setState({
        checkedMaps: filt,
      })
    }
  }
  componentDidMount() {
    var uid = this.props.user.uid
    db
      .collection('favoritedMaps')
      .where('userId', '==', uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(map => {
          db
            .collection('maps')
            .where('mid', '==', map.data().mapId)
            .get()
            .then(querySnapshot =>
              querySnapshot.forEach(nestMap => {
                this.setState({ maps: [...this.state.maps, nestMap.data()] })
              })
            )
        })
      })
      .then(() => this.setState({ loading: false }))
  }

  render() {
    if (this.state.loading === true) return <CirclularProgress size={200} color={'secondary'} />
    const styles = {
      block: {
        maxWidth: 250,
      },
      checkbox: {
        marginBottom: 16,
      },
    }

    const style = {
      width: '80vw',
      height: '80vh',
    }

    return (
      <div>
        {this.state.checkedMaps.length ? (
          <div>
            <button onClick={this.onLayerClick} className="favorited-map-button">
              Layer Map
            </button>
            <button className="layered-save-button" onClick={this.onSaveClick}>
              {' '}
              Save Layered Map{' '}
            </button>
          </div>
        ) : (
          <div />
        )}

        <div ref="newmap" className="google-map" style={style} />

        {this.state.maps.length ? (
          <div style={styles.block}>
            {' '}
            {this.state.maps.map(map => {
              return (
                <p key={map.mid}>
                  <Checkbox
                    className="margin-top-5"
                    value={map.mid}
                    onChange={this.onCheckClick}
                    style={styles.checkbox}
                  />
                  {map.title}
                </p>
              )
            })}
          </div>
        ) : (
          <div />
        )}
      </div>
    )
  }
}

export default withRouter(FavoritedMaps)

//this.state.checkedMaps.length
//   ? this.state.checkedMaps.map(map => {
//     return <div key={map.mid} className='margin-top-5'> {map.title} </div>
//   })
//   : <div></div>
// }
// {this.state.checkedMaps.length
//   ? <button onClick={this.onLayerClick} className="favorited-map-button">Layer Map</button>
//   : <div></div>
// }
