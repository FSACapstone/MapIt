import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withRouter, Link } from "react-router-dom";
import firebase from "~/fire";
import Button from "material-ui/Button";
import React, { Component } from 'react'

const db = firebase.firestore()

class CreatedMap extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
<<<<<<< HEAD
    const { followerUserId } = this.props
    const mapId = this.props.match.params.id
    this.listen(this.props);
    db
      .collection("maps")
      .doc(mapId)
=======
    this.listen(this.props)
    db
      .collection('maps')
      .doc(this.props.match.params.id)
>>>>>>> f1d236f0cd98b0a58887a808533e7fee08689414
      .get()
      .then(map => {
        const dbMapRef = map.data()
        const places = dbMapRef.places
        const { google } = this.props // sets props equal to google
        const maps = google.maps // sets maps to google maps props
        const mapRef = this.refs.createdMap // looks for HTML div ref 'map'. Returned in render below.
        const node = ReactDOM.findDOMNode(mapRef) // finds the 'map' div in the React DOM, names it node
        const mapConfig = Object.assign(
          {},
          {
            center: dbMapRef.center, // sets center of google map to NYC.
            zoom: 15, // sets zoom. Lower numbers are zoomed further out.
            mapTypeId: 'roadmap', // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
          }
        )
        this.map = new maps.Map(node, mapConfig)
        var infowindow = new google.maps.InfoWindow()
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
              map: this.map,
              position: latLng,
              icon: 'https://www.google.com/mapfiles/marker_green.png',
            })
            //marker.id = placeName
            //addedMarkersArr.push(marker)
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.setContent(
                '<div><strong>' + placeName + '</strong><br>Address:' + placeAddress + '</div '
              )
              infowindow.open(this.map, this)
            })
          })()
        }
<<<<<<< HEAD
      });

      db
        .collection("maps")
        .where("uid", "==", followerUserId)
        .onSnapshot(querySnapshot => {
          let maps = []
          querySnapshot.forEach(doc => {
            maps.push(doc.data().mid)
          })
          if (maps.includes(mapId)) {
            return this.setState({ ownMap: true })
          }
          this.setState({ ownMap: false })
        })
=======
      })
>>>>>>> f1d236f0cd98b0a58887a808533e7fee08689414
  }

  componentWillReceiveProps(props) {
    this.listen(props)
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  listen({ followerUserId }) {
    const followingMapId = this.props.match.params.id
    this.unsubscribe = db
      .collection('favoritedMaps')
      .where('userId', '==', followerUserId)
      .where('mapId', '==', followingMapId)
      .onSnapshot(querySnapshot => {
        if (!querySnapshot.empty) {
          return this.setState({
            favoritedMapRef: querySnapshot.docs[0].ref,
            mapFavorited: true,
          })
        }
        this.setState({
          favoritedMapRef: null,
          mapFavorited: false,
        })
      })
  }

  handleFavorite = event => {
    const followingMapId = this.props.match.params.id
    event.preventDefault()
    const { followerUserId } = this.props
    db.collection('favoritedMaps').add({
      userId: followerUserId,
      mapId: followingMapId,
    })
  }

  handleUnfavorite = event => {
    event.preventDefault()
    return this.state.favoritedMapRef.delete()
  }

  render() {
<<<<<<< HEAD
    const { mapFavorited, ownMap } = this.state || {};
    const followingMapId = this.props.match.params.id;
=======
    const { mapFavorited } = this.state || {}
>>>>>>> f1d236f0cd98b0a58887a808533e7fee08689414

    const style = {
      width: '100vw',
      height: '100vh',
    }

    return (
      <div>
        <div className="google-map-buttons text-align-center">
<<<<<<< HEAD
          {
            ownMap ?
            <Link to={`/newmap/${followingMapId}`}>
              <Button variant="raised" color="primary">
                Edit
              </Button>
            </Link>
          :
          mapFavorited ? 
=======
          {mapFavorited ? (
>>>>>>> f1d236f0cd98b0a58887a808533e7fee08689414
            <Button variant="raised" color="primary" onClick={this.handleUnfavorite}>
              Unfavorite
            </Button>
          ) : (
            <Button variant="raised" color="primary" onClick={this.handleFavorite}>
              Favorite
            </Button>
          )}
        </div>
        <div ref="createdMap" className="google-map">
          Loading map...
        </div>
      </div>
    )
  }
}

export default withRouter(CreatedMap)
