import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Divider from "material-ui/Divider";
import firebase from "~/fire";
import Count from "./Count";

const db = firebase.firestore();

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const displayName = event.target.displayName.value;
    const { user } = this.props;

    db
      .collection("users")
      .where("displayName", "==", displayName)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();
          this.props.history.push(`/user/${data.uid}`);
        });
      })
      .catch(err => console.error(err));
  }

  get followers() {
    const { user } = this.props;
    return db.collection("relationships").where("following", "==", user.uid);
  }

  get following() {
    const { user } = this.props;
    return db.collection("relationships").where("follower", "==", user.uid);
  }

  render() {
    const { user, classes } = this.props;

    return (
      <div id="sidebar">
        <div className="sidebar-margin">
          <div>
            <img src={user.photoURL} />
          </div>
<<<<<<< HEAD

          <div>
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="displayName" />
            </form>
            <p>{user.displayName}</p>
            
              <p>
                Following: <Count of={this.following} />
              </p>
            
            <p>
              Followers: <Count of={this.followers} />
            </p>
=======
       
        <div>
          <Typography color="inherit" className={classes.typography}>{user.displayName}</Typography>
          <div className="sidebar-flex-info">
            <div className="sidebar-flex-inner">
            <Typography color="inherit" className={classes.typography}>Following</Typography>
            <Typography color="inherit" className={classes.typography}><Count of={this.following}/>
            </Typography>
            </div>
            <div className="sidebar-flex-inner">
            <Typography color="inherit" className={classes.typography}>Followers</Typography>
            <Typography color="inherit" className={classes.typography}><Count of={this.followers} /></Typography>
            </div>
            <div className="sidebar-flex-inner">
            <Typography color="inherit" className={classes.typography}>Maps</Typography>
            <Typography color="inherit" className={classes.typography}>0</Typography>
            </div>
          </div>
>>>>>>> f3464fe0ace55fdc69d06a10fec63a36e6d69391
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  typography: {
    margin: '0.2rem',
    'font-size': '1rem'
  }
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Sidebar));
