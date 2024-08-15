import createAuth0Client, {
  getIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdToken,
  LogoutOptions,
  PopupLoginOptions,
  RedirectLoginOptions,
} from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { config } from '../config';
import history from '../history';
import { urls } from '../routers/urls';

interface Auth0Context {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  popupOpen: boolean;
  loginWithPopup(options: PopupLoginOptions): Promise<void>;
  handleRedirectCallback(): Promise<any>;
  getIdTokenClaims(o?: getIdTokenClaimsOptions): Promise<IdToken | undefined>;
  loginWithRedirect(o: RedirectLoginOptions): Promise<void>;
  getAccessTokenSilently(o?: GetTokenSilentlyOptions): Promise<string | undefined>;
  getTokenWithPopup(o?: GetTokenWithPopupOptions): Promise<string | undefined>;
  logout(o?: LogoutOptions): void;
}

export const Auth0Context = createContext<Auth0Context | null>(null);
export const useAuth0 = () => useContext(Auth0Context)!;

const onRedirectCallback = appState => {
  history.replace(appState && appState.returnTo ? appState.returnTo : urls.orderManagement);
};

let initOptions = config.auth;

const getAuth0Client: any = () => {
  return new Promise(async (resolve, reject) => {
    let client;
    if (!client) {
      try {
        client = await createAuth0Client({ ...initOptions, cacheLocation: 'localstorage' });
        resolve(client);
      } catch (e) {
        reject(new Error(`getAuth0Client Error: ${e}`));
      }
    }
  });
};

export const getTokenSilently = async (...p) => {
  const client = await getAuth0Client();
  return await client.getTokenSilently(...p);
};

export const Auth0Provider = ({ children }): any => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>();
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const client = await getAuth0Client();
      setAuth0(client);
      if (window.location.search.includes('code=')) {
        const { appState } = await client.handleRedirectCallback();
        onRedirectCallback(appState);
      }
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await client.getUser();
        setUser(user);
      } else {
        history.push(urls.authentication)
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client!.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client!.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client!.handleRedirectCallback();
    const user = await auth0Client!.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (o: getIdTokenClaimsOptions | undefined) => auth0Client!.getIdTokenClaims(o),
        loginWithRedirect: (o: RedirectLoginOptions) => auth0Client!.loginWithRedirect(o),
        getAccessTokenSilently: (o: GetTokenSilentlyOptions | undefined) => auth0Client!.getTokenSilently(o),
        getTokenWithPopup: (o: GetTokenWithPopupOptions | undefined) => auth0Client!.getTokenWithPopup(o),
        logout: (o: LogoutOptions | undefined) => auth0Client!.logout(o),
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
