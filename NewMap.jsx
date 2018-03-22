import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from '~/fire';
import { withRouter } from "react-router-dom";
import ResultList from './ResultList'


const db = firebase.firestore();
var markersArray = [];
function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
}
class NewMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: []
    }
    this.onClick = this.onClick.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
  }
  clearSearch() {
    this.setState({ results: [] })
    clearOverlays()

  }

  onButtonForKids = (event) => {
    event.preventDefault();
  }



  onClick(event) {
    event.preventDefault()
    const { google } = this.props
    const center = new this.props.google.maps.LatLng(this.map.getCenter().lat(), this.map.getCenter().lng())

    const service = new this.props.google.maps.places.PlacesService(this.map);
    var request = {
      location: center,
      radius: '1000',
      name: event.target.search.value
    }
    const holder = this
    var infowindow = new google.maps.InfoWindow();
    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        holder.setState({ results: results })
        for (var i = 0; i < results.length; i++) {
          var place1 = results[i];
          var center = {
            lat: place1.geometry.location.lat(),
            lng: place1.geometry.location.lng()
          }
          service.getDetails({
            placeId: place1.place_id
          }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              var marker = new google.maps.Marker({
                map: holder.map,
                position: place.geometry.location
              });
              markersArray.push(marker)
              google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                  'Place ID: ' + place.place_id + '<br>' +
                  place.formatted_address + '<button id="buttonforkids">Add Place</button></div ');
                infowindow.open(holder.map, this);
                const getButton = document.getElementById('buttonforkids');
                getButton.addEventListener('click', function () {
                  marker.setIcon('https://www.google.com/mapfiles/marker_green.png')
                  var obj = {}
                  obj[place.place_id] = true
                  var mapRef = db.collection('maps').doc(holder.props.match.params.id);
                  var getDoc = mapRef.set({
                    places: obj
                  }, { merge: true })
                    .then(doc => {
                      if (!doc.exists) {
                        console.log('No such document!');
                      } else {
                        console.log('Document data:', doc.data());
                      }
                    })
                    .catch(err => {
                      console.log('Error getting document', err);
                    });
                })
              });
            }

          });
        }
      }
      else { console.log('no results') }
    }

    service.nearbySearch(request, callback);
  }

  componentDidMount() {
    db
      .collection('maps')
      .doc(this.props.match.params.id)
      .get()
      .then((map) => {

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

  render() {
    const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      width: '90vw', // 90vw basically means take up 90% of the width screen. px also works.
      height: '75vh' // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
    };
    console.log(this.props.match.params.id)

    return (
      <div>
        <div ref="newmap" style={style}>
          Loading map...
      </div>
        <form onSubmit={this.onClick}>
          <input ref='center' className='controls' type='text' placeholder='search for place' name='search' />
          <button type='submit' />

        </form>
        {(this.state.results.length) ? <ResultList results={this.state.results} id={this.props.match.params.id} /> : <div>no results</div>}
        <button onClick={this.clearSearch}>Clear Search </button>
      </div>
    )
  }




}


export default withRouter(NewMap)


