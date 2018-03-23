import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from '~/fire';
import { withRouter } from "react-router-dom";
import ResultList from './ResultList'

const db = firebase.firestore();

var searchMarkersArray = [];
var addedMarkersArr = [];

function clearOverlays(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].setMap(null);
  }
  arr.length = 0;
}
class NewMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      places: {}
    }
    this.onClick = this.onClick.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
  }

  clearSearch() {
    this.setState({ results: [] })
    clearOverlays(searchMarkersArray)
    var search = this.refs.center
    search.value = ''
  }

  addPlace = (marker, place, infowindow) => {

    //marker.setIcon('https://www.google.com/mapfiles/marker_green.png')
    infowindow.close()
    var obj = {}
    marker.id = place.place_id
    addedMarkersArr.push(marker)
    marker.setMap(null)
    console.log(place);
    obj[place.place_id] = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      name: place.name,
      address: place.formatted_address,
    }
    var mapRef = db.collection('maps').doc(this.props.match.params.id);
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
  }

  removePlace = (marker) => {
    marker.setMap(null)
    var thisHolder = this
    addedMarkersArr.map((addedMarker) => {
      if (marker.id === addedMarker.id) {
        console.log('nothing')
      }
      else return addedMarker
    })
    var ref = db.collection('maps').where('mid', '==', this.props.match.params.id).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var placeObj = doc.data().places;
        var holder = marker.id
        delete placeObj[holder]
        var mapRef = db.collection('maps').doc(thisHolder.props.match.params.id);
        var getDoc = mapRef.update({
          places: placeObj
        })
      });
    }
    )
  }

  onClick = (event) => {
    event.preventDefault()
    if (searchMarkersArray.length) {
      clearOverlays()
    }

    const { google } = this.props
    const center = new this.props.google.maps.LatLng(this.map.getCenter().lat(), this.map.getCenter().lng())
    const service = new this.props.google.maps.places.PlacesService(this.map);
    const holder = this

    var request = {
      location: center,
      radius: '1000',
      name: event.target.search.value
    }
    var infowindow = new google.maps.InfoWindow();
    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        holder.setState({ results: results })
        for (var i = 0; i < results.length; i++) {
          if (holder.state.places[results[i].place_id]) {
            console.log('hello dan')
          }
          else {
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
                searchMarkersArray.push(marker)
                google.maps.event.addListener(marker, 'click', function () {
                  infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                    'Place ID: ' + place.place_id + '<br>' +
                    place.formatted_address + '<button id="addPlaceButton">Add Place</button></div ');
                  infowindow.open(holder.map, this);
                  const getButton = document.getElementById('addPlaceButton');
                  getButton.addEventListener('click', () => { holder.addPlace(marker, place, infowindow) })
                });
              }
            });
          }
        }
      }
      else { console.log('no results') }
    }
    service.nearbySearch(request, callback);
  }

  componentDidMount() {
    db.collection('maps').doc(this.props.match.params.id).set({
      mid: this.props.match.params.id
    }, { merge: true })

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
        var isthis = this
        const service1 = new this.props.google.maps.places.PlacesService(this.map);
        const defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(-33.8902, 151.1759),
          new google.maps.LatLng(-33.8474, 151.2631)
        );
        const input = document.getElementById('center'); // use a ref instead
        const options = {
          bounds: defaultBounds,
        };
        const autocomplete = new google.maps.places.Autocomplete(input, options);
        var checkedMap = db.collection('maps').doc(this.props.match.params.id).onSnapshot(function (doc) {
          var infowindow = new google.maps.InfoWindow();

          const arr = doc.data().places
          isthis.setState({ places: arr })
          const keysArr = Object.keys(arr)
          clearOverlays(addedMarkersArr)
          for (var i = 0; i < keysArr.length; i++) {
            (() => {
              var latLng = { lat: arr[keysArr[i]].lat, lng: arr[keysArr[i]].lng }
              var placeName = keysArr[i]
              var placeInfo=arr[placeName];
              var marker = new google.maps.Marker({
                map: isthis.map,
                position: latLng,
                icon: ('https://www.google.com/mapfiles/marker_green.png')
              });
              marker.id = placeName
              addedMarkersArr.push(marker)
              google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<div><strong>Work in Progress</strong><br>' +
                  'Place:' + placeInfo.name + 'Address' + placeInfo.address+ '<br><button id="removePlaceButton">Remove Place</div ');
                infowindow.open(isthis.map, this);
                const getButton = document.getElementById('removePlaceButton');
                getButton.addEventListener('click', () => { isthis.removePlace(marker) })
              });
            })()
          }
        })
      })
  }

  render() {
    const style = {
      width: '90vw',
      height: '75vh'
    };
    return (
      <div>
        <div ref="newmap" style={style}>
          Loading map...
      </div>
        <form onSubmit={this.onClick}>
          <input ref='center' id='center' className='controls' type='text' placeholder='search for place' name='search' />
          <button type='submit' />
        </form>
        <button onClick={this.clearSearch}>Clear Search </button>
      </div>
    )
  }
}

export default withRouter(NewMap);

