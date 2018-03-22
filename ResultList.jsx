import React, { Component } from "react";
import Follow from "./Follow";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";

const db = firebase.firestore();

export default class ResultList extends Component {
  constructor(props){
    super(props)
    this.state = {results: []}
    this.onClick = this.onClick.bind(this)
  }
  onClick(event){
    event.preventDefault()
    var placeId = event.target.placeid.value
    var id = this.props.id
    var obj = {}
    obj[placeId] = true
    var mapRef = db.collection('maps').doc(id);
    var getDoc = mapRef.set({
      places: obj
  }, { merge: true })
    .then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            console.log('Document data:', doc.data());
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });

  }
  componentDidMount(){
    console.log(this.props)
    this.setState({results:this.props.results})
    console.log(this.state)
  }

  render(){
    var key = 0
    console.log(this.state.results)
    return(
      <ul>{this.state.results && this.state.results.map(result =>{
        return <form key={key++} onSubmit = {this.onClick}><option   type = 'submit'>{result.name}</option><button name='placeid' type='submit' value={result.place_id}>add to map</button></form>
      })}</ul>    )
  }

}
