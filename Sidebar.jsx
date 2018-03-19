import React, { Component } from 'react';
import AddFollower from './AddFollower';



const Sidebar = props => {
 
  const user = props.user;

  return (
    <div>
      <img src={user.photoURL} />
      <h1>{user.displayName}</h1>
      <h2>{user.email}</h2>
      <AddFollower user={user} />
    </div>
  )
}

export default Sidebar;

