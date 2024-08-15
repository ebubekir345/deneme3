import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { InfoMessageBoxState } from '../../components/molecules/InfoMessageBox/InfoMessageBox';
import { AddressTypeOutputDTO, ToteContainedItemOutputDTO } from '../../services/swagger';
import { PickingPhases, RASPickingModals } from './rasPickingStore';

/* Interfaces */
export interface IRASPutAwayStore {
  station: AddressTypeOutputDTO;
  isMoreActionsOpen: boolean;
  isManuelBarcodeInputOpen: boolean;
  barcodeData: string;
  slots: SlotInterface[];
  toteToBeAdded: string;
  toteToBeRemoved: string;
  selectedSlot: number | undefined;
  cellLabel: string;
  modals: {
    Logout: boolean;
    AddTote: boolean;
    RemoveTote: boolean;
    ForceAddTote: boolean;
    ForceRemoveTote: boolean;
    ProblemProduct: boolean;
  };
  phases: {
    POD: boolean;
    Cell: boolean;
    Product: boolean;
    Tote: boolean;
  };
  infoMessageBox: {
    state?: InfoMessageBoxState;
    text?: string;
    timer?: number;
  };
  successMessage: undefined | JSX.Element;
  product: ToteContainedItemOutputDTO;
}

export interface IRASPutAwayActions {
  clearState: (data: Partial<IRASPutAwayStore>) => void;
  setStation: (station: AddressTypeOutputDTO) => void;
  setIsMoreActionsOpen: (status: boolean) => void;
  setIsManuelBarcodeInputOpen: (status: boolean) => void;
  setBarcodeData: (barcodeData: string) => void;
  setSlots: (slots: SlotInterface[]) => void;
  setToteToBeAdded: (toteToBeAdded: string) => void;
  setToteToBeRemoved: (toteToBeRemoved: string) => void;
  setSelectedSlot: (selectedSlot: number | undefined) => void;
  setCellLabel: (cellLabel: string) => void;
  toggleModalState: (name: RASPickingModals, status?: boolean) => void;
  togglePhaseState: (name: PickingPhases, status?: boolean) => void;
  callInfoMessageBox: (infoMessageBox: Object) => void;
  setSuccessMessage: (successMessage: undefined | JSX.Element) => void;
  setProduct: (product: ToteContainedItemOutputDTO) => void;
}

/* InitalStates */
export const initialRASPutAwayState: IRASPutAwayStore = {
  station: { id: 0, label: '', discriminator: '' },
  isMoreActionsOpen: false,
  isManuelBarcodeInputOpen: false,
  barcodeData: '',
  slots: [],
  toteToBeAdded: '',
  toteToBeRemoved: '',
  selectedSlot: undefined,
  cellLabel: '',
  modals: {
    Logout: false,
    AddTote: false,
    RemoveTote: false,
    ForceAddTote: false,
    ForceRemoveTote: false,
    ProblemProduct: false,
  },
  phases: {
    POD: false,
    Cell: false,
    Product: false,
    Tote: false,
  },
  infoMessageBox: {},
  successMessage: undefined,
  product: {},
};

/* Actions */
export const rasPutAwayActions: object = {
  clearState: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, data: Partial<IRASPutAwayStore>) => {
    store.setState({ ...store.state, ...data });
  },
  setStation: (store: Store<IProblemSolverStore, IProblemSolverActions>, station: AddressTypeOutputDTO) => {
    store.setState({ ...store.state, station });
  },
  setIsMoreActionsOpen: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, status: boolean) => {
    store.setState({ ...store.state, isMoreActionsOpen: status });
  },
  setIsManuelBarcodeInputOpen: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, status: boolean) => {
    store.setState({ ...store.state, isManuelBarcodeInputOpen: status });
  },
  setBarcodeData: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, barcodeData: string) => {
    store.setState({ ...store.state, barcodeData });
  },
  setSlots: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, slots: SlotInterface[]) => {
    store.setState({ ...store.state, slots });
  },
  setToteToBeAdded: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, toteToBeAdded: string) => {
    store.setState({ ...store.state, toteToBeAdded });
  },
  setToteToBeRemoved: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, toteToBeRemoved: string) => {
    store.setState({ ...store.state, toteToBeRemoved });
  },
  setSelectedSlot: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, selectedSlot: number | undefined) => {
    store.setState({ ...store.state, selectedSlot });
  },
  setCellLabel: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, cellLabel: string) => {
    store.setState({ ...store.state, cellLabel });
  },
  toggleModalState: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, name: RASPickingModals, status?: boolean) => {
    const modalState = store.state.modals[name];
    const modals = {
      ...store.state.modals,
      [name]: status === undefined ? !modalState : status,
    };
    store.setState({ ...store.state, modals });
  },
  togglePhaseState: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, name: PickingPhases, status?: boolean) => {
    const phaseState = store.state.phases[name];
    const phases = {
      POD: false,
      Cell: false,
      Product: false,
      Tote: false,
      [name]: status === undefined ? !phaseState : status,
    };
    store.setState({ ...store.state, phases });
  },
  callInfoMessageBox: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, infoMessageBox: Object) => {
    store.setState({ ...store.state, infoMessageBox });
  },
  setSuccessMessage: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, successMessage: undefined | JSX.Element) => {
    store.setState({ ...store.state, successMessage });
  },
  setProduct: (store: Store<IRASPutAwayStore, IRASPutAwayActions>, product: ToteContainedItemOutputDTO) => {
    store.setState({ ...store.state, product });
  },
};

/* Export */
const useRASPutAwayStore = globalHook<IRASPutAwayStore, IRASPutAwayActions>(
  React,
  initialRASPutAwayState,
  rasPutAwayActions
);

export default useRASPutAwayStore;
