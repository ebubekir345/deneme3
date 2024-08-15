import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { InfoMessageBoxState } from '../../components/molecules/InfoMessageBox/InfoMessageBox';
import { AddressTypeOutputDTO } from '../../services/swagger';

export enum RebinModals {
  Logout = 'Logout',
  QuarantineAddress = 'QuarantineAddress',
  DropTote = 'DropTote',
  ToteDetails = 'ToteDetails',
  TransactionHistory = 'TransactionHistory',
}

export interface IRebinStore {
  station: { id: number; label: string; discriminator: string };
  isMoreActionsOpen: boolean;
  isManuelBarcodeInputOpen: boolean;
  batchTrolleyLabel: string;
  toteCount: number;
  rebinTrolleyCount: number;
  sortingProcessReferenceNumber: number;
  rightRebinTrolleyLabel: string;
  leftRebinTrolleyLabel: string;
  isRightRebinTrolleyActive: boolean;
  isLeftRebinTrolleyActive: boolean;
  toteLabel: string;
  productCount: number;
  product: {
    productId: string;
    name: string;
    barcodes: string;
    imageURL: string;
    amount: number;
  };
  cellLabel: string;
  barcodeData: string;
  modals: {
    Logout: boolean;
    QuarantineAddress: boolean;
    DropTote: boolean;
    ToteDetails: boolean;
    TransactionHistory: boolean;
  };
  rebinTime: number;
  batchList: string;
  infoMessageBox: {
    state?: InfoMessageBoxState;
    text?: string;
    timer?: number;
  };
  isCellScanRemoved: boolean;
}

export interface IRebinActions {
  clearState: (data: Partial<IRebinStore>) => void;
  setStation: (station: { id: number; label: string; discriminator: string }) => void;
  setIsMoreActionsOpen: (status: boolean) => void;
  setIsManuelBarcodeInputOpen: (status: boolean) => void;
  setBatchTrolleyLabel: (batchTrolleyLabel: string) => void;
  setToteCount: (toteCount: number) => void;
  setRebinTrolleyCount: (rebinTrolleyCount: number) => void;
  setSortingProcessReferenceNumber: (sortingProcessReferenceNumber: number) => void;
  setRightRebinTrolleyLabel: (rightRebinTrolleyLabel: string) => void;
  setLeftRebinTrolleyLabel: (leftRebinTrolleyLabel: string) => void;
  setIsRightRebinTrolleyActive: (status: boolean) => void;
  setIsLeftRebinTrolleyActive: (status: boolean) => void;
  setToteLabel: (toteLabel: string) => void;
  setProductCount: (productCount: number) => void;
  setProduct: (product: Object) => void;
  setCellLabel: (cellLabel: string) => void;
  setBarcodeData: (barcodeData: string) => void;
  toggleModalState: (name: RebinModals, status?: boolean) => void;
  setRebinTime: (isInterval?: boolean, rebinTime?: number) => void;
  setBatchList: (batchList: string) => void;
  callInfoMessageBox: (infoMessageBox: Object) => void;
  setIsCellScanRemoved: (isCellScanRemoved: boolean) => void;
}

/* InitalStates */
export const initialRebinState: IRebinStore = {
  station: { id: 0, label: '', discriminator: '' },
  isMoreActionsOpen: false,
  isManuelBarcodeInputOpen: false,
  batchTrolleyLabel: '',
  toteCount: 0,
  rebinTrolleyCount: 0,
  sortingProcessReferenceNumber: 0,
  rightRebinTrolleyLabel: '',
  leftRebinTrolleyLabel: '',
  isRightRebinTrolleyActive: false,
  isLeftRebinTrolleyActive: false,
  toteLabel: '',
  productCount: 0,
  product: {
    productId: '',
    name: '',
    barcodes: '',
    imageURL: '',
    amount: 0,
  },
  cellLabel: '',
  barcodeData: '',
  modals: {
    Logout: false,
    QuarantineAddress: false,
    DropTote: false,
    ToteDetails: false,
    TransactionHistory: false,
  },
  rebinTime: 0,
  batchList: '',
  infoMessageBox: {
    state: InfoMessageBoxState.None,
    text: '',
    timer: 0,
  },
  isCellScanRemoved: false,
};

/* Actions */
export const rebinActions: object = {
  clearState: (store: Store<IRebinStore, IRebinActions>, data: Partial<IRebinStore>) => {
    store.setState({ ...store.state, ...data });
  },
  setStation: (store: Store<IProblemSolverStore, IProblemSolverActions>, station: AddressTypeOutputDTO) => {
    store.setState({ ...store.state, station });
  },
  setIsMoreActionsOpen: (store: Store<IRebinStore, IRebinActions>, status: boolean) => {
    store.setState({ ...store.state, isMoreActionsOpen: status });
  },
  setIsManuelBarcodeInputOpen: (store: Store<IRebinStore, IRebinActions>, status: boolean) => {
    store.setState({ ...store.state, isManuelBarcodeInputOpen: status });
  },
  setBatchTrolleyLabel: (store: Store<IRebinStore, IRebinActions>, batchTrolleyLabel: string) => {
    store.setState({ ...store.state, batchTrolleyLabel });
  },
  setToteCount: (store: Store<IRebinStore, IRebinActions>, toteCount: number) => {
    store.setState({ ...store.state, toteCount });
  },
  setRebinTrolleyCount: (store: Store<IRebinStore, IRebinActions>, rebinTrolleyCount: number) => {
    store.setState({ ...store.state, rebinTrolleyCount });
  },
  setSortingProcessReferenceNumber: (
    store: Store<IRebinStore, IRebinActions>,
    sortingProcessReferenceNumber: number
  ) => {
    store.setState({ ...store.state, sortingProcessReferenceNumber });
  },
  setRightRebinTrolleyLabel: (store: Store<IRebinStore, IRebinActions>, rightRebinTrolleyLabel: string) => {
    store.setState({ ...store.state, rightRebinTrolleyLabel });
  },
  setLeftRebinTrolleyLabel: (store: Store<IRebinStore, IRebinActions>, leftRebinTrolleyLabel: string) => {
    store.setState({ ...store.state, leftRebinTrolleyLabel });
  },
  setToteLabel: (store: Store<IRebinStore, IRebinActions>, toteLabel: string) => {
    store.setState({ ...store.state, toteLabel });
  },
  setProductCount: (store: Store<IRebinStore, IRebinActions>, productCount: number) => {
    store.setState({ ...store.state, productCount });
  },
  setProduct: (
    store: Store<IRebinStore, IRebinActions>,
    product: {
      productId: string;
      name: string;
      barcodes: string;
      imageURL: string;
      amount: number;
    }
  ) => {
    store.setState({ ...store.state, product });
  },
  setCellLabel: (store: Store<IRebinStore, IRebinActions>, cellLabel: string) => {
    store.setState({ ...store.state, cellLabel });
  },
  setIsRightRebinTrolleyActive: (store: Store<IRebinStore, IRebinActions>, status: boolean) => {
    store.setState({ ...store.state, isRightRebinTrolleyActive: status });
  },
  setIsLeftRebinTrolleyActive: (store: Store<IRebinStore, IRebinActions>, status: boolean) => {
    store.setState({ ...store.state, isLeftRebinTrolleyActive: status });
  },
  setBarcodeData: (store: Store<IRebinStore, IRebinActions>, barcodeData: string) => {
    store.setState({ ...store.state, barcodeData });
  },
  toggleModalState: (store: Store<IRebinStore, IRebinActions>, name: RebinModals, status?: boolean) => {
    const modalState = store.state.modals[name];
    const modals = {
      ...store.state.modals,
      [name]: status === undefined ? !modalState : status,
    };
    store.setState({ ...store.state, modals });
  },
  setRebinTime: (store: Store<IRebinStore, IRebinActions>, isInterval?: boolean, rebinTime?: number) => {
    store.setState({ ...store.state, rebinTime: isInterval ? store.state.rebinTime + 1 : rebinTime || 0 });
  },
  setBatchList: (store: Store<IRebinStore, IRebinActions>, batchList: string) => {
    store.setState({ ...store.state, batchList });
  },
  callInfoMessageBox: (store: Store<IRebinStore, IRebinActions>, infoMessageBox: Object) => {
    store.setState({ ...store.state, infoMessageBox });
  },
  setIsCellScanRemoved: (store: Store<IRebinStore, IRebinActions>, isCellScanRemoved: boolean) => {
    store.setState({ ...store.state, isCellScanRemoved });
  },
};

/* Export */
const useRebinStore = globalHook<IRebinStore, IRebinActions>(React, initialRebinState, rebinActions);

export default useRebinStore;
