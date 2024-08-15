import React, { Component } from 'react';

const asyncComponent = (importComponent: any) => {
  return class extends Component {
    state = {
      component: null,
    };

    componentDidMount() {
      importComponent().then((cmp: any) => {
        this.setState({ component: cmp.default });
      });
    }

    render() {
      const { component } = this.state;
      const C: any = component;
      return C ? <C {...this.props} /> : null;
    }
  };
};

export default asyncComponent;
