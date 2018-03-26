import React from 'react'
import GoogleMap, {Marker} from './maps/Map'
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

export default ({ of }) => <div style={{position: 'relative'}}>
  <GoogleMap
    onClick={
      ({latLng}) =>
        of.collection('places').add({
          position: new GeoPoint(latLng.lat(), latLng.lng())
        })
    }
    defaultCenter={{lat: 40.732540, lng: -74.005120}}
    defaultZoom={10}>
    <Layer map={of} />
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
