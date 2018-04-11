import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import firebase from '~/fire';

const db = firebase.firestore();

class LayeredMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: {},
      center: {},
    };
  }

  componentDidMount() {
    db
      .collection('layeredMaps')
      .doc(this.props.match.params.id)
      .get()
      .then(map => {
        console.log(map);
        let placesObj = map.data().places;
        this.setState({ center: map.data().center });
        for (var place in placesObj) {
          let innerPlaces = placesObj[place].places;
          this.setState({ places: { ...this.state.places, ...innerPlaces } });
        }
        const { google } = this.props;
        const maps = google.maps;
        const mapRef = this.refs.layeredMap;
        const node = ReactDOM.findDOMNode(mapRef);
        if (this.state.center.lat) {
          const mapConfig = Object.assign(
            {},
            {
              center: this.state.center,
              zoom: 10,
              mapTypeId: 'roadmap',
            }
          );
          this.map = new maps.Map(node, mapConfig);
          var infowindow = new google.maps.InfoWindow();
          for (place in this.state.places) {
            var currentPlace = this.state.places[place];
            console.log(currentPlace);
            var marker = new google.maps.Marker({
              map: this.map,
              position: { lat: currentPlace.lat, lng: currentPlace.lng },
              icon: 'https://www.google.com/mapfiles/marker_green.png',
            });

            let placeName = currentPlace.name;
            let placeAddress = currentPlace.address;
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.setContent(
                '<div><strong>' + placeName + '</strong><br>Address:' + placeAddress + '</div '
              );
              infowindow.open(this.map, this);
            });
          }
        }
      });
  }

  render() {
    return (
      <div ref="layeredMap" className="google-map">
        Loading map...
      </div>
    );
  }
}

export default withRouter(LayeredMap);
