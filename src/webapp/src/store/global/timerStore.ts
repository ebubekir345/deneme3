import React from 'react';
import globalHook, { Store } from 'use-global-hook';

/* Interfaces */
export interface ITimerStore {
  packingTime: number;
  singleItemPackingTime: number;
  missingItemTransferTime: number;
}

export interface ITimerActions {
  clearState: (data: Partial<ITimerStore>) => void;
  setPackingTime: (isInterval?: boolean, packingTime?: number) => void;
  setSingleItemPackingTime: (isInterval?: boolean, singleItemPackingTime?: number) => void;
  setMissingItemTransferTime: (isInterval?: boolean, missingItemTransferTime?: number) => void;
}

/* InitalStates */
export const initialTimerState: ITimerStore = {
  packingTime: 0,
  singleItemPackingTime: 0,
  missingItemTransferTime: 0,
};

/* Actions */
export const timerActions: object = {
  clearState: (store: Store<ITimerStore, ITimerActions>, data: Partial<ITimerStore>) => {
    store.setState({ ...store.state, ...data });
  },
  setPackingTime: (store: Store<ITimerStore, ITimerActions>, isInterval?: boolean, packingTime?: number) => {
    store.setState({ ...store.state, packingTime: isInterval ? store.state.packingTime + 1 : packingTime || 0 });
  },
  setSingleItemPackingTime: (
    store: Store<ITimerStore, ITimerActions>,
    isInterval?: boolean,
    singleItemPackingTime?: number
  ) => {
    store.setState({
      ...store.state,
      singleItemPackingTime: isInterval ? store.state.singleItemPackingTime + 1 : singleItemPackingTime || 0,
    });
  },
  setMissingItemTransferTime: (
    store: Store<ITimerStore, ITimerActions>,
    isInterval?: boolean,
    missingItemTransferTime?: number
  ) => {
    store.setState({
      ...store.state,
      missingItemTransferTime: isInterval ? store.state.missingItemTransferTime + 1 : missingItemTransferTime || 0,
    });
  },
};

/* Export */
const useTimerStore = globalHook<ITimerStore, ITimerActions>(React, initialTimerState, timerActions);

export default useTimerStore;
