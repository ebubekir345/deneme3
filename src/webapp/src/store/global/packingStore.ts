import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { InfoMessageBoxState } from '../../components/molecules/InfoMessageBox/InfoMessageBox';
import {
  AddressTypeOutputDTO,
  CargoPackageTypeOutputDTO,
  OperationOutputDTO,
  SalesChannel,
  SearchUserByFullNameOutputDTO,
  ShippingFlowTag,
} from '../../services/swagger';

export enum PackingModals {
  Logout = 'Logout',
  OrderStatus = 'OrderStatus',
  CompleteQuarantine = 'CompleteQuarantine',
  MissingItem = 'MissingItem',
  CargoPackagePick = 'CargoPackagePick',
  QuarantineAreaScan = 'QuarantineAreaScan',
  AddSerialNumber = 'AddSerialNumber',
}

/* Interfaces */
export interface IPackingStore {
  station: { id: number; label: string; discriminator: string; isPrintAdditionalPackageLabel: boolean };
  isMissing: boolean;
  isCancelled: boolean;
  isLeftBarExpanded: boolean;
  isCoOpScreenOpen: boolean;
  isMoreActionsOpen: boolean;
  isManuelBarcodeInputOpen: boolean;
  errorModalData: {
    header: string;
    subHeader?: string;
  };
  isOrderCompleted: boolean;
  isEligibleForSLAMPrint: boolean;
  isSuspendedSLAM: boolean;
  barcodeData: string;
  productSerialNo: string;
  boxItems: BoxItemsInterface[];
  orderItems: OrderItemsInterface[];
  vasItems: VasItemInterface[];
  missingItems: MissingItemsInterface[];
  orderBasket: string;
  orderNumber: string;
  orderId: string;
  processId: string;
  operationCargoPackageTypes: CargoPackageTypeOutputDTO[];
  oplogCargoPackageTypes: CargoPackageTypeOutputDTO[];
  selectedCoOp: SearchUserByFullNameOutputDTO;
  operation: OperationOutputDTO;
  shippingFlow: undefined | ShippingFlowTag;
  modals: {
    Logout: boolean;
    OrderStatus: boolean;
    CompleteQuarantine: boolean;
    MissingItem: boolean;
    CargoPackagePick: boolean;
    QuarantineAreaScan: boolean;
    AddSerialNumber: boolean;
  };
  salesChannel: SalesChannel;
  marketPlaceName: string;
  isProductAddedIntoPackage: boolean;
  isVasAddedIntoPackage: boolean;
  boxItemToBeRemoved: BoxItemsInterface;
  infoMessageBox: {
    state?: InfoMessageBoxState;
    text?: string;
    timer?: number;
  };
  infoPopup: InfoPopupInterface;
}

export interface IPackingActions {
  clearState: (data: Partial<IPackingStore>) => void;
  setStation: (station: {
    id: number;
    label: string;
    discriminator: string;
    isPrintAdditionalPackageLabel: boolean;
  }) => void;
  setIsMissing: (status: boolean) => void;
  setIsCancelled: (status: boolean) => void;
  setIsLeftBarExpanded: (status: boolean) => void;
  setIsCoOpScreenOpen: (status: boolean) => void;
  setIsMoreActionsOpen: (status: boolean) => void;
  setErrorModalData: (status: { header: string; subHeader?: string }) => void;
  setIsManuelBarcodeInputOpen: (status: boolean) => void;
  setIsOrderCompleted: (status: boolean) => void;
  setIsEligibleForSLAMPrint: (status: boolean) => void;
  setIsSuspendedSLAM: (status: boolean) => void;
  setBarcodeData: (barcodeData: string) => void;
  setProductSerialNo: (productSerialNo: string) => void;
  setBoxItems: (boxItems: BoxItemsInterface[]) => void;
  setOrderItems: (boxItems: OrderItemsInterface[]) => void;
  setVasItems: (vasItems: VasItemInterface[]) => void;
  setMissingItems: (missingItems: MissingItemsInterface[]) => void;
  setOrderBasket: (orderBasket: string) => void;
  setOrderNumber: (orderNumber: string) => void;
  setProcessId: (processId: string) => void;
  setOrderId: (orderId: string) => void;
  setOperationCargoPackageTypes: (operationCargoPackageTypes: CargoPackageTypeOutputDTO[]) => void;
  setOplogCargoPackageTypes: (oplogCargoPackageTypes: CargoPackageTypeOutputDTO[]) => void;
  setSelectedCoOp: (selectedCoOp: SearchUserByFullNameOutputDTO) => void;
  setOperation: (operation: OperationOutputDTO) => void;
  setShippingFlow: (shippingFlow: ShippingFlowTag) => void;
  toggleModalState: (name: PackingModals, status?: boolean) => void;
  setSalesChannel: (salesChannel: SalesChannel) => void;
  setMarketPlaceName: (marketPlaceName: string) => void;
  setIsProductAddedIntoPackage: (isProductAddedIntoPackage: boolean) => void;
  setIsVasAddedIntoPackage: (isVasAddedIntoPackage: boolean) => void;
  setItemToBeRemove: (boxItemToBeRemoved: BoxItemsInterface) => void;
  callInfoMessageBox: (infoMessageBox: Object) => void;
  setInfoPopup: (infoPopup: InfoPopupInterface) => void;
}

/* InitalStates */
export const initialPackingState: IPackingStore = {
  station: { id: 0, label: '', discriminator: '', isPrintAdditionalPackageLabel: false },
  isMissing: false,
  isCancelled: false,
  isLeftBarExpanded: false,
  isCoOpScreenOpen: false,
  isMoreActionsOpen: false,
  isManuelBarcodeInputOpen: false,
  errorModalData: {
    header: '',
    subHeader: '',
  },
  isOrderCompleted: false,
  isEligibleForSLAMPrint: false,
  isSuspendedSLAM: false,
  barcodeData: '',
  productSerialNo: '',
  boxItems: [],
  orderItems: [],
  vasItems: [],
  missingItems: [],
  orderBasket: '',
  orderNumber: '',
  orderId: '',
  processId: '',
  operationCargoPackageTypes: [],
  oplogCargoPackageTypes: [],
  selectedCoOp: { id: '', fullName: '' },
  operation: { id: '', name: '', imageUrl: '' },
  shippingFlow: undefined,
  modals: {
    Logout: false,
    OrderStatus: false,
    CompleteQuarantine: false,
    MissingItem: false,
    CargoPackagePick: false,
    QuarantineAreaScan: false,
    AddSerialNumber: false,
  },
  salesChannel: SalesChannel.Marketplace,
  marketPlaceName: '',
  isProductAddedIntoPackage: false,
  isVasAddedIntoPackage: false,
  boxItemToBeRemoved: {
    key: 0,
    title: '',
    selected: false,
    content: [],
  },
  infoMessageBox: {
    state: InfoMessageBoxState.None,
    text: '',
    timer: 0,
  },
  infoPopup: {
    isOpen: false,
    header: '',
    subHeader: '',
    icon: '',
  },
};

/* Actions */
export const packingActions: object = {
  clearState: (store: Store<IPackingStore, IPackingActions>, data: Partial<IPackingStore>) => {
    store.setState({ ...store.state, ...data });
  },
  setStation: (store: Store<IProblemSolverStore, IProblemSolverActions>, station: AddressTypeOutputDTO) => {
    store.setState({ ...store.state, station });
  },
  setIsMissing: (store: Store<IPackingStore, IPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isMissing: status });
  },
  setIsCancelled: (store: Store<IPackingStore, IPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isCancelled: status });
  },
  setIsLeftBarExpanded: (store: Store<IPackingStore, IPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isLeftBarExpanded: status });
  },
  setIsCoOpScreenOpen: (store: Store<IPackingStore, IPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isCoOpScreenOpen: status });
  },
  setIsMoreActionsOpen: (store: Store<IPackingStore, IPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isMoreActionsOpen: status });
  },
  setIsManuelBarcodeInputOpen: (store: Store<IPackingStore, IPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isManuelBarcodeInputOpen: status });
  },
  setErrorModalData: (
    store: Store<IPackingStore, IPackingActions>,
    errorModalData: { header: string; subHeader: string }
  ) => {
    store.setState({ ...store.state, errorModalData });
  },
  setIsOrderCompleted: (store: Store<IPackingStore, IPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isOrderCompleted: status });
  },
  setIsEligibleForSLAMPrint: (store: Store<IPackingStore, IPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isEligibleForSLAMPrint: status });
  },
  setIsSuspendedSLAM: (store: Store<IPackingStore, IPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isSuspendedSLAM: status });
  },
  setBarcodeData: (store: Store<IPackingStore, IPackingActions>, barcodeData: string) => {
    store.setState({ ...store.state, barcodeData });
  },
  setProductSerialNo: (store: Store<IPackingStore, IPackingActions>, productSerialNo: string) => {
    store.setState({ ...store.state, productSerialNo });
  },
  setBoxItems: (store: Store<IPackingStore, IPackingActions>, boxItems: BoxItemsInterface[]) => {
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
  setOrderItems: (store: Store<IPackingStore, IPackingActions>, orderItems: OrderItemsInterface[]) => {
    store.setState({ ...store.state, orderItems });
  },
  setVasItems: (store: Store<IPackingStore, IPackingActions>, vasItems: VasItemInterface[]) => {
    store.setState({ ...store.state, vasItems });
  },
  setMissingItems: (store: Store<IPackingStore, IPackingActions>, missingItems: MissingItemsInterface[]) => {
    store.setState({ ...store.state, missingItems });
  },
  setOrderBasket: (store: Store<IPackingStore, IPackingActions>, orderBasket: string) => {
    store.setState({ ...store.state, orderBasket });
  },
  setOrderNumber: (store: Store<IPackingStore, IPackingActions>, orderNumber: string) => {
    store.setState({ ...store.state, orderNumber });
  },
  setProcessId: (store: Store<IPackingStore, IPackingActions>, processId: string) => {
    store.setState({ ...store.state, processId });
  },
  setOrderId: (store: Store<IPackingStore, IPackingActions>, orderId: string) => {
    store.setState({ ...store.state, orderId });
  },
  setOperationCargoPackageTypes: (
    store: Store<IPackingStore, IPackingActions>,
    operationCargoPackageTypes: CargoPackageTypeOutputDTO[]
  ) => {
    store.setState({ ...store.state, operationCargoPackageTypes });
  },
  setOplogCargoPackageTypes: (
    store: Store<IPackingStore, IPackingActions>,
    oplogCargoPackageTypes: CargoPackageTypeOutputDTO[]
  ) => {
    store.setState({ ...store.state, oplogCargoPackageTypes });
  },
  setSelectedCoOp: (store: Store<IPackingStore, IPackingActions>, selectedCoOp: SearchUserByFullNameOutputDTO) => {
    store.setState({ ...store.state, selectedCoOp });
  },
  setOperation: (store: Store<IPackingStore, IPackingActions>, operation: OperationOutputDTO) => {
    store.setState({ ...store.state, operation });
  },
  setShippingFlow: (store: Store<IPackingStore, IPackingActions>, shippingFlow: ShippingFlowTag) => {
    store.setState({ ...store.state, shippingFlow });
  },
  toggleModalState: (store: Store<IPackingStore, IPackingActions>, name: PackingModals, status?: boolean) => {
    const modalState = store.state.modals[name];
    const modals = {
      ...store.state.modals,
      [name]: status === undefined ? !modalState : status,
    };
    store.setState({ ...store.state, modals });
  },
  setSalesChannel: (store: Store<IPackingStore, IPackingActions>, salesChannel: SalesChannel) => {
    store.setState({ ...store.state, salesChannel });
  },
  setMarketPlaceName: (store: Store<IPackingStore, IPackingActions>, marketPlaceName: string) => {
    store.setState({ ...store.state, marketPlaceName });
  },
  setIsProductAddedIntoPackage: (store: Store<IPackingStore, IPackingActions>, isProductAddedIntoPackage: boolean) => {
    store.setState({ ...store.state, isProductAddedIntoPackage });
  },
  setIsVasAddedIntoPackage: (store: Store<IPackingStore, IPackingActions>, isVasAddedIntoPackage: boolean) => {
    store.setState({ ...store.state, isVasAddedIntoPackage });
  },
  setItemToBeRemove: (store: Store<IPackingStore, IPackingActions>, boxItemToBeRemoved: BoxItemsInterface) => {
    store.setState({ ...store.state, boxItemToBeRemoved });
  },
  callInfoMessageBox: (store: Store<IPackingStore, IPackingActions>, infoMessageBox: Object) => {
    store.setState({ ...store.state, infoMessageBox });
  },
  setInfoPopup: (store: Store<IPackingStore, IPackingActions>, infoPopup: InfoPopupInterface) => {
    store.setState({ ...store.state, infoPopup });
  },
};

/* Export */
const usePackingStore = globalHook<IPackingStore, IPackingActions>(React, initialPackingState, packingActions);

export default usePackingStore;
