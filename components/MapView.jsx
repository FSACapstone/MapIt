import React from 'react'
import GoogleMap, { Marker, Info } from './maps/Map'
import { Map } from 'fireview'
import firebase from '~/fire'
import debounce from 'debounce'

const db = firebase.firestore()
const { GeoPoint } = firebase.firestore

const Layer = ({ map }) =>
  <Map from={map.collection('places')}
      Render={
        ({position: {latitude: lat, longitude: lng}}) =>
          <Marker position={{lat, lng}} title="Hello" />
      } />

const tagsAsString = (tags={}) => Object.keys(tags).join(' ')
const { FieldValue } = firebase.firestore

const setTags = ref => ({target: { value }}) =>
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
          onChange={setTags(from)}
          placeholder='Enter tags...'
        />
    }
  />

  const SearchBar = ({ from, style }) =>
    <Map from={from}
      Render={
        ({ place }) =>
          <input
            style={style}
            placeholder='Search for a place...'
          />
      }
    />


export default class Editor extends React.Component {
  state = {
    adding: null,
    center: {}
  }

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
          <input name="name" placeholder='Enter name of place' />
          <input type="submit" value="➕" />
        </form>
      </Info>
    )
  }

  // Put in Cloud Function
  get averageLatLngOfPins() {
    const {of} = this.props
    const latLngObj = {lat: 0, lng: 0}
    let counter = 0
    return of.collection('places').get().then(DocumentSnapshot => {
      DocumentSnapshot.forEach(place => {
        counter++
        let { _lat, _long } = place.data().position
        latLngObj.lat += _lat
        latLngObj.lng += _long
      });
    })
    .then( () => {
      latLngObj.lat = latLngObj.lat / counter
      latLngObj.lng = latLngObj.lng / counter
    })
    .then( () => {
      this.props.of.set({
        center: new GeoPoint(latLngObj.lat, latLngObj.lng)
      }, {merge: true})
    })
    .catch(err => console.error(err))
  }

  componentDidMount() {
    const { of } = this.props
    this.unsubscribe = of
      .get()
      .then(map => {
        return this.setState({
          center: {
            lat: map.data().center._lat,
            lng: map.data().center._long,
          }
        })
      })
      .catch(err => console.error(err))
  }

  render() {
    const { of } = this.props
    const { center } = this.state
    this.averageLatLngOfPins

    return <div style={{position: 'relative'}}>
      {
        Object.keys(center).length &&
        <GoogleMap
          onClick={this.mapWasClicked}
          defaultCenter={center}
          defaultZoom={10}>
          <Layer map={of} />
          {this.addPlaceWindow}
        </GoogleMap>
      }
      <TagInput
        from={of}
        style={{top: '9px', right: '50px', position: 'absolute', zIndex: 100}}
      />
      <SearchBar
        from={of}
        style={{top: '30px', right: '50px', position: 'absolute', zIndex: 100}}
      />
    </div>
  }
}
