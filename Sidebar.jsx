import React, { Component } from 'react';

const Sidebar = props => {
 
  const user = props.user;
  console.log(user);

  return (
    <div>
      <img src={user.photoURL} />
      <h1>{user.displayName}</h1>
      <h2>{user.email}</h2>
    </div>
  )
  
}

export default Sidebar;

