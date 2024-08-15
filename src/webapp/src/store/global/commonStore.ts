import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { roles } from '../../auth/roles';
import { config } from '../../config';

/* InitalStates */
export const initialCommonState: ICommonStore = {
  auth0UserInfo: {},
  activeTab: undefined,
  tabLength: 0,
  selectedSalesOrderIds: []
};

/* Actions */
export const commonActions: object = {
  clearState: (store: Store<ICommonStore, ICommonActions>, data: Partial<ICommonStore>) => {
    store.setState({ ...store.state, ...data });
  },
  setAuth0UserInfo: (store: Store<ICommonStore, ICommonActions>, auth0UserInfo: any) => {
    store.setState({ ...store.state, auth0UserInfo });
  },
  userHasRole: (store: Store<ICommonStore, ICommonActions>, requiredRole: string): boolean => {
    if (requiredRole === '') {
      return true;
    }
    const role = store.state.auth0UserInfo && store.state.auth0UserInfo[config.auth.userRole];
    if (role && role === requiredRole) {
      return true;
    }
    return false;
  },
  userHasMinRole: (store: Store<ICommonStore, ICommonActions>, minRole: roles): boolean => {
    const role = store.state.auth0UserInfo && store.state.auth0UserInfo[config.auth.userRole];
    const userRoleIndex = Object.values(roles).indexOf(role);
    const minRoleIndex = Object.values(roles).indexOf(minRole);
    if (role && userRoleIndex >= minRoleIndex) {
      return true;
    }
    return false;
  },
  setActiveTab: (store: Store<ICommonStore, ICommonActions>, activeTab: number) => {
    store.setState({ ...store.state, activeTab });
  },
  setTabLength: (store: Store<ICommonStore, ICommonActions>, tabLength: number) => {
    store.setState({ ...store.state, tabLength });
  },
  tabNext: (store: Store<ICommonStore, ICommonActions>) => {
    if (typeof store.state?.activeTab === "number" && store.state?.activeTab + 1 < store.state?.tabLength) {
      store.setState({ ...store.state, activeTab: store.state?.activeTab + 1 });
    }
  },
  tabBack: (store: Store<ICommonStore, ICommonActions>) => {
    if (typeof store.state?.activeTab === "number" && store.state?.activeTab > 0) {
      store.setState({ ...store.state, activeTab: store.state?.activeTab - 1 });
    }
  },
  setSelectedSalesOrderIds: (store: Store<ICommonStore, ICommonActions>, selectedSalesOrderIds: string[]) => {
    store.setState({ ...store.state, selectedSalesOrderIds });
  },
};

/* Export */
const useCommonStore = globalHook<ICommonStore, ICommonActions>(React, initialCommonState, commonActions);

export default useCommonStore;
