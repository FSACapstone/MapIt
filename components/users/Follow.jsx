import React, { Component } from 'react';
import firebase, { auth } from '~/fire';
import { withRouter } from 'react-router-dom';

const db = firebase.firestore();

class Follow extends Component {
  componentDidMount() {
    this.listen(this.props);
  }

  componentWillReceiveProps(props) {
    this.listen(props);
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  listen({ followerId, followingId }) {
    this.unsubscribe = db
      .collection('relationships')
      .where('follower', '==', followerId)
      .where('following', '==', followingId)
      .onSnapshot(querySnapshot => {
        if (!querySnapshot.empty) {
          return this.setState({
            relationshipRef: querySnapshot.docs[0].ref,
            relationshipExists: true,
          });
        }
        this.setState({
          relationshipRef: null,
          relationshipExists: false,
        });
      });
  }

  handleFollow = event => {
    event.preventDefault();
    const { followerId, followingId } = this.props;
    db.collection('relationships').add({
      follower: followerId,
      following: followingId,
    });
  }

  handleUnfollow = event => {
    event.preventDefault();
    return this.state.relationshipRef.delete();
  }

  render() {
    const { relationshipExists } = this.state || {};
    return relationshipExists ? (
      <button className="follow-button" onClick={this.handleUnfollow}>
        Unfollow
      </button>
    ) : (
      <button className="follow-button" onClick={this.handleFollow}>
        Follow
      </button>
    );
  }
}

export default withRouter(Follow);
