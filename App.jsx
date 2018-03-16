import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GoogleMap from './GoogleMap';
import Login from './Login';

export default class App extends Component {
  constructor() {
    super() 
  }
  componentDidMount() {
    
  }
  render() {
    return (
      <div>
      <Router> 
        <Switch>              
          <Route exact path="/" component={GoogleMap}></Route>
          <Route exact path="/login" component={Login}></Route>
        </Switch>
      </Router>
      </div>
    )
    
  }
}
// export default App;
// export default () => '🔥 Ready.'
