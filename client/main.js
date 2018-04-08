import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import { InstantSearch } from 'react-instantsearch/dom'
import algoliasearch from 'algoliasearch'

import App from '~/App'

function main() {
  render(
    <Router>
      <App />
    </Router>,
    document.getElementById('main')
  )
}
const algolia = algoliasearch('2N7N3I0FJ2', 'd163ceea9b530ca67676dc76cac7ee53')

main()

module.hot && module.hot.accept('~/App', main)
