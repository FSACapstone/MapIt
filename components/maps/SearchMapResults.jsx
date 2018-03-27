import React, { Component } from "react";
import { withRouter, NavLink, Link } from "react-router-dom";
import firebase from "~/fire";
import Count from "~/fromTop/Count";

const db = firebase.firestore();

class SearchMapResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapResults: []
    };

  }

  componentDidMount() {
    this.getAllUserMaps();
  }

  // get maps() {
  //   const { mapResults } = this.props;
  // }

  get mapsCreated() {
    const { signedInUser } = this.props;
    return db.collection("maps").where("uid", "==", signedInUser.uid);
  }

  render() {
    const { createdMaps } = this.state;
    console.log(createdMaps);

    return Object.keys(createdMaps).length ? (
      <div className="text-align-center">
        <h2>
          Maps Created: <Count of={this.mapsCreated} />
        </h2>
        {Object.keys(createdMaps).length &&
          Object.keys(createdMaps).map(mapId => {
            return (
              <div key={mapId}>
                <Link to={`/map/${mapId}`} key={mapId}>
                  <p>
                    {createdMaps[mapId].title} (<Count
                      of={db
                        .collection("favoritedMaps")
                        .where("mapId", "==", mapId)}
                    />)
                  </p>
                </Link>
                <Link to={`/newmap/${mapId}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => this.deleteMap(mapId)}>Delete</button>
              </div>
            );
          })}
      </div>
    ) : (
      <div className="text-align-center">
        <h2>You currently have no maps. You should make some!</h2>
      </div>
    );
  }
}

export default withRouter(SearchMapResults);
