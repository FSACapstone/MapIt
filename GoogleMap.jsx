import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createMarker, Marker } from 'google-maps-react';
import firebase from '~/fire';

const db = firebase.firestore();

export default class GoogleMap extends Component {

  constructor() {
    super();
    this.onSearchClick = this.onSearchClick.bind(this);
    this.getCenter = this.getCenter.bind(this);
  }

  getCenter() {
    let center = {
      lat: this.map.getCenter().lat(),
      lng: this.map.getCenter().lng()
    };
    db.collection('maps').add({
      center: center,
      user: this.props.google.user.uid
    });
    console.log(center);
  }

  onSearchClick() {

    const input = document.getElementById('center-point');
    const geocoder = new google.maps.Geocoder();
    const holder = this;
    const { geocode } = geocoder;

    geocode({ address: input.value }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        holder.map.setCenter({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
        holder.map.setZoom(15);
      } else {
        console.log('ERROR: ', status);
      }
    });

  }


  componentDidMount() {
    if (this.props.google.maps) {
      this.loadMap();
    }
  }

  componentDidUpdate() {
    this.loadMap(); // call loadMap function to load the google map
  }

  loadMap() {
    if (this.props && this.props.google) { // checks to make sure that props have been passed
      const { google } = this.props; // sets props equal to google
      const maps = google.maps; // sets maps to google maps props
      const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
      const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node
      const mapConfig = Object.assign({},
        {
          center: google.loc, // sets center of google map to NYC.
          zoom: 2, // sets zoom. Lower numbers are zoomed further out.
          mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
        });
      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.
      const service = new google.maps.places.PlacesService(this.map);
      const defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631)
      );
      const input = document.getElementById('center-point');
      const options = {
        bounds: defaultBounds,
        types: ['establishment']
      };
      const autocomplete = new google.maps.places.Autocomplete(input, options);
    }
  }

  render() {

    const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      width: '70vw', // 90vw basically means take up 90% of the width screen. px also works.
      height: '75vh' // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
    };

    return ( // in our return function you must return a div with ref='map' and style.

      <div>
        <div ref="map" style={style}>
          Loading map...
        </div>

        <input id='center-point' className='controls' type='text' placeholder='search for location' />
        <button onClick={this.onSearchClick}>Center Map</button>
        <button onClick={this.getCenter}>Start Adding Places</button>
      </div>

    );
  }
}
