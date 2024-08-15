import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { InfoMessageBoxState } from '../../components/molecules/InfoMessageBox/InfoMessageBox';
import { AddressTypeOutputDTO, OperationOutputDTO } from '../../services/swagger';
import { MissingItemTransferModals } from '../../typings/globalStore/enums';

export interface IMissingItemTransferStore {
  station: { id: number; label: string; discriminator: string };
  isMissing: boolean;
  isCancelled: boolean;
  isLeftBarExpanded: boolean;
  isMoreActionsOpen: boolean;
  isManuelBarcodeInputOpen: boolean;
  isOrderCompleted: boolean;
  isMissingDuringTransfer: boolean;
  barcodeData: string;
  boxItems: BoxItemsInterface[];
  orderItems: OrderItemsInterface[];
  missingItems: MissingItemsInterface[];
  quarantineToteItems: MissingItemsInterface[];
  orderBasket: string;
  orderNumber: string;
  orderId: string;
  processId: string;
  quarantineToteLabel: string;
  operation: OperationOutputDTO;
  modals: {
    Logout: boolean;
    OrderStatus: boolean;
    CompleteMissingItemTransfer: boolean;
    MissingItem: boolean;
    SerialNumber: boolean;
  };
  isQuarantineToteInQurantineArea: boolean;
  pickingToteContainedItemSerialNumbers: {};
  errorData: {
    header: string;
    subHeader?: string;
  }
  infoMessageBox: {
    state?: InfoMessageBoxState;
    text?: string;
    timer?: number;
  };
}

export interface IMissingItemTransferActions {
  clearState: (data: Partial<IMissingItemTransferStore>) => void;
  setStation: (station: { id: number; label: string; discriminator: string }) => void;
  setIsMissing: (status: boolean) => void;
  setIsCancelled: (status: boolean) => void;
  setIsLeftBarExpanded: (status: boolean) => void;
  setIsMoreActionsOpen: (status: boolean) => void;
  setIsManuelBarcodeInputOpen: (status: boolean) => void;
  setIsOrderCompleted: (status: boolean) => void;
  setIsMissingDuringTransfer: (status: boolean) => void;
  setBarcodeData: (barcodeData: string) => void;
  setBoxItems: (boxItems: BoxItemsInterface[]) => void;
  setOrderItems: (boxItems: OrderItemsInterface[]) => void;
  setMissingItems: (missingItems: MissingItemsInterface[]) => void;
  setQuarantineToteItems: (quarantineToteItems: MissingItemsInterface[]) => void;
  setOrderBasket: (orderBasket: string) => void;
  setOrderNumber: (orderNumber: string) => void;
  setProcessId: (processId: string) => void;
  setOrderId: (orderId: string) => void;
  setQuarantineToteLabel: (quarantineToteLabel: string) => void;
  setOperation: (operation: OperationOutputDTO) => void;
  toggleModalState: (name: MissingItemTransferModals, status?: boolean) => void;
  setIsQuarantineToteInQurantineArea: (status: boolean) => void;
  setPickingToteContainedItemSerialNumbers: (pickingToteContainedItemSerialNumbers: {}) => void;
  setErrorData: (errorData: { }) => void;
  callInfoMessageBox: (infoMessageBox: Object) => void;
}

/* InitalStates */
export const initialMissingItemTransferState: IMissingItemTransferStore = {
  station: { id: 0, label: '', discriminator: '' },
  isMissing: false,
  isCancelled: false,
  isLeftBarExpanded: false,
  isMoreActionsOpen: false,
  isManuelBarcodeInputOpen: false,
  isOrderCompleted: false,
  isMissingDuringTransfer: false,
  barcodeData: '',
  boxItems: [],
  orderItems: [],
  missingItems: [],
  quarantineToteItems: [],
  orderBasket: '',
  orderNumber: '',
  orderId: '',
  processId: '',
  quarantineToteLabel: '',
  operation: { id: '', name: '', imageUrl: '' },
  modals: {
    Logout: false,
    OrderStatus: false,
    CompleteMissingItemTransfer: false,
    MissingItem: false,
    SerialNumber: false,
  },
  isQuarantineToteInQurantineArea: false,
  pickingToteContainedItemSerialNumbers: {},
  errorData: {
    header: '',
    subHeader: '',
  },
  infoMessageBox: {
    state: InfoMessageBoxState.None,
    text: '',
    timer: 0,
  },
};

/* Actions */
export const MissingItemTransferActions: object = {
  clearState: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    data: Partial<IMissingItemTransferStore>
  ) => {
    store.setState({ ...store.state, ...data });
  },
  setStation: (store: Store<IProblemSolverStore, IProblemSolverActions>, station: AddressTypeOutputDTO) => {
    store.setState({ ...store.state, station });
  },
  setIsMissing: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, status: boolean) => {
    store.setState({ ...store.state, isMissing: status });
  },
  setIsCancelled: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, status: boolean) => {
    store.setState({ ...store.state, isCancelled: status });
  },
  setIsLeftBarExpanded: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, status: boolean) => {
    store.setState({ ...store.state, isLeftBarExpanded: status });
  },
  setIsMoreActionsOpen: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, status: boolean) => {
    store.setState({ ...store.state, isMoreActionsOpen: status });
  },
  setIsManuelBarcodeInputOpen: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    status: boolean
  ) => {
    store.setState({ ...store.state, isManuelBarcodeInputOpen: status });
  },
  setIsOrderCompleted: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, status: boolean) => {
    store.setState({ ...store.state, isOrderCompleted: status });
  },
  setIsMissingDuringTransfer: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    status: boolean
  ) => {
    store.setState({ ...store.state, isMissingDuringTransfer: status });
  },
  setBarcodeData: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, barcodeData: string) => {
    store.setState({ ...store.state, barcodeData });
  },
  setBoxItems: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    boxItems: BoxItemsInterface[]
  ) => {
    const orderItems = store.state.orderItems.map(orderItem => {
      const boxedCount = parseInt(
        boxItems.reduce((accumulator, boxItem) => {
          let localBoxedCount = boxItem.content.filter(content => {
            return content.productId === orderItem.productId;
          });
          if (localBoxedCount.length) {
            localBoxedCount = localBoxedCount[0].count;
          } else {
            localBoxedCount = 0;
          }
          return accumulator + localBoxedCount;
        }, 0),
        10
      );
      return { ...orderItem, boxedCount };
    });
    store.setState({ ...store.state, orderItems, boxItems });
  },
  setOrderItems: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    orderItems: OrderItemsInterface[]
  ) => {
    store.setState({ ...store.state, orderItems });
  },
  setMissingItems: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    missingItems: MissingItemsInterface[]
  ) => {
    store.setState({ ...store.state, missingItems });
  },
  setQuarantineToteItems: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    quarantineToteItems: MissingItemsInterface[]
  ) => {
    store.setState({ ...store.state, quarantineToteItems });
  },
  setOrderBasket: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, orderBasket: string) => {
    store.setState({ ...store.state, orderBasket });
  },
  setOrderNumber: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, orderNumber: string) => {
    store.setState({ ...store.state, orderNumber });
  },
  setProcessId: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, processId: string) => {
    store.setState({ ...store.state, processId });
  },
  setOrderId: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, orderId: string) => {
    store.setState({ ...store.state, orderId });
  },
  setQuarantineToteLabel: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    quarantineToteLabel: string
  ) => {
    store.setState({ ...store.state, quarantineToteLabel });
  },
  setOperation: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    operation: OperationOutputDTO
  ) => {
    store.setState({ ...store.state, operation });
  },
  toggleModalState: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    name: MissingItemTransferModals,
    status?: boolean
  ) => {
    const modalState = store.state.modals[name];
    const modals = {
      ...store.state.modals,
      [name]: status === undefined ? !modalState : status,
    };
    store.setState({ ...store.state, modals });
  },
  setIsQuarantineToteInQurantineArea: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    isQuarantineToteInQurantineArea: boolean
  ) => {
    store.setState({ ...store.state, isQuarantineToteInQurantineArea });
  },
  setPickingToteContainedItemSerialNumbers: (
    store: Store<IMissingItemTransferStore, IMissingItemTransferActions>,
    pickingToteContainedItemSerialNumbers: {}
  ) => {
    store.setState({ ...store.state, pickingToteContainedItemSerialNumbers });
  },
  setErrorData: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, errorData) => {
    store.setState({ ...store.state, errorData });
  },
  callInfoMessageBox: (store: Store<IMissingItemTransferStore, IMissingItemTransferActions>, infoMessageBox: Object) => {
    store.setState({ ...store.state, infoMessageBox });
  },
};

/* Export */
const useMissingItemTransferStore = globalHook<IMissingItemTransferStore, IMissingItemTransferActions>(
  React,
  initialMissingItemTransferState,
  MissingItemTransferActions
);

export default useMissingItemTransferStore;
