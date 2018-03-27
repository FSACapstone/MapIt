import React, { Component } from "react";
import Follow from "./Follow";
import { withRouter } from "react-router-dom";
import firebase from "~/fire";

const db = firebase.firestore();

export default class ResultList extends Component {
  constructor(props){
    super(props)
    this.state = {results: []}
  }
  componentWillReceiveProps(){
    console.log(this.props.arr.arr, this.props.arr.length)
        this.setState({results:this.props.arr})


  }

  componentDidMount(){
    console.log(this.props)
    //this.setState({results:this.props.arr})
  }

  render(){
    //console.log(this.props.arr[0])
    console.log(this.state)

    return(
      this.state.results.length ? this.state.results.map((place)=>{
        return <div>{place.name}</div>
      })
      :  <div>no results </div>
    )
  }

}
