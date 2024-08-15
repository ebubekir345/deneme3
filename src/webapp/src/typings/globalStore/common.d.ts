interface ICommonStore {
  auth0UserInfo: any;
  activeTab: number | undefined;
  tabLength: number;
  selectedSalesOrderIds: string[];
}

interface ICommonActions {
  clearState: (data: Partial<ICommonStore>) => void;
  setAuth0UserInfo: (auth0UserInfo: any) => void;
  userHasRole: (requiredRole: string) => boolean;
  userHasMinRole: (minRole: roles) => boolean;
  setActiveTab: (activeSubMenu: number) => void;
  setTabLength: (tabLength: number) => void;
  tabNext: () => void;
  tabBack: () => void;
  setSelectedSalesOrderIds: (selectedSalesOrderIds: string[]) => void;
}
