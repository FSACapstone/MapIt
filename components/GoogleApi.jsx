import React from 'react'
import createContext from 'create-react-context'

const ApiContext = createContext(null)

export class GoogleProvider extends React.PureComponent {
  async componentDidMount() {
    await window.__googleHasLoaded__
    this.setState({loaded: true})
  }

  render() {
    if (!window.google) return null
    const {children} = this.props
    return <ApiContext.Provider value={window.google}>{
      children
    }</ApiContext.Provider>
  }
}

export default ApiContext.Consumer
