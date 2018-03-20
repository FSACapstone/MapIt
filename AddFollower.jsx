// import React, { Component } from "react";
// import firebase, { auth } from "~/fire";

// const db = firebase.firestore();

// class AddFollower extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       following: false
//     };
//     // this.findRelationship = this.findRelationship.bind(this);
//     this.handleFollow = this.handleFollow.bind(this);
//     this.handleUnfollow = this.handleUnfollow.bind(this);
//   }

//   // WIP:
//   componentDidMount() {
//     console.log('in component DID mount')
//     console.log('this.props -->', this.props)
//     const { user } = this.props;
//     console.log('{user} = this.props -->', user)
//     // const foundRelationship =
//     //   db
//     //     .collection("relationships")
//     //     .where("follower", "==", this.props.signedInUser.uid)
//     //     .where("following", "==", this.props.user.uid)
//     //     .get();
//     // console.log('foundRelationship -->', foundRelationship)
//   }

//   handleFollow(event) {
//     event.preventDefault();
//     const { user, signedInUser } = this.props;
//     db
//       .collection("relationships")
//       .add({
//         follower: signedInUser.uid,
//         following: user.uid
//       })
//       .catch(err => console.error(err));
//   }

//   handleUnfollow(event) {
//     event.preventDefault();
//     const { user, signedInUser } = this.props;
//     db
//       .collection("relationships")
//       .where("follower", "==", signedInUser.uid)
//       .where("following", "==", user.uid)
//       .get()
//       .then(querySnapshot => {
//         db
//           .collection("relationships")
//           .doc(querySnapshot.docs[0].id)
//           .delete();
//       })
//       .catch(err => console.error(err));
//   }

//   // findRelationship() {
//   //   const { user, signedInUser } = this.props;
//   //   console.log('in FIND RELATIONSHIP');
//   //   return (
//   //    db
//   //     .collection("relationships")
//   //     .where("follower", "==", signedInUser.uid)
//   //     .where("following", "==", user.uid)
//   //     .get()
//   //     .then(querySnapshot => {
//   //       db
//   //         .collection("relationships")
//   //         .doc(querySnapshot.docs[0].id);
//   //     })
//   //     .catch(err => console.error(err))
//   //   );
//   // }

//   render() {
//     return (
//       <div>
//         <button onClick={this.handleFollow}>Follow</button>
//         <button onClick={this.handleUnfollow}>Unfollow</button>
//       </div>
//     );
//   }
// }

// export default AddFollower;
