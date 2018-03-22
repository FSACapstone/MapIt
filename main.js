import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter as Router } from 'react-router-dom';

import App from '~/App'

function main() {
  render(
      <Router>
      <App />
      </Router>,
    document.getElementById('main'))
}

main()

module.hot && module.hot.accept('~/App', main)
