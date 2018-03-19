import React, { Component } from 'react';
import firebase, { auth } from '~/fire';

const db = firebase.firestore();

class AddFollower extends Component {
  constructor(props) {
    super(props);

    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {

  }

  handleAdd(event) {
    const user = this.props.user;
    console.log(user);
    event.preventDefault();
    const usersdb = db.collection('users').where('user')
    console.log(usersdb);

  }

  render() {

    return (
      <button onClick={this.handleAdd}>Follow Button</button>
    )
  }
}

export default AddFollower;