import React from 'react';
import globalHook, { Store } from 'use-global-hook';

interface ISidebarStore {
  activeSubMenu: string;
}
interface ISidebarActions {
  setActiveSubMenu: (activeSubMenu: string) => void;
}

/* InitalStates */
export const initialSidebarStore: any = {
 activeSubMenu: ''
};

/* Actions */
export const commonActions: object = {

  setActiveSubMenu: (store: Store<ISidebarStore,ISidebarActions >, activeSubMenu: string) => {
    store.setState({ ...store.state, activeSubMenu });
  },
  
};

/* Export */
const useSidebarStore = globalHook<ISidebarStore,ISidebarActions >(
  React,
  initialSidebarStore,
  commonActions
);

export default useSidebarStore;
