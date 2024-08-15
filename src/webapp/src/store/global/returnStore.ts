import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { InfoMessageBoxState } from '../../components/molecules/InfoMessageBox/InfoMessageBox';
import {
  ContainedItemsType,
  OperationOutputDTO,
  ReturnSource,
  SalesOrdersSearchOutputDTO,
  SearchUserByFullNameOutputDTO,
} from '../../services/swagger';

export enum ReturnModals {
  Logout = 'Logout',
  CompleteReturn = 'CompleteReturn',
  GenericError = 'GenericError',
  Error = 'Error',
  SerialNumber = 'SerialNumber',
}

export enum ReturnTooltips {
  CustomerInfo = 'CustomerInfo',
  OrderHistoricalInfo = 'OrderHistoricalInfo',
}

/* Interfaces */
export interface IReturnStore {
  isCoOpScreenOpen: boolean;
  isLeftBarExpanded: boolean;
  isMoreActionsOpen: boolean;
  isManuelBarcodeInputOpen: boolean;
  isParcelSearchScreenOpen: boolean;
  isUndefinedReturnInputScreenOpen: boolean;
  isReturnCompleted: boolean;
  isReferenceNumberActive: boolean;
  isParcelInfoInputScreenOpen: boolean;
  returnProcessId: string;
  orderNumber: string;
  operation: OperationOutputDTO;
  customerInfo: ICustomerInfo;
  boxItems: BoxItemsInterface[];
  orderItems: OrderItemsInterface[];
  previousBoxItems: BoxItemsInterface[];
  selectedCoOp: SearchUserByFullNameOutputDTO;
  parcelInfo: {
    trackingId: string;
    cargoCarrierName: string;
    fullName: string;
    phone: string;
    cargoTrackingNumber: string;
    cargoCarrierLogoUrl: string;
    address: string;
    carrierId: string;
  };
  filteredOrders: SalesOrdersSearchOutputDTO[];
  selectedOrder: SalesOrdersSearchOutputDTO;
  undefinedReturnProductBarcodes: string[];
  undefinedReturnValidProductBarcodes: string[];
  searchQueries: SearchQueryInterface;
  returnTime: number;
  error: Error;
  modals: {
    Logout: boolean;
    CompleteReturn: boolean;
    GenericError: boolean;
    Error: boolean;
    SerialNumber: boolean;
  };
  tooltips: {
    CustomerInfo: boolean;
    OrderHistoricalInfo: boolean;
  };
  barcodeData: string;
  salesOrderId: string;
  infoMessageBox: {
    state?: InfoMessageBoxState;
    text?: string;
    timer?: number;
  };
  isHighlighted: boolean;
}

export interface IReturnActions {
  clearState: (data: Partial<IReturnStore>) => void;
  setIsCoOpScreenOpen: (status: boolean) => void;
  setIsLeftBarExpanded: (status: boolean) => void;
  setIsMoreActionsOpen: (status: boolean) => void;
  setIsManuelBarcodeInputOpen: (status: boolean) => void;
  setIsParcelSearchScreenOpen: (status: boolean) => void;
  setIsUndefinedReturnInputScreenOpen: (status: boolean) => void;
  setIsReturnCompleted: (status: boolean) => void;
  setIsReferenceNumberActive: (status: boolean) => void;
  setIsParcelInfoInputScreenOpen: (status: boolean) => void;
  setReturnProcessId: (returnProcessId: string) => void;
  setOrderNumber: (orderNumber: string) => void;
  setOperation: (operation: OperationOutputDTO) => void;
  setCustomerInfo: (customerInfo: ICustomerInfo) => void;
  setBoxItems: (boxItems: BoxItemsInterface[]) => void;
  setOrderItems: (orderItems: OrderItemsInterface[]) => void;
  setPreviousBoxItems: (previousBoxItems: BoxItemsInterface[]) => void;
  setSelectedCoOp: (selectedCoOp: SearchUserByFullNameOutputDTO) => void;
  setParcelInfo: (parcelInfo) => void;
  setFilteredOrders: (filteredOrders: SalesOrdersSearchOutputDTO[]) => void;
  setSelectedOrder: (selectedOrder: SalesOrdersSearchOutputDTO) => void;
  setUndefinedReturnProductBarcodes: (undefinedReturnProductBarcodes: string[]) => void;
  setUndefinedReturnValidProductBarcodes: (undefinedReturnValidProductBarcodes: string[]) => void;
  setSearchQueries: (searchQueries: SearchQueryInterface) => void;
  setReturnTime: (isInterval?: boolean, returnTime?: number) => void;
  setError: (header: string, subHeader: string) => void;
  toggleModalState: (name: ReturnModals, status?: boolean) => void;
  toggleTooltipState: (name: ReturnTooltips, status?: boolean) => void;
  setBarcodeData: (barocdeData: string) => void;
  setSalesOrderId: (salesOrderId: string) => void;
  callInfoMessageBox: (infoMessageBox: Object) => void;
  setIsHighlighted: (isHighlighted: boolean) => void;
}

interface ICustomerInfo {
  name: string;
  tel: string;
  address: string;
}

interface Error {
  header: string;
  subHeader: string;
}

/* InitalStates */
export const initialReturnState: IReturnStore = {
  isCoOpScreenOpen: false,
  isLeftBarExpanded: false,
  isMoreActionsOpen: false,
  isManuelBarcodeInputOpen: false,
  isParcelSearchScreenOpen: false,
  isUndefinedReturnInputScreenOpen: false,
  isReturnCompleted: false,
  isReferenceNumberActive: false,
  isParcelInfoInputScreenOpen: false,
  returnProcessId: '',
  orderNumber: '',
  operation: { id: '', name: '', imageUrl: '' },
  customerInfo: { name: '', tel: '', address: '' },
  boxItems: [],
  orderItems: [],
  previousBoxItems: [],
  selectedCoOp: { id: '', fullName: '' },
  parcelInfo: {
    trackingId: '',
    cargoCarrierName: '',
    fullName: '',
    phone: '',
    address: '',
    cargoTrackingNumber: '',
    cargoCarrierLogoUrl: '',
    carrierId: '',
  },
  filteredOrders: [],
  selectedOrder: {
    id: '',
    referenceNumber: '',
    operationId: '',
    returnSource: ReturnSource.None,
    imageUrl: '',
    orderId: '',
    orderCreatedAt: new Date().toString(),
  },
  undefinedReturnProductBarcodes: [],
  undefinedReturnValidProductBarcodes: [],
  searchQueries: {
    customerName: '',
    recipientName: '',
    referenceNumber: '',
    cargoPackageLabel: '',
    barcodes: [],
    operationId: '',
    displayAll: false,
    serialNumber: '',
  },
  returnTime: 0,
  error: {
    header: '',
    subHeader: '',
  },
  modals: {
    Logout: false,
    CompleteReturn: false,
    GenericError: false,
    Error: false,
    SerialNumber: false,
  },
  tooltips: {
    CustomerInfo: false,
    OrderHistoricalInfo: false,
  },
  barcodeData: '',
  salesOrderId: '',
  infoMessageBox: {
    state: InfoMessageBoxState.None,
    text: '',
    timer: 0,
  },
  isHighlighted: false
};

/* Actions */
const actions: object = {
  clearState: (store: Store<IReturnStore, IReturnActions>, data: Partial<IReturnStore>) => {
    store.setState({ ...store.state, ...data });
  },
  setIsCoOpScreenOpen: (store: Store<IReturnStore, IReturnActions>, status: boolean) => {
    store.setState({ ...store.state, isCoOpScreenOpen: status });
  },
  setIsLeftBarExpanded: (store: Store<IReturnStore, IReturnActions>, status: boolean) => {
    store.setState({ ...store.state, isLeftBarExpanded: status });
  },
  setIsMoreActionsOpen: (store: Store<IReturnStore, IReturnActions>, status: boolean) => {
    store.setState({ ...store.state, isMoreActionsOpen: status });
  },
  setIsManuelBarcodeInputOpen: (store: Store<IReturnStore, IReturnActions>, status: boolean) => {
    store.setState({ ...store.state, isManuelBarcodeInputOpen: status });
  },
  setIsParcelSearchScreenOpen: (store: Store<IReturnStore, IReturnActions>, status: boolean) => {
    store.setState({ ...store.state, isParcelSearchScreenOpen: status });
  },
  setIsUndefinedReturnInputScreenOpen: (store: Store<IReturnStore, IReturnActions>, status: boolean) => {
    store.setState({ ...store.state, isUndefinedReturnInputScreenOpen: status });
  },
  setIsReturnCompleted: (store: Store<IReturnStore, IReturnActions>, status: boolean) => {
    store.setState({ ...store.state, isReturnCompleted: status });
  },
  setIsReferenceNumberActive: (store: Store<IReturnStore, IReturnActions>, status: boolean) => {
    store.setState({ ...store.state, isReferenceNumberActive: status });
  },
  setIsParcelInfoInputScreenOpen: (store: Store<IReturnStore, IReturnActions>, status: boolean) => {
    store.setState({ ...store.state, isParcelInfoInputScreenOpen: status });
  },
  setReturnProcessId: (store: Store<IReturnStore, IReturnActions>, returnProcessId: string) => {
    store.setState({ ...store.state, returnProcessId });
  },
  setOrderNumber: (store: Store<IReturnStore, IReturnActions>, orderNumber: string) => {
    store.setState({ ...store.state, orderNumber });
  },
  setOperation: (store: Store<IReturnStore, IReturnActions>, operation: OperationOutputDTO) => {
    store.setState({ ...store.state, operation });
  },
  setCustomerInfo: (store: Store<IReturnStore, IReturnActions>, customerInfo: ICustomerInfo) => {
    store.setState({ ...store.state, customerInfo });
  },
  setBoxItems: (store: Store<IReturnStore, IReturnActions>, boxItems: BoxItemsInterface[]) => {
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
      const damagedBoxedCount = parseInt(
        boxItems
          .filter(boxItem => boxItem.containedItemsType === ContainedItemsType.Damaged)
          .reduce((accumulator, boxItem) => {
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
      const controlBoxedCount = parseInt(
        boxItems
          .filter(boxItem => boxItem.containedItemsType === ContainedItemsType.Outbound)
          .reduce((accumulator, boxItem) => {
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
      return { ...orderItem, boxedCount, damagedBoxedCount, controlBoxedCount };
    });
    store.setState({ ...store.state, orderItems, boxItems });
  },
  setOrderItems: (store: Store<IReturnStore, IReturnActions>, orderItems: OrderItemsInterface[]) => {
    store.setState({ ...store.state, orderItems });
  },
  setPreviousBoxItems: (store: Store<IReturnStore, IReturnActions>, previousBoxItems: BoxItemsInterface[]) => {
    store.setState({ ...store.state, previousBoxItems });
  },
  setSelectedCoOp: (store: Store<IReturnStore, IReturnActions>, selectedCoOp: SearchUserByFullNameOutputDTO) => {
    store.setState({ ...store.state, selectedCoOp });
  },
  setParcelInfo: (store: Store<IReturnStore, IReturnActions>, parcelInfo) => {
    store.setState({ ...store.state, parcelInfo });
  },
  setFilteredOrders: (store: Store<IReturnStore, IReturnActions>, filteredOrders: SalesOrdersSearchOutputDTO[]) => {
    store.setState({ ...store.state, filteredOrders });
  },
  setSelectedOrder: (store: Store<IReturnStore, IReturnActions>, selectedOrder: SalesOrdersSearchOutputDTO) => {
    store.setState({ ...store.state, selectedOrder });
  },
  setUndefinedReturnProductBarcodes: (
    store: Store<IReturnStore, IReturnActions>,
    undefinedReturnProductBarcodes: string[]
  ) => {
    store.setState({ ...store.state, undefinedReturnProductBarcodes });
  },
  setUndefinedReturnValidProductBarcodes: (
    store: Store<IReturnStore, IReturnActions>,
    undefinedReturnValidProductBarcodes: string[]
  ) => {
    store.setState({ ...store.state, undefinedReturnValidProductBarcodes });
  },
  setSearchQueries: (store: Store<IReturnStore, IReturnActions>, searchQueries: SearchQueryInterface) => {
    store.setState({ ...store.state, searchQueries });
  },
  setReturnTime: (store: Store<IReturnStore, IReturnActions>, isInterval?: boolean, returnTime?: number) => {
    store.setState({ ...store.state, returnTime: isInterval ? store.state.returnTime + 1 : returnTime || 0 });
  },
  setError: (store: Store<IReturnStore, IReturnActions>, header: string, subHeader: string) => {
    store.setState({ ...store.state, error: { header, subHeader } });
  },
  toggleModalState: (store: Store<IReturnStore, IReturnActions>, name: ReturnModals, status?: boolean) => {
    const modalState = store.state.modals[name];
    const modals = {
      ...store.state.modals,
      [name]: status === undefined ? !modalState : status,
    };
    store.setState({ ...store.state, modals });
  },
  toggleTooltipState: (store: Store<IReturnStore, IReturnActions>, name: ReturnTooltips, status?: boolean) => {
    const tooltipState = store.state.tooltips[name];
    const tooltips = {
      ...store.state.tooltips,
      [name]: status === undefined ? !tooltipState : status,
    };
    store.setState({ ...store.state, tooltips });
  },
  setBarcodeData: (store: Store<IReturnStore, IReturnActions>, barcodeData: string) => {
    store.setState({ ...store.state, barcodeData });
  },
  setSalesOrderId: (store: Store<IReturnStore, IReturnActions>, salesOrderId: string) => {
    store.setState({ ...store.state, salesOrderId });
  },
  callInfoMessageBox: (store: Store<IReturnStore, IReturnActions>, infoMessageBox: Object) => {
    store.setState({ ...store.state, infoMessageBox });
  },
  setIsHighlighted: (store: Store<IReturnStore, IReturnActions>, isHighlighted: boolean) => {
    store.setState({...store.state, isHighlighted})
  }
};

/* Export */
const useReturnStore = globalHook<IReturnStore, IReturnActions>(React, initialReturnState, actions);

export default useReturnStore;
