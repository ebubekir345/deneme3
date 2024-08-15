import { ThemeProvider } from '@oplog/express';
import { render } from '@testing-library/react';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { MockStore } from 'redux-mock-store';
import { getLocale } from '../i18n/index';
import { mockStoreWithState } from '../store/configure.mock';
import { initialState, StoreState } from '../store/initState';
import theme from '../theme';

export const locale = getLocale('tr-TR');
export const intlProvider = new IntlProvider(locale);
export const { intl } = intlProvider.getChildContext();

export interface ContextOptions {
  store?: MockStore<any>;
  routerProps?: any;
}

export const createWithRedux = (node: React.ReactNode, mockState?: Partial<StoreState>) => {
  let store = mockStoreWithState({ ...initialState, ...mockState });

  return create(
    <ThemeProvider customTheme={theme as any}>
      <Provider store={store}>{node}</Provider>
    </ThemeProvider>
  );
};

export const renderWithRedux = (node: React.ReactNode, mockState?: Partial<StoreState>) => {
  let store = mockStoreWithState({ ...initialState, ...mockState });
  return render(
    <ThemeProvider customTheme={theme as any}>
      <Provider store={store}>{node}</Provider>
    </ThemeProvider>
  );
};

export const renderWithContext = (children: React.ReactElement) => {
  const store = mockStoreWithState({ ...initialState });
  return render(
    <Provider store={store}>
      <ThemeProvider customTheme={theme as any}>
        <IntlProvider {...locale}>{children}</IntlProvider>
      </ThemeProvider>
    </Provider>
  );
};

export function setupIntersectionObserverMock({
  root = null,
  rootMargin = '',
  thresholds = [],
  disconnect = () => null,
  observe = () => null,
  takeRecords = () => null,
  unobserve = () => null,
} = {}) {
  class MockIntersectionObserver {
    root: null;

    disconnect: () => null;

    observe: () => null;

    rootMargin: string;

    thresholds: never[];

    takeRecords: () => null;

    unobserve: () => null;

    constructor() {
      this.root = root;
      this.rootMargin = rootMargin;
      this.thresholds = thresholds;
      this.disconnect = disconnect;
      this.observe = observe;
      this.takeRecords = takeRecords;
      this.unobserve = unobserve;
    }
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}
