import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { InfoMessageBoxState } from '../../components/pages/InboundItemStation/bones/InfoMessageBox';
import { ProblemReportModalType } from '../../components/pages/InboundItemStation/bones/ReportProblemModal';
import { AddressTypeOutputDTO } from '../../services/swagger/api';

export enum BarcodeScanState {
  Package,
  Tote,
  QuarantineTote,
  Product,
  QuarantineProductBarcodeRead,
  DropTote,
  PlaceItemToteToQuarantine,
}

export enum DroppableTote {
  None,
  Tote,
  QuarantineTote,
}

/* Interfaces */
export interface IInitialInboundItemStationStore {
  barcodeScanState: BarcodeScanState;
  station: AddressTypeOutputDTO;
  barcodeData: string;
  isManuelBarcodeInputOpen: boolean;
  isMoreActionsOpen: boolean;
  receivingProcessId: string;
  packageLabel: string;
  toteLabel: string;
  quarantineToteLabel: string;
  productLabel: string;
  whichDropToteLabel: DroppableTote;
  isToteDropped: boolean;
  isQuarantineToteDropped: boolean;
  isPackageDropped: boolean;
  isBarcodeMessageOpen: boolean;
  barcodeMessageText: string;
  isReportProblemModalOpen: boolean;
  reportProblemType: string;
  reportProblemModal: ProblemReportModalType;
  masterCartonDamagedItemCount: number;
  infoMessageBox: {
    state?: InfoMessageBoxState;
    text?: string;
    textValue?: string | number;
    timer?: number;
    isOpen?: boolean;
  };
  isDiffOpsSamePrdModalOpen: boolean;
  isReportExpirationDateModalOpen: boolean;
  errorData: {
    header: string;
    subHeader?: string;
    delay?: number;
  };
  unknownBarcodeData: string;
  genericErrorModalIsOpen: boolean;
}

export interface IInitialInboundItemStationActions {
  clearState: (data: Partial<IInitialInboundItemStationStore>) => void;
  changeBarcodeScanState: (barcodeState: BarcodeScanState) => void;
  setStation: (station: AddressTypeOutputDTO) => void;
  setBarcodeData: (barcodeData: string) => void;
  setIsManuelBarcodeInputOpen: (status: boolean) => void;
  setIsMoreActionsOpen: (status: boolean) => void;
  setReceivingProcessId: (receivingProcessId: string) => void;
  setPackageLabel: (packageLabel: string) => void;
  setToteLabel: (toteLabel: string) => void;
  setQuarantineToteLabel: (quarantineToteLabel: string) => void;
  setProductLabel: (productLabel: string) => void;
  setWhichDropToteLabel: (whichDropToteLabel: DroppableTote) => void;
  setIsToteDropped: (isToteDropped: boolean) => void;
  setIsQuarantineToteDropped: (isQuarantineToteDropped: boolean) => void;
  setIsPackageDropped: (isPackageDropped: boolean) => void;
  setIsBarcodeMessageOpen: (status: boolean) => void;
  setBarcodeMessageBoxText: (barcodeMessageText: string) => void;
  setIsReportProblemModalOpen: (status: boolean) => void;
  setReportProblemType: (reportProblemType: string) => void;
  setReportProblemModal: (reportProblemModal: ProblemReportModalType) => void;
  setMasterCartonDamagedItemCount: (masterCartonDamagedItemCount: number) => void;
  callInfoMessageBox: (infoMessageBox: Object) => void;
  setDiffOpsSamePrdModalOpen: (isDiffOpsSamePrdModalOpen: boolean) => void;
  setReportExpirationDateModalOpen: (status: boolean) => void;
  setErrorData: (errorData: { header: string; subHeader?: string; delay?: number }) => void;
  setUnknownBarcodeData: (unknownBarcodeData) => void;
  setGenericErrorModalIsOpen: (genericErrorModalIsOpen) => void;
}

/* InitalStates */
export const initialInboundItemStationState: IInitialInboundItemStationStore = {
  barcodeScanState: BarcodeScanState.Package,
  station: { id: 0, label: '', discriminator: '' },
  barcodeData: '',
  isManuelBarcodeInputOpen: false,
  isMoreActionsOpen: false,
  receivingProcessId: '',
  packageLabel: '',
  toteLabel: '',
  quarantineToteLabel: '',
  productLabel: '',
  whichDropToteLabel: DroppableTote.None,
  isToteDropped: false,
  isQuarantineToteDropped: false,
  isPackageDropped: false,
  isBarcodeMessageOpen: false,
  barcodeMessageText: '',
  isReportProblemModalOpen: false,
  reportProblemType: '',
  reportProblemModal: ProblemReportModalType.None,
  masterCartonDamagedItemCount: 0,
  infoMessageBox: {
    state: InfoMessageBoxState.None,
    text: '',
    textValue: '',
    timer: 0,
    isOpen: false,
  },
  isDiffOpsSamePrdModalOpen: false,
  isReportExpirationDateModalOpen: false,
  errorData: {
    header: '',
    subHeader: '',
    delay: 0,
  },
  unknownBarcodeData: '',
  genericErrorModalIsOpen: false,
};

/* Actions */
export const inboundItemStationActions: object = {
  clearState: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    data: Partial<IInitialInboundItemStationStore>
  ) => {
    store.setState({ ...store.state, ...data });
  },
  changeBarcodeScanState: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    data: BarcodeScanState
  ) => {
    store.setState({ ...store.state, barcodeScanState: data });
  },
  setStation: (store: Store<IInitialInboundItemStationStore, IProblemSolverActions>, station: AddressTypeOutputDTO) => {
    store.setState({ ...store.state, station });
  },
  setBarcodeData: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    barcodeData: string
  ) => {
    store.setState({ ...store.state, barcodeData });
  },
  setIsManuelBarcodeInputOpen: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    status: boolean
  ) => {
    store.setState({ ...store.state, isManuelBarcodeInputOpen: status });
  },
  setIsMoreActionsOpen: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    status: boolean
  ) => {
    store.setState({ ...store.state, isMoreActionsOpen: status });
  },
  setReceivingProcessId: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    receivingProcessId: string
  ) => {
    store.setState({ ...store.state, receivingProcessId });
  },
  setPackageLabel: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    packageLabel: string
  ) => {
    store.setState({ ...store.state, packageLabel });
  },
  setToteLabel: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    toteLabel: string
  ) => {
    store.setState({ ...store.state, toteLabel });
  },
  setQuarantineToteLabel: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    quarantineToteLabel: string
  ) => {
    store.setState({ ...store.state, quarantineToteLabel });
  },
  setProductLabel: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    productLabel: string
  ) => {
    store.setState({ ...store.state, productLabel });
  },
  setWhichDropToteLabel: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    whichDropToteLabel: DroppableTote
  ) => {
    store.setState({ ...store.state, whichDropToteLabel });
  },
  setIsToteDropped: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    isToteDropped: boolean
  ) => {
    store.setState({ ...store.state, isToteDropped });
  },
  setIsQuarantineToteDropped: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    isQuarantineToteDropped: boolean
  ) => {
    store.setState({ ...store.state, isQuarantineToteDropped });
  },
  setIsPackageDropped: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    isPackageDropped: boolean
  ) => {
    store.setState({ ...store.state, isPackageDropped });
  },
  setIsBarcodeMessageOpen: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    status: boolean
  ) => {
    store.setState({ ...store.state, isBarcodeMessageOpen: status });
  },
  setBarcodeMessageBoxText: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    barcodeMessageText: string
  ) => {
    store.setState({ ...store.state, barcodeMessageText });
  },
  setIsReportProblemModalOpen: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    status: boolean
  ) => {
    store.setState({ ...store.state, isReportProblemModalOpen: status });
  },
  setReportProblemType: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    reportProblemType: string
  ) => {
    store.setState({ ...store.state, reportProblemType });
  },
  setReportProblemModal: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    reportProblemModal: ProblemReportModalType
  ) => {
    store.setState({ ...store.state, reportProblemModal });
  },
  setMasterCartonDamagedItemCount: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    masterCartonDamagedItemCount: number
  ) => {
    store.setState({ ...store.state, masterCartonDamagedItemCount });
  },
  callInfoMessageBox: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    infoMessageBox: Object
  ) => {
    store.setState({ ...store.state, infoMessageBox });
  },
  setDiffOpsSamePrdModalOpen: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    isDiffOpsSamePrdModalOpen: boolean
  ) => {
    store.setState({ ...store.state, isDiffOpsSamePrdModalOpen });
  },
  setReportExpirationDateModalOpen: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    status: boolean
  ) => {
    store.setState({ ...store.state, isReportExpirationDateModalOpen: status });
  },
  setErrorData: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    errorData: {
      header: string;
      subHeader?: string;
      delay?: number;
    }
  ) => {
    store.setState({ ...store.state, errorData });
  },
  setUnknownBarcodeData: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    unknownBarcodeData
  ) => {
    store.setState({ ...store.state, unknownBarcodeData });
  },
  setGenericErrorModalIsOpen: (
    store: Store<IInitialInboundItemStationStore, IInitialInboundItemStationActions>,
    unknownBarcodeData
  ) => {
    store.setState({ ...store.state, unknownBarcodeData });
  },
};

/* Export */
const useInboundItemStationStore = globalHook<IInitialInboundItemStationStore, IInitialInboundItemStationActions>(
  React,
  initialInboundItemStationState,
  inboundItemStationActions
);

export default useInboundItemStationStore;
