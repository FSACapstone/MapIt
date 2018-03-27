import React from 'react'
import GoogleMap, {Marker, Info} from './maps/Map'
import {Map} from 'fireview'
import firebase from '~/fire'
import debounce from 'debounce'

const {GeoPoint} = firebase.firestore

const Layer = ({ map }) =>
  <Map from={map.collection('places')}
      Render={
        ({position: {latitude: lat, longitude: lng}}) =>
          <Marker position={{lat, lng}} title="Hello" />
      } />

const tagsAsString = (tags={}) => Object.keys(tags).join(' ')
const {FieldValue} = firebase.firestore

const setTags = ref => ({target: {value}}) =>
  writeTags(ref, value)

const writeTags = debounce(
  async (ref, value) => {
    await ref.update({tags: FieldValue.delete()})
    ref.set({
      tags: Object.assign(
        ...value.toLowerCase()
          .split(/\s+/)
          .filter(x => x)
          .map(tag => ({ [tag]: true }))
      )
    }, {merge: true})
  },
  200)

const TagInput = ({ from, style }) =>
  <Map from={from}
    Render={
      ({ tags }) =>
        <input
          style={style}
          defaultValue={tagsAsString(tags)}
          onChange={setTags(from)} />
    } />


export default class Editor extends React.Component {
  state = {adding: null}

  mapWasClicked = ({latLng}) =>
    this.setState({adding: latLng})

  addPlace = latLng => evt => {
    evt.preventDefault()
    return this.props.of.collection('places').add({
      position: new GeoPoint(latLng.lat(), latLng.lng()),
      name: evt.target.name.value
    }).then(() => this.setState({adding: null}))
  }

  get addPlaceWindow() {
    const {adding} = this.state
    if (!adding) return null
    return (
      <Info position={adding}>
        <form onSubmit={this.addPlace(adding)}>
          <input name="name" />
          <input type="submit" value="➕" />
        </form>
      </Info>
    )
  }

  render() {
    const {of} = this.props

    return <div style={{position: 'relative'}}>
      <GoogleMap
        onClick={this.mapWasClicked}
        defaultCenter={{lat: 40.732540, lng: -74.005120}}
        defaultZoom={10}>
        <Layer map={of} />
        {this.addPlaceWindow}
      </GoogleMap>
      <TagInput
        from={of}
        style={{
          top: '9px',
          right: '9px',
          position: 'absolute',
          zIndex: 500000,
        }} />
    </div>
  }
}
