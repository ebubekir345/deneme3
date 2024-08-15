interface IProblemSolverStore {
  station: AddressTypeOutputDTO;
  selectedCargoCarrier: string;
  modals: {
    Logout: boolean;
  };
  isMoreActionsOpen: boolean;
  scannedCargoPackages: string[];
  infoMessageBox: {
    state?: InfoMessageBoxState;
    text?: string;
    timer?: number;
  };
}

interface IProblemSolverActions {
  clearState: (data: Partial<IProblemSolverStore>) => void;
  setStation: (station: AddressTypeOutputDTO) => void;
  setSelectedCargoCarrier: (selectedCargoCarrier: string) => void;
  toggleModalState: (name: ProblemSolverModals, status?: boolean) => void;
  setIsMoreActionsOpen: (isMoreActionsOpen: boolean) => void;
  setScannedCargoPackages: (scannedCargoPackages: string[]) => void;
  callInfoMessageBox: (infoMessageBox: Object) => void;
}
