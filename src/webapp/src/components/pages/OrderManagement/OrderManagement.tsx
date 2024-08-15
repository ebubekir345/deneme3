import { ErrorPanel, Flex, LayoutContent, Panel } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { Pagination, QueryBuilder, SortDirection, SortField } from 'dynamic-query-builder-client';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ResourceType } from '../../../models';
import {
  CancelledSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  CreatedSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  InDispatchSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  InPackingSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  InPickingSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  InSLAMOrSuspendedSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  InSortingSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  SalesOrderState,
  WarehouseConfigOutputDTO,
} from '../../../services/swagger';
import useOrderManagementStore, {
  IModifiedSalesOrders,
  initialOrderManagementState,
} from '../../../store/global/orderManagementStore';
import { StoreState } from '../../../store/initState';
import ActionBar from '../../organisms/ActionBar';
import { FilterAnalytics } from './bones/FilterAnalytics';
import OrderManagementColumGrid from './bones/OrderManagementColumGrid';
import SkeletonCards from './bones/SkeletonCards';

const intlKey = 'OrderManagement';

export const ListTypes = [
  SalesOrderState.Created,
  SalesOrderState.Picking,
  SalesOrderState.Sorting,
  SalesOrderState.Packing,
  SalesOrderState.Slam,
  SalesOrderState.Dispatch,
  SalesOrderState.Cancelled,
];

export const listTypeToSortMap = (listType: string) => {
  switch (listType) {
    case SalesOrderState.Created:
      return 'orderCreatedAt';
    case SalesOrderState.Picking:
      return 'startedAt';
    case SalesOrderState.Sorting:
      return 'startedAt';
    case SalesOrderState.Packing:
      return 'startedAt';
    case SalesOrderState.Dispatch:
      return 'startedAt';
    case SalesOrderState.Slam:
      return 'startedAt';
    case SalesOrderState.Cancelled:
      return 'cancelledAt';
    default:
      return 'orderCreatedAt';
  }
};

export const listTypeToResourceTypeMap = (listType: string) => {
  switch (listType) {
    case SalesOrderState.Created:
      return ResourceType.GetSalesOrdersCreated;
    case SalesOrderState.Picking:
      return ResourceType.GetSalesOrdersPicking;
    case SalesOrderState.Sorting:
      return ResourceType.GetSalesOrdersSorting;
    case SalesOrderState.Packing:
      return ResourceType.GetSalesOrdersPacking;
    case SalesOrderState.Dispatch:
      return ResourceType.GetSalesOrdersDispatch;
    case SalesOrderState.Slam:
      return ResourceType.GetSalesOrdersSLAM;
    case SalesOrderState.Cancelled:
      return ResourceType.GetSalesOrdersCancelled;
    default:
      return ResourceType.GetSalesOrdersCreated;
  }
};

const OrderManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [orderManagementStore, orderManagementActions] = useOrderManagementStore();
  const isSalesOrderCreatedEffectFirstRun = useRef(true);
  const isSalesOrderPickingEffectFirstRun = useRef(true);
  const isSalesOrderSortingEffectFirstRun = useRef(true);
  const isSalesOrderPackingEffectFirstRun = useRef(true);
  const isSalesOrderDispatchEffectFirstRun = useRef(true);
  const isSalesOrderSLAMEffectFirstRun = useRef(true);
  const isSalesOrderCancelledEffectFirstRun = useRef(true);

  const salesOrdersCreated: Resource<CreatedSalesOrderQueryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrdersCreated]
  );
  const salesOrdersPicking: Resource<InPickingSalesOrderQueryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrdersPicking]
  );
  const salesOrdersSorting: Resource<InSortingSalesOrderQueryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrdersSorting]
  );
  const salesOrdersPacking: Resource<InPackingSalesOrderQueryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrdersPacking]
  );
  const salesOrdersDispatch: Resource<InDispatchSalesOrderQueryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrdersDispatch]
  );
  const salesOrdersSLAM: Resource<InSLAMOrSuspendedSalesOrderQueryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrdersSLAM]
  );
  const salesOrdersCancelled: Resource<CancelledSalesOrderQueryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrdersCancelled]
  );
  const warehouseConfig: Resource<WarehouseConfigOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.WarehouseConfig]
  );

  useEffect(() => {
    orderManagementActions.clearState(initialOrderManagementState);
    orderManagementActions.setModifiedSalesOrders({
      Created: '',
      Picking: '',
      Sorting: '',
      Packing: '',
      SLAM: '',
      Dispatch: '',
      Cancelled: '',
    });
    dispatch(resourceActions.resourceRequested(ResourceType.GetOperations));
    dispatch(resourceActions.resourceRequested(ResourceType.WarehouseConfig));
    dispatch(resourceActions.resourceRequested(ResourceType.GetSalesOrdersOperationCount));
    return () => {
      ListTypes.forEach(listType => {
        dispatch(resourceActions.resourceInit(listTypeToResourceTypeMap(listType)));
      });
      dispatch(resourceActions.resourceInit(ResourceType.WarehouseConfig));
      dispatch(resourceActions.resourceInit(ResourceType.GetSalesOrdersOperationCount));
      orderManagementActions.setPreviousCountData({
        previousCountCreated: 10,
        previousCountPicking: 10,
        previousCountSorting: 10,
        previousCountPacking: 10,
        previousCountDispatch: 10,
        previousCountSLAM: 10,
        previousCountCancelled: 10,
      });
    };
  }, []);

  useEffect(() => {
    if (warehouseConfig?.isSuccess) {
      ListTypes.forEach(listType => {
        if (listType === SalesOrderState.Sorting && !warehouseConfig?.data?.batchPickingEnabled) null;
        else {
          const builder = new QueryBuilder({
            filters: [],
            pagination: new Pagination({ offset: 0, count: 10 }),
            sortBy: new SortField({
              property: listTypeToSortMap(listType),
              by: listType === SalesOrderState.Cancelled ? SortDirection.DESC : SortDirection.ASC,
            }),
          });
          const query = builder.build();
          dispatch(resourceActions.resourceRequested(listTypeToResourceTypeMap(listType), { query }));
        }
      });
    }
  }, [warehouseConfig]);

  useEffect(() => {
    if (isSalesOrderCreatedEffectFirstRun.current) {
      isSalesOrderCreatedEffectFirstRun.current = false;
      return;
    }
    if (salesOrdersCreated?.isSuccess) {
      orderManagementActions.setModifiedSalesOrders({
        ...orderManagementStore.modifiedSalesOrders,
        Created: {
          type: SalesOrderState.Created,
          orderCount: salesOrdersCreated?.data?.count,
          orders: orderManagementStore.modifiedSalesOrders.Created
            ? [
                ...(orderManagementStore.modifiedSalesOrders.Created as any).orders,
                ...(salesOrdersCreated?.data?.data as any),
              ]
            : salesOrdersCreated?.data?.data,
        } as IModifiedSalesOrders,
      });
    }
  }, [salesOrdersCreated]);

  useEffect(() => {
    if (isSalesOrderPickingEffectFirstRun.current) {
      isSalesOrderPickingEffectFirstRun.current = false;
      return;
    }
    if (salesOrdersPicking?.isSuccess) {
      orderManagementActions.setModifiedSalesOrders({
        ...orderManagementStore.modifiedSalesOrders,
        Picking: {
          type: SalesOrderState.Picking,
          orderCount: salesOrdersPicking?.data?.count,
          orders: orderManagementStore.modifiedSalesOrders.Picking
            ? [
                ...(orderManagementStore.modifiedSalesOrders.Picking as any).orders,
                ...(salesOrdersPicking?.data?.data as any),
              ]
            : salesOrdersPicking?.data?.data,
        } as IModifiedSalesOrders,
      });
    }
  }, [salesOrdersPicking]);

  useEffect(() => {
    if (isSalesOrderSortingEffectFirstRun.current) {
      isSalesOrderSortingEffectFirstRun.current = false;
      return;
    }
    if (salesOrdersSorting?.isSuccess) {
      orderManagementActions.setModifiedSalesOrders({
        ...orderManagementStore.modifiedSalesOrders,
        Sorting: {
          type: SalesOrderState.Sorting,
          orderCount: salesOrdersSorting?.data?.count,
          orders: orderManagementStore.modifiedSalesOrders.Sorting
            ? [
                ...(orderManagementStore.modifiedSalesOrders.Sorting as any).orders,
                ...(salesOrdersSorting?.data?.data as any),
              ]
            : salesOrdersSorting?.data?.data,
        } as IModifiedSalesOrders,
      });
    }
  }, [salesOrdersSorting]);

  useEffect(() => {
    if (isSalesOrderPackingEffectFirstRun.current) {
      isSalesOrderPackingEffectFirstRun.current = false;
      return;
    }
    if (salesOrdersPacking?.isSuccess) {
      orderManagementActions.setModifiedSalesOrders({
        ...orderManagementStore.modifiedSalesOrders,
        Packing: {
          type: SalesOrderState.Packing,
          orderCount: salesOrdersPacking?.data?.count,
          orders: orderManagementStore.modifiedSalesOrders.Packing
            ? [
                ...(orderManagementStore.modifiedSalesOrders.Packing as any).orders,
                ...(salesOrdersPacking?.data?.data as any),
              ]
            : salesOrdersPacking?.data?.data,
        } as IModifiedSalesOrders,
      });
    }
  }, [salesOrdersPacking]);

  useEffect(() => {
    if (isSalesOrderDispatchEffectFirstRun.current) {
      isSalesOrderDispatchEffectFirstRun.current = false;
      return;
    }
    if (salesOrdersDispatch?.isSuccess) {
      orderManagementActions.setModifiedSalesOrders({
        ...orderManagementStore.modifiedSalesOrders,
        Dispatch: {
          type: SalesOrderState.Dispatch,
          orderCount: salesOrdersDispatch?.data?.count,
          orders: orderManagementStore.modifiedSalesOrders.Dispatch
            ? [
                ...(orderManagementStore.modifiedSalesOrders.Dispatch as any).orders,
                ...(salesOrdersDispatch?.data?.data as any),
              ]
            : salesOrdersDispatch?.data?.data,
        } as IModifiedSalesOrders,
      });
    }
  }, [salesOrdersDispatch]);

  useEffect(() => {
    if (isSalesOrderSLAMEffectFirstRun.current) {
      isSalesOrderSLAMEffectFirstRun.current = false;
      return;
    }
    if (salesOrdersSLAM?.isSuccess) {
      orderManagementActions.setModifiedSalesOrders({
        ...orderManagementStore.modifiedSalesOrders,
        SLAM: {
          type: SalesOrderState.Slam,
          orderCount: salesOrdersSLAM?.data?.count,
          orders: orderManagementStore.modifiedSalesOrders.SLAM
            ? [
                ...(orderManagementStore.modifiedSalesOrders.SLAM as any).orders,
                ...(salesOrdersSLAM?.data?.data as any),
              ]
            : salesOrdersSLAM?.data?.data,
        } as IModifiedSalesOrders,
      });
    }
  }, [salesOrdersSLAM]);

  useEffect(() => {
    if (isSalesOrderCancelledEffectFirstRun.current) {
      isSalesOrderCancelledEffectFirstRun.current = false;
      return;
    }
    if (salesOrdersCancelled?.isSuccess) {
      orderManagementActions.setModifiedSalesOrders({
        ...orderManagementStore.modifiedSalesOrders,
        Cancelled: {
          type: SalesOrderState.Cancelled,
          orderCount: salesOrdersCancelled?.data?.count,
          orders: orderManagementStore.modifiedSalesOrders.Cancelled
            ? [
                ...(orderManagementStore.modifiedSalesOrders.Cancelled as any).orders,
                ...(salesOrdersCancelled?.data?.data as any),
              ]
            : salesOrdersCancelled?.data?.data,
        } as IModifiedSalesOrders,
      });
    }
  }, [salesOrdersCancelled]);

  useEffect(() => {
    if (
      (salesOrdersCreated?.isBusy && !orderManagementStore.modifiedSalesOrders.Created) ||
      (salesOrdersPicking?.isBusy && !orderManagementStore.modifiedSalesOrders.Picking) ||
      (salesOrdersSorting?.isBusy && !orderManagementStore.modifiedSalesOrders.Sorting) ||
      (salesOrdersPacking?.isBusy && !orderManagementStore.modifiedSalesOrders.Packing) ||
      (salesOrdersDispatch?.isBusy && !orderManagementStore.modifiedSalesOrders.Dispatch) ||
      (salesOrdersSLAM?.isBusy && !orderManagementStore.modifiedSalesOrders.SLAM) ||
      (salesOrdersCancelled?.isBusy && !orderManagementStore.modifiedSalesOrders.Cancelled)
    ) {
      orderManagementActions.setIsResourceBusy(true);
    } else {
      orderManagementActions.setIsResourceBusy(false);
    }
  }, [
    salesOrdersCreated,
    salesOrdersPicking,
    salesOrdersSorting,
    salesOrdersPacking,
    salesOrdersDispatch,
    salesOrdersSLAM,
    salesOrdersCancelled,
    orderManagementStore.modifiedSalesOrders,
  ]);

  return (
    <Flex height="100vh" flexDirection="column">
      <ActionBar title={t(`${intlKey}.Title`)} breadcrumb={[{ title: t(`${intlKey}.Title`) }]} />
      <LayoutContent display="flex" flexDirection="column" flexGrow={1}>
        <FilterAnalytics />
        <Panel bg="palette.white" p="16px 22px" mt="18px" borderRadius="sm" flexGrow={1} flexShrink={0}>
          {orderManagementStore.isResourceBusy ? (
            <SkeletonCards cardAmount={warehouseConfig?.data?.batchPickingEnabled ? 7 : 6} />
          ) : (
            <OrderManagementColumGrid />
          )}
          {salesOrdersCreated?.error &&
            salesOrdersPicking?.error &&
            salesOrdersSorting?.error &&
            salesOrdersPacking?.error &&
            salesOrdersDispatch?.error &&
            salesOrdersSLAM?.error &&
            salesOrdersCancelled?.error && (
              <ErrorPanel title={t('ErrorPanel.ErrorMessage')} message={t('ErrorPanel.ReloadMessage')} />
            )}
        </Panel>
      </LayoutContent>
    </Flex>
  );
};

export default OrderManagement;
