import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router-dom'
import firebase from '~/fire'
import debounce from 'debounce'
import { Map as DataMap } from 'fireview'

const db = firebase.firestore()

const tagsAsString = (tags = {}) => Object.keys(tags).join(' ')
const { FieldValue } = firebase.firestore

const setTags = ref => ({ target: { value } }) => writeTags(ref, value)

const writeTags = debounce(async (ref, value) => {
    await ref.update({ tags: FieldValue.delete() })
    ref.set(
        {
            tags: Object.assign(
                ...value
                    .toLowerCase()
                    .split(/\s+/)
                    .filter(x => x)
                    .map(tag => ({ [tag]: true })),
            ),
        },
        { merge: true },
    )
}, 200)

const TagInput = ({ from, style }) => (
    <DataMap
        from={from}
        Render={({ tags }) => (
            <input
                style={style}
                defaultValue={tagsAsString(tags)}
                onChange={setTags(from)}
                placeholder="Enter tags..."
            />
        )}
    />
)

export default () =>
  <Route exact path="/newmap/:id" render={({match: {params: {id}}}) =>
    <TagInput
      from={db.collection('maps').doc(id)}
      style={{
          bottom: '9px',
          left: '50px',
          position: 'absolute',
          zIndex: 500,
      }}
    />}
  />
