import React from 'react'
import { GoogleApiWrapper } from 'google-maps-react'
import createContext from 'create-react-context'

const ApiContext = createContext(null)

export const GoogleProvider = GoogleApiWrapper({
  apiKey: "AIzaSyBNO9SHxnyzMG6J1FCDYcle7DjXMjg6jBU"
})(
  ({google, children}) =>
    <ApiContext.Provider value={google}>{
      children
    }</ApiContext.Provider>
)

export default ApiContext.Consumer
