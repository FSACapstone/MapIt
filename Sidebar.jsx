import React, { Component } from 'react';
import AddFollower from './AddFollower';
import firebase from '~/fire';

const db = firebase.firestore();

class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
   handleSubmit (event) {
    event.preventDefault();
    const displayName = event.target.displayName.value;

    db.collection('users').where('displayName', '==', displayName)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => console.log(doc.data()))
    });
  }

  render() {
  const user = this.props.user;

  return (
    <div> 
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          name="displayName"
        />
      </form>
      <img src={user.photoURL} />
      <h1>{user.displayName}</h1>
      <h2>{user.email}</h2>
      <AddFollower user={user} />
    </div>
  )
}
}

export default Sidebar;

