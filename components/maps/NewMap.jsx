import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router-dom';
import firebase from '~/fire';
import GoogleMapButton from './GoogleMapButton';

const db = firebase.firestore();
const searchMarkersArray = [];
const addedMarkersArr = [];

function clearOverlays(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].setMap(null);
  }
  arr.length = 0;
}

class NewMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      places: {},
    };
    this.onClick = this.onClick.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  clearSearch() {
    this.setState({ results: [] });
    clearOverlays(searchMarkersArray);
    let search = this.refs.center;
    search.value = '';
  }

  addPlace = (marker, place, infowindow) => {
    infowindow.close();
    const obj = {};
    marker.id = place.place_id;
    addedMarkersArr.push(marker);
    marker.setMap(null);
    obj[place.place_id] = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      name: place.name,
      address: place.formatted_address,
    };
    const mapRef = db.collection('maps').doc(this.props.match.params.id);
    const getDoc = mapRef
      .set(
        {
          places: obj,
        },
        { merge: true }
      )
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

  removePlace = marker => {
    marker.setMap(null);
    let thisHolder = this;
    addedMarkersArr.map(addedMarker => {
      if (marker.id === addedMarker.id) {
        console.log('nothing');
      } else {
        return addedMarker;
      }
    });
    const ref = db
      .collection('maps')
      .where('mid', '==', this.props.match.params.id)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let placeObj = doc.data().places;
          let holder = marker.id;
          delete placeObj[holder];
          const mapRef = db.collection('maps').doc(thisHolder.props.match.params.id);
          const getDoc = mapRef.update({
            places: placeObj,
          });
        });
      });
  }

  onClick = event => {
    event.preventDefault();
    const placeArr = [];
    if (searchMarkersArray.length) {
      clearOverlays(searchMarkersArray);
    }
    const { google } = this.props;
    const center = new this.props.google.maps.LatLng(
      this.map.getCenter().lat(),
      this.map.getCenter().lng()
    );
    const service = new this.props.google.maps.places.PlacesService(this.map);
    const holder = this;
    const request = {
      location: center,
      bounds: this.map.getBounds(),
      name: event.target.search.value,
    };
    const infowindow = new google.maps.InfoWindow();
    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        holder.setState({ results: results });
        for (let i = 0; i < results.length; i++) {
          if (!holder.state.places[results[i].place_id]) {
            let place1 = results[i];
            const center = {
              lat: place1.geometry.location.lat(),
              lng: place1.geometry.location.lng(),
            };
            service.getDetails(
              {
                placeId: place1.place_id,
              },
              function(place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  const marker = new google.maps.Marker({
                    map: holder.map,
                    position: place.geometry.location,
                  });
                  searchMarkersArray.push(marker);
                  placeArr.push(place);
                  google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(
                      '<div><strong>' +
                        place.name +
                        '</strong><br>' +
                        place.formatted_address +
                        '<button id="addPlaceButton">Add Place</button></div '
                    );
                    infowindow.open(holder.map, this);
                    const getButton = document.getElementById('addPlaceButton');
                    getButton.addEventListener('click', () => {
                      holder.addPlace(marker, place, infowindow);
                    });
                  });
                }
              }
            );
          }
        }
      } else {
        alert('Sorry! No results found.');
      }
    }
    service.nearbySearch(request, callback);
  }

  componentDidMount() {
    db
      .collection('maps')
      .doc(this.props.match.params.id)
      .set(
        {
          mid: this.props.match.params.id,
        },
        { merge: true }
      );
    db
      .collection('maps')
      .doc(this.props.match.params.id)
      .get()
      .then(map => {
        const { google } = this.props; // sets props equal to google
        const maps = google.maps; // sets maps to google maps props
        const mapRef = this.refs.newmap; // looks for HTML div ref 'map'. Returned in render below.
        const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node
        const mapConfig = Object.assign(
          {},
          {
            center: map.data().center, // sets center of google map to NYC.
            zoom: 15, // sets zoom. Lower numbers are zoomed further out.
            mapTypeId: 'roadmap', // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
          }
        );
        this.map = new maps.Map(node, mapConfig);
        let isthis = this;
        const service1 = new this.props.google.maps.places.PlacesService(this.map);
        let options = {
          bounds: this.map.getBounds(),
        };
        const input = document.getElementById('center'); // use a ref instead
        const autocomplete = new google.maps.places.Autocomplete(input, options);
        google.maps.event.addListener(this.map, 'idle', function() {
          autocomplete.setBounds(isthis.map.getBounds());
        });
        const checkedMap = db
          .collection('maps')
          .doc(this.props.match.params.id)
          .onSnapshot(function(doc) {
            const infowindow = new google.maps.InfoWindow();
            const arr = doc.data().places;
            isthis.setState({ places: arr });
            const keysArr = Object.keys(arr);
            clearOverlays(addedMarkersArr);
            for (let i = 0; i < keysArr.length; i++) {
              (() => {
                const latLng = { lat: arr[keysArr[i]].lat, lng: arr[keysArr[i]].lng };
                let placeName = keysArr[i];
                let placeInfo = arr[placeName];
                const marker = new google.maps.Marker({
                  map: isthis.map,
                  position: latLng,
                  icon: 'https://www.google.com/mapfiles/marker_green.png',
                });
                marker.id = placeName;
                addedMarkersArr.push(marker);
                google.maps.event.addListener(marker, 'click', function() {
                  infowindow.setContent(
                    '<div><strong>' +
                      placeInfo.name +
                      '</strong><br>Address: ' +
                      placeInfo.address +
                      '<br><button id="removePlaceButton">Remove Place</div '
                  );
                  infowindow.open(isthis.map, this);
                  const getButton = document.getElementById('removePlaceButton');
                  getButton.addEventListener('click', () => {
                    isthis.removePlace(marker);
                  });
                });
              })();
            }
          });
      });
  }

  get mapReference() {
    return db.collection('maps').doc(this.props.match.params.id);
  }

  render() {
    const style = {
      width: '100vw',
      height: '100vh',
    };
    let { signedInUser } = this.props;
    return (
      <div>
        <div className="google-map-buttons text-align-center">
          <form onSubmit={this.onClick}>
            <input
              ref="center"
              id="center"
              className="google-map-input google-input-margin"
              type="text"
              placeholder="Search for a place..."
              name="search"
            />
            <GoogleMapButton type="submit" text="Drop Pin" />
            {<GoogleMapButton onClick={this.clearSearch} text="Clear Search" />}
            <Link to={`/user/${signedInUser.uid}`}>
              <GoogleMapButton type="submit" text="Save Map" />
            </Link>
          </form>
        </div>
        <div ref="newmap" className="google-map margin-subtract-70">
          Loading map...
        </div>
      </div>
    );
  }
}

export default withRouter(NewMap);
