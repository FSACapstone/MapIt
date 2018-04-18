import React, { Component } from 'react';
import firebase, { auth } from '~/fire';
import { withRouter, Link } from 'react-router-dom';

const db = firebase.firestore();

class LayeredMapsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layeredMaps: [],
    };
  }

  componentDidMount() {
    db
      .collection('layeredMaps')
      .where('uid', '==', this.props.user.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(map => {
          let innerMap = map.data();
          console.log(innerMap);
          this.setState({ layeredMaps: [...this.state.layeredMaps, innerMap] });
        });
      });
  }
  render() {
    const { user } = this.props;
    console.log(user);

    return (
      <div className="text-align-center">
        <h1>{user.displayName}'s Stacked Maps</h1>
        <div className="map-flex-outer text-align-center">
          {this.state.layeredMaps.length
            ? this.state.layeredMaps.map(map => {
                return (
                  <div className="map-flex-inner" key={map.mid}>
                    <Link to={`/layered-maps/${map.mid}`}>
                      <img src="/img/pin.png" className="animated bounceInDown" />
                      <div>
                        <p className="text-bold">{map.name} </p>
                      </div>
                    </Link>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  }
}

export default withRouter(LayeredMapsList);
