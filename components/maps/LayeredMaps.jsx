import React, { Component } from 'react'
import firebase, { auth } from '~/fire'
import { withRouter, Link } from 'react-router-dom'
// import { QuerySnapshot } from "@google-cloud/firestore";

const db = firebase.firestore()

class LayeredMapsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      layeredMaps:[]
    }
  }

  componentDidMount(){
    db
      .collection('layeredMaps')
      .where('uid','==', this.props.user.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(map => {
                let innerMap = map.data()
                console.log(innerMap)
                this.setState({layeredMaps:[...this.state.layeredMaps, innerMap]})
              })



            })
  }
  render() {
    let place = 'Layered Map'
    console.log(this.state)

    return (
      <div>
      { this.state.layeredMaps.length ?
           this.state.layeredMaps.map(map =>{
             return <Link to = {`/layered-maps/${map.mid}`} key = {map.mid} ><div>{map.name}</div></Link>
           })

     : null
      }
      </div>
    )
  }
}

export default withRouter(LayeredMapsList)
