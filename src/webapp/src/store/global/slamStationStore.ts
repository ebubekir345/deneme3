import { SortDirection } from 'dynamic-query-builder-client';
import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { ISort } from '../../components/molecules/TouchScreen/GridTable';
import { ReadyToShipCargoPackagesOutputDTO, WaitingForSLAMCargoPackageOutputDTO } from '../../services/swagger';
import { SlamStationModals, ReadyToShipStatusFilter, WaitingStatusFilter } from '../../typings/globalStore/enums';

/* InitalStates */
export const initialSlamStationState: ISlamStationStore = {
  isMoreActionsOpen: false,
  activeTab: 1,
  waitingCategoryFilter: WaitingStatusFilter.Total,
  waitingSort: {
    key: 'salesOrderCreatedAt',
    direction: SortDirection.ASC,
  },
  waitingPackages: [],
  readyToShipCategoryFilter: ReadyToShipStatusFilter.Total,
  readyToShipSort: {
    key: 'salesOrderCreatedAt',
    direction: SortDirection.ASC,
  },
  readyToShipPackages: [],
  modals: {
    Logout: false,
  },
};

/* Actions */
export const slamStationActions: object = {
  clearState: (store: Store<ISlamStationStore, ISlamStationActions>, data: Partial<ISlamStationStore>) => {
    store.setState({ ...store.state, ...data });
  },
  setIsMoreActionsOpen: (store: Store<ISlamStationStore, ISlamStationActions>, isMoreActionsOpen: boolean) => {
    store.setState({ ...store.state, isMoreActionsOpen });
  },
  setActiveTab: (store: Store<ISlamStationStore, ISlamStationActions>, activeTab: number) => {
    store.setState({ ...store.state, activeTab });
  },
  setWaitingCategoryFilter: (store: Store<ISlamStationStore, ISlamStationActions>, waitingCategoryFilter: string) => {
    store.setState({ ...store.state, waitingCategoryFilter });
  },
  setWaitingSort: (store: Store<ISlamStationStore, ISlamStationActions>, waitingSort: ISort) => {
    store.setState({ ...store.state, waitingSort });
  },
  setWaitingPackages: (
    store: Store<ISlamStationStore, ISlamStationActions>,
    waitingPackages: WaitingForSLAMCargoPackageOutputDTO[]
  ) => {
    store.setState({ ...store.state, waitingPackages });
  },
  setReadyToShipCategoryFilter: (
    store: Store<ISlamStationStore, ISlamStationActions>,
    readyToShipCategoryFilter: string
  ) => {
    store.setState({ ...store.state, readyToShipCategoryFilter });
  },
  setReadyToShipSort: (store: Store<ISlamStationStore, ISlamStationActions>, readyToShipSort: ISort) => {
    store.setState({ ...store.state, readyToShipSort });
  },
  setReadyToShipPackages: (
    store: Store<ISlamStationStore, ISlamStationActions>,
    readyToShipPackages: ReadyToShipCargoPackagesOutputDTO[]
  ) => {
    store.setState({ ...store.state, readyToShipPackages });
  },
  toggleModalState: (
    store: Store<ISlamStationStore, ISlamStationActions>,
    name: SlamStationModals,
    status?: boolean
  ) => {
    const modalState = store.state.modals[name];
    const modals = {
      ...store.state.modals,
      [name]: status === undefined ? !modalState : status,
    };
    store.setState({ ...store.state, modals });
  },
};

/* Export */
const useSlamStationStore = globalHook<ISlamStationStore, ISlamStationActions>(
  React,
  initialSlamStationState,
  slamStationActions
);

export default useSlamStationStore;
