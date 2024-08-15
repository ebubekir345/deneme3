import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { InfoMessageBoxState } from '../../components/molecules/InfoMessageBox/InfoMessageBox';
import { AddressTypeOutputDTO, ToteContainedItemOutputDTO } from '../../services/swagger';

export enum RASPickingModals {
  Logout = 'Logout',
  AddTote = 'AddTote',
  RemoveTote = 'RemoveTote',
  ForceAddTote = 'ForceAddTote',
  ForceRemoveTote = 'ForceRemoveTote',
  ForceRemoveCandidateTote = 'ForceRemoveCandidateTote',
  ProblemProduct = 'ProblemProduct',
}

export enum PickingPhases {
  POD = 'POD',
  Cell = 'Cell',
  Product = 'Product',
  Tote = 'Tote',
}

/* Interfaces */
export interface IRASPickingStore {
  station: AddressTypeOutputDTO;
  isMoreActionsOpen: boolean;
  isManuelBarcodeInputOpen: boolean;
  barcodeData: string;
  slots: SlotInterface[];
  toteToBeAdded: string;
  toteToBeRemoved: string;
  selectedSlot: number | undefined;
  cellLabel: string;
  pickListId: string;
  modals: {
    Logout: boolean;
    AddTote: boolean;
    RemoveTote: boolean;
    ForceAddTote: boolean;
    ForceRemoveTote: boolean;
    ForceRemoveCandidateTote: boolean;
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
  product: ToteContainedItemOutputDTO;
  isPalette: boolean;
}

export interface IRASPickingActions {
  clearState: (data: Partial<IRASPickingStore>) => void;
  setStation: (station: AddressTypeOutputDTO) => void;
  setIsMoreActionsOpen: (status: boolean) => void;
  setIsManuelBarcodeInputOpen: (status: boolean) => void;
  setBarcodeData: (barcodeData: string) => void;
  setSlots: (slots: SlotInterface[]) => void;
  setToteToBeAdded: (toteToBeAdded: string) => void;
  setToteToBeRemoved: (toteToBeRemoved: string) => void;
  setSelectedSlot: (selectedSlot: number | undefined) => void;
  setCellLabel: (cellLabel: string) => void;
  setPickListId: (pickListId: string) => void;
  toggleModalState: (name: RASPickingModals, status?: boolean) => void;
  togglePhaseState: (name: PickingPhases, status?: boolean) => void;
  callInfoMessageBox: (infoMessageBox: Object) => void;
  setProduct: (product: ToteContainedItemOutputDTO) => void;
  setIsPalette: (isPalette: boolean) => void;
}

/* InitalStates */
export const initialRASPickingState: IRASPickingStore = {
  station: { id: 0, label: '', discriminator: '' },
  isMoreActionsOpen: false,
  isManuelBarcodeInputOpen: false,
  barcodeData: '',
  slots: [],
  toteToBeAdded: '',
  toteToBeRemoved: '',
  selectedSlot: undefined,
  cellLabel: '',
  pickListId: '',
  modals: {
    Logout: false,
    AddTote: false,
    RemoveTote: false,
    ForceAddTote: false,
    ForceRemoveTote: false,
    ForceRemoveCandidateTote: false,
    ProblemProduct: false,
  },
  phases: {
    POD: false,
    Cell: false,
    Product: false,
    Tote: false,
  },
  infoMessageBox: {},
  product: {},
  isPalette: false,
};

/* Actions */
export const rasPickingActions: object = {
  clearState: (store: Store<IRASPickingStore, IRASPickingActions>, data: Partial<IRASPickingStore>) => {
    store.setState({ ...store.state, ...data });
  },
  setStation: (store: Store<IProblemSolverStore, IProblemSolverActions>, station: AddressTypeOutputDTO) => {
    store.setState({ ...store.state, station });
  },
  setIsMoreActionsOpen: (store: Store<IRASPickingStore, IRASPickingActions>, status: boolean) => {
    store.setState({ ...store.state, isMoreActionsOpen: status });
  },
  setIsManuelBarcodeInputOpen: (store: Store<IRASPickingStore, IRASPickingActions>, status: boolean) => {
    store.setState({ ...store.state, isManuelBarcodeInputOpen: status });
  },
  setBarcodeData: (store: Store<IRASPickingStore, IRASPickingActions>, barcodeData: string) => {
    store.setState({ ...store.state, barcodeData });
  },
  setSlots: (store: Store<IRASPickingStore, IRASPickingActions>, slots: SlotInterface[]) => {
    store.setState({ ...store.state, slots });
  },
  setToteToBeAdded: (store: Store<IRASPickingStore, IRASPickingActions>, toteToBeAdded: string) => {
    store.setState({ ...store.state, toteToBeAdded });
  },
  setToteToBeRemoved: (store: Store<IRASPickingStore, IRASPickingActions>, toteToBeRemoved: string) => {
    store.setState({ ...store.state, toteToBeRemoved });
  },
  setSelectedSlot: (store: Store<IRASPickingStore, IRASPickingActions>, selectedSlot: number | undefined) => {
    store.setState({ ...store.state, selectedSlot });
  },
  setCellLabel: (store: Store<IRASPickingStore, IRASPickingActions>, cellLabel: string) => {
    store.setState({ ...store.state, cellLabel });
  },
  setPickListId: (store: Store<IRASPickingStore, IRASPickingActions>, pickListId: string) => {
    store.setState({ ...store.state, pickListId });
  },
  setIsPalette: (store: Store<IRASPickingStore, IRASPickingActions>, isPalette: boolean) => {
    store.setState({ ...store.state, isPalette });
  },
  toggleModalState: (store: Store<IRASPickingStore, IRASPickingActions>, name: RASPickingModals, status?: boolean) => {
    const modalState = store.state.modals[name];
    const modals = {
      ...store.state.modals,
      [name]: status === undefined ? !modalState : status,
    };
    store.setState({ ...store.state, modals });
  },
  togglePhaseState: (store: Store<IRASPickingStore, IRASPickingActions>, name: PickingPhases, status?: boolean) => {
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
  callInfoMessageBox: (store: Store<IRASPickingStore, IRASPickingActions>, infoMessageBox: Object) => {
    store.setState({ ...store.state, infoMessageBox });
  },
  setProduct: (store: Store<IRASPickingStore, IRASPickingActions>, product: ToteContainedItemOutputDTO) => {
    store.setState({ ...store.state, product });
  },
};

/* Export */
const useRASPickingStore = globalHook<IRASPickingStore, IRASPickingActions>(
  React,
  initialRASPickingState,
  rasPickingActions
);

export default useRASPickingStore;
