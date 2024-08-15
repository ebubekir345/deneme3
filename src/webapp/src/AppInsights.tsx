import React from 'react';
import Component from './components/atoms/Component/Component';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<any, ErrorBoundaryState> {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    const { onError, children } = this.props;
    if (hasError) {
      return typeof onError === 'function' ? onError() : React.createElement(onError);
    }

    return children;
  }
}

export { ErrorBoundary };
