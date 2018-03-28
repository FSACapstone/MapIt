import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import { createMarker, Marker } from "google-maps-react";
import firebase from "~/fire";
import Button from "material-ui/Button";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";
import { Search } from "material-ui-icons";

const db = firebase.firestore();
let tags;
let title;
class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onCreateClick = this.onCreateClick.bind(this);
    this.createNewMap = this.createNewMap.bind(this);

    this.state = {
      openNewForm: false,
      centerMap: false,
      title: "",
      tags: "",
      center: {}
    };
  }

  onSubmitMapInfo = e => {
    e.preventDefault();
    this.createNewMap();
  };

  onChange = e => {
    e.preventDefault();
    if (e.target.name === "title") {
      title = e.target.value;
    } else if (e.target.name === "tags") {
      tags = e.target.value.split(" ").map(tag => tag.toLowerCase().replace(/^#/, ""));
    }
  };

  onCreateClick(e) {
    e.preventDefault()
    this.setState({center:{
      lat: this.map.getCenter().lat(),
      lng: this.map.getCenter().lng()
    }})
    this.setState({ openNewForm: !this.state.openNewForm })
  }

  mapInput(event) {
    event.preventDefault();
  }

  createNewMap() {
    // let center = {
    //   lat: this.map.getCenter().lat(),
    //   lng: this.map.getCenter().lng()
    // };

    this.setState({center:{
      lat: this.map.getCenter().lat(),
      lng: this.map.getCenter().lng()
    }})

    db
      .collection("maps")
      .add({
        center: this.state.center,
        uid: this.props.google.user.uid,
        places: {},
        title: title
      })
      .then(map => {
        let mapId = map.id;
        this.props.history.push(`/newmap/${mapId}`);
        tags.forEach(tag => {
          db
            .collection("tags")
            .doc(tag)
            .set({ [mapId]: true }, { merge: true });
        });
      });
  }

  onSearchClick() {
    const input = document.getElementById("center-point");
    const geocoder = new google.maps.Geocoder();
    const holder = this;
    const { geocode } = geocoder;

    geocode({ address: input.value }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        const center = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        holder.setState({ center });
        holder.map.setCenter(center);
        holder.map.setZoom(15);
      } else {
        console.log("ERROR: ", status);
      }
    });

    this.setState({ centerMap: true });
  }

  componentDidMount() {
    if (this.props.google.maps) {
      this.loadMap();
    }
  }

  componentDidUpdate() {
    this.loadMap();
  }

  loadMap() {
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;
      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);
      let defaultCenter;
      let zoom;

      if (this.state.center.lat) {
        defaultCenter = this.state.center;
        zoom = 15;
      } else {
        defaultCenter = google.loc;
        zoom = 3;
      }
      const mapConfig = Object.assign(
        {},
        {
          center: defaultCenter, // sets center of google map to NYC.
          zoom, // sets zoom. Lower numbers are zoomed further out.
          mapTypeId: "roadmap" // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
        }
      );
      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.
      const service = new google.maps.places.PlacesService(this.map);
      const defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631)
      );
      const input = document.getElementById("center-point"); // use a ref instead
      const options = {
        bounds: defaultBounds
        // types: ['establishment']
      };
      const autocomplete = new google.maps.places.Autocomplete(input, options);
    }
  }

  render() {
    const { classes } = this.props;
    const { openNewForm, centerMap } = this.state;

    const style = {
      width: "100vw",
      height: "100vh"
    };

    return (
      <div>
        {!openNewForm && (
          <div className="google-map-buttons text-align-center">
            <input
              id="center-point"
              className="controls google-map-input"
              type="text"
              placeholder="Search Locations"
            />
            <Button
              variant="raised"
              color="primary"
              className={classes.button}
              onClick={this.onSearchClick}
            >
              Center Map
            </Button>
            {centerMap && (
              <Button
                variant="raised"
                color="primary"
                onClick={this.onCreateClick}
              >
                Create New Map
              </Button>
            )}
          </div>
        )}

        {openNewForm && (
          <div className="google-map-buttons-2 text-align-center">
            <form onSubmit={this.onSubmitMapInfo} onChange={this.onChange}>
              <input
                name="title"
                className="google-map-input google-input-margin"
                placeholder="New Map Name"
                required
              />
              <input
                name="tags"
                className="google-map-input google-input-margin"
                placeholder="Enter Hashtags"
                required
              />
              <Button
                variant="raised"
                color="primary"
                className={classes.button}
                type="submit"
              >
                Submit
              </Button>
            </form>
            <Button
              variant="raised"
              color="primary"
              className={classes.button}
              type="text"
              onClick={this.onCreateClick}
            >
              Back
            </Button>
          </div>
        }
        <div ref="map" className="google-map margin-subtract-70">
          Loading map...
        </div>
      </div>
    );
  }
}

GoogleMap.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    "border-radius": "5px"
  }
});

export default withStyles(styles)(withRouter(GoogleMap));
