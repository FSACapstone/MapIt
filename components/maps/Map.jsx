import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";
import Button from "material-ui/Button";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";
import { Search } from "material-ui-icons";

import GoogleConsumer from '../GoogleApi'

import createReactContext from 'create-react-context'

const db = firebase.firestore();

const { Provider, Consumer } = createReactContext(null)

export const Marker = props =>
  <Consumer>{
      map => map && <RenderMarker map={map} {...props} />
  }</Consumer>

class RenderMarker extends Component {
  componentDidMount() {
    this.marker = new google.maps.Marker(this.props)
  }

  componentWillUnmount() {
    this.marker.setMap(null)
  }

  render() {
    return null
  }
}

class GoogleMap extends Component {
  componentDidMount() {
    this.loadMap(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadMap(props);
  }

  loadMap({ google, onClick }) {
    if (!google) return;

    const maps = google.maps;
    const node = this.refs.map;

    const map = new maps.Map(node,
      {
      center: this.props.defaultCenter,
      zoom: this.props.defaultZoom,
      mapTypeId: "roadmap"
    });

    onClick && map.addListener('click', onClick)
    this.setState({map})
  }

  render() {
    const {map=null} = this.state || {}
    return <Provider value={map}>{
      <div ref="map" className="google-map">{
        this.props.children
      }</div>
    }</Provider>
  }
}

export default
  props => <GoogleConsumer>{
    google => <GoogleMap {...props} google={google} />
  }</GoogleConsumer>
