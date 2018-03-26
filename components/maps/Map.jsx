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

export const MapConsumer = Consumer

export const Marker = props =>
  <Consumer>{
      map => map && <RenderMarker map={map} {...props} />
  }</Consumer>

export const Info = props =>
  <Consumer>{
      map => map && <RenderInfoWindow map={map} {...props} />
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

class RenderInfoWindow extends Component {
  node = document.createElement('div')

  componentDidMount() {
    this.win = new google.maps.InfoWindow({
      content: this.node,
      ...this.props,
    })
    this.win.addListener('close', console.log)
  }

  componentWillReceiveProps(props) {
    if (props.position !== this.props.position)
      this.win.setPosition(props.position)
  }

  componentWillUnmount() {
    this.win.close()
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.node)
  }
}

class GoogleMap extends React.PureComponent {
  componentDidMount() {
    this.setup(this.props);
  }

  componentWillReceiveProps(props) {
    this.setup(props);
  }

  setup({ google, onClick }) {
    if (!google) return;

    const map = this.initMap(google)

    onClick && map.addListener('click', onClick)
  }

  initMap(google) {
    if (this.map) return this.map

    const maps = google.maps;
    const node = this.refs.map;

    const map = new maps.Map(node,
      {
      center: this.props.defaultCenter,
      zoom: this.props.defaultZoom,
      mapTypeId: this.props.defaultType || "roadmap"
    });

    this.map = map
    this.setState({map})

    return map
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
