import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NotFound extends Component {
  
  
  render() {

    return (
      <div>
        <h1>404 Not Found</h1>
        <Link to="/">Back To Home Page</Link>
      </div>
    )
  }
}

export default NotFound;
