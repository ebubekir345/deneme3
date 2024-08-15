import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { InfoMessageBoxState } from '../../components/molecules/InfoMessageBox/InfoMessageBox';
import { AddressTypeOutputDTO } from '../../services/swagger';
import { ProblemSolverModals } from '../../typings/globalStore/enums';

/* InitalStates */
export const initialProblemSolverState: IProblemSolverStore = {
  station: { id: 0, label: '', discriminator: '' },
  selectedCargoCarrier: '',
  modals: {
    Logout: false,
  },
  isMoreActionsOpen: false,
  scannedCargoPackages: [],
  infoMessageBox: {
    state: InfoMessageBoxState.None,
    text: '',
    timer: 0,
  },
};

/* Actions */
export const commonActions: object = {
  clearState: (store: Store<IProblemSolverStore, IProblemSolverActions>, data: Partial<IProblemSolverStore>) => {
    store.setState({ ...store.state, ...data });
  },
  setStation: (store: Store<IProblemSolverStore, IProblemSolverActions>, station: AddressTypeOutputDTO) => {
    store.setState({ ...store.state, station });
  },
  setSelectedCargoCarrier: (store: Store<IProblemSolverStore, IProblemSolverActions>, selectedCargoCarrier: string) => {
    store.setState({ ...store.state, selectedCargoCarrier });
  },
  toggleModalState: (
    store: Store<IProblemSolverStore, IProblemSolverActions>,
    name: ProblemSolverModals,
    status?: boolean
  ) => {
    const modalState = store.state.modals[name];
    const modals = {
      ...store.state.modals,
      [name]: status === undefined ? !modalState : status,
    };
    store.setState({ ...store.state, modals });
  },
  setIsMoreActionsOpen: (store: Store<IProblemSolverStore, IProblemSolverActions>, isMoreActionsOpen: boolean) => {
    store.setState({ ...store.state, isMoreActionsOpen });
  },
  setScannedCargoPackages: (store: Store<IProblemSolverStore, IProblemSolverActions>, scannedCargoPackages: string[]) => {
    store.setState({ ...store.state, scannedCargoPackages });
  },
  callInfoMessageBox: (store: Store<IProblemSolverStore, IProblemSolverActions>, infoMessageBox: Object) => {
    store.setState({ ...store.state, infoMessageBox });
  },
};

/* Export */
const useProblemSolverStore = globalHook<IProblemSolverStore, IProblemSolverActions>(
  React,
  initialProblemSolverState,
  commonActions
);

export default useProblemSolverStore;
