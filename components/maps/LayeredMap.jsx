import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom'
import firebase from '~/fire'
import Button from 'material-ui/Button'

const db = firebase.firestore()

class LayeredMap extends Component {
  constructor(props) {
    super(props)
    this.state ={
      places: {},
      center:{}
    }
  }

  componentDidMount() {
    db
      .collection('layeredMaps')
      .doc(this.props.match.params.id)
      .get()
      .then(map => {
        let placesObj = map.data().places
        this.setState({center: map.data().center})
        for(var place in placesObj){
          let innerPlaces = placesObj[place].places
          this.setState({places:{...this.state.places, ... innerPlaces }})
        }
        const { google } = this.props // sets props equal to google
        const maps = google.maps // sets maps to google maps props
        const mapRef = this.refs.layeredMap // looks for HTML div ref 'map'. Returned in render below.
        const node = ReactDOM.findDOMNode(mapRef) // finds the 'map' div in the React DOM, names it node
        if(this.state.center.lat){
        const mapConfig = Object.assign(
          {},
          {
            center: this.state.center, // sets center of google map to NYC.
            zoom: 10, // sets zoom. Lower numbers are zoomed further out.
            mapTypeId: 'roadmap', // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
          }
        )
        this.map = new maps.Map(node, mapConfig)
        var infowindow = new google.maps.InfoWindow()
        for(place in this.state.places){

          var currentPlace = this.state.places[place]
          console.log(currentPlace)
          var marker = new google.maps.Marker({
            map: this.map,
            position: {lat:currentPlace.lat,lng:currentPlace.lng},
            icon: 'https://www.google.com/mapfiles/marker_green.png',
          })

          let placeName = currentPlace.name
          let placeAddress = currentPlace.address
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(
              '<div><strong>' + placeName + '</strong><br>Address:' + placeAddress + '</div '
            )
            infowindow.open(this.map, this)
          })
        }




      }

      })



      //var infowindow = new google.maps.InfoWindow()
  }




  render() {

    return (
      <div ref="layeredMap" className="google-map">
      Loading map...
    </div>

    )
  }
}

export default withRouter(LayeredMap)
