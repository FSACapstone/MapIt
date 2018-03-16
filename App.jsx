import React, { Component } from 'react';
import GoogleMap from './GoogleMap';
import { GoogleApiWrapper } from 'google-maps-react'
class App extends Component {
  constructor() {
    super()

  }
  componentDidMount() {

  }
  render() {
    console.log(this.props)
    return (
      <div>

        <GoogleMap google={{...this.props.google, loc:{lat: 40.2549, lng:-75.0890}} } />

      </div>
    )

  }
}
console.log(GoogleApiWrapper)
export default GoogleApiWrapper({
  apiKey: 'AIzaSyBNO9SHxnyzMG6J1FCDYcle7DjXMjg6jBU',
})(App)
// export default App;
// export default () => '🔥 Ready.'
