import React from 'react';
import globalHook, { Store } from 'use-global-hook';

export enum cutOffStatus {
  all,
  cutOff,
  late,
}

/* Interfaces */
export interface IModifiedSalesOrders {
  orderCount: number;
  orders: any;
}
export interface IInitialOrderManagementStore {
  filterData: {
    operation: any;
    referenceNumber: any;
    productName: any;
    priority: any;
    salesChannel: any;
    deliveryType: any;
    onlyErrors: boolean;
    isCutOff: boolean;
    isLate: boolean;
  };
  previousCountData: {
    previousCountCreated: number;
    previousCountPicking: number;
    previousCountSorting: number;
    previousCountPacking: number;
    previousCountDispatch: number;
    previousCountSLAM: number;
    previousCountCancelled: number;
  };
  modifiedSalesOrders: {
    Created: any;
    Picking: any;
    Sorting: any;
    Packing: any;
    SLAM: any;
    Dispatch: any;
    Cancelled: any;
  };
  isResourceBusy: any;
}

export interface IInitialOrderManagementActions {
  clearState: (data: Partial<IInitialOrderManagementStore>) => void;
  setFilterData: (infoMessageBox: Object) => void;
  setIsDateRangeChanged: (isDateRangeChanged: boolean) => void;
  setPreviousCountData: (previousCountData: {
    previousCountCreated?: number;
    previousCountPicking?: number;
    previousCountSorting?: number;
    previousCountPacking?: number;
    previousCountDispatch?: number;
    previousCountSLAM?: number;
    previousCountCancelled?: number;
  }) => void;
  setModifiedSalesOrders: (modifiedSalesOrders: {
    Created?: any;
    Picking?: any;
    Sorting?: any;
    Packing?: any;
    SLAM?: any;
    Dispatch?: any;
    Cancelled?: any;
  }) => void;
  setIsResourceBusy: (isResourceBusy: any) => void;
}

/* InitalStates */
export const initialOrderManagementState: IInitialOrderManagementStore = {
  filterData: {
    operation: '',
    referenceNumber: '',
    productName: '',
    priority: '',
    salesChannel: '',
    deliveryType: '',
    onlyErrors: false,
    isCutOff: false,
    isLate: false,
  },
  previousCountData: {
    previousCountCreated: 10,
    previousCountPicking: 10,
    previousCountSorting: 10,
    previousCountPacking: 10,
    previousCountDispatch: 10,
    previousCountSLAM: 10,
    previousCountCancelled: 10,
  },
  modifiedSalesOrders: {
    Created: '',
    Picking: '',
    Sorting: '',
    Packing: '',
    SLAM: '',
    Dispatch: '',
    Cancelled: '',
  },
  isResourceBusy: false,
};

/* Actions */
export const orderManagementActions: object = {
  clearState: (
    store: Store<IInitialOrderManagementStore, IInitialOrderManagementActions>,
    data: Partial<IInitialOrderManagementStore>
  ) => {
    store.setState({ ...store.state, ...data });
  },
  setFilterData: (store: Store<IInitialOrderManagementStore, IInitialOrderManagementActions>, filterData) => {
    store.setState({ ...store.state, filterData });
  },
  setPreviousCountData: (
    store: Store<IInitialOrderManagementStore, IInitialOrderManagementActions>,
    previousCountData
  ) => {
    store.setState({ ...store.state, previousCountData });
  },
  setModifiedSalesOrders: (
    store: Store<IInitialOrderManagementStore, IInitialOrderManagementActions>,
    modifiedSalesOrders
  ) => {
    store.setState({ ...store.state, modifiedSalesOrders });
  },
  setIsResourceBusy: (
    store: Store<IInitialOrderManagementStore, IInitialOrderManagementActions>,
    isResourceBusy: any
  ) => {
    store.setState({ ...store.state, isResourceBusy });
  },
};

/* Export */
const useOrderManagementStore = globalHook<IInitialOrderManagementStore, IInitialOrderManagementActions>(
  React,
  initialOrderManagementState,
  orderManagementActions
);

export default useOrderManagementStore;
