import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import firebase from '~/fire'
import { Follow, UsersCreatedMaps, Count, CircularLoad } from '../'

const db = firebase.firestore()

class FollowingUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      following: [],
      userPage: {},
      loading: true,
    }

    this.findFollowing = this.findFollowing.bind(this)
  }

  componentDidMount() {
    this.findFollowing()
  }

  findFollowing() {
    const user = this.props.match.params.userId

    db
      .collection('users')
      .where('uid', '==', user)
      .get()
      .then(querySnapshot => querySnapshot.forEach(doc => this.setState({ userPage: doc.data() })))

    db
      .collection('relationships')
      .where('follower', '==', user)
      .get()
      .then(querySnapshot => {
        let followingUser = {}
        querySnapshot.forEach(doc => {
          let followingId = doc.data().following
          db
            .collection('users')
            .doc(followingId)
            .get()
            .then(following => {
              followingUser[followingId] = following.data()
            })
            .then(() => this.setState({ following: followingUser }))
        })
      })
      .then(() => this.setState({ loading: false }))
  }

  render() {
    const { following, userPage } = this.state
    if (this.state.loading === true) return <CircularLoad size={200} color={`secondary`} />
    return (
      <div className="text-align-center">
        <h1>{userPage.displayName}</h1>
        <h2>Following</h2>
        <div className="following-page-flex">
          {Object.keys(following).length &&
            Object.keys(following).map(followingId => {
              return (
                <div key={followingId}>
                  <Link to={`/user/${followingId}`}>
                    <img src={following[followingId].photoURL} className="margin-top-5" />
                  </Link>
                  <h1>{following[followingId].displayName}</h1>
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}

export default withRouter(FollowingUsers)
