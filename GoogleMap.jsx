import React, {Component} from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class GoogleMap extends Component {
render() {
    return (
      <Map google={this.props.google} zoom={14}>

        <Marker
        onClick={this.onMarkerClick}
        name={'Current location'}
        />

        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>hi</h1>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBNO9SHxnyzMG6J1FCDYcle7DjXMjg6jBU")
})(GoogleMap)
