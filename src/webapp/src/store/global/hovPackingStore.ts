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

export enum HovPackingModals {
  Logout = 'Logout',
  OrderStatus = 'OrderStatus',
  CompleteQuarantine = 'CompleteQuarantine',
  MissingItem = 'MissingItem',
  CargoPackagePick = 'CargoPackagePick',
  QuarantineAreaScan = 'QuarantineAreaScan',
  HovAddProduct = 'HovAddProduct',
  AddSerialNumber = 'AddSerialNumber',
  AddSimpleSerialNumber = 'AddSimpleSerialNumber',
}

interface ITrolleyDetails {
  label: string;
  packedCount: number;
  totalCount: number;
}

/* Interfaces */
export interface IHovPackingStore {
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
  itemCountThreshold: number;
  hovItemCount: number;
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
    HovAddProduct: boolean;
    AddSerialNumber: boolean;
    AddSimpleSerialNumber: boolean;
  };
  salesChannel: SalesChannel;
  marketPlaceName: string;
  isProductAddedIntoPackage: boolean;
  isVasAddedIntoPackage: boolean;
  trolleyDetails: ITrolleyDetails;
  boxItemToBeRemoved: BoxItemsInterface;
  infoMessageBox: {
    state?: InfoMessageBoxState;
    text?: string;
    timer?: number;
  };
  infoPopup: InfoPopupInterface;
}

export interface IHovPackingActions {
  clearState: (data: Partial<IHovPackingStore>) => void;
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
  setItemCountThreshold: (itemCountThreshold: number) => void;
  setHovItemCount: (hovItemCount: number) => void;
  setOrderId: (orderId: string) => void;
  setOperationCargoPackageTypes: (operationCargoPackageTypes: CargoPackageTypeOutputDTO[]) => void;
  setOplogCargoPackageTypes: (oplogCargoPackageTypes: CargoPackageTypeOutputDTO[]) => void;
  setSelectedCoOp: (selectedCoOp: SearchUserByFullNameOutputDTO) => void;
  setOperation: (operation: OperationOutputDTO) => void;
  setShippingFlow: (shippingFlow: ShippingFlowTag) => void;
  toggleModalState: (name: HovPackingModals, status?: boolean) => void;
  setSalesChannel: (salesChannel: SalesChannel) => void;
  setMarketPlaceName: (marketPlaceName: string) => void;
  setIsProductAddedIntoPackage: (isProductAddedIntoPackage: boolean) => void;
  setIsVasAddedIntoPackage: (isVasAddedIntoPackage: boolean) => void;
  setTrolleyDetails: (trolley: ITrolleyDetails) => void;
  setItemToBeRemove: (boxItemToBeRemoved: BoxItemsInterface) => void;
  callInfoMessageBox: (infoMessageBox: Object) => void;
  setInfoPopup: (infoPopup: InfoPopupInterface) => void;
}

/* InitalStates */
export const initialHovPackingState: IHovPackingStore = {
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
  itemCountThreshold: 0,
  hovItemCount: 1,
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
    HovAddProduct: false,
    AddSerialNumber: false,
    AddSimpleSerialNumber: false,
  },
  salesChannel: SalesChannel.Marketplace,
  marketPlaceName: '',
  isProductAddedIntoPackage: false,
  isVasAddedIntoPackage: false,
  trolleyDetails: {
    label: '',
    packedCount: 0,
    totalCount: 0,
  },
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
export const hovPackingActions: object = {
  clearState: (store: Store<IHovPackingStore, IHovPackingActions>, data: Partial<IHovPackingStore>) => {
    store.setState({ ...store.state, ...data });
  },
  setStation: (store: Store<IProblemSolverStore, IProblemSolverActions>, station: AddressTypeOutputDTO) => {
    store.setState({ ...store.state, station });
  },
  setIsMissing: (store: Store<IHovPackingStore, IHovPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isMissing: status });
  },
  setIsCancelled: (store: Store<IHovPackingStore, IHovPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isCancelled: status });
  },
  setIsLeftBarExpanded: (store: Store<IHovPackingStore, IHovPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isLeftBarExpanded: status });
  },
  setIsCoOpScreenOpen: (store: Store<IHovPackingStore, IHovPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isCoOpScreenOpen: status });
  },
  setIsMoreActionsOpen: (store: Store<IHovPackingStore, IHovPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isMoreActionsOpen: status });
  },
  setIsManuelBarcodeInputOpen: (store: Store<IHovPackingStore, IHovPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isManuelBarcodeInputOpen: status });
  },
  setErrorModalData: (
    store: Store<IHovPackingStore, IHovPackingStore>,
    errorModalData: { header: string; subHeader: string }
  ) => {
    store.setState({ ...store.state, errorModalData });
  },
  setIsOrderCompleted: (store: Store<IHovPackingStore, IHovPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isOrderCompleted: status });
  },
  setIsEligibleForSLAMPrint: (store: Store<IHovPackingStore, IHovPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isEligibleForSLAMPrint: status });
  },
  setIsSuspendedSLAM: (store: Store<IHovPackingStore, IHovPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isSuspendedSLAM: status });
  },
  setBarcodeData: (store: Store<IHovPackingStore, IHovPackingActions>, barcodeData: string) => {
    store.setState({ ...store.state, barcodeData });
  },
  setProductSerialNo: (store: Store<IHovPackingStore, IHovPackingActions>, productSerialNo: string) => {
    store.setState({ ...store.state, productSerialNo });
  },
  setBoxItems: (store: Store<IHovPackingStore, IHovPackingActions>, boxItems: BoxItemsInterface[]) => {
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
  setOrderItems: (store: Store<IHovPackingStore, IHovPackingActions>, orderItems: OrderItemsInterface[]) => {
    store.setState({ ...store.state, orderItems });
  },
  setVasItems: (store: Store<IHovPackingStore, IHovPackingActions>, vasItems: VasItemInterface[]) => {
    store.setState({ ...store.state, vasItems });
  },
  setMissingItems: (store: Store<IHovPackingStore, IHovPackingActions>, missingItems: MissingItemsInterface[]) => {
    store.setState({ ...store.state, missingItems });
  },
  setOrderBasket: (store: Store<IHovPackingStore, IHovPackingActions>, orderBasket: string) => {
    store.setState({ ...store.state, orderBasket });
  },
  setOrderNumber: (store: Store<IHovPackingStore, IHovPackingActions>, orderNumber: string) => {
    store.setState({ ...store.state, orderNumber });
  },
  setProcessId: (store: Store<IHovPackingStore, IHovPackingActions>, processId: string) => {
    store.setState({ ...store.state, processId });
  },
  setItemCountThreshold: (store: Store<IHovPackingStore, IHovPackingActions>, itemCountThreshold: number) => {
    store.setState({ ...store.state, itemCountThreshold });
  },
  setHovItemCount: (store: Store<IHovPackingStore, IHovPackingActions>, hovItemCount: number) => {
    store.setState({ ...store.state, hovItemCount });
  },
  setOrderId: (store: Store<IHovPackingStore, IHovPackingActions>, orderId: string) => {
    store.setState({ ...store.state, orderId });
  },
  setOperationCargoPackageTypes: (
    store: Store<IHovPackingStore, IHovPackingActions>,
    operationCargoPackageTypes: CargoPackageTypeOutputDTO[]
  ) => {
    store.setState({ ...store.state, operationCargoPackageTypes });
  },
  setOplogCargoPackageTypes: (
    store: Store<IHovPackingStore, IHovPackingActions>,
    oplogCargoPackageTypes: CargoPackageTypeOutputDTO[]
  ) => {
    store.setState({ ...store.state, oplogCargoPackageTypes });
  },
  setSelectedCoOp: (
    store: Store<IHovPackingStore, IHovPackingActions>,
    selectedCoOp: SearchUserByFullNameOutputDTO
  ) => {
    store.setState({ ...store.state, selectedCoOp });
  },
  setOperation: (store: Store<IHovPackingStore, IHovPackingActions>, operation: OperationOutputDTO) => {
    store.setState({ ...store.state, operation });
  },
  setShippingFlow: (store: Store<IHovPackingStore, IHovPackingActions>, shippingFlow: ShippingFlowTag) => {
    store.setState({ ...store.state, shippingFlow });
  },
  toggleModalState: (store: Store<IHovPackingStore, IHovPackingActions>, name: HovPackingModals, status?: boolean) => {
    const modalState = store.state.modals[name];
    const modals = {
      ...store.state.modals,
      [name]: status === undefined ? !modalState : status,
    };
    store.setState({ ...store.state, modals });
  },
  setSalesChannel: (store: Store<IHovPackingStore, IHovPackingActions>, salesChannel: SalesChannel) => {
    store.setState({ ...store.state, salesChannel });
  },
  setMarketPlaceName: (store: Store<IHovPackingStore, IHovPackingActions>, marketPlaceName: string) => {
    store.setState({ ...store.state, marketPlaceName });
  },
  setIsProductAddedIntoPackage: (
    store: Store<IHovPackingStore, IHovPackingActions>,
    isProductAddedIntoPackage: boolean
  ) => {
    store.setState({ ...store.state, isProductAddedIntoPackage });
  },
  setIsVasAddedIntoPackage: (store: Store<IHovPackingStore, IHovPackingActions>, isVasAddedIntoPackage: boolean) => {
    store.setState({ ...store.state, isVasAddedIntoPackage });
  },
  setTrolleyDetails: (store: Store<IHovPackingStore, IHovPackingActions>, trolley: ITrolleyDetails) => {
    store.setState({ ...store.state, trolleyDetails: trolley });
  },
  setItemToBeRemove: (store: Store<IHovPackingStore, IHovPackingActions>, boxItemToBeRemoved: BoxItemsInterface) => {
    store.setState({ ...store.state, boxItemToBeRemoved });
  },
  callInfoMessageBox: (store: Store<IHovPackingStore, IHovPackingActions>, infoMessageBox: Object) => {
    store.setState({ ...store.state, infoMessageBox });
  },
  setInfoPopup: (store: Store<IHovPackingStore, IHovPackingActions>, infoPopup: InfoPopupInterface) => {
    store.setState({ ...store.state, infoPopup });
  },
};

/* Export */
const useHovPackingStore = globalHook<IHovPackingStore, IHovPackingActions>(
  React,
  initialHovPackingState,
  hovPackingActions
);

export default useHovPackingStore;
