import * as firebase from 'firebase'
import 'firebase/firestore'
import setup from './setup'
import algoliasearch from 'algoliasearch'

setup(firebase)

export default firebase
export const firestore = firebase.firestore()
export const database = firebase.database()
export const auth = firebase.auth()
export const storage = firebase.storage()

// const algolia = algoliasearch(
//     '2N7N3I0FJ2', 'd163ceea9b530ca67676dc76cac7ee53'
// );

// const index = algolia.initIndex('mapstack');

// Export your models here. Example:
export const userById = id => db.collection('users').doc(id)