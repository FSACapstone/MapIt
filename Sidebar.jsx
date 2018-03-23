import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Divider from "material-ui/Divider";
import firebase from "~/fire";

const db = firebase.firestore();

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numFollowing: 0,
      numFollowers: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setNumFollowers();
    this.setNumFollowing();
  }

  setNumFollowers() {
    const { user, numFollowers } = this.props;
    db
      .collection("relationships")
      .where("following", "==", user.uid)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges.forEach(change => {
          if (change.type === "added") {
            this.setState(prevState => { 
              return {numFollowers: prevState.numFollowers + 1}
            })
          }
          if (change.type === "removed") {
            this.setState(prevState => { 
              return {numFollowers: prevState.numFollowers - 1}
            })
          }
        })
      })
  }

  setNumFollowing() {
    const { user, numFollowing } = this.props;
    db
      .collection("relationships")
      .where("follower", "==", user.uid)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges.forEach(change => {
          if (change.type === "added") {
            this.setState(prevState => { 
              return {numFollowing: prevState.numFollowing + 1}
            })
          }
          if (change.type === "removed") {
            this.setState(prevState => { 
              return {numFollowing: prevState.numFollowing - 1 }
            })
          }
        })
      })
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

  render() {

    const { numFollowing, numFollowers } = this.state;
    const { user, classes } = this.props;

    return (
      <div id="sidebar">

        <div className="sidebar-margin">
          <div>
            <img src={user.photoURL} />
          </div>
       
        <div>
          <Typography color="inherit" className={classes.typography}>{user.displayName}</Typography>
          <div className="sidebar-flex-info">
            <div className="sidebar-flex-inner">
            <Typography color="inherit" className={classes.typography}>Following</Typography>
            <Typography color="inherit" className={classes.typography}>{numFollowing}</Typography>
            </div>
            <div className="sidebar-flex-inner">
            <Typography color="inherit" className={classes.typography}>Followers</Typography>
            <Typography color="inherit" className={classes.typography}>{numFollowers}</Typography>
            </div>
            <div className="sidebar-flex-inner">
            <Typography color="inherit" className={classes.typography}>Maps</Typography>
            <Typography color="inherit" className={classes.typography}>0</Typography>
            </div>
          </div>
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
