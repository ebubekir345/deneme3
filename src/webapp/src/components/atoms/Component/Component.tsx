import * as React from 'react';
import { InjectedIntl } from 'react-intl';

export interface Props {
  /**
   * intl is the object to inject react-intl"s provider to the components that use localization
   */
  intl: InjectedIntl;

  /**
   * isBusy indicates the loading state of a component
   */
  isBusy?: boolean;

  /**
   * error message of the response
   */
  error?: ErrorModel;

  /**
   * onWillMount is the callback triggered when componentWillMount
   */
  onWillMount?: () => void;

  /**
   * onWillReceiveProps is the callback triggered when componentWillReceiveProps
   */
  onWillReceiveProps?: (nextProps: any) => void;

  /**
   * onWillUnmount is the callback triggered when componentWillUnmount
   */
  onWillUnmount?: () => void;

  /**
   * onWillUpdate is the callback triggered when componentWillUpdate
   */
  onWillUpdate?: () => void;

  /**
   * onDidMount is the callback triggered when componentDidMount
   */
  onDidMount?: () => void;

  /**
   * onDidCatch is the callback triggered when componentDidCatch
   */
  onDidCatch?: (error: any, errorInfo: any) => void;

  /**
   * onDidUpdate is the callback triggered when componentDidUpdate
   */
  onDidUpdate?: (prevProps: any, prevState: any) => void;
}

class Component<P extends Props, S> extends React.Component<P, S> {
  UNSAFE_componentWillMount() {
    const { onWillMount } = this.props;
    if (onWillMount) {
      onWillMount();
    }
  }

  componentDidMount(): void {
    window.scrollTo(0, 0);
    const { onDidMount } = this.props;
    if (onDidMount) {
      onDidMount();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    const { onWillReceiveProps } = this.props;
    if (onWillReceiveProps) {
      onWillReceiveProps(nextProps);
    }
  }

  UNSAFE_componentWillUpdate() {
    const { onWillUpdate } = this.props;
    if (onWillUpdate) {
      onWillUpdate();
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const { onDidUpdate } = this.props;
    if (onDidUpdate) {
      onDidUpdate(prevProps, prevState);
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    const { onDidCatch } = this.props;
    if (onDidCatch) {
      onDidCatch(error, errorInfo);
    }
  }

  componentWillUnmount() {
    const { onWillUnmount } = this.props;
    if (onWillUnmount) {
      onWillUnmount();
    }
  }
}

export default Component;
