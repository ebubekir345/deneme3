import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { InfoMessageBoxState } from '../../components/molecules/InfoMessageBox/InfoMessageBox';
import {
  AddressTypeOutputDTO,
  CargoPackageTypeOutputDTO,
  OperationOutputDTO,
  SalesChannel,
  ShippingFlowTag,
} from '../../services/swagger';

export enum SingleItemPackingModals {
  Logout = 'Logout',
  OrderStatus = 'OrderStatus',
  DropTote = 'DropTote',
  CargoPackagePick = 'CargoPackagePick',
  ParkAreaScan = 'ParkAreaScan',
  SerialNumber = 'SerialNumber',
}

/* Interfaces */
export interface ISingleItemPackingStore {
  station: AddressTypeOutputDTO;
  isMoreActionsOpen: boolean;
  isManuelBarcodeInputOpen: boolean;
  isOrderCompleted: boolean;
  isEligibleForSLAMPrint: boolean;
  isSioc: boolean;
  isSuspendedSLAM: boolean;
  barcodeData: string;
  boxItems: BoxItemsInterface[];
  orderItems: OrderItemsInterface[];
  vasItems: VasItemInterface[];
  toteLabel: string;
  toteContainedItemCount: number;
  orderNumber: string;
  orderId: string;
  processId: string;
  packingProcessId: string;
  quarantineToteLabel: string;
  quarantineAddressLabel: string;
  operationCargoPackageTypes: CargoPackageTypeOutputDTO[];
  oplogCargoPackageTypes: CargoPackageTypeOutputDTO[];
  ownContainerCargoPackageTypes: CargoPackageTypeOutputDTO[];
  operation: OperationOutputDTO;
  shippingFlow: undefined | ShippingFlowTag;
  modals: {
    Logout: boolean;
    OrderStatus: boolean;
    DropTote: boolean;
    CargoPackagePick: boolean;
    ParkAreaScan: boolean;
    SerialNumber: boolean;
  };
  salesChannel: SalesChannel;
  marketPlaceName: string;
  selectedCargoPackageTypeBarcode: string;
  serialNumber: string;
  simpleSerialNumber: string;
  product: ProductInterface[];
  infoMessageBox: {
    state?: InfoMessageBoxState;
    text?: string;
    timer?: number;
  };
  infoPopup: InfoPopupInterface;
}

export interface ISingleItemPackingActions {
  clearState: (data: Partial<ISingleItemPackingStore>) => void;
  setStation: (station: AddressTypeOutputDTO) => void;
  setIsMoreActionsOpen: (status: boolean) => void;
  setIsManuelBarcodeInputOpen: (status: boolean) => void;
  setIsOrderCompleted: (status: boolean) => void;
  setIsEligibleForSLAMPrint: (status: boolean) => void;
  setIsSuspendedSLAM: (status: boolean) => void;
  setIsSioc: (isSioc: boolean) => void;
  setBarcodeData: (barcodeData: string) => void;
  setBoxItems: (boxItems: BoxItemsInterface[]) => void;
  setOrderItems: (boxItems: OrderItemsInterface[]) => void;
  setVasItems: (vasItems: VasItemInterface[]) => void;
  setToteLabel: (toteLabel: string) => void;
  setToteContainedItemCount: (toteContainedItemCount: number) => void;
  setOrderNumber: (orderNumber: string) => void;
  setProcessId: (processId: string) => void;
  setPackingProcessId: (packingProcessId: string) => void;
  setOrderId: (orderId: string) => void;
  setQuarantineToteLabel: (quarantineToteLabel: string) => void;
  setQuarantineAddressLabel: (quarantineAddressLabel: string) => void;
  setOperationCargoPackageTypes: (operationCargoPackageTypes: CargoPackageTypeOutputDTO[]) => void;
  setOplogCargoPackageTypes: (oplogCargoPackageTypes: CargoPackageTypeOutputDTO[]) => void;
  setOwnContainerCargoPackageTypes: (ownContainerCargoPackageTypes: CargoPackageTypeOutputDTO[]) => void;
  setOperation: (operation: OperationOutputDTO) => void;
  setShippingFlow: (shippingFlow: ShippingFlowTag) => void;
  toggleModalState: (name: SingleItemPackingModals, status?: boolean) => void;
  setSalesChannel: (salesChannel: SalesChannel) => void;
  setMarketPlaceName: (marketPlaceName: string) => void;
  setSelectedCargoPackageTypeBarcode: (selectedCargoPackageTypeBarcode: string) => void;
  setSerialNumber: (serialNumber: string) => void;
  setSimpleSerialNumber: (simpleSerialNumber: string) => void;
  setProduct: (product: ProductInterface[]) => void;
  callInfoMessageBox: (infoMessageBox: Object) => void;
  setInfoPopup: (infoPopup: InfoPopupInterface) => void;
}

/* InitalStates */
export const initialSingleItemPackingState: ISingleItemPackingStore = {
  station: { id: 0, label: '', discriminator: '' },
  isMoreActionsOpen: false,
  isManuelBarcodeInputOpen: false,
  isOrderCompleted: false,
  isEligibleForSLAMPrint: false,
  isSuspendedSLAM: false,
  isSioc: false,
  barcodeData: '',
  boxItems: [],
  orderItems: [],
  vasItems: [],
  toteLabel: '',
  toteContainedItemCount: 0,
  orderNumber: '',
  orderId: '',
  processId: '',
  packingProcessId: '',
  quarantineToteLabel: '',
  quarantineAddressLabel: '',
  operationCargoPackageTypes: [],
  oplogCargoPackageTypes: [],
  ownContainerCargoPackageTypes: [],
  operation: { id: '', name: '', imageUrl: '' },
  shippingFlow: undefined,
  modals: {
    Logout: false,
    OrderStatus: false,
    DropTote: false,
    CargoPackagePick: false,
    ParkAreaScan: false,
    SerialNumber: false,
  },
  salesChannel: SalesChannel.Marketplace,
  marketPlaceName: '',
  selectedCargoPackageTypeBarcode: '',
  serialNumber: '',
  simpleSerialNumber: '',
  product: [],
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
export const singleItemPackingActions: object = {
  clearState: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    data: Partial<ISingleItemPackingStore>
  ) => {
    store.setState({ ...store.state, ...data });
  },
  setStation: (store: Store<IProblemSolverStore, IProblemSolverActions>, station: AddressTypeOutputDTO) => {
    store.setState({ ...store.state, station });
  },
  setIsMoreActionsOpen: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isMoreActionsOpen: status });
  },
  setIsManuelBarcodeInputOpen: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isManuelBarcodeInputOpen: status });
  },
  setIsOrderCompleted: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isOrderCompleted: status });
  },
  setIsEligibleForSLAMPrint: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isEligibleForSLAMPrint: status });
  },
  setIsSuspendedSLAM: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, status: boolean) => {
    store.setState({ ...store.state, isSuspendedSLAM: status });
  },
  setIsSioc: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, isSioc: boolean) => {
    store.setState({ ...store.state, isSioc: isSioc });
  },
  setBarcodeData: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, barcodeData: string) => {
    store.setState({ ...store.state, barcodeData });
  },
  setBoxItems: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, boxItems: BoxItemsInterface[]) => {
    store.setState({ ...store.state, boxItems });
  },
  setOrderItems: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    orderItems: OrderItemsInterface[]
  ) => {
    store.setState({ ...store.state, orderItems });
  },
  setVasItems: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, vasItems: VasItemInterface[]) => {
    store.setState({ ...store.state, vasItems });
  },
  setToteLabel: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, toteLabel: string) => {
    store.setState({ ...store.state, toteLabel });
  },
  setToteContainedItemCount: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    toteContainedItemCount: number
  ) => {
    store.setState({ ...store.state, toteContainedItemCount });
  },
  setOrderNumber: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, orderNumber: string) => {
    store.setState({ ...store.state, orderNumber });
  },
  setProcessId: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, processId: string) => {
    store.setState({ ...store.state, processId });
  },
  setPackingProcessId: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, packingProcessId: string) => {
    store.setState({ ...store.state, packingProcessId });
  },
  setOrderId: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, orderId: string) => {
    store.setState({ ...store.state, orderId });
  },
  setQuarantineToteLabel: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    quarantineToteLabel: string
  ) => {
    store.setState({ ...store.state, quarantineToteLabel });
  },
  setQuarantineAddressLabel: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    quarantineAddressLabel: string
  ) => {
    store.setState({ ...store.state, quarantineAddressLabel });
  },
  setOperationCargoPackageTypes: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    operationCargoPackageTypes: CargoPackageTypeOutputDTO[]
  ) => {
    store.setState({ ...store.state, operationCargoPackageTypes });
  },
  setOplogCargoPackageTypes: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    oplogCargoPackageTypes: CargoPackageTypeOutputDTO[]
  ) => {
    store.setState({ ...store.state, oplogCargoPackageTypes });
  },
  setOwnContainerCargoPackageTypes: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    ownContainerCargoPackageTypes: CargoPackageTypeOutputDTO[]
  ) => {
    store.setState({ ...store.state, ownContainerCargoPackageTypes });
  },
  setOperation: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, operation: OperationOutputDTO) => {
    store.setState({ ...store.state, operation });
  },
  setShippingFlow: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    shippingFlow: ShippingFlowTag
  ) => {
    store.setState({ ...store.state, shippingFlow });
  },
  toggleModalState: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    name: SingleItemPackingModals,
    status?: boolean
  ) => {
    const modalState = store.state.modals[name];
    const modals = {
      ...store.state.modals,
      [name]: status === undefined ? !modalState : status,
    };
    store.setState({ ...store.state, modals });
  },
  setSalesChannel: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, salesChannel: SalesChannel) => {
    store.setState({ ...store.state, salesChannel });
  },
  setMarketPlaceName: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, marketPlaceName: string) => {
    store.setState({ ...store.state, marketPlaceName });
  },
  setSelectedCargoPackageTypeBarcode: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    selectedCargoPackageTypeBarcode: string
  ) => {
    store.setState({ ...store.state, selectedCargoPackageTypeBarcode });
  },
  setSerialNumber: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, serialNumber: string) => {
    store.setState({ ...store.state, serialNumber });
  },
  setSimpleSerialNumber: (
    store: Store<ISingleItemPackingStore, ISingleItemPackingActions>,
    simpleSerialNumber: string
  ) => {
    store.setState({ ...store.state, simpleSerialNumber });
  },
  setProduct: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, product: ProductInterface[]) => {
    store.setState({ ...store.state, product });
  },
  callInfoMessageBox: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, infoMessageBox: Object) => {
    store.setState({ ...store.state, infoMessageBox });
  },
  setInfoPopup: (store: Store<ISingleItemPackingStore, ISingleItemPackingActions>, infoPopup: InfoPopupInterface) => {
    store.setState({ ...store.state, infoPopup });
  },
};

/* Export */
const useSingleItemPackingStore = globalHook<ISingleItemPackingStore, ISingleItemPackingActions>(
  React,
  initialSingleItemPackingState,
  singleItemPackingActions
);

export default useSingleItemPackingStore;
