import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { InfoMessageBoxState } from '../../components/molecules/InfoMessageBox/InfoMessageBox';
import { AddressTypeOutputDTO, CargoPackageTypeOutputDTO, OperationOutputDTO, ShippingFlowTag } from '../../services/swagger';

export enum SimplePackingModals {
  Logout = 'Logout',
  CargoPackagePick = 'CargoPackagePick',
}

/* Interfaces */
export interface ISimplePackingStore {
  station: { id: number; label: string; discriminator: string };
  isMoreActionsOpen: boolean;
  isManuelBarcodeInputOpen: boolean;
  isOrderCompleted: boolean;
  isEligibleForSLAMPrint: boolean;
  isSuspendedSLAM: boolean;
  barcodeData: string;
  boxItems: BoxItemsInterface[];
  orderItems: OrderItemsInterface[];
  orderNumber: string;
  orderId: string;
  processId: string;
  operationCargoPackageTypes: CargoPackageTypeOutputDTO[];
  oplogCargoPackageTypes: CargoPackageTypeOutputDTO[];
  operation: OperationOutputDTO;
  modals: {
    Logout: boolean;
    CargoPackagePick: boolean;
  };
  infoMessageBox: {
    state?: InfoMessageBoxState;
    text?: string;
    timer?: number;
  };
  simplePackingTime: number;
  isProductAddedIntoPackage: boolean;
  isAllItemsAdded: boolean;
  shippingFlow: undefined | ShippingFlowTag;
}

export interface ISimplePackingActions {
  clearState: (data: Partial<ISimplePackingStore>) => void;
  setStation: (station: { id: number; label: string; discriminator: string }) => void;
  setIsMoreActionsOpen: (status: boolean) => void;
  setIsManuelBarcodeInputOpen: (status: boolean) => void;
  setIsOrderCompleted: (status: boolean) => void;
  setIsEligibleForSLAMPrint: (status: boolean) => void;
  setIsSuspendedSLAM: (status: boolean) => void;
  setBarcodeData: (barcodeData: string) => void;
  setBoxItems: (boxItems: BoxItemsInterface[]) => void;
  setOrderItems: (boxItems: OrderItemsInterface[]) => void;
  setOrderNumber: (orderNumber: string) => void;
  setProcessId: (processId: string) => void;
  setOrderId: (orderId: string) => void;
  setOperationCargoPackageTypes: (operationCargoPackageTypes: CargoPackageTypeOutputDTO[]) => void;
  setOplogCargoPackageTypes: (oplogCargoPackageTypes: CargoPackageTypeOutputDTO[]) => void;
  setOwnContaineCargoPackageTypes: (ownContainerCargoPackageTypes: CargoPackageTypeOutputDTO[]) => void;
  setOperation: (operation: OperationOutputDTO) => void;
  toggleModalState: (name: SimplePackingModals, status?: boolean) => void;
  callInfoMessageBox: (infoMessageBox: Object) => void;
  setSimplePackingTime: (isInterval?: boolean, simplePackingTime?: number) => void;
  setIsProductAddedIntoPackage: (status: boolean) => void;
  setIsAllItemsAdded: (status: boolean) => void;
  setShippingFlow: (shippingFlow: ShippingFlowTag) => void;
}

/* InitalStates */
export const initialSimplePackingState: ISimplePackingStore = {
  station: { id: 0, label: '', discriminator: '' },
  isMoreActionsOpen: false,
  isManuelBarcodeInputOpen: false,
  isOrderCompleted: false,
  isEligibleForSLAMPrint: false,
  isSuspendedSLAM: false,
  barcodeData: '',
  boxItems: [],
  orderItems: [],
  orderNumber: '',
  orderId: '',
  processId: '',
  operationCargoPackageTypes: [],
  oplogCargoPackageTypes: [],
  operation: { id: '', name: '', imageUrl: '' },
  modals: {
    Logout: false,
    CargoPackagePick: false,
  },
  infoMessageBox: {
    state: InfoMessageBoxState.None,
    text: '',
    timer: 0,
  },
  simplePackingTime: 0,
  isProductAddedIntoPackage: false,
  isAllItemsAdded: false,
  shippingFlow: undefined,
};

/* Actions */
export const singleItemPackingActions: object = {
  clearState: (store: Store<ISimplePackingStore, ISimplePackingActions>, data: Partial<ISimplePackingStore>) => {
    store.setState({ ...store.state, ...data });
  },
  setStation: (store: Store<IProblemSolverStore, IProblemSolverActions>, station: AddressTypeOutputDTO) => {
    store.setState({ ...store.state, station });
  },
  setIsMoreActionsOpen: (store: Store<ISimplePackingStore, ISimplePackingActions>, status: boolean) => {
    store.setState({ ...store.state, isMoreActionsOpen: status });
  },
  setIsManuelBarcodeInputOpen: (store: Store<ISimplePackingStore, ISimplePackingActions>, status: boolean) => {
    store.setState({ ...store.state, isManuelBarcodeInputOpen: status });
  },
  setIsOrderCompleted: (store: Store<ISimplePackingStore, ISimplePackingActions>, status: boolean) => {
    store.setState({ ...store.state, isOrderCompleted: status });
  },
  setIsEligibleForSLAMPrint: (store: Store<ISimplePackingStore, ISimplePackingActions>, status: boolean) => {
    store.setState({ ...store.state, isEligibleForSLAMPrint: status });
  },
  setIsSuspendedSLAM: (store: Store<ISimplePackingStore, ISimplePackingActions>, status: boolean) => {
    store.setState({ ...store.state, isSuspendedSLAM: status });
  },
  setBarcodeData: (store: Store<ISimplePackingStore, ISimplePackingActions>, barcodeData: string) => {
    store.setState({ ...store.state, barcodeData });
  },
  setBoxItems: (store: Store<ISimplePackingStore, ISimplePackingActions>, boxItems: BoxItemsInterface[]) => {
    store.setState({ ...store.state, boxItems });
  },
  setOrderItems: (store: Store<ISimplePackingStore, ISimplePackingActions>, orderItems: OrderItemsInterface[]) => {
    store.setState({ ...store.state, orderItems });
  },
  setOrderNumber: (store: Store<ISimplePackingStore, ISimplePackingActions>, orderNumber: string) => {
    store.setState({ ...store.state, orderNumber });
  },
  setProcessId: (store: Store<ISimplePackingStore, ISimplePackingActions>, processId: string) => {
    store.setState({ ...store.state, processId });
  },
  setOrderId: (store: Store<ISimplePackingStore, ISimplePackingActions>, orderId: string) => {
    store.setState({ ...store.state, orderId });
  },
  setOperationCargoPackageTypes: (
    store: Store<ISimplePackingStore, ISimplePackingActions>,
    operationCargoPackageTypes: CargoPackageTypeOutputDTO[]
  ) => {
    store.setState({ ...store.state, operationCargoPackageTypes });
  },
  setOplogCargoPackageTypes: (
    store: Store<ISimplePackingStore, ISimplePackingActions>,
    oplogCargoPackageTypes: CargoPackageTypeOutputDTO[]
  ) => {
    store.setState({ ...store.state, oplogCargoPackageTypes });
  },
  setOperation: (store: Store<ISimplePackingStore, ISimplePackingActions>, operation: OperationOutputDTO) => {
    store.setState({ ...store.state, operation });
  },
  toggleModalState: (
    store: Store<ISimplePackingStore, ISimplePackingActions>,
    name: SimplePackingModals,
    status?: boolean
  ) => {
    const modalState = store.state.modals[name];
    const modals = {
      ...store.state.modals,
      [name]: status === undefined ? !modalState : status,
    };
    store.setState({ ...store.state, modals });
  },

  callInfoMessageBox: (store: Store<ISimplePackingStore, ISimplePackingActions>, infoMessageBox: Object) => {
    store.setState({ ...store.state, infoMessageBox });
  },
  setSimplePackingTime: (
    store: Store<ISimplePackingStore, ISimplePackingActions>,
    isInterval?: boolean,
    simplePackingTime?: number
  ) => {
    store.setState({
      ...store.state,
      simplePackingTime: isInterval ? store.state.simplePackingTime + 1 : simplePackingTime || 0,
    });
  },
  setIsProductAddedIntoPackage: (store: Store<ISimplePackingStore, ISimplePackingActions>, status: boolean) => {
    store.setState({ ...store.state, isProductAddedIntoPackage: status });
  },
  setIsAllItemsAdded: (store: Store<ISimplePackingStore, ISimplePackingActions>, status: boolean) => {
    store.setState({ ...store.state, isAllItemsAdded: status });
  },
  setShippingFlow: (store: Store<ISimplePackingStore, ISimplePackingActions>, shippingFlow: ShippingFlowTag) => {
    store.setState({ ...store.state, shippingFlow });
  },
};

/* Export */
const useSimplePackingStore = globalHook<ISimplePackingStore, ISimplePackingActions>(
  React,
  initialSimplePackingState,
  singleItemPackingActions
);

export default useSimplePackingStore;
