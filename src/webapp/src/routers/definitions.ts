import React from 'react';
import { roles } from '../auth/roles';
import Callback from '../components/pages/Callback/Callback';
import Login from '../components/pages/LoginPage/Login';
import NotFound from '../components/pages/NotFound/NotFound';
import { urls } from './urls';

const Integrations = React.lazy(() => import('../components/pages/Integrations/Integrations'));
const OperationManagement = React.lazy(() => import('../components/pages/OperationManagement/OperationManagement'));
const ProductDetails = React.lazy(() => import('../components/pages/ProductDetails/ProductDetails'));
const Products = React.lazy(() => import('../components/pages/Products/Products'));
const Settings = React.lazy(() => import('../components/pages/Settings/Settings'));
const StockManagement = React.lazy(() => import('../components/pages/StockManagement/StockManagement'));
const TenantManagement = React.lazy(() => import('../components/pages/TenantManagement/TenantManagement'));
const WarehouseManagement = React.lazy(() => import('../components/pages/WarehouseManagement/WarehouseManagement'));
const OrderManagement = React.lazy(() => import('../components/pages/OrderManagement/OrderManagement'));
const OrderDetails = React.lazy(() => import('../components/pages/OrderDetails/OrderDetails'));
const ReturnManagement = React.lazy(() => import('../components/pages/ReturnManagement/ReturnManagement'));
const ReturnDetails = React.lazy(() => import('../components/pages/ReturnDetails/ReturnDetails'));
const PackingStation = React.lazy(() => import('../components/pages/PackingStation/PackingStation'));
const SingleItemPackingStation = React.lazy(() =>
  import('../components/pages/SingleItemPackingStation/SingleItemPackingStation')
);
const ReturnStation = React.lazy(() => import('../components/pages/ReturnStation/ReturnStation'));
const StationLogin = React.lazy(() => import('../components/pages/StationLogin/StationLogin'));
const QuarantineManagement = React.lazy(() => import('../components/pages/QuarantineManagement/QuarantineManagement'));
const LostItems = React.lazy(() => import('../components/pages/LostItems/LostItems'));
const ReceivingOperations = React.lazy(() => import('../components/pages/ReceivingOperations/ReceivingOperations'));
const ReceivingPurchaseOrders = React.lazy(() =>
  import('../components/pages/ReceivingPurchaseOrders/ReceivingPurchaseOrders')
);
const ReceivingOrderDetails = React.lazy(() =>
  import('../components/pages/ReceivingOrderDetails/ReceivingOrderDetails')
);
const ReceivingWaybillDetails = React.lazy(() =>
  import('../components/pages/ReceivingWaybillDetails/ReceivingWaybillDetails')
);
const ChangeLog = React.lazy(() => import('../components/pages/ChangeLog/ChangeLog'));
const SlamStation = React.lazy(() => import('../components/pages/SlamStation/SlamStation'));
const DispatchHistory = React.lazy(() => import('../components/pages/DispatchHistory/DispatchHistory'));
const DispatchDetails = React.lazy(() => import('../components/pages/DispatchDetails/DispatchDetails'));
const DispatchManagement = React.lazy(() => import('../components/pages/DispatchManagement/DispatchManagement'));
const PutAwayManagement = React.lazy(() => import('../components/pages/PutAwayManagement/PutAwayManagement'));
const PickingManagement = React.lazy(() => import('../components/pages/PickingManagement/PickingManagement'));
const ManualPicklists = React.lazy(() => import('../components/pages/ManualPicklists/ManualPicklists'));
const BatchManagement = React.lazy(() => import('../components/pages/BatchManagement/BatchManagement'));
const BatchDetails = React.lazy(() => import('../components/pages/BatchDetails/BatchDetails'));
const PickListDetails = React.lazy(() => import('../components/pages/PickListDetails/PickListDetails'));
const ProblemSolver = React.lazy(() => import('../components/pages/ProblemSolver/ProblemSolver'));
const ProblemList = React.lazy(() => import('../components/pages/ProblemList/ProblemList'));
const ProblemDetails = React.lazy(() => import('../components/pages/ProblemDetails/ProblemDetails'));
const PickingProblems = React.lazy(() => import('../components/pages/PickingProblems/PickingProblems'));
const DispatchProblems = React.lazy(() => import('../components/pages/DispatchProblems/DispatchProblems'));
const InboundProblems = React.lazy(() => import('../components/pages/InboundProblems/InboundProblems'));
const InboundProblemList = React.lazy(() => import('../components/pages/InboundProblemList/InboundProblemList'));
const InboundProblemDetails = React.lazy(() =>
  import('../components/pages/InboundProblemDetails/InboundProblemDetails')
);
const ZoneDetails = React.lazy(() => import('../components/pages/ZoneDetails/ZoneDetails'));
const InboundProblemSolver = React.lazy(() => import('../components/pages/InboundProblemSolver/InboundProblemSolver'));
const MasterCartonDetails = React.lazy(() => import('../components/pages/MasterCartonDetails/MasterCartonDetails'));
const FlowManagement = React.lazy(() => import('../components/pages/FlowManagement/FlowManagement'));
const MissingItemTransferStation = React.lazy(() =>
  import('../components/pages/MissingItemTransferStation/MissingItemTransferStation')
);
const OtherCountings = React.lazy(() => import('../components/pages/OtherCountings/OtherCountings'));
const CreateW2WPlan = React.lazy(() => import('../components/pages/CreateW2WPlan/CreateW2WPlan'));
const TrackW2WPlan = React.lazy(() => import('../components/pages/TrackW2WPlan/TrackW2WPlan'));
const W2WPlanReports = React.lazy(() => import('../components/pages/W2WPlanReports/W2WPlanReports'));
const CountingPlanDetails = React.lazy(() => import('../components/pages/CountingPlanDetails/CountingPlanDetails'));
const CreateCountingPlan = React.lazy(() => import('../components/pages/CreateCountingPlan/CreateCountingPlan'));
const InventoryView = React.lazy(() => import('../components/pages/InventoryView/InventoryView'));
const InventoryTrolleyDetails = React.lazy(() =>
  import('../components/pages/InventoryTrolleyDetails/InventoryTrolleyDetails')
);
const InventoryToteDetails = React.lazy(() => import('../components/pages/InventoryToteDetails/InventoryToteDetails'));
const InventoryCellDetails = React.lazy(() => import('../components/pages/InventoryCellDetails/InventoryCellDetails'));
const CountingListDetails = React.lazy(() => import('../components/pages/CountingListDetails/CountingListDetails'));
const InboundItemStation = React.lazy(() => import('../components/pages/InboundItemStation/InboundItemStation'));
const DispatchPackages = React.lazy(() => import('../components/pages/DispatchPackages/DispatchPackages'));
const ProductFeedManagement = React.lazy(() =>
  import('../components/pages/ProductFeedManagement/ProductFeedManagement')
);
const ExpirationDateTrack = React.lazy(() => import('../components/pages/ExpirationDateTrack/ExpirationDateTrack'));
const HOVPackingStation = React.lazy(() => import('../components/pages/HOVPackingStation/HOVPackingStation'));
const SerialNumberTrack = React.lazy(() => import('../components/pages/SerialNumberTrack/SerialNumberTrack'));
const RebinStation = React.lazy(() => import('../components/pages/RebinStation/RebinStation'));
const HOVRebinStation = React.lazy(() => import('../components/pages/RebinStation/RebinStation'));
const SimplePackingStation = React.lazy(() => import('../components/pages/SimplePackingStation/SimplePackingStation'));
const RASPickingStation = React.lazy(() => import('../components/pages/RASPickingStation/RASPickingStation'));
const RASPutAwayStation = React.lazy(() => import('../components/pages/RASPutAwayStation/RASPutAwayStation'));
const SyncComparison = React.lazy(() => import('../components/pages/SyncComparison/SyncComparison'));
const OrderPickListProblems = React.lazy(() => import('../components/pages/OrderPickListProblems/OrderPickListProblems'));

export interface AppRouteConfigParams {
  url: string;
  component: any;
  protectedRoute?: boolean;
  enabled?: boolean;
  key?: string;
  scopes?: string[];
  role?: string;
  titleKey: string;
}

export enum scopes { }

const definitions: Dictionary<AppRouteConfigParams> = {
  Home: {
    titleKey: 'OrderManagement',
    url: urls.home,
    component: OrderManagement,
  },
  Login: {
    titleKey: 'Login',
    url: urls.authentication,
    component: Login,
    protectedRoute: false,
  },
  ChangeLog: {
    titleKey: 'ChangeLog',
    url: urls.changeLog,
    component: ChangeLog,
    role: roles.Admin,
  },
  Integrations: {
    titleKey: 'Integrations',
    url: urls.integrations,
    component: Integrations,
  },
  TenantManagement: {
    titleKey: 'TenantManagement',
    url: urls.tenantManagement,
    component: TenantManagement,
    role: roles.Admin,
  },
  Settings: {
    titleKey: 'Settings',
    url: urls.settings,
    component: Settings,
    role: roles.Admin,
  },
  WarehouseManagement: {
    titleKey: 'WarehouseManagement',
    url: urls.warehouseManagement,
    component: WarehouseManagement,
    role: roles.Admin,
  },
  OperationManagement: {
    titleKey: 'OperationManagement',
    url: urls.operationManagement,
    component: OperationManagement,
    role: roles.Admin,
  },
  StockManagement: {
    titleKey: 'StockManagement',
    url: urls.stockManagement,
    component: StockManagement,
    role: roles.Admin,
  },
  Products: {
    titleKey: 'Products',
    url: urls.products,
    component: Products,
    role: roles.Admin,
  },
  ProductsDetails: {
    titleKey: 'ProductDetails',
    url: urls.productDetails,
    component: ProductDetails,
    role: roles.Admin,
  },
  OrderManagement: {
    titleKey: 'OrderManagement',
    url: urls.orderManagement,
    component: OrderManagement,
    role: roles.Admin,
  },
  OrderDetails: {
    titleKey: 'OrderDetails',
    url: urls.orderDetails,
    component: OrderDetails,
    role: roles.Admin,
  },
  ReturnManagement: {
    titleKey: 'ReturnManagement',
    url: urls.returnManagement,
    component: ReturnManagement,
    role: roles.Admin,
  },
  ReturnDetails: {
    titleKey: 'ReturnDetails',
    url: urls.returnDetails,
    component: ReturnDetails,
    role: roles.Admin,
  },
  StationLogin: {
    titleKey: 'TouchScreen.Login',
    url: urls.stationLogin,
    component: StationLogin,
    role: roles.Admin,
  },
  PackingStation: {
    titleKey: 'TouchScreen.PackingStation',
    url: urls.packingStation,
    component: PackingStation,
    role: roles.Admin,
  },
  SingleItemPackingStation: {
    titleKey: 'TouchScreen.SingleItemPackingStation',
    url: urls.singleItemPackingStation,
    component: SingleItemPackingStation,
    role: roles.Admin,
  },
  ReturnStation: {
    titleKey: 'TouchScreen.ReturnStation',
    url: urls.returnStation,
    component: ReturnStation,
    role: roles.Admin,
  },
  MissingItemTransferStation: {
    titleKey: 'TouchScreen.MissingItemTransferStation',
    url: urls.missingItemTransferStation,
    component: MissingItemTransferStation,
    role: roles.Admin,
  },
  QuarantineManagement: {
    titleKey: 'QuarantineManagement',
    url: urls.quarantineManagement,
    component: QuarantineManagement,
    role: roles.Admin,
  },
  LostItems: {
    titleKey: 'LostItems',
    url: urls.lostItems,
    component: LostItems,
    role: roles.Admin,
  },
  ReceivingOperations: {
    titleKey: 'ReceivingOperations',
    url: urls.receivingOperations,
    component: ReceivingOperations,
    role: roles.Admin,
  },
  ReceivingPurchaseOrders: {
    titleKey: 'ReceivingPurchaseOrders',
    url: urls.receivingPurchaseOrders,
    component: ReceivingPurchaseOrders,
    role: roles.Admin,
  },
  ReceivingOrderDetails: {
    titleKey: 'ReceivingOrderDetails',
    url: urls.receivingOrderDetails,
    component: ReceivingOrderDetails,
    role: roles.Admin,
  },
  ReceivingWaybillDetails: {
    titleKey: 'ReceivingWaybillDetails',
    url: urls.receivingWaybillDetails,
    component: ReceivingWaybillDetails,
    role: roles.Admin,
  },
  SlamStation: {
    titleKey: 'TouchScreen.SlamStation',
    url: urls.slamStation,
    component: SlamStation,
    role: roles.Admin,
  },
  DispatchHistory: {
    titleKey: 'DispatchHistory',
    url: urls.dispatchHistory,
    component: DispatchHistory,
    role: roles.Admin,
  },
  DispatchDetails: {
    titleKey: 'DispatchDetails',
    url: urls.dispatchDetails,
    component: DispatchDetails,
    role: roles.Admin,
  },
  DispatchManagement: {
    titleKey: 'DispatchManagement',
    url: urls.dispatchManagement,
    component: DispatchManagement,
    role: roles.Admin,
  },
  PickingManagement: {
    titleKey: 'PickingManagement',
    url: urls.pickingManagement,
    component: PickingManagement,
    role: roles.Admin,
  },
  ManualPicklists: {
    titleKey: 'ManualPicklists',
    url: urls.manualPicklists,
    component: ManualPicklists,
    role: roles.Admin,
  },
  BatchManagement: {
    titleKey: 'BatchManagement',
    url: urls.batchManagement,
    component: BatchManagement,
    role: roles.Admin,
  },
  BatchDetails: {
    titleKey: 'BatchDetails',
    url: urls.batchDetails,
    component: BatchDetails,
    role: roles.Admin,
  },
  PickListDetails: {
    titleKey: 'PickListDetails',
    url: urls.pickListDetails,
    component: PickListDetails,
    role: roles.Admin,
  },
  PutAwayManagement: {
    titleKey: 'PutAwayManagement',
    url: urls.putAwayManagement,
    component: PutAwayManagement,
    role: roles.Admin,
  },
  ProductFeedManagement: {
    titleKey: 'ProductFeedManagement',
    url: urls.productFeedManagement,
    component: ProductFeedManagement,
    role: roles.Admin,
  },
  ProblemSolver: {
    titleKey: 'TouchScreen.ProblemSolver',
    url: urls.problemSolver,
    component: ProblemSolver,
    role: roles.Admin,
  },
  ProblemList: {
    titleKey: 'TouchScreen.ProblemSolver.ProblemList',
    url: urls.problemList,
    component: ProblemList,
    role: roles.Admin,
  },
  ProblemDetails: {
    titleKey: 'TouchScreen.ProblemSolver.ProblemDetails',
    url: urls.problemDetails,
    component: ProblemDetails,
    role: roles.Admin,
  },
  InboundProblemSolver: {
    titleKey: 'TouchScreen.InboundProblemSolver',
    url: urls.inboundProblemSolver,
    component: InboundProblemSolver,
    role: roles.Admin,
  },
  InboundProblemList: {
    titleKey: 'TouchScreen.InboundProblemSolver.ProblemList',
    url: urls.inboundProblemList,
    component: InboundProblemList,
    role: roles.Admin,
  },
  InboundProblemDetails: {
    titleKey: 'TouchScreen.InboundProblemSolver.ProblemDetails',
    url: urls.inboundProblemDetails,
    component: InboundProblemDetails,
    role: roles.Admin,
  },
  Callback: {
    titleKey: 'Callback',
    url: urls.callback,
    component: Callback,
    protectedRoute: false,
  },
  PickingProblems: {
    titleKey: 'PickingProblems',
    url: urls.pickingProblems,
    component: PickingProblems,
    role: roles.Admin,
  },
  DispatchProblems: {
    titleKey: 'DispatchProblems',
    url: urls.dispatchProblems,
    component: DispatchProblems,
    role: roles.Admin,
  },
  InboundProblems: {
    titleKey: 'InboundProblems',
    url: urls.inboundProblems,
    component: InboundProblems,
    role: roles.Admin,
  },
  ZoneDetails: {
    titleKey: 'ZoneDetails',
    url: urls.zoneDetails,
    component: ZoneDetails,
    role: roles.Admin,
  },
  MasterCartonDetails: {
    titleKey: 'MasterCartonDetails',
    url: urls.masterCartonDetails,
    component: MasterCartonDetails,
    role: roles.Admin,
  },
  FlowManagement: {
    titleKey: 'FlowManagement',
    url: urls.flowManagement,
    component: FlowManagement,
    role: roles.Admin,
  },
  OtherCountings: {
    titleKey: 'OtherCountings',
    url: urls.otherCountings,
    component: OtherCountings,
    role: roles.Admin,
  },
  CreateW2WPlan: {
    titleKey: 'CreateW2WPlan',
    url: urls.createW2WPlan,
    component: CreateW2WPlan,
    role: roles.Admin,
  },
  TrackW2WPlan: {
    titleKey: 'TrackW2WPlan',
    url: urls.trackW2WPlan,
    component: TrackW2WPlan,
    role: roles.Admin,
  },
  W2WPlanReports: {
    titleKey: 'W2WPlanReports',
    url: urls.w2wPlanReports,
    component: W2WPlanReports,
    role: roles.Admin,
  },
  CountingPlanDetails: {
    titleKey: 'CountingPlanDetails',
    url: urls.countingPlanDetails,
    component: CountingPlanDetails,
    role: roles.Admin,
  },
  CreateCountingPlan: {
    titleKey: 'CreateCountingPlan',
    url: urls.createCountingPlan,
    component: CreateCountingPlan,
  },
  InventoryView: {
    titleKey: 'InventoryView',
    url: urls.inventoryView,
    component: InventoryView,
    role: roles.Admin,
  },
  InventoryTrolleyDetails: {
    titleKey: 'InventoryTrolleyListDetails',
    url: urls.inventoryTrolleyDetails,
    component: InventoryTrolleyDetails,
    role: roles.Admin,
  },
  InventoryToteDetails: {
    titleKey: 'InventoryToteListDetails',
    url: urls.inventoryToteDetails,
    component: InventoryToteDetails,
    role: roles.Admin,
  },
  InventoryCellDetails: {
    titleKey: 'InventoryCellListDetails',
    url: urls.inventoryCellDetails,
    component: InventoryCellDetails,
    role: roles.Admin,
  },
  CountingListDetails: {
    titleKey: 'CountingListDetails',
    url: urls.countingListDetails,
    component: CountingListDetails,
    role: roles.Admin,
  },
  InboundItemStation: {
    titleKey: 'TouchScreen.InboundItemStation', //InboundItemStation olacak
    url: urls.inboundItemStation,
    component: InboundItemStation,
    role: roles.Admin,
  },
  DispatchPackages: {
    titleKey: 'DispatchPackages',
    url: urls.dispatchPackages,
    component: DispatchPackages,
    role: roles.Admin,
  },
  ExpirationDateTrack: {
    titleKey: 'ExpirationDateTrack',
    url: urls.expirationDateTrack,
    component: ExpirationDateTrack,
    role: roles.Admin,
  },
  HOVPackingStation: {
    titleKey: 'TouchScreen.HOVPackingStation',
    url: urls.hovPackingStation,
    component: HOVPackingStation,
    role: roles.Admin,
  },
  SerialNumberTrack: {
    titleKey: 'SerialNumberTrack',
    url: urls.serialNumberTrack,
    component: SerialNumberTrack,
    role: roles.Admin,
  },
  RebinStation: {
    titleKey: 'TouchScreen.RebinStation',
    url: urls.rebinStation,
    component: RebinStation,
    role: roles.Admin,
  },
  HOVRebinStation: {
    titleKey: 'TouchScreen.HOVRebinStation',
    url: urls.hovRebinStation,
    component: HOVRebinStation,
    role: roles.Admin,
  },
  SimplePackingStation: {
    titleKey: 'TouchScreen.SimplePackingStation',
    url: urls.simplePackingStation,
    component: SimplePackingStation,
    role: roles.Admin,
  },
  RASPickingStation: {
    titleKey: 'TouchScreen.RASPickingStation',
    url: urls.rasPickingStation,
    component: RASPickingStation,
    role: roles.Admin,
  },
  RASPutAwayStation: {
    titleKey: 'TouchScreen.RASPutAwayStation',
    url: urls.rasPutAwayStation,
    component: RASPutAwayStation,
    role: roles.Admin,
  },
  OrderPickListProblems: {
    titleKey: 'OrderPickListProblems',
    url: urls.orderPickListProblems,
    component: OrderPickListProblems,
    role: roles.Admin,
  },
  SyncComparison: {
    titleKey: 'SyncComparison',
    url: urls.syncComparison,
    component: SyncComparison,
    role: roles.Supervisor,
  },
  NotFound: {
    titleKey: 'NotFound',
    url: urls.notFound,
    component: NotFound,
    protectedRoute: false,
  },
};

export default definitions;
