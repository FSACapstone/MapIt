import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from '~/fire';
import { withRouter } from "react-router-dom";


const db = firebase.firestore();

class NewMap extends Component {
  constructor(props){
    super(props)
    this.state = {map:{}}
    this.onClick = this.onClick.bind(this)
    //this.onChange = this.onChange.bind(this)
  }
  onClick(event){
    event.preventDefault()
    console.log(event.target.dan.value)
    const {google} = this.props
    const center = new this.props.google.maps.LatLng(this.map.getCenter().lat(),this.map.getCenter().lng())


      const service = new this.props.google.maps.places.PlacesService(this.map);
      console.log(center)
      var request = {
        location: center,
        radius: '500',
        name: event.target.dan.value
      }
      const map = this.map
      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            var center = {lat: place.geometry.location.lat(),
                          lng: place.geometry.location.lng()}
            var marker = new google.maps.Marker({
              position: center,
              map: map,
              title: 'Hello World!'
            });
          }
        }
      }
      service.nearbySearch(request, callback);
  }

  // onChange(event){
  //   console.log(event.target.value)
  //   const service = new google.maps.places.PlacesService(this.map);
  //   console.log(service)
  //   //service.textSearch(request, callback);

  // }
  componentDidMount(){
    db
      .collection('maps')
      .doc(this.props.match.params.id)
      .get()
      .then((map)=>{

      const { google } = this.props; // sets props equal to google
      const maps = google.maps; // sets maps to google maps props
      const mapRef = this.refs.newmap; // looks for HTML div ref 'map'. Returned in render below.
      const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node
      const mapConfig = Object.assign({},

        {
          center: map.data().center, // sets center of google map to NYC.
          zoom: 15, // sets zoom. Lower numbers are zoomed further out.
          mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
        });
      this.map = new maps.Map(node, mapConfig)
      })

  }

  render(){
    const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      width: '90vw', // 90vw basically means take up 90% of the width screen. px also works.
      height: '75vh' // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
    };
    console.log(this.props.match.params.id)
    return(
      <div>
      <div ref="newmap" style={style}>
        Loading map...
      </div>
      <form onSubmit = {this.onClick}>
        <input ref='center' className='controls' type='text' placeholder='search for place' name='dan'/>
        <button type='submit'/>
      </form>
      </div>
    )
  }




}

export default withRouter(NewMap)


