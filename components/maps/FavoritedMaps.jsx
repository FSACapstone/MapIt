import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import firebase from '~/fire';
import Checkbox from 'material-ui/Checkbox';
import ReactDOM from 'react-dom';
import CirclularProgress from '../CircularProgress';

const db = firebase.firestore();

class FavoritedMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maps: [],
      checkedMaps: [],
      loading: true,
      center: {},
      createMap: false,
      layerMap: false,
    };
  }

  onSaveClick = e => {
    e.preventDefault();
    let places = {};
    for (var i = 0; i < this.state.checkedMaps.length; i++) {
      places[this.state.checkedMaps[i].title] = {
        places: this.state.checkedMaps[i].places,
      };
    }
    db
      .collection('layeredMaps')
      .add({
        places: places,
        uid: this.props.user.uid,
        center: this.state.center,
        name: e.target.name.value,
      })
      .then(map => {
        console.log(map.id);
        let id = map.id;
        db
          .collection('layeredMaps')
          .doc(id)
          .set(
            {
              mid: id,
            },
            { merge: true }
          );
      });
    this.props.history.push(`/layered-maps`);
  }

  onCreateClick = e => {
    e.preventDefault();
    this.setState({ createMap: !this.state.createMap });
  }

  onLayerClick = e => {
    e.preventDefault();
    var { google } = this.props;
    let newCenter = {
      lat: 0,
      lng: 0,
    };
    this.state.checkedMaps.map(map => {
      newCenter.lat += map.center.lat;
      newCenter.lng += map.center.lng;
    });
    newCenter = {
      lat: newCenter.lat / this.state.checkedMaps.length,
      lng: newCenter.lng / this.state.checkedMaps.length,
    };
    this.setState({ center: newCenter });
    const mapRef = this.refs.newmap;
    const node = ReactDOM.findDOMNode(mapRef);
    const mapConfig = Object.assign(
      {},

      {
        center: newCenter, // sets center of google map to NYC.
        zoom: 12, // sets zoom. Lower numbers are zoomed further out.
        mapTypeId: 'roadmap', // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
      }
    );
    var infowindow = new google.maps.InfoWindow();

    this.map = new google.maps.Map(node, mapConfig);
    this.state.checkedMaps.map(map => {
      var places = map.places;
      for (var place in places) {
        (() => {
          var internalPlaceObj = places[place];
          var latLng = {
            lat: internalPlaceObj.lat,
            lng: internalPlaceObj.lng,
          };
          var placeName = internalPlaceObj.name;
          var placeAddress = internalPlaceObj.address;
          var marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            map: this.map,
            position: latLng,
            icon: 'https://www.google.com/mapfiles/marker_green.png',
          });
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(
              '<div><strong>' +
                placeName +
                '</strong><br>Address:' +
                placeAddress +
                '<br> From:' +
                map.title +
                '</div> '
            );
            infowindow.open(this.map, this);
          });
        })();
      }
    });
    this.setState({ layerMap: true });
  }

  onCheckClick = (event, checked) => {
    if (checked) {
      let filtered = this.state.maps;
      filtered = filtered.filter(map => {
        return map.mid === event.target.value;
      });
      this.setState({ checkedMaps: [...this.state.checkedMaps, ...filtered] });
    } else {
      let filt = this.state.checkedMaps;
      filt = filt.filter(map => {
        return map.mid !== event.target.value;
      });
      console.log(filt);
      this.setState({
        checkedMaps: filt,
      });
    }
  }
  componentDidUpdate() {
    const mapRef = this.refs.map;
    const node = ReactDOM.findDOMNode(mapRef);
    const mapConfig = Object.assign(
      {},

      {
        center: { lat: 20, lng: -70 }, // sets center of google map to NYC.
        zoom: 2, // sets zoom. Lower numbers are zoomed further out.
        mapTypeId: 'roadmap', // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
      }
    );
    var infowindow = new google.maps.InfoWindow();

    this.map = new google.maps.Map(node, mapConfig);
  }
  componentDidMount() {
    var uid = this.props.user.uid;
    var google1 = this.props.google;
    console.log(this.props);
    db
      .collection('favoritedMaps')
      .where('userId', '==', uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(map => {
          db
            .collection('maps')
            .where('mid', '==', map.data().mapId)
            .get()
            .then(querySnapshot =>
              querySnapshot.forEach(nestMap => {
                this.setState({ maps: [...this.state.maps, nestMap.data()] });
              }));
        });
      })
      .then(() => this.setState({ loading: false }));
  }

  render() {
    if (this.state.loading === true) return <CirclularProgress size={200} color="secondary" />;
    const styles = {
      block: {
        maxWidth: 250,
      },
      checkbox: {
        marginBottom: 16,
      },
    };

    const style = {
      width: '100vw',
      height: '100vh',
    };

    return (
      <div>
        <div ref="map" className="google-map-favorite" style={style} />
        <div ref="newmap" className="google-map-favorite" style={style} />
        <div className="favorite-map-controls text-align-center">
          <h2>Favorite Maps</h2>
          {this.state.maps.length ? (
            <div style={styles.block}>
              {this.state.maps.map(map => {
                return (
                  <p key={map.mid}>
                    {this.state.createMap ? (
                      <Checkbox
                        type="checkbox"
                        value={map.mid}
                        onChange={this.onCheckClick}
                        color="primary"
                        style={styles.checkbox}
                      />
                    ) : null}
                    <Link to={`map/${map.mid}`}>{map.title} </Link>
                  </p>
                );
              })}
              {this.state.checkedMaps.length ? (
                <div>
                  <button className="favorite-map-controls-buttons" onClick={this.onLayerClick}>
                    Stack Map
                  </button>
                </div>
              ) : null}
              {!this.state.createMap && (
                <button className="favorite-map-controls-buttons" onClick={this.onCreateClick}>
                  Create A Stacked Map
                </button>
              )}
              {this.state.layerMap &&
                this.state.checkedMaps.length && (
                  <form onSubmit={this.onSaveClick}>
                    <input name="name" className="" placeholder="Enter Map Name" required />
                    <button className="favorite-map-controls-buttons" type="submit">
                      Save Stacked Map
                    </button>
                  </form>
                )}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withRouter(FavoritedMaps);
