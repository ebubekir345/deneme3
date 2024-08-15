interface ISlamStationStore {
  isMoreActionsOpen: boolean;
  activeTab: number;
  waitingCategoryFilter: string;
  waitingSort: ISort;
  waitingPackages: WaitingForSLAMCargoPackageOutputDTO[];
  readyToShipCategoryFilter: string;
  readyToShipSort: ISort;
  readyToShipPackages: ReadyToShipCargoPackagesOutputDTO[];
  modals: {
    Logout: boolean;
  };
}

interface ISlamStationActions {
  clearState: (data: Partial<ISlamStationStore>) => void;
  setIsMoreActionsOpen: (isMoreActionsOpen: boolean) => void;
  setActiveTab: (activeTab: number) => void;
  setWaitingCategoryFilter: (waitingCategoryFilter: string) => void;
  setWaitingSort: (waitingSort: ISort) => void;
  setWaitingPackages: (waitingPackages: WaitingForSLAMCargoPackageOutputDTO[]) => void;
  setReadyToShipCategoryFilter: (readyToShipCategoryFilter: string) => void;
  setReadyToShipSort: (readyToShipSort: ISort) => void;
  setReadyToShipPackages: (waitingPackages: ReadyToShipCargoPackagesOutputDTO[]) => void;
  toggleModalState: (name: SlamStationModals, status?: boolean) => void;
}
