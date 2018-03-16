import React, { Component } from 'react';
import GoogleMap from './GoogleMap';
export default class App extends Component {
  constructor() {
    super() 
  }
  componentDidMount() {
    
  }
  render() {
    return (
      <div>
         
        <GoogleMap />

      </div>
    )
    
  }
}
// export default App;
// export default () => '🔥 Ready.'
