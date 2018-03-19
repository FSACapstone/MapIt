import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { createMarker, Marker } from 'google-maps-react'
import CitySearch from './CitySearch'

export default class GoogleMap extends Component {

  constructor(){
    super()
  }


  componentDidMount() {
    if(this.props.google.maps){
      console.log('did mount')
    this.loadMap()}}


  componentDidUpdate() {

    (console.log('did update'))
    this.loadMap(); // call loadMap function to load the google map
  }

  loadMap() {
    //var location= {lat: 40.2549, lng:-75.0890}
    if (this.props && this.props.google) { // checks to make sure that props have been passed
      const {google} = this.props; // sets props equal to google
      const maps = google.maps; // sets maps to google maps props

      const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
      const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node
      const mapConfig = Object.assign({}, {

        center: google.loc, // sets center of google map to NYC.
        zoom: 2, // sets zoom. Lower numbers are zoomed further out.
        mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
      })

      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.
      var service = new google.maps.places.PlacesService(this.map)


      var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631));

        // var input = document.getElementById('pac-input');
        // var options = {
        //   bounds: defaultBounds,
        //   types: ['establishment']
        // };

      //var autocomplete = new google.maps.places.Autocomplete(input, options);


    }
  }

  render() {

    const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      width: '90vw', // 90vw basically means take up 90% of the width screen. px also works.
      height: '75vh' // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
    }

    return ( // in our return function you must return a div with ref='map' and style.

     <div>
      <div ref="map" style={style}>
        loading map...
      </div>

      <CitySearch props = {this.props}/>
      <button onClick = {()=>{
        var c=this.map.getCenter()
        console.log(c.lat(),c.lng())
      }}/>
    </div>

    )
  }
}




