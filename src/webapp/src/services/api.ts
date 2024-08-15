import { GridFetchResult } from '@oplog/data-grid';
import axios from 'axios';
import { getTokenSilently } from '../auth/auth0';
import { config } from '../config';
import history from '../history';
import { GridType, ResourceType } from '../models';
import { urls } from '../routers/urls';
import {
  AddressesApiFactory,
  BatchPickingProcessApiFactory,
  ContainersApiFactory,
  DispatchProcessApiFactory,
  HOVPackingProcessesApiFactory,
  InboundProblemsApiFactory,
  IntegrationsApiFactory,
  InventoryItemsApiFactory,
  ManualPicklistsApiFactory,
  MasterCartonsApiFactory,
  MissingItemTransferProcessesApiFactory,
  NpsMatchApiFactory,
  OpenAPIIntegrationsApiFactory,
  OperationsApiFactory,
  PackingProcessesApiFactory,
  PackingSingleItemProcessesApiFactory,
  PalletReceivingApiFactory,
  PickingProcessApiFactory,
  PickingSingleItemApiFactory,
  PickListRequestsApiFactory,
  PrintersApiFactory,
  ProblemsApiFactory,
  ProductsApiFactory,
  PurchaseOrdersApiFactory,
  PutAwayApiFactory,
  QuarantineManagementApiFactory,
  RasApiFactory,
  RebinSortingApiFactory,
  ReceivingProcessesApiFactory,
  ReportsApiFactory,
  ReturnApiFactory,
  SalesOrdersApiFactory,
  SimplePackingProcessApiFactory,
  SLAMApiFactory,
  StockCountingTasksApiFactory,
  TenantsApiFactory,
  TrolleyTransfersApiFactory,
  UsersApiFactory,
  VehiclesApiFactory,
  WallToWallStockCountingTasksApiFactory,
  WarehouseApiFactory,
  WaybillsApiFactory,
  WebReceivingProcessesApiFactory,
  WorkflowsApiFactory,
  ZonesApiFactory,
} from './swagger/api';

const { url } = config.api;

// Request interceptor for API calls
axios.interceptors.request.use(
  async config => {
    const token = await getTokenSilently();
    config.headers.authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

const maxRetries = 5;
const retryDelay = 1000;
// Response interceptor for API calls
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  async function(error) {
    const { config, response } = error;
    if (response?.status === 401 || error?.error === 'login_required') {
      history.push(urls.authentication);
    }
    return Promise.reject(error);
  }
);

const api = {
  Reports: ReportsApiFactory(undefined, url, axios),
  Tenants: TenantsApiFactory(undefined, url, axios),
  Integrations: IntegrationsApiFactory(undefined, url, axios),
  OpenAPIIntegrations: OpenAPIIntegrationsApiFactory(undefined, url, axios),
  Addresses: AddressesApiFactory(undefined, url, axios),
  Containers: ContainersApiFactory(undefined, url, axios),
  Vehicles: VehiclesApiFactory(undefined, url, axios),
  InventoryItems: InventoryItemsApiFactory(undefined, url, axios),
  Products: ProductsApiFactory(undefined, url, axios),
  Operations: OperationsApiFactory(undefined, url, axios),
  Workflows: WorkflowsApiFactory(undefined, url, axios),
  Printers: PrintersApiFactory(undefined, url, axios),
  SalesOrders: SalesOrdersApiFactory(undefined, url, axios),
  PackingProcesses: PackingProcessesApiFactory(undefined, url, axios),
  HOVPackingProcesses: HOVPackingProcessesApiFactory(undefined, url, axios),
  PackingSingleItemProcesses: PackingSingleItemProcessesApiFactory(undefined, url, axios),
  Users: UsersApiFactory(undefined, url, axios),
  Return: ReturnApiFactory(undefined, url, axios),
  QuarantineManagement: QuarantineManagementApiFactory(undefined, url, axios),
  PurchaseOrders: PurchaseOrdersApiFactory(undefined, url, axios),
  Waybills: WaybillsApiFactory(undefined, url, axios),
  SLAM: SLAMApiFactory(undefined, url, axios),
  DispatchProcess: DispatchProcessApiFactory(undefined, url, axios),
  PickingProcess: PickingProcessApiFactory(undefined, url, axios),
  Problems: ProblemsApiFactory(undefined, url, axios),
  Zones: ZonesApiFactory(undefined, url, axios),
  InboundProblems: InboundProblemsApiFactory(undefined, url, axios),
  MasterCartons: MasterCartonsApiFactory(undefined, url, axios),
  StockCountingTasks: StockCountingTasksApiFactory(undefined, url, axios),
  TrolleyTransfers: TrolleyTransfersApiFactory(undefined, url, axios),
  PutAway: PutAwayApiFactory(undefined, url, axios),
  MissingItemTransferProcesses: MissingItemTransferProcessesApiFactory(undefined, url, axios),
  PickingSingleItem: PickingSingleItemApiFactory(undefined, url, axios),
  ReceivingProcesses: ReceivingProcessesApiFactory(undefined, url, axios),
  WebReceivingProcesses: WebReceivingProcessesApiFactory(undefined, url, axios),
  ManualPicklists: ManualPicklistsApiFactory(undefined, url, axios),
  PickListRequests: PickListRequestsApiFactory(undefined, url, axios),
  PalletReceiving: PalletReceivingApiFactory(undefined, url, axios),
  WallToWallStockCountingTasks: WallToWallStockCountingTasksApiFactory(undefined, url, axios),
  BatchPickingProcess: BatchPickingProcessApiFactory(undefined, url, axios),
  RebinSorting: RebinSortingApiFactory(undefined, url, axios),
  Warehouse: WarehouseApiFactory(undefined, url, axios),
  SimplePackingProcess: SimplePackingProcessApiFactory(undefined, url, axios),
  NpsMatch: NpsMatchApiFactory(undefined, url, axios),
  Ras: RasApiFactory(undefined, url, axios),
};

const gridApiMap = {
  [GridType.Tenants]: api.Tenants.adminV1TenantsQueryGet,
  [GridType.Settings]: api.Tenants.apiV1TenantsQueryGet,
  [GridType.Adresses]: api.Addresses.apiV1AddressesQueryGet,
  [GridType.CellContainers]: api.Containers.apiV1ContainersQueryCellsGet,
  [GridType.Totes]: api.Containers.apiV1ContainersQueryTotesGet,
  [GridType.Trolleys]: api.Vehicles.apiV1VehiclesQueryGet,
  [GridType.Printers]: api.Printers.apiV1PrintersQueryGet,
  [GridType.StocksCurrentStatus]: api.InventoryItems.apiV1InventoryItemsQueryGet,
  [GridType.StocksStockStatus]: api.InventoryItems.apiV1InventoryItemsQueryStockItemsGet,
  [GridType.StocksWaitingToPutAway]: api.InventoryItems.apiV1InventoryItemsQueryPutAwayAwaitingReceivedItemsGet,
  [GridType.StocksNoStock]: api.InventoryItems.apiV1InventoryItemsQueryOutOfStockItemsGet,
  [GridType.Products]: api.Products.apiV1ProductsQueryGet,
  [GridType.MasterCartons]: api.MasterCartons.apiV1MasterCartonsQueryGet,
  [GridType.ProductsByAllStock]: api.Products.apiV1ProductsQueryInventoryItemsByProductGet,
  [GridType.ProductsByProductDefinition]: api.Products.apiV1ProductsQueryProductListingsGet,
  [GridType.Operations]: api.Operations.apiV1OperationsQueryGet,
  [GridType.Workflows]: api.Workflows.apiV1WorkflowsQueryGet,
  [GridType.SalesOrdersCreatedList]: api.SalesOrders.apiV1SalesOrdersQueryCreatedOrdersGet,
  [GridType.SalesOrdersPickingList]: api.SalesOrders.apiV1SalesOrdersQueryOrdersInPickingGet,
  [GridType.SalesOrdersPackingList]: api.SalesOrders.apiV1SalesOrdersQueryOrdersInPackingGet,
  [GridType.SalesOrdersDispatchList]: api.SalesOrders.apiV1SalesOrdersQueryOrdersInDispatchGet,
  [GridType.SalesOrdersDeliveredList]: api.SalesOrders.apiV1SalesOrdersQueryDeliveredOrdersGet,
  [GridType.SalesOrdersSLAMList]: api.SalesOrders.apiV1SalesOrdersQueryOrdersInSLAMGet,
  [GridType.SalesOrdersCancelledList]: api.SalesOrders.apiV1SalesOrdersQueryCancelledOrdersGet,
  [GridType.SalesOrderQueryLineItems]: api.SalesOrders.apiV1SalesOrdersQueryLineItemsGet,
  [GridType.SalesOrderOperationalStateDetails]: api.SalesOrders.apiV1SalesOrdersQueryOperationalStateDetailsGet,
  [GridType.ArrivedReturnPackagesList]: api.Return.apiV1ReturnQueryArrivedReturnPackagesGet,
  [GridType.InProcessReturnPackagesList]: api.Return.apiV1ReturnQueryInProcessReturnPackagesGet,
  [GridType.ResolvedReturnPackagesList]: api.Return.apiV1ReturnQueryResolvedReturnPackagesGet,
  [GridType.UndefinedReturnPackagesList]: api.Return.apiV1ReturnQueryUndefinedReturnPackagesGet,
  [GridType.ReturnQueryLineItems]: api.Return.apiV1ReturnQueryLineItemsGet,
  [GridType.QuarantineToStock]: api.QuarantineManagement.apiV1QuarantineManagementQueryReceivedItemTotesGet,
  [GridType.QuarantineDamaged]: api.QuarantineManagement.apiV1QuarantineManagementQueryDamagedItemTotesGet,
  [GridType.QuarantineOutbound]: api.QuarantineManagement.apiV1QuarantineManagementQueryOutboundItemTotesGet,
  [GridType.LostItems]: api.InventoryItems.apiV1InventoryItemsQueryLostItemLogRecordsGet,
  [GridType.ReceivingPurchaseOrders]: api.PurchaseOrders.apiV1PurchaseOrdersQueryGet,
  [GridType.ReceivingPurchasePackages]: api.ReceivingProcesses.apiV1ReceivingProcessesQueryActiveInboundBoxesGet,
  [GridType.ActiveReceivingPurchaseOrders]:
    api.WebReceivingProcesses.apiV1WebReceivingProcessesQueryActiveWebReceivingProcessGet,
  [GridType.ReceivingPurchaseOrdersByOperation]: api.PurchaseOrders.apiV1PurchaseOrdersQueryByOperationGet,
  [GridType.ReceivingWaybills]: api.Waybills.apiV1WaybillsQueryByPurchaseOrderGet,
  [GridType.ReceivingProducts]: api.PurchaseOrders.apiV1PurchaseOrdersQueryLineItemsByPurchaseOrderGet,
  [GridType.ReturnManagement]: api.Return.apiV1ReturnQueryReturnPackagesGet,
  [GridType.DispatchHistory]: api.DispatchProcess.apiV1DispatchProcessQueryDispatchHistoryGet,
  [GridType.DispatchSalesOrders]: api.DispatchProcess.apiV1DispatchProcessQuerySalesOrdersByDispatchProcessIdGet,
  [GridType.DispatchCargoPackages]: api.DispatchProcess.apiV1DispatchProcessQueryCargoPackagesByDispatchProcessIdGet,
  [GridType.DispatchManagement]: api.DispatchProcess.apiV1DispatchProcessQueryGet,
  [GridType.DispatchManagement]: api.DispatchProcess.apiV1DispatchProcessQueryGet, // TODO Change the endpoint
  [GridType.PickingTrolleyPickingTotes]: api.Vehicles.apiV1VehiclesQueryPickingTrolleyPickingTotesGet,
  [GridType.PickingManagementActivePickings]: api.PickingProcess.apiV1PickingProcessQueryActivePickingProcessesGet,
  [GridType.PickingManagementDropArea]: api.PickingProcess.apiV1PickingProcessQueryDropAddressedPickingTotesGet,
  [GridType.SingleItemPickingToteDetails]:
    api.PickingProcess.apiV1PickingProcessQueryDropAddressedPickingToteDetailsGet,
  [GridType.PickingManagementPackingArea]: api.PackingProcesses.apiV1PackingProcessesQueryPickingTrolleysInPackingGet,
  [GridType.PickingManagementParkingArea]: api.PickingProcess.apiV1PickingProcessQueryAvailablePickingTrolleysGet,
  [GridType.PickingListsGrid]: api.PickingProcess.apiV1PickingProcessQueryPickListsGet,
  [GridType.PickListDetailsPickingPlan]: api.PickingProcess.apiV1PickingProcessQueryPickListPickingPlanGet,
  [GridType.PickListDetailsPickingHistory]: api.PickingProcess.apiV1PickingProcessQueryPickListPickingHistoryGet,
  [GridType.PickListDetailsSalesOrders]: api.PickingProcess.apiV1PickingProcessQueryPickListSalesOrdersGet,
  [GridType.PickingManagementWaitingOrdersGrid]:
    api.PickingProcess.apiV1PickingProcessQueryWaitingForPickingSalesOrdersGet,
  [GridType.PickingManagementQuarantineTotes]: api.PickingProcess.apiV1PickingProcessQueryPickingQuarantineTotesGet,
  [GridType.PickingProblemsGrid]: api.Problems.apiV1ProblemsQueryPickingProblemsGet,
  [GridType.DispatchProblemsGrid]: api.Problems.apiV1ProblemsQueryDispatchProblemsGet,
  [GridType.SalesOrderProblemsGrid]: api.SalesOrders.apiV1SalesOrdersQueryProblemsGet,
  [GridType.StocksZoneStatusGrid]: api.InventoryItems.apiV1InventoryItemsQueryByZoneGet,
  [GridType.ZonesGrid]: api.Zones.apiV1ZonesQueryGet,
  [GridType.ZoneDetailsAddressesGrid]: api.Zones.apiV1ZonesQueryAdressesGet,
  [GridType.ZoneDetailsProductsGrid]: api.Zones.apiV1ZonesQueryProductsGet,
  [GridType.InboundProblemsGrid]: api.InboundProblems.apiV1InboundProblemsQueryGet,
  [GridType.SalesOrderInboundProblemsGrid]: api.InboundProblems.apiV1InboundProblemsQueryByPurchaseOrderGet,
  [GridType.ReceivingOrdersPackagesGrid]: api.InboundProblems.apiV1InboundProblemsQueryInboundBoxesByPurchaseOrderGet,
  [GridType.WaybillDetailsProblemsGrid]: api.InboundProblems.apiV1InboundProblemsQueryByWaybillGet,
  [GridType.WaybillDetailsPackagesGrid]: api.InboundProblems.apiV1InboundProblemsQueryInboundBoxesByWaybillGet,
  [GridType.StockCountingTasksGrid]: api.StockCountingTasks.apiV1StockCountingTasksGetCellStockCountingTasksQueryGet,
  [GridType.FlowManagement]: api.Vehicles.apiV1VehiclesQueryPickingTrolleySelectionConfigurationsGet,
  [GridType.PrioritizedSalesOrders]: api.PickingProcess.apiV1PickingProcessQueryPrioritizedSalesOrdersGet,
  [GridType.PickListItems]: api.SalesOrders.apiV1SalesOrdersQueryPickListItemsGet,
  [GridType.TransferTrolleys]: api.TrolleyTransfers.apiV1TrolleyTransfersQueryActiveTransferTrolleysGet,
  [GridType.TransferTrolleyPickingTotes]: api.TrolleyTransfers.apiV1TrolleyTransfersQueryTransferTrolleyPickingTotesGet,
  [GridType.PutAwayManagementWaitingProducts]: api.InventoryItems.apiV1InventoryItemsQueryPutAwayReceivedItemsGet,
  [GridType.PutAwayManagementWaitingTotes]: api.PutAway.apiV1PutAwayQueryWaitingTotesGet,
  [GridType.PutAwayManagementActivePutAways]: api.PutAway.apiV1PutAwayQueryActivePutAwaysGet,
  [GridType.PutAwayManagementAvailablePutAwayTrolleys]: api.PutAway.apiV1PutAwayQueryAvailablePutAwayTrolleysGet,
  [GridType.PutAwayManagementCellStatus]: api.Containers.apiV1ContainersQueryStockCellStatusGet,
  [GridType.PutAwayTrolleyTotes]: api.Vehicles.apiV1VehiclesQueryPutAwayTrolleyTotesGet,
  [GridType.PutAwayTotes]: api.InventoryItems.apiV1InventoryItemsQueryPutAwayReceivedItemsByToteGet,
  [GridType.CountingPlans]: api.StockCountingTasks.apiV1StockCountingTasksQueryStockCountingPlansGet,
  [GridType.CountingPlanDetail]:
    api.StockCountingTasks.apiV1StockCountingTasksQueryStockCountingPlanItemsByPlanReferenceNumberGet,
  [GridType.CreateStockCountingPlan]: api.StockCountingTasks.apiV1StockCountingTasksQueryToCreateStockCountingPlanGet,
  [GridType.SingleItemSalesOrdersToteDetails]:
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesQuerySingleItemSalesOrdersToteDetailsGet,
  [GridType.InventoryTrolleys]: api.Vehicles.apiV1VehiclesQueryTrolleyStatusGet,
  [GridType.InventoryToteStatus]: api.Containers.apiV1ContainersQueryToteStatusGet,
  [GridType.InventoryCellContainersGrid]: api.Containers.apiV1ContainersQueryStockCellStatusGet,
  [GridType.InventoryTrolleyListDetailsGrid]: api.Vehicles.apiV1VehiclesQueryTrolleyTotesGet,
  [GridType.InventoryToteListDetailsGrid]: api.InventoryItems.apiV1InventoryItemsQueryByContainerLabelGet,
  [GridType.CountingLists]: api.StockCountingTasks.apiV1StockCountingTasksQueryStockCountingListsGet,
  [GridType.CountingListDetail]: api.StockCountingTasks.apiV1StockCountingTasksQueryStockCountingListDetailsGet,
  [GridType.ActiveCountings]: api.StockCountingTasks.apiV1StockCountingTasksQueryActiveStockCountingListGet,
  [GridType.SalesOrdersProductDetail]: api.SalesOrders.apiV1SalesOrdersQuerySalesOrderByProductGet,
  [GridType.PurchaseOrdersProductDetail]: api.PurchaseOrders.apiV1PurchaseOrdersQueryPurchaseOrderByProductGet,
  [GridType.SystemCountings]: api.StockCountingTasks.apiV1StockCountingTasksQueryAutomaticStockCountingTasksGet,
  [GridType.GetReceivingToteDetails]: api.WebReceivingProcesses.apiV1WebReceivingProcessesGetReceivingToteDetailsGet,
  [GridType.GetQuarantineToteDetails]: api.WebReceivingProcesses.apiV1WebReceivingProcessesGetQuarantineToteDetailsGet,
  [GridType.ManualCountings]: api.StockCountingTasks.apiV1StockCountingTasksQueryManualStockCountingTasksGet,
  [GridType.CountingFlowManagement]:
    api.StockCountingTasks.apiV1StockCountingTasksQueryStockCountingListConfigurationsGet,
  [GridType.InventoryCellCountings]:
    api.StockCountingTasks.apiV1StockCountingTasksQueryStockCountingTasksByCellLabelGet,
  [GridType.VasItems]: api.SalesOrders.apiV1SalesOrdersQuerySalesOrderVasGet,
  [GridType.DispatchPackages]: api.DispatchProcess.apiV1DispatchProcessQueryCargoPackagesGet,
  [GridType.ProductReturnPackageDetails]: api.Products.apiV1ProductsQueryProductReturnPackageDetailsGet,
  [GridType.ProductStockCountingLists]: api.Products.apiV1ProductsQueryProductStockCountingListsGet,
  [GridType.ReservedProductManagementBlockerFeeds]:
    api.PutAway.apiV1PutAwayQueryReservedProductManagementBlockerFeedsGet,
  [GridType.ReservedProductManagementReservedProducts]:
    api.PutAway.apiV1PutAwayQueryReservedProductManagementReservedProductsGet,
  [GridType.ReservedProductManagementProposedFeeds]:
    api.PutAway.apiV1PutAwayQueryReservedProductManagementProposedFeedsGet,
  [GridType.QualityCountings]: api.StockCountingTasks.apiV1StockCountingTasksQueryQualityStockCountingTasksGet,
  [GridType.ExpirationDateTrackings]:
    api.InventoryItems.apiV1InventoryItemsQueryInventoryItemExpirationDateTrackingsGet,
  [GridType.ReceivingPurchaseWaybills]: api.Waybills.apiV1WaybillsQueryWaybillsGet,
  [GridType.PackageGridDetails]: api.ReceivingProcesses.apiV1ReceivingProcessesQueryInboundBoxRecordsGet,
  [GridType.PickListExpectedItemsByCellLabel]:
    api.PickingProcess.apiV1PickingProcessQueryPickListExpectedItemsByCellLabelGet,
  [GridType.InventoryItemsByProductWithSerialNumber]:
    api.InventoryItems.apiV1InventoryItemsQueryInventoryItemsByProductWithSerialNumberGet,
  [GridType.SerialNumberTrack]: api.InventoryItems.apiV1InventoryItemsQueryInventoryItemSerialNumberTrackingsGet,
  [GridType.SimpleSerialNumberTrack]: api.SalesOrders.apiV1SalesOrdersQuerySalesOrderSerialNumberTrackingsGet,
  [GridType.ManualPicklists]: api.ManualPicklists.apiV1ManualPicklistsQueryWaitingForPickingSalesOrdersGet,
  [GridType.PickListRequests]: api.PickListRequests.apiV1PickListRequestsQueryPickListRequestsGet,
  [GridType.PickListRequestSalesOrderDetails]:
    api.PickListRequests.apiV1PickListRequestsQueryPickListRequestSalesOrderDetailsGet,
  [GridType.PickListRequestPickListDetails]:
    api.PickListRequests.apiV1PickListRequestsQueryPickListRequestPickListDetailsGet,
  [GridType.WaitingPallets]: api.PalletReceiving.apiV1PalletReceivingQueryWaitingPalletsGet,
  [GridType.PutAwayReceivedItemsByPallet]: api.InventoryItems.apiV1InventoryItemsQueryPutAwayReceivedItemsByPalletGet,
  [GridType.WallToWallStockCountingTasksQueryCells]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksQueryCellsGet,
  [GridType.PreviewWallToWallStockCountingPlanLists]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksPreviewWallToWallStockCountingPlanListsGet,
  [GridType.PreviewWallToWallStockCountingPlanItems]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksPreviewWallToWallStockCountingPlanItemsGet,
  [GridType.QueryWallToWallStockCountingLists]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksQueryWallToWallStockCountingListsGet,
  [GridType.QueryWallToWallStockCountingAddresses]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksQueryWallToWallStockCountingAddressesGet,
  [GridType.QueryWallToWallStockCountingDamagedItems]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksQueryWallToWallStockCountingDamagedItemsGet,
  [GridType.QueryWallToWallStockCountingProducts]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksQueryWallToWallStockCountingProductsGet,
  [GridType.GetListsWithIncorrectCountedCells]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksGetListsWithIncorrectCountedCellsGet,
  [GridType.GetCellsForControlCount]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksGetCellsForControlCountGet,
  [GridType.QueryWallToWallStockCountingOperationsReport]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksQueryWallToWallStockCountingOperationsReportGet,
  [GridType.QueryWallToWallStockCountingAddressesReport]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksQueryWallToWallStockCountingAddressesReportGet,
  [GridType.QueryWallToWallStockCountingProductsReport]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksQueryWallToWallStockCountingProductsReportGet,
  [GridType.QueryWallToWallStockCountingListsReport]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksQueryWallToWallStockCountingListsReportGet,
  [GridType.QueryWallToWallStockCountingDamagedItemsReport]:
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksQueryWallToWallStockCountingDamagedItemsReportGet,
  [GridType.QueryShippingItemsByProduct]: api.Products.apiV1ProductsQueryShippingItemsByProductGet,
  [GridType.QuerySalesOrdersWithPickListProblems]:
    api.SalesOrders.apiV1SalesOrdersQuerySalesOrdersWithPickListProblemsGet,
  [GridType.QueryStockZonePickListCapacity]: api.Zones.apiV1ZonesQueryStockZonePickListCapacityGet,
};

export const getResource = (func: Function) => {
  return (params: RequestParams) => {
    if (params) {
      const parameters = Object.keys(params).map(x => {
        return params[x];
      });
      return func(...parameters);
    }
    return func();
  };
};

export const resourceApiMap = {
  [ResourceType.ExportToExcel]: getResource(api.Reports.apiV1ReportsExportToExcelGet),
  [ResourceType.CreateNewTenant]: getResource(api.Tenants.adminV1TenantsCreatePost),
  [ResourceType.CreateNewUser]: getResource(api.Tenants.adminV1TenantsCreateUserPost),
  [ResourceType.DeleteUser]: getResource(api.Tenants.adminV1TenantsDeleteUserPost),
  [ResourceType.GetUserRoles]: getResource(api.Tenants.apiV1TenantsListRolesGet),
  [ResourceType.DeleteTenant]: getResource(api.Tenants.adminV1TenantsDeletePost),
  [ResourceType.CreateOpenAPIIntegration]: getResource(api.OpenAPIIntegrations.apiV1OpenAPIIntegrationsCreatePost),
  [ResourceType.Integrations]: getResource(api.Integrations.apiV1IntegrationsListGet),
  [ResourceType.DeleteIntegration]: getResource(api.Integrations.apiV1IntegrationsDeleteDelete),
  [ResourceType.UpdateOpenAPIIntegration]: getResource(api.OpenAPIIntegrations.apiV1OpenAPIIntegrationsUpdatePut),
  [ResourceType.GetOpenAPIIntegration]: getResource(api.OpenAPIIntegrations.apiV1OpenAPIIntegrationsGetGet),
  [ResourceType.GetProduct]: getResource(api.Products.apiV1ProductsGetProductDetailsGet),
  [ResourceType.GetMasterCarton]: getResource(api.MasterCartons.apiV1MasterCartonsGetMasterCartonDetailsGet),
  [ResourceType.WorkflowsListApplicationEvents]: getResource(api.Workflows.apiV1WorkflowsListApplicationEventsGet),
  [ResourceType.WorkflowsGetByEventType]: getResource(api.Workflows.apiV1WorkflowsGetApplicationEventPayloadSchemaGet),
  [ResourceType.CreateWorkflow]: getResource(api.Workflows.apiV1WorkflowsCreatePost),
  [ResourceType.GetInstalledPrinters]: getResource(api.Printers.apiV1PrintersGetInstalledPrintersGet),
  [ResourceType.CreateOperation]: getResource(api.Operations.apiV1OperationsCreateOperationPost),
  [ResourceType.GetOperations]: getResource(api.Operations.apiV1OperationsListGet),
  [ResourceType.PrintTestPage]: getResource(api.Printers.apiV1PrintersPrintTestPagePost),
  [ResourceType.GetSalesOrdersOperationCount]: getResource(
    api.SalesOrders.apiV1SalesOrdersQuerySalesOrdersOperationCountGet
  ),
  [ResourceType.GetSalesOrdersCreated]: getResource(api.SalesOrders.apiV1SalesOrdersQueryCreatedOrdersGet),
  [ResourceType.GetSalesOrdersPicking]: getResource(api.SalesOrders.apiV1SalesOrdersQueryOrdersInPickingGet),
  [ResourceType.GetSalesOrdersSorting]: getResource(api.SalesOrders.apiV1SalesOrdersQueryOrdersInSortingGet),
  [ResourceType.GetSalesOrdersPacking]: getResource(api.SalesOrders.apiV1SalesOrdersQueryOrdersInPackingGet),
  [ResourceType.GetSalesOrdersSLAM]: getResource(api.SalesOrders.apiV1SalesOrdersQueryOrdersInSLAMGet),
  [ResourceType.GetSalesOrdersDispatch]: getResource(api.SalesOrders.apiV1SalesOrdersQueryOrdersInDispatchGet),
  [ResourceType.GetSalesOrdersDelivered]: getResource(api.SalesOrders.apiV1SalesOrdersQueryDeliveredOrdersGet),
  [ResourceType.GetSalesOrdersCancelled]: getResource(api.SalesOrders.apiV1SalesOrdersQueryCancelledOrdersGet),
  [ResourceType.GetSalesOrderStateDetail]: getResource(api.SalesOrders.apiV1SalesOrdersStateDetailsGet),
  [ResourceType.RecipientAddressDetails]: getResource(api.SalesOrders.apiV1SalesOrdersRecipientAddressDetailsGet),
  [ResourceType.ShipmentDetails]: getResource(api.SalesOrders.apiV1SalesOrdersShipmentDetailsGet),
  [ResourceType.ListCargoPackages]: getResource(api.SalesOrders.apiV1SalesOrdersListCargoPackagesGet),
  [ResourceType.ListReturnPackages]: getResource(api.SalesOrders.apiV1SalesOrdersListReturnPackagesGet),
  [ResourceType.GetArrivedReturnPackages]: getResource(api.Return.apiV1ReturnQueryArrivedReturnPackagesGet),
  [ResourceType.GetInProcessReturnPackages]: getResource(api.Return.apiV1ReturnQueryInProcessReturnPackagesGet),
  [ResourceType.GetResolvedReturnPackages]: getResource(api.Return.apiV1ReturnQueryResolvedReturnPackagesGet),
  [ResourceType.GetUndefinedReturnPackages]: getResource(api.Return.apiV1ReturnQueryUndefinedReturnPackagesGet),
  [ResourceType.GetReturnPackageStateDetail]: getResource(api.Return.apiV1ReturnStateDetailsGet),
  [ResourceType.ReturnPackageDetails]: getResource(api.Return.apiV1ReturnReturnPackageDetailsGet),
  [ResourceType.ListOperationsByProductBarcodes]: getResource(api.Return.apiV1ReturnListOperationsByProductBarcodesGet),
  [ResourceType.CreateUndefinedReturnPackage]: getResource(api.Return.apiV1ReturnCreateUndefinedReturnPackagePost),
  [ResourceType.CheckOperationCargoPackageTypeBarcode]: getResource(
    api.PackingProcesses.apiV1PackingProcessesCheckOperationCargoPackageTypeBarcodeGet
  ),
  [ResourceType.GetSalesOrderState]: getResource(api.PackingProcesses.apiV1PackingProcessesGetSalesOrderStateGet),
  [ResourceType.GetHOVSalesOrderState]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesGetHOVSalesOrderStateGet
  ),
  [ResourceType.CreatePackingProcess]: getResource(
    api.PackingProcesses.apiV1PackingProcessesCreatePackingProcessIfNotExistsPost
  ),
  [ResourceType.CreateHovPackingProcess]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesCreateHOVPackingProcessIfNotExistsPost
  ),
  [ResourceType.PrintVAS]: getResource(api.PackingProcesses.apiV1PackingProcessesPrintVASPost),
  [ResourceType.HOVPrintVAS]: getResource(api.HOVPackingProcesses.apiV1HOVPackingProcessesHOVPrintVASPost),
  [ResourceType.CreatePackingQuarantineProcess]: getResource(
    api.PackingProcesses.apiV1PackingProcessesCreatePackingQuarantineProcessIfNotExistsPost
  ),
  [ResourceType.CreateHovPackingQuarantineProcess]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesCreateHOVPackingQuarantineProcessIfNotExistsPost
  ),
  [ResourceType.CompletePackingProcess]: getResource(
    api.PackingProcesses.apiV1PackingProcessesCompletePackingProcessPost
  ),
  [ResourceType.CompleteHovPackingProcess]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesCompleteHOVPackingProcessPost
  ),
  [ResourceType.CompletePackingQuarantineProcess]: getResource(
    api.PackingProcesses.apiV1PackingProcessesCompletePackingQuarantineProcessPost
  ),
  [ResourceType.CompleteHovPackingQuarantineProcess]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesCompleteHOVPackingQuarantineProcessPost
  ),
  [ResourceType.AssignQuarantineTote]: getResource(api.PackingProcesses.apiV1PackingProcessesAssignQuarantineTotePost),
  [ResourceType.AssignHovQuarantineTote]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesAssignHOVQuarantineTotePost
  ),
  [ResourceType.UnassignQuarantineTote]: getResource(
    api.PackingProcesses.apiV1PackingProcessesUnassignQuarantineTotePost
  ),
  [ResourceType.UnassignHovQuarantineTote]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesUnassignHOVQuarantineTotePost
  ),
  [ResourceType.AddCargoPackage]: getResource(api.PackingProcesses.apiV1PackingProcessesAddCargoPackagePost),
  [ResourceType.AddHovCargoPackage]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesAddHOVCargoPackagePost
  ),
  [ResourceType.RemoveCargoPackage]: getResource(api.PackingProcesses.apiV1PackingProcessesRemoveCargoPackagePost),
  [ResourceType.RemoveHovCargoPackage]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesRemoveHOVCargoPackagePost
  ),
  [ResourceType.QueueItemIntoCargoPackage]: getResource(
    api.PackingProcesses.apiV1PackingProcessesQueueItemIntoCargoPackagePost
  ),
  [ResourceType.QueueHovItemIntoCargoPackage]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesQueueHOVItemIntoCargoPackagePost
  ),
  [ResourceType.QueueItemIntoQuarantineTote]: getResource(
    api.PackingProcesses.apiV1PackingProcessesQueueItemIntoQuarantineTotePost
  ),
  [ResourceType.QueueHovItemIntoQuarantineTote]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesQueueHOVItemIntoQuarantineTotePost
  ),
  [ResourceType.PrintCargoPackageLabels]: getResource(
    api.PackingProcesses.apiV1PackingProcessesPrintCargoPackageLabelsPost
  ),
  [ResourceType.PrintHovCargoPackageLabels]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesPrintHOVCargoPackageLabelsPost
  ),
  [ResourceType.PrintSLAMDocuments]: getResource(api.PackingProcesses.apiV1PackingProcessesPrintSLAMDocumentsPost),
  [ResourceType.HOVPrintSLAMDocuments]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesHOVPrintSLAMDocumentsPost
  ),
  [ResourceType.GetOperatorsByFullName]: getResource(api.Users.apiV1UsersSearchOperatorsByFullNameGet),
  [ResourceType.GetCargoCarriers]: getResource(api.Return.apiV1ReturnGetCargoCarriersGet),
  [ResourceType.UpdateTrackingInfo]: getResource(api.Return.apiV1ReturnUpdateTrackingInfoPost),
  [ResourceType.SearchSalesOrders]: getResource(api.Return.apiV1ReturnSearchSalesOrdersGet),
  [ResourceType.SelectToteForReturnProcess]: getResource(api.Return.apiV1ReturnSelectToteForReturnProcessPost),
  [ResourceType.GetSalesOrderDetails]: getResource(api.Return.apiV1ReturnGetSalesOrderDetailsGet),
  [ResourceType.CreateReturnProcessIfNotExist]: getResource(api.Return.apiV1ReturnCreateReturnProcessIfNotExistPost),
  [ResourceType.SelectSalesOrderForReturn]: getResource(api.Return.apiV1ReturnSelectSalesOrderForReturnPost),
  [ResourceType.CompleteReturnProcess]: getResource(api.Return.apiV1ReturnCompleteReturnProcessPost),
  [ResourceType.WaybillDetails]: getResource(api.Waybills.apiV1WaybillsGetDetailsGet),
  [ResourceType.CompleteWaybill]: getResource(api.Waybills.apiV1WaybillsCompleteWaybillPost),
  [ResourceType.CompleteOrder]: getResource(api.PurchaseOrders.apiV1PurchaseOrdersCompletePurchaseOrderPost),
  [ResourceType.GetInventoryItemsCount]: getResource(api.InventoryItems.apiV1InventoryItemsGetInventoryItemsCountGet),
  [ResourceType.GetStockItemsCount]: getResource(api.InventoryItems.apiV1InventoryItemsGetStockItemsCountGet),
  [ResourceType.GetOutOfStockItemsCount]: getResource(api.InventoryItems.apiV1InventoryItemsGetOutOfStockItemsCountGet),
  [ResourceType.GetLineItemCountsByPurchaseOrder]: getResource(
    api.PurchaseOrders.apiV1PurchaseOrdersGetLineItemCountsByPurchaseOrderGet
  ),
  [ResourceType.GetPurchaseOrderDetails]: getResource(api.PurchaseOrders.apiV1PurchaseOrdersGetPurchaseOrderDetailsGet),
  [ResourceType.GetInventoryStatusByProduct]: getResource(api.Products.apiV1ProductsGetInventoryStatusByProductGet),
  [ResourceType.QuarantineItemCounts]: getResource(
    api.QuarantineManagement.apiV1QuarantineManagementQuarantineItemCountsGet
  ),
  [ResourceType.DeleteWorkflow]: getResource(api.Workflows.apiV1WorkflowsDeletePost),
  [ResourceType.GetWaitingForSLAMCargoPackagesCount]: getResource(
    api.SLAM.apiV1SLAMGetWaitingForSLAMCargoPackagesCountGet
  ),
  [ResourceType.GetReadyToShipCargoPackagesCount]: getResource(api.SLAM.apiV1SLAMGetReadyToShipCargoPackagesCountGet),
  [ResourceType.WaitingForSLAMCargoPackages]: getResource(api.SLAM.apiV1SLAMQueryWaitingForSLAMCargoPackagesGet),
  [ResourceType.ReadyToShipCargoPackages]: getResource(api.SLAM.apiV1SLAMQueryReadyToShipCargoPackagesGet),
  [ResourceType.PrintCargoPackageCarrierLabel]: getResource(api.SLAM.apiV1SLAMPrintCargoPackageCarrierLabelPost),
  [ResourceType.ListCarriers]: getResource(api.Operations.apiV1OperationsListCarriersGet),
  [ResourceType.DispatchManagementCounts]: getResource(
    api.DispatchProcess.apiV1DispatchProcessQueryDispatchManagementCountsGet
  ),
  [ResourceType.ReceivingOperationsCounts]: getResource(
    api.PurchaseOrders.apiV1PurchaseOrdersQueryPurchaseOrderManagementCountsGet
  ),
  [ResourceType.GetAddressType]: getResource(api.Addresses.apiV1AddressesGetAddressTypeGet),
  [ResourceType.GetDispatchProcessDetails]: getResource(
    api.DispatchProcess.apiV1DispatchProcessGetDispatchProcessDetailsGet
  ),
  [ResourceType.GetPickingTrolleyDetails]: getResource(api.Vehicles.apiV1VehiclesGetPickingTrolleyDetailsGet),
  [ResourceType.GetPickingManagementAnalytics]: getResource(
    api.PickingProcess.apiV1PickingProcessQueryPickingManagementCountsGet
  ),
  [ResourceType.GetPickListDetails]: getResource(api.PickingProcess.apiV1PickingProcessGetPickListDetailsGet),
  [ResourceType.GetBarcodeType]: getResource(api.Problems.apiV1ProblemsCheckBarcodeTypeGet),
  [ResourceType.GetSalesOrderProblemDetails]: getResource(api.Problems.apiV1ProblemsGetSalesOrderProblemDetailsGet),
  [ResourceType.GetCreatedProblems]: getResource(api.Problems.apiV1ProblemsGetCreatedProblemsBySalesOrderIdGet),
  [ResourceType.GetInProgressProblems]: getResource(api.Problems.apiV1ProblemsGetInProgressProblemsBySalesOrderIdGet),
  [ResourceType.GetResolvedProblems]: getResource(api.Problems.apiV1ProblemsGetResolvedProblemsBySalesOrderIdGet),
  [ResourceType.GetPickingProblemsAnalytics]: getResource(
    api.Problems.apiV1ProblemsQueryPickingProblemsManagementCountsGet
  ),
  [ResourceType.GetDispatchProblemsAnalytics]: getResource(
    api.Problems.apiV1ProblemsQueryDispatchProblemsManagementCountsGet
  ),
  [ResourceType.CreateCargoCarrierPreferenceProblem]: getResource(
    api.Problems.apiV1ProblemsCreateCargoCarrierPreferenceProblemPost
  ),
  [ResourceType.CreateMissingCargoPackageLabelProblem]: getResource(
    api.Problems.apiV1ProblemsCreateMissingCargoPackageLabelProblemPost
  ),
  [ResourceType.CreateMissingSLAMLabelProblem]: getResource(
    api.Problems.apiV1ProblemsCreateMissingSLAMLabelProblemPost
  ),
  [ResourceType.GetProblemDetails]: getResource(api.Problems.apiV1ProblemsGetSalesOrderDetailsForProblemGet),
  [ResourceType.GetWrongShippingAddressProblemDetails]: getResource(
    api.Problems.apiV1ProblemsGetWrongShippingAddressProblemDetailsGet
  ),
  [ResourceType.SolveWrongShippingAddressProblem]: getResource(
    api.Problems.apiV1ProblemsSolveWrongShippingAddressProblemPost
  ),
  [ResourceType.GetCargoCarrierQuotaProblemDetails]: getResource(
    api.Problems.apiV1ProblemsGetCargoCarrierQuotaProblemDetailsGet
  ),
  [ResourceType.SolveCargoCarrierQuotaProblem]: getResource(
    api.Problems.apiV1ProblemsSolveCargoCarrierQuotaProblemPost
  ),
  [ResourceType.GetMissingCargoPackageLabelProblemDetails]: getResource(
    api.Problems.apiV1ProblemsGetMissingCargoPackageLabelProblemDetailsGet
  ),
  [ResourceType.SolveMissingCargoPackageLabelProblem]: getResource(
    api.Problems.apiV1ProblemsSolveMissingCargoPackageLabelProblemPost
  ),
  [ResourceType.GetMissingSLAMLabelProblemDetails]: getResource(
    api.Problems.apiV1ProblemsGetMissingSLAMLabelProblemDetailsGet
  ),
  [ResourceType.SolveMissingSLAMLabelProblem]: getResource(api.Problems.apiV1ProblemsSolveMissingSLAMLabelProblemPost),
  [ResourceType.GetSLAMShipmentProblemDetails]: getResource(api.Problems.apiV1ProblemsGetSLAMShipmentProblemDetailsGet),
  [ResourceType.SolveSLAMShipmentProblem]: getResource(api.Problems.apiV1ProblemsSolveSLAMShipmentProblemPost),
  [ResourceType.GetCargoCarrierPreferenceProblemDetails]: getResource(
    api.Problems.apiV1ProblemsGetCargoCarrierPreferenceProblemDetailsGet
  ),
  [ResourceType.SolveCargoCarrierPreferenceProblem]: getResource(
    api.Problems.apiV1ProblemsSolveCargoCarrierPreferenceProblemPost
  ),
  [ResourceType.GetMarketplaceCargoCarrierQuotaProblemDetails]: getResource(
    api.Problems.apiV1ProblemsGetMarketplaceCargoCarrierQuotaProblemDetailsGet
  ),
  [ResourceType.SolveMarketplaceCargoCarrierQuotaProblem]: getResource(
    api.Problems.apiV1ProblemsSolveMarketplaceCargoCarrierQuotaProblemPost
  ),
  [ResourceType.GetIntegrationCodeProblemDetails]: getResource(
    api.Problems.apiV1ProblemsGetIntegrationCodeProblemDetailsGet
  ),
  [ResourceType.SolveIntegrationCodeProblem]: getResource(
    api.Problems.apiV1ProblemsSolveIntegrationCodeProblemForSLAMPost
  ),
  [ResourceType.GetZoneDetails]: getResource(api.Zones.apiV1ZonesGetDetailsGet),
  [ResourceType.GetInboundBarcodeType]: getResource(api.InboundProblems.apiV1InboundProblemsCheckBarcodeTypeGet),
  [ResourceType.GetInboundProblemsByQuarantineContainerOrInboundBox]: getResource(
    api.InboundProblems.apiV1InboundProblemsGetInboundProblemsByQuarantineContainerOrInboundBoxGet
  ),
  [ResourceType.GetInboundProblemDetails]: getResource(
    api.InboundProblems.apiV1InboundProblemsGetInboundProblemDetailsGet
  ),
  [ResourceType.GetInboundProblemsAnalytics]: getResource(api.InboundProblems.apiV1InboundProblemsGetAnalyticsGet),
  [ResourceType.GetInboundProblemsAnalytics]: getResource(api.InboundProblems.apiV1InboundProblemsGetAnalyticsGet),
  [ResourceType.GetLostItemProblemDetails]: getResource(api.Problems.apiV1ProblemsGetLostItemProblemDetailsGet),
  [ResourceType.GetBarcodeMismatchProblemDetails]: getResource(
    api.InboundProblems.apiV1InboundProblemsGetBarcodeMismatchProblemDetailsGet
  ),
  [ResourceType.SolveBarcodeMismatchProblem]: getResource(
    api.InboundProblems.apiV1InboundProblemsSolveBarcodeMismatchProblemPost
  ),
  [ResourceType.GetBarcodeNotExistProblemDetails]: getResource(
    api.InboundProblems.apiV1InboundProblemsGetBarcodeNotExistProblemDetailsGet
  ),
  [ResourceType.SolveBarcodeNotExistProblem]: getResource(
    api.InboundProblems.apiV1InboundProblemsSolveBarcodeNotExistProblemPost
  ),
  [ResourceType.GetDamagedItemsProblemDetails]: getResource(
    api.InboundProblems.apiV1InboundProblemsGetDamagedItemsProblemDetailsGet
  ),
  [ResourceType.SolveDamagedItemsProblem]: getResource(
    api.InboundProblems.apiV1InboundProblemsSolveDamagedItemsProblemPost
  ),
  [ResourceType.GetDuplicateBarcodeProblemDetails]: getResource(
    api.InboundProblems.apiV1InboundProblemsGetDuplicateBarcodeProblemDetailsGet
  ),
  [ResourceType.SolveDuplicateBarcodeProblem]: getResource(
    api.InboundProblems.apiV1InboundProblemsSolveDuplicateBarcodeProblemPost
  ),
  [ResourceType.GetUnidentifiedProductProblemDetails]: getResource(
    api.InboundProblems.apiV1InboundProblemsGetUnidentifiedProductProblemDetailsGet
  ),
  [ResourceType.SolveUnidentifiedProductProblem]: getResource(
    api.InboundProblems.apiV1InboundProblemsSolveUnidentifiedProductProblemPost
  ),
  [ResourceType.GetUnreadableBarcodeProblemDetails]: getResource(
    api.InboundProblems.apiV1InboundProblemsGetUnreadableBarcodeProblemDetailsGet
  ),
  [ResourceType.SolveUnreadableBarcodeProblem]: getResource(
    api.InboundProblems.apiV1InboundProblemsSolveUnreadableBarcodeProblemPost
  ),
  [ResourceType.SetPickingTrolleySelectionConfigurationStatus]: getResource(
    api.Vehicles.apiV1VehiclesSetPickingTrolleySelectionConfigurationStatusPost
  ),
  [ResourceType.PrioritizeSalesOrders]: getResource(api.PickingProcess.apiV1PickingProcessPrioritizeSalesOrdersPost),
  [ResourceType.PrioritizeAllSalesOrders]: getResource(
    api.PickingProcess.apiV1PickingProcessPrioritizeAllSalesOrdersGet
  ),
  [ResourceType.RemovePickingPriorities]: getResource(
    api.PickingProcess.apiV1PickingProcessRemovePickingPrioritiesPost
  ),
  [ResourceType.SalesOrderGetPickListDetails]: getResource(api.SalesOrders.apiV1SalesOrdersGetPickListDetailsGet),
  [ResourceType.GetPutAwayManagementCounts]: getResource(api.PutAway.apiV1PutAwayQueryPutAwayManagementCountsGet),
  [ResourceType.GetPutAwayTrolleyDetails]: getResource(api.Vehicles.apiV1VehiclesGetPutAwayTrolleyDetailsGet),
  [ResourceType.GetPutAwayToteDetails]: getResource(api.Containers.apiV1ContainersGetToteDetailsGet),
  [ResourceType.PlaceQuarantineToteToQuarantineAddress]: getResource(
    api.PackingProcesses.apiV1PackingProcessesPlaceQuarantineToteToQuarantineAddressPost
  ),
  [ResourceType.PlaceHovQuarantineToteToQuarantineAddress]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesPlaceHOVQuarantineToteToQuarantineAddressPost
  ),
  [ResourceType.GetTransferTrolleyDetails]: getResource(
    api.TrolleyTransfers.apiV1TrolleyTransfersGetTransferTrolleyDetailsGet
  ),
  [ResourceType.GetMissingItemSalesOrderState]: getResource(
    api.MissingItemTransferProcesses.apiV1MissingItemTransferProcessesGetSalesOrderStateGet
  ),
  [ResourceType.CreateMissingItemTransferProcess]: getResource(
    api.MissingItemTransferProcesses.apiV1MissingItemTransferProcessesCreateMissingItemTransferProcessIfNotExistsPost
  ),
  [ResourceType.GetQuarantineToteDetails]: getResource(
    api.MissingItemTransferProcesses.apiV1MissingItemTransferProcessesGetQuarantineToteDetailsPost
  ),
  [ResourceType.CompleteMissingItemTransfer]: getResource(
    api.MissingItemTransferProcesses.apiV1MissingItemTransferProcessesCompletedMissingItemTransferProcessPost
  ),
  [ResourceType.CompleteWithLostItemMissingItemTransfer]: getResource(
    api.MissingItemTransferProcesses
      .apiV1MissingItemTransferProcessesCompletedWithLostItemMissingItemTransferProcessPost
  ),
  [ResourceType.CompleteCancelledMissingItemTransfer]: getResource(
    api.MissingItemTransferProcesses.apiV1MissingItemTransferProcessesCancelledMissingItemTransferProcessPost
  ),
  [ResourceType.CheckQuarantineToteMissingItemTransfer]: getResource(
    api.MissingItemTransferProcesses
      .apiV1MissingItemTransferProcessesCheckQuarantineToteAvailablityForPutIntoCancelledOrderPost
  ),
  [ResourceType.CreateToteSingleItemPackingProcessIfNotExists]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesCreateToteSingleItemPackingProcessIfNotExistsPost
  ),
  [ResourceType.GetSingleItemSalesOrderState]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesGetSingleItemSalesOrderStateGet
  ),
  [ResourceType.CreateSalesOrderPackingProcessIfNotExists]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesCreateSalesOrderPackingProcessIfNotExistsPost
  ),
  [ResourceType.CompleteSalesOrderPackingProcess]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesCompleteSalesOrderPackingProcessPost
  ),
  [ResourceType.GetSingleItemSalesOrdersToteRemainingItems]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesGetSingleItemSalesOrdersToteRemainingItemsGet
  ),
  [ResourceType.CompleteToteSingleItemPackingProcess]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesCompleteToteSingleItemPackingProcessPost
  ),
  [ResourceType.CompleteSingleItemPackingQuarantineProcess]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesCompleteSingleItemPackingQuarantineProcessPost
  ),
  [ResourceType.PrintSingleItemSalesOrderCargoPackageLabels]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesPrintSingleItemSalesOrderCargoPackageLabelsPost
  ),
  [ResourceType.PrintSingleItemSalesOrderVAS]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesPrintSingleItemSalesOrderVASPost
  ),
  [ResourceType.PrintSLAMDocumentsOnSingleItemSalesOrderPacking]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesPrintSLAMDocumentsOnSingleItemSalesOrderPackingPost
  ),
  [ResourceType.GetSingleItemRemainingToteSalesOrdersCount]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesGetSingleItemRemainingToteSalesOrdersCountGet
  ),
  [ResourceType.StockCountingStatistics]: getResource(
    api.StockCountingTasks.apiV1StockCountingTasksGetStockCountingStatisticsGet
  ),
  [ResourceType.PrioritizeStockCountingPlan]: getResource(
    api.StockCountingTasks.apiV1StockCountingTasksPrioritizeStockCountingPlanPost
  ),
  [ResourceType.DeprioritizeStockCountingPlan]: getResource(
    api.StockCountingTasks.apiV1StockCountingTasksDeprioritizeStockCountingPlanPost
  ),
  [ResourceType.GetStockCountingPlanDetails]: getResource(
    api.StockCountingTasks.apiV1StockCountingTasksGetStockCountingPlanDetailsGet
  ),
  [ResourceType.GetPendingStockCountingPlanDetails]: getResource(
    api.StockCountingTasks.apiV1StockCountingTasksGetPendingStockCountingPlanDetailsGet
  ),
  [ResourceType.CreateStockCountingPlan]: getResource(
    api.StockCountingTasks.apiV1StockCountingTasksCreateStockCountingPlanPost
  ),
  [ResourceType.GetTrolleyStatus]: getResource(api.Vehicles.apiV1VehiclesGetTrolleyStatusGet),
  [ResourceType.GetToteStatus]: getResource(api.Containers.apiV1ContainersGetToteStatusGet),
  [ResourceType.GetCellStatus]: getResource(api.Containers.apiV1ContainersGetCellStatusGet),
  [ResourceType.StockCountingListDetails]: getResource(
    api.StockCountingTasks.apiV1StockCountingTasksGetStockCountingListDetailsGet
  ),
  [ResourceType.StockStatusCounts]: getResource(api.InventoryItems.apiV1InventoryItemsQueryStockStatusCountsGet),
  [ResourceType.GetInboundBoxDetails]: getResource(
    api.WebReceivingProcesses.apiV1WebReceivingProcessesGetInboundBoxDetailsGet
  ),
  [ResourceType.CreatePackageInboundStationIfNotExists]: getResource(
    api.WebReceivingProcesses.apiV1WebReceivingProcessesCreateIfNotExistsPost
  ),
  [ResourceType.SelectReceivingTote]: getResource(
    api.WebReceivingProcesses.apiV1WebReceivingProcessesSelectReceivingTotePost
  ),
  [ResourceType.SelectQuarantineTote]: getResource(
    api.WebReceivingProcesses.apiV1WebReceivingProcessesSelectQuarantineTotePost
  ),
  [ResourceType.CheckBarcodeType]: getResource(api.WebReceivingProcesses.apiV1WebReceivingProcessesCheckBarcodeTypeGet),
  [ResourceType.PlaceItemToReceivingTote]: getResource(
    api.WebReceivingProcesses.apiV1WebReceivingProcessesPlaceItemToReceivingTotePost
  ),
  [ResourceType.PlaceItemToQuarantineTote]: getResource(
    api.WebReceivingProcesses.apiV1WebReceivingProcessesPlaceItemToQuarantineTotePost
  ),
  [ResourceType.DropTote]: getResource(api.WebReceivingProcesses.apiV1WebReceivingProcessesDropTotePost),
  [ResourceType.InboundPackageComplete]: getResource(api.WebReceivingProcesses.apiV1WebReceivingProcessesCompletePost),
  [ResourceType.GetOngoingSingleItemPackingProcessTote]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesGetOngoingSingleItemPackingProcessToteGet
  ),
  [ResourceType.AddOrUpdateCargoPackageToQueueForSingleItemPacking]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesAddOrUpdateCargoPackageToQueueForSingleItemPackingPost
  ),
  [ResourceType.DeleteCargoPackageFromQueueForSingleItemPacking]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesDeleteCargoPackageFromQueueForSingleItemPackingPost
  ),
  [ResourceType.SetStockCountingListConfigurationStatus]: getResource(
    api.StockCountingTasks.apiV1StockCountingTasksSetStockCountingListConfigurationStatusPost
  ),
  [ResourceType.ContinueIfTotesExistsOnReceivingAddress]: getResource(
    api.WebReceivingProcesses.apiV1WebReceivingProcessesContinueIfTotesExistsOnReceivingAddressGet
  ),
  [ResourceType.QuerySalesOrderNotes]: getResource(api.SalesOrders.apiV1SalesOrdersQuerySalesOrderNotesGet),
  [ResourceType.CreateSalesOrderNote]: getResource(api.SalesOrders.apiV1SalesOrdersCreateSalesOrderNotePost),
  [ResourceType.DispatchPackagesCounts]: getResource(
    api.DispatchProcess.apiV1DispatchProcessQueryCargoPackageManagementCountsGet
  ),
  [ResourceType.ReservedProductManagementCounts]: getResource(
    api.PutAway.apiV1PutAwayQueryReservedProductManagementCountsGet
  ),
  [ResourceType.DispatchPackagesCounts]: getResource(
    api.DispatchProcess.apiV1DispatchProcessQueryCargoPackageManagementCountsGet
  ),
  [ResourceType.ExpirationDateTrackingCounts]: getResource(
    api.InventoryItems.apiV1InventoryItemsGetInventoryItemExpirationDateTrackingCountsGet
  ),
  [ResourceType.PackageDetails]: getResource(api.ReceivingProcesses.apiV1ReceivingProcessesGetInboundBoxDetailsGet),
  [ResourceType.CheckProductBarcode]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesCheckProductBarcodeGet
  ),
  [ResourceType.CheckReturnItemSerialNumber]: getResource(api.Return.apiV1ReturnCheckReturnItemSerialNumberGet),
  [ResourceType.PrintHOVPalettePackingList]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesPrintHOVPalettePackingListPost
  ),
  [ResourceType.PrintPalettePackingList]: getResource(
    api.PackingProcesses.apiV1PackingProcessesPrintPalettePackingListPost
  ),
  [ResourceType.PrintUnprintedHOVPalettePackingList]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesPrintUnprintedHOVPalettePackingListPost
  ),
  [ResourceType.PrintUnprintedPalettePackingList]: getResource(
    api.PackingProcesses.apiV1PackingProcessesPrintUnprintedPalettePackingListPost
  ),
  [ResourceType.ReprintHOVPalettePackingList]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesReprintHOVPalettePackingListPost
  ),
  [ResourceType.ReprintPalettePackingList]: getResource(
    api.PackingProcesses.apiV1PackingProcessesReprintPalettePackingListPost
  ),
  [ResourceType.SerialNumberTracking]: getResource(
    api.InventoryItems.apiV1InventoryItemsGetInventoryItemSerialNumberTrackingCountsGet
  ),
  [ResourceType.CheckSimpleSerialNumber]: getResource(
    api.PackingProcesses.apiV1PackingProcessesCheckSimpleSerialNumberPost
  ),
  [ResourceType.CheckSimpleSerialNumberForSinglePacking]: getResource(
    api.PackingSingleItemProcesses.apiV1PackingSingleItemProcessesCheckSimpleSerialNumberPost
  ),
  [ResourceType.CheckHOVSimpleSerialNumber]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesCheckSimpleSerialNumberPost
  ),
  [ResourceType.RemovePackingQuarantineProcess]: getResource(
    api.PackingProcesses.apiV1PackingProcessesRemoveQuarantineProcessPost
  ),
  [ResourceType.PreviewManualPicklist]: getResource(
    api.ManualPicklists.apiV1ManualPicklistsPreviewManualPicklistRequestPost
  ),
  [ResourceType.CreateManualPicklist]: getResource(
    api.ManualPicklists.apiV1ManualPicklistsCreateManualPicklistRequestPost
  ),
  [ResourceType.DeletePickLists]: getResource(api.PickingProcess.apiV1PickingProcessDeletePickListsDelete),
  [ResourceType.GetCargoCodeUpdatedProblemDetails]: getResource(
    api.Problems.apiV1ProblemsGetCargoCodeUpdatedProblemDetailsGet
  ),
  [ResourceType.SolveCargoCodeUpdatedProblem]: getResource(api.Problems.apiV1ProblemsSolveCargoCodeUpdatedProblemPost),
  [ResourceType.PalletsGetSummary]: getResource(api.PalletReceiving.apiV1PalletReceivingGetSummaryGet),
  [ResourceType.CheckWaitingPallets]: getResource(api.PalletReceiving.apiV1PalletReceivingCheckWaitingPalletsGet),
  [ResourceType.GetWallToWallStockCountingCounts]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksGetWallToWallStockCountingCountsGet
  ),
  [ResourceType.CheckWallToWallStockCountingPlanNameIfAvailable]: getResource(
    api.WallToWallStockCountingTasks
      .apiV1WallToWallStockCountingTasksCheckWallToWallStockCountingPlanNameIfAvailablePost
  ),
  [ResourceType.AssignToWallToWallStockCountingPlan]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksAssignToWallToWallStockCountingPlanPost
  ),
  [ResourceType.DeleteWallToWallStockCountingList]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksDeleteWallToWallStockCountingListDelete
  ),
  [ResourceType.DeleteWallToWallStockCountingAddress]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksDeleteWallToWallStockCountingAddressDelete
  ),
  [ResourceType.StartWallToWallStockCountingPlan]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksStartWallToWallStockCountingPlanPut
  ),
  [ResourceType.GetActiveWallToWallStockCountingPlans]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksGetActiveWallToWallStockCountingPlansGet
  ),
  [ResourceType.GetCompletedWallToWallStockCountingPlans]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksGetCompletedWallToWallStockCountingPlansGet
  ),
  [ResourceType.GetWallToWallStockCountingTrackingCounts]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksGetWallToWallStockCountingTrackingCountsGet
  ),
  [ResourceType.AssignNewAddressesToPlan]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksAssignNewAddressesToPlanPost
  ),
  [ResourceType.FinishWallToWallStockCountingPlan]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksFinishWallToWallStockCountingPlanPut
  ),
  [ResourceType.CreateListForIncorrectCountedCells]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksCreateListForIncorrectCountedCellsPost
  ),
  [ResourceType.GetCreatedStateWallToWallStockCountingLists]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksGetCreatedStateWallToWallStockCountingListsGet
  ),
  [ResourceType.GetWallToWallStockCountingReportCounts]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksGetWallToWallStockCountingReportCountsGet
  ),
  [ResourceType.QueryWallToWallStockCountingSummaryReport]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksQueryWallToWallStockCountingSummaryReportGet
  ),
  [ResourceType.GetCreatedWallToWallStockCountingPlans]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksGetCreatedWallToWallStockCountingPlansGet
  ),
  [ResourceType.ApplyWallToWallStockCountingPlanToStock]: getResource(
    api.WallToWallStockCountingTasks.apiV1WallToWallStockCountingTasksApplyWallToWallStockCountingPlanToStockPut
  ),
  [ResourceType.BatchPickingProcessGetConfig]: getResource(
    api.BatchPickingProcess.apiV1BatchPickingProcessGetConfigGet
  ),
  [ResourceType.BatchPickingProcessUpsertConfig]: getResource(
    api.BatchPickingProcess.apiV1BatchPickingProcessUpsertConfigPost
  ),
  [ResourceType.RebinSortingCheckBatchTrolley]: getResource(api.RebinSorting.apiV1RebinSortingCheckBatchTrolleyPost),
  [ResourceType.RebinSortingStartSortingProcess]: getResource(
    api.RebinSorting.apiV1RebinSortingStartSortingProcessPost
  ),
  [ResourceType.RebinSortingAssignRebinTrolley]: getResource(api.RebinSorting.apiV1RebinSortingAssignRebinTrolleyPost),
  [ResourceType.RebinSortingCheckBatchPickingTote]: getResource(
    api.RebinSorting.apiV1RebinSortingCheckBatchPickingTotePost
  ),
  [ResourceType.RebinSortingGetBatchPickingToteDetails]: getResource(
    api.RebinSorting.apiV1RebinSortingGetBatchPickingToteDetailsPost
  ),
  [ResourceType.RebinSortingCheckBatchPickingProduct]: getResource(
    api.RebinSorting.apiV1RebinSortingCheckBatchPickingProductPost
  ),
  [ResourceType.RebinSortingPlaceProduct]: getResource(api.RebinSorting.apiV1RebinSortingPlaceProductPost),
  [ResourceType.RebinSortingDropBatchTote]: getResource(api.RebinSorting.apiV1RebinSortingDropBatchTotePost),
  [ResourceType.RebinSortingDropBatchToteWithLostItems]: getResource(
    api.RebinSorting.apiV1RebinSortingDropBatchToteWithLostItemsPost
  ),
  [ResourceType.RebinSortingDropRebinTrolley]: getResource(api.RebinSorting.apiV1RebinSortingDropRebinTrolleyPost),
  [ResourceType.RebinSortingDropBatchTrolley]: getResource(api.RebinSorting.apiV1RebinSortingDropBatchTrolleyPost),
  [ResourceType.PickListRequestsDelete]: getResource(api.PickListRequests.apiV1PickListRequestsDelete),
  [ResourceType.PickListRequestsPrioritize]: getResource(api.PickListRequests.apiV1PickListRequestsPrioritizeDelete),
  [ResourceType.GetPickListRequestStateDetails]: getResource(
    api.PickListRequests.apiV1PickListRequestsGetPickListRequestStateDetailsGet
  ),
  [ResourceType.WarehouseConfig]: getResource(api.Warehouse.apiV1WarehouseWarehouseConfigGet),
  [ResourceType.PickListRequestsGetBatchNextQrCode]: getResource(
    api.PickListRequests.apiV1PickListRequestsGetBatchNextQrCodeGet
  ),
  [ResourceType.PrintAdditionalCargoPackageLabels]: getResource(
    api.PackingProcesses.apiV1PackingProcessesPrintAdditionalCargoPackageLabelsPost
  ),
  [ResourceType.HOVPrintAdditionalCargoPackageLabels]: getResource(
    api.HOVPackingProcesses.apiV1HOVPackingProcessesPrintAdditionalCargoPackageLabelsPost
  ),
  [ResourceType.SimplePackingProcessCheckPackingProcessExists]: getResource(
    api.SimplePackingProcess.apiV1SimplePackingProcessCheckPackingProcessExistsGet
  ),
  [ResourceType.SimplePackingProcessCreatePackingProcess]: getResource(
    api.SimplePackingProcess.apiV1SimplePackingProcessCreatePackingProcessPost
  ),
  [ResourceType.SimplePackingProcessQueueItemsIntoCargoPackage]: getResource(
    api.SimplePackingProcess.apiV1SimplePackingProcessQueueItemsIntoCargoPackagePost
  ),
  [ResourceType.SimplePackingProcessAddCargoPackage]: getResource(
    api.SimplePackingProcess.apiV1SimplePackingProcessAddCargoPackagePost
  ),
  [ResourceType.SimplePackingProcessCompletePackingProcess]: getResource(
    api.SimplePackingProcess.apiV1SimplePackingProcessCompletePackingProcessPost
  ),
  [ResourceType.SimplePackingProcessPrintCargoPackageLabels]: getResource(
    api.SimplePackingProcess.apiV1SimplePackingProcessPrintCargoPackageLabelsPost
  ),
  [ResourceType.SimplePackingProcessPrintSLAMDocuments]: getResource(
    api.SimplePackingProcess.apiV1SimplePackingProcessPrintSLAMDocumentsPost
  ),
  [ResourceType.NpsMatch]: getResource(api.NpsMatch.apiV1NpsMatchPost),
  [ResourceType.RasCheckBarcodeType]: getResource(api.Ras.apiV1RasCheckBarcodeTypeGet),
  [ResourceType.RasStowCheckTote]: getResource(api.Ras.apiV1RasStowCheckToteGet),
  [ResourceType.RasStowPlaceTote]: getResource(api.Ras.apiV1RasStowPlaceTotePost),
  [ResourceType.RasStowCheckProduct]: getResource(api.Ras.apiV1RasStowCheckProductGet),
  [ResourceType.RasCheckCell]: getResource(api.Ras.apiV1RasCheckCellGet),
  [ResourceType.RasStowPlaceProduct]: getResource(api.Ras.apiV1RasStowPlaceProductPost),
  [ResourceType.RasStowDropTote]: getResource(api.Ras.apiV1RasStowDropTotePost),
  [ResourceType.RasReleasePod]: getResource(api.Ras.apiV1RasReleasePodPost),
  [ResourceType.RasStowCloseStation]: getResource(api.Ras.apiV1RasStowCloseStationPost),
  [ResourceType.RasPickCheckTote]: getResource(api.Ras.apiV1RasPickCheckToteGet),
  [ResourceType.RasPickPlaceTote]: getResource(api.Ras.apiV1RasPickPlaceTotePost),
  [ResourceType.RasPickCheckProduct]: getResource(api.Ras.apiV1RasPickCheckProductGet),
  [ResourceType.RasPickPlaceProduct]: getResource(api.Ras.apiV1RasPickPlaceProductPost),
  [ResourceType.RasPickDropTote]: getResource(api.Ras.apiV1RasPickDropTotePost),
  [ResourceType.RasPickCloseStation]: getResource(api.Ras.apiV1RasPickCloseStationPost),
  [ResourceType.RasStationTotes]: getResource(api.Ras.apiV1RasStationTotesGet),
  [ResourceType.RasPickLostItem]: getResource(api.Ras.apiV1RasPickLostItemPost),
  [ResourceType.RasPickStationMetric]: getResource(api.Ras.apiV1RasRasStationMetricPost),
  [ResourceType.GetTenantConfigurationsByTenantId]: getResource(
    api.Tenants.apiV1TenantsGetTenantConfigurationsByTenantIdGet
  ),
  [ResourceType.RebinSortingGetAllRebinSortingHistory]: getResource(
    api.RebinSorting.apiV1RebinSortingGetAllRebinSortingHistoryGet
  ),
  [ResourceType.RebinSortingCheckAndPlaceBatchPickingProduct]: getResource(
    api.RebinSorting.apiV1RebinSortingCheckAndPlaceBatchPickingProductPost
  ),
  [ResourceType.RasStowStationMetric]: getResource(api.Ras.apiV1RasRasStationMetricPost),
};

export function getGridData(
  query: string,
  gridKey: string,
  apiArgs?: Array<Record<string, any>>
): Promise<GridFetchResult> {
  if (apiArgs) {
    return gridApiMap[gridKey](...apiArgs, query);
  }
  return gridApiMap[gridKey](query);
}

export type RequestParams = Dictionary<any>;

export function uploadImage(params: RequestParams) {
  const endpoint = `${url}/api/v1/Operations.uploadOperationImage`;

  const data = new FormData();
  data.append('file', params.file);
  // data.append("containerName", "operation");

  const options = {
    method: 'POST',
    mode: 'cors' as RequestMode,
    body: data,
  };

  return fetch(endpoint, options).then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    throw response;
  });
}
