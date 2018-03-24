import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { withRouter } from "react-router-dom";
import firebase from "~/fire";

const db = firebase.firestore();

class CreatedMap extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    db
      .collection('maps')
      .doc(this.props.match.params.id)
      .get()
      .then((map) => {
        const dbMapRef = map.data()
        const places = dbMapRef.places
        console.log(places)

        const { google } = this.props; // sets props equal to google
        const maps = google.maps; // sets maps to google maps props
        const mapRef = this.refs.createdMap; // looks for HTML div ref 'map'. Returned in render below.
        const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node
        const mapConfig = Object.assign({},

          {
            center: dbMapRef.center, // sets center of google map to NYC.
            zoom: 15, // sets zoom. Lower numbers are zoomed further out.
            mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
          });
        this.map = new maps.Map(node, mapConfig)
        var infowindow = new google.maps.InfoWindow();
        for(var place in places){
          (() => {
            var internalPlaceObj = places[place]
            var latLng = { lat: internalPlaceObj.lat, lng: internalPlaceObj.lng }
            var placeName = internalPlaceObj.name
            var placeAddress = internalPlaceObj.address
            var marker = new google.maps.Marker({
              map: this.map,
              position: latLng,
              icon: ('https://www.google.com/mapfiles/marker_green.png')
            });
            //marker.id = placeName
            //addedMarkersArr.push(marker)
            google.maps.event.addListener(marker, 'click', function () {
              infowindow.setContent('<div><strong>' +
                  placeName + '</strong><br>Address:' + placeAddress+ '</div ');
              infowindow.open(this.map, this);
            });
          })()
        }
  })
}

  componentWillReceiveProps() {}


  updateUserView() {}

  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    };

    return (
      <div ref="createdMap" className="google-map">
          Loading map...
        </div>
    );
  }
}

export default withRouter(CreatedMap);
