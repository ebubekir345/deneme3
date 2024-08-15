import { init as initApm } from '@elastic/apm-rum';
import { ThemeProvider } from '@oplog/express';
import * as React from 'react';
import { IntlProvider } from 'react-intl-redux';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { Auth0Provider } from './auth/auth0';
import MainLayoutWrapper from './components/atoms/MainLayoutWrapper';
import { config } from './config';
import GlobalStyle from './GlobalStyle';
import history from './history';
import { routes } from './routers';
import { initStore } from './store/configure';
import theme from './theme';

initApm(config.elastic);
export const store = initStore();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <IntlProvider>
        <Auth0Provider>
          <ThemeProvider customTheme={theme as any}>
            <GlobalStyle />
            <Router history={history}>
              <Switch>
                {routes
                  .filter(r => r.enabled)
                  .map((route: any) => {
                    const RouteComponent = route.component;

                    if (route.protectedRoute && route.component) {
                      return (
                        <Route
                          exact
                          key={route.key}
                          path={route.url}
                          component={() => <MainLayoutWrapper route={route} titleKey={route.titleKey} />}
                        />
                      );
                    }
                    if (!route.protectedRoute && route.component) {
                      return <Route exact key={route.key} path={route.url} component={() => <RouteComponent />} />;
                    }
                    throw Object.assign(new Error(`No component or render is available for route: ${route.url}`), {
                      code: 0,
                    });
                  })}
              </Switch>
            </Router>
          </ThemeProvider>
        </Auth0Provider>
      </IntlProvider>
    </Provider>
  );
};

export default App;
