import React, { Component } from 'react';
import Follow from './Follow';
import { withRouter } from 'react-router-dom';
import firebase from '~/fire';

const db = firebase.firestore();

export default class ResultList extends Component {
  constructor(props) {
    super(props);
    this.state = { results: [] };
  }
  componentWillReceiveProps() {
    this.setState({ results: this.props.arr });
  }

  componentDidMount() {}

  render() {
    return this.state.results.length ? (
      this.state.results.map(place => {
        return <div>{place.name}</div>;
      })
    ) : (
      <div>no results </div>
    );
  }
}
