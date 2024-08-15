import { Box, Flex, Heading, PseudoBox } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import {
  BooleanFilter,
  BooleanFilterOperation,
  Pagination,
  QueryBuilder,
  SortDirection,
  SortField,
  StringFilter,
  StringFilterOperation
} from 'dynamic-query-builder-client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  CancelledSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  CreatedSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  InDispatchSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  InPackingSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  InPickingSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  InSLAMOrSuspendedSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  InSortingSalesOrderQueryOutputDTODynamicQueryOutputDTO,
  SalesChannel,
  SalesOrderState
} from '../../../../services/swagger';
import useOrderManagementStore from '../../../../store/global/orderManagementStore';
import { StoreState } from '../../../../store/initState';
import SalesOrderItem from '../../../molecules/SalesOrderItem';
import { ListTypes, listTypeToResourceTypeMap, listTypeToSortMap } from '../OrderManagement';
import { SalesOrderLastItem } from './SalesOrderLastItem';

const intlKey = 'OrderManagement';

const OrderManagementColumGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [orderManagementStore, orderManagementActions] = useOrderManagementStore();

  const salesOrdersOperationCount: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrdersOperationCount]
  );
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

  const listTypeToIsBusyMap = (listType: string) => {
    switch (listType) {
      case SalesOrderState.Created:
        return salesOrdersCreated?.isBusy;
      case SalesOrderState.Picking:
        return salesOrdersPicking?.isBusy;
      case SalesOrderState.Sorting:
        return salesOrdersSorting?.isBusy;
      case SalesOrderState.Packing:
        return salesOrdersPacking?.isBusy;
      case SalesOrderState.Dispatch:
        return salesOrdersDispatch?.isBusy;
      case SalesOrderState.Slam:
        return salesOrdersSLAM?.isBusy;
      case SalesOrderState.Cancelled:
        return salesOrdersCancelled?.isBusy;
      default:
        return false;
    }
  };

  const listTypeToOperationCountMap = (listType: string) => {
    switch (listType) {
      case SalesOrderState.Created:
        return 'createdSalesOrdersOperationCount';
      case SalesOrderState.Picking:
        return 'pickingSalesOrdersOperationCount';
      case SalesOrderState.Sorting:
        return 'sortingSalesOrdersOperationCount';
      case SalesOrderState.Packing:
        return 'packingSalesOrdersOperationCount';
      case SalesOrderState.Dispatch:
        return 'dispatchedSalesOrdersOperationCount';
      case SalesOrderState.Slam:
        return 'slamSalesOrdersOperationCount';
      case SalesOrderState.Cancelled:
        return 'cancelledSalesOrdersOperationCount';
      default:
        return 'createdSalesOrdersOperationCount';
    }
  };

  const listTypeToPreviousCountMap = (listType: string) => {
    switch (listType) {
      case SalesOrderState.Created:
        return orderManagementStore.previousCountData.previousCountCreated;
      case SalesOrderState.Picking:
        return orderManagementStore.previousCountData.previousCountPicking;
      case SalesOrderState.Sorting:
        return orderManagementStore.previousCountData.previousCountSorting;
      case SalesOrderState.Packing:
        return orderManagementStore.previousCountData.previousCountPacking;
      case SalesOrderState.Dispatch:
        return orderManagementStore.previousCountData.previousCountDispatch;
      case SalesOrderState.Slam:
        return orderManagementStore.previousCountData.previousCountSLAM;
      case SalesOrderState.Cancelled:
        return orderManagementStore.previousCountData.previousCountCancelled;
      default:
        return orderManagementStore.previousCountData.previousCountCreated;
    }
  };

  const listTypeToMaxCountMap = (listType: string) => {
    switch (listType) {
      case SalesOrderState.Created:
        return salesOrdersCreated?.data?.count || 0;
      case SalesOrderState.Picking:
        return salesOrdersPicking?.data?.count || 0;
      case SalesOrderState.Sorting:
        return salesOrdersSorting?.data?.count || 0;
      case SalesOrderState.Packing:
        return salesOrdersPacking?.data?.count || 0;
      case SalesOrderState.Dispatch:
        return salesOrdersDispatch?.data?.count || 0;
      case SalesOrderState.Slam:
        return salesOrdersSLAM?.data?.count || 0;
      case SalesOrderState.Cancelled:
        return salesOrdersCancelled?.data?.count || 0;
      default:
        return 0;
    }
  };

  const increasePreviousCount = (listType: string) => {
    if (listType === SalesOrderState.Created) {
      orderManagementActions.setPreviousCountData({
        ...orderManagementStore.previousCountData,
        previousCountCreated: orderManagementStore.previousCountData.previousCountCreated + 10,
      });
    }
    if (listType === SalesOrderState.Picking) {
      orderManagementActions.setPreviousCountData({
        ...orderManagementStore.previousCountData,
        previousCountPicking: orderManagementStore.previousCountData.previousCountPicking + 10,
      });
    }
    if (listType === SalesOrderState.Packing) {
      orderManagementActions.setPreviousCountData({
        ...orderManagementStore.previousCountData,
        previousCountPacking: orderManagementStore.previousCountData.previousCountPacking + 10,
      });
    }
    if (listType === SalesOrderState.Sorting) {
      orderManagementActions.setPreviousCountData({
        ...orderManagementStore.previousCountData,
        previousCountSorting: orderManagementStore.previousCountData.previousCountSorting + 10,
      });
    }
    if (listType === SalesOrderState.Dispatch) {
      orderManagementActions.setPreviousCountData({
        ...orderManagementStore.previousCountData,
        previousCountDispatch: orderManagementStore.previousCountData.previousCountDispatch + 10,
      });
    }
    if (listType === SalesOrderState.Slam) {
      orderManagementActions.setPreviousCountData({
        ...orderManagementStore.previousCountData,
        previousCountSLAM: orderManagementStore.previousCountData.previousCountSLAM + 10,
      });
    }
    if (listType === SalesOrderState.Cancelled) {
      orderManagementActions.setPreviousCountData({
        ...orderManagementStore.previousCountData,
        previousCountCancelled: orderManagementStore.previousCountData.previousCountCancelled + 10,
      });
    }
  };

  const loadMore = (listType: string, maxCount: number, filterValues) => {
    const filters: any = [];
    if (filterValues.operation) {
      filters.push(
        new StringFilter({
          property: 'operation.id',
          value: filterValues.operation,
          op: StringFilterOperation.Equals,
        })
      );
    }
    if (filterValues.referenceNumber) {
      filters.push(
        new StringFilter({
          property: 'referenceNumber',
          value: filterValues.referenceNumber,
          op: StringFilterOperation.Contains,
        })
      );
    }
    if (filterValues.isCutOff) {
      filters.push(
        new BooleanFilter({
          property: 'isCutOff',
          op: BooleanFilterOperation.Equals,
          value: filterValues.isCutOff,
        })
      );
    }
    if (filterValues.isLate) {
      filters.push(
        new BooleanFilter({
          property: 'isLate',
          op: BooleanFilterOperation.Equals,
          value: filterValues.isLate,
        })
      );
    }
    if (filterValues.priority) {
      filters.push(
        new StringFilter({
          property: 'priority',
          op: StringFilterOperation.Equals,
          value: filterValues.priority,
        })
      );
    }
    if (filterValues.deliveryType) {
      filters.push(
        new StringFilter({
          property: 'deliveryType',
          value: filterValues.deliveryType,
          op: StringFilterOperation.Equals,
        })
      );
    }
    if (filterValues.salesChannel) {
      filters.push(
        new StringFilter({
          property: `salesChannel`,
          op: StringFilterOperation.Equals,
          value: filterValues.salesChannel,
        })
      );
    }
    if (filterValues.onlyErrors) {
      filters.push(
        new BooleanFilter({
          property: 'isSuspended',
          op: BooleanFilterOperation.Equals,
          value: true,
        })
      );
    }

    if (maxCount > listTypeToPreviousCountMap(listType)) {
      const builder = new QueryBuilder({
        filters: filters,
        pagination: new Pagination({ offset: listTypeToPreviousCountMap(listType), count: 10 }),
        sortBy: new SortField({
          property: listTypeToSortMap(listType),
          by: SortDirection.ASC,
        }),
      });
      const query = builder.build();
      dispatch(resourceActions.resourceRequested(listTypeToResourceTypeMap(listType), { query }));
      increasePreviousCount(listType);
    }
  };

  return (
    <Flex flexGrow={1}>
      {[
        orderManagementStore.modifiedSalesOrders.Created,
        orderManagementStore.modifiedSalesOrders.Picking,
        orderManagementStore.modifiedSalesOrders.Sorting,
        orderManagementStore.modifiedSalesOrders.Packing,
        orderManagementStore.modifiedSalesOrders.SLAM,
        orderManagementStore.modifiedSalesOrders.Dispatch,
        orderManagementStore.modifiedSalesOrders.Cancelled,
      ].map((item: any, i) => {
        if (item?.orders) {
          return (
            <PseudoBox
              key={i.toString()}
              width="full"
              px="10"
              borderRight="xs"
              borderColor="palette.snow_lighter"
              _last={{ borderRight: 0 }}
              display="flex"
              flexDirection="column"
              height="100%"
              ml={8}
            >
              <Box>
                <Heading fontFamily="heading" fontSize="14" letterSpacing="-0.26px" color="palette.grey_darker">
                  {t(`${intlKey}.Grid.${item.type}`)}
                </Heading>
                <Box color="palette.grey_lighter">
                  {t(`${intlKey}.OrderCount`, {
                    orderCount: item.orderCount,
                  })}
                </Box>
                <Box color="palette.grey_lighter">
                  {t(`${intlKey}.OperationCount`, {
                    operationCount: salesOrdersOperationCount?.data
                      ? salesOrdersOperationCount?.data[listTypeToOperationCountMap(item.type)]
                      : 0,
                  })}
                </Box>
              </Box>
              <Box id="order-item-list" overflowX="hidden" overflowY="auto" flexGrow={1} height="0px" mt={16}>
                {item.orders &&
                  item.orders?.map((order, k, arr) =>
                    k + 1 === arr.length ? (
                      <SalesOrderLastItem
                        key={order.id}
                        order={order}
                        isBusy={listTypeToIsBusyMap(ListTypes[i])}
                        loadMore={() => {
                          loadMore(ListTypes[i], listTypeToMaxCountMap(ListTypes[i]), orderManagementStore.filterData);
                        }}
                      />
                    ) : (
                      <SalesOrderItem key={order.id} order={order} />
                    )
                  )}
              </Box>
            </PseudoBox>
          );
        }
        return null;
      })}
    </Flex>
  );
};

export default OrderManagementColumGrid;
