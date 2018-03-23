import React, { Component } from "react";
import firebase, { auth } from "~/fire";

export default class Count extends Component {
  componentDidMount() {
    this.listen(this.props);
  }

  componentWillReceiveProps(props) {
    this.listen(props);
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  listen({of}) {
    this.unsubscribe = of
      .onSnapshot(querySnapshot => {
          this.setState({count: querySnapshot.size})
      });
  }

  render() {
    const { count = '' }  = this.state || {};
    return count
  }
}
