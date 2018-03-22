import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import purple from 'material-ui/colors/purple';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

function CircularLoad(props) {
  const { classes } = props;
  return (
    <div className="login-wrapper text-align-center">

      <CircularProgress className={classes.progress} color="secondary" size={200} />
    
    </div>
  );
}

CircularLoad.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularLoad);
