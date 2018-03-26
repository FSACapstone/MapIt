import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';

class GoogleMapButton extends Component {

  render() {
    const { classes, text, onClick, type } = this.props;

    return (
      <Button variant="raised" color="primary" className={classes.button} onClick={onClick} type={type}>{text}</Button>
    )
  }
}

GoogleMapButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    'border-radius': '5px'
  },
});

export default (withStyles(styles))(GoogleMapButton);
