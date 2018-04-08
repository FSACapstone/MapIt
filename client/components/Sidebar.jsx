import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import firebase from '~/fire'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import { Count, SearchMaps } from '../'

const db = firebase.firestore()

class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {}

  handleSubmit(event) {
    event.preventDefault()
    const displayName = event.target.displayName.value
    const { user } = this.props

    db
      .collection('users')
      .where('displayName', '==', displayName)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data()
          this.props.history.push(`/user/${data.uid}`)
        })
      })
      .catch(err => console.error(err))
  }

  get followers() {
    const { user } = this.props
    return db.collection('relationships').where('following', '==', user.uid)
  }

  get following() {
    const { user } = this.props
    return db.collection('relationships').where('follower', '==', user.uid)
  }

  get mapsCreated() {
    const { user } = this.props
    return db.collection('maps').where('uid', '==', user.uid)
  }

  render() {
    const { user, classes } = this.props

    return (
      <div id="sidebar">
        <div className="">
          <div>
            <Link to={`/user/${user.uid}`}>
              <img src={user.photoURL} />
              <h2>{user.displayName}</h2>
            </Link>
          </div>
          <hr />
          <div>
            <div className="sidebar-flex-info">
              <Link to={`/following/${user.uid}`}>
                <Typography color="inherit" className={classes.typography}>
                  Following: <Count of={this.following} />
                </Typography>
              </Link>
              <Link to={`/followers/${user.uid}`}>
                <Typography color="inherit" className={classes.typography}>
                  Followers: <Count of={this.followers} />
                </Typography>
              </Link>
              <Link to={`/user/${user.uid}`}>
                <Typography color="inherit" className={classes.typography}>
                  Maps: <Count of={this.mapsCreated} />
                </Typography>
              </Link>
              <Link to={`/favorite-maps`}>
                <Typography color="inherit" className={classes.typography}>
                  Favorite Maps
                </Typography>
              </Link>
              <Link to={`/layered-maps`}>
                <Typography color="inherit" className={classes.typography}>
                  Stacked Maps
                </Typography>
              </Link>
              <Link to={`/searchmaps`}>
                <Typography color="inherit" className={classes.typography}>
                  Search Maps 🔎
                </Typography>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  typography: {
    margin: '0.2rem',
    'font-size': '1rem',
  },
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(withRouter(Sidebar))
