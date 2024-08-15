import { Box, Button, Flex, Icon, Input, Panel, Select, Toggle } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import {
  BooleanFilter,
  BooleanFilterOperation,
  Pagination,
  QueryBuilder,
  SortDirection,
  SortField,
  StringFilter,
  StringFilterOperation,
} from 'dynamic-query-builder-client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  DeliveryTypeTag,
  OperationQueryOutputDTO,
  SalesChannel,
  SalesOrderPickingPriority,
  SalesOrderState,
  WarehouseConfigOutputDTO,
} from '../../../../services/swagger';
import useOrderManagementStore, { cutOffStatus } from '../../../../store/global/orderManagementStore';
import { StoreState } from '../../../../store/initState';
import { ListTypes, listTypeToResourceTypeMap, listTypeToSortMap } from '../OrderManagement';

const intlKey = 'OrderManagement';

export const FilterAnalytics = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [orderManagementStore, orderManagementActions] = useOrderManagementStore();
  const [operationOptions, setOperationOptions]: any = useState();

  const operations: Resource<OperationQueryOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetOperations]
  );
  const warehouseConfig: Resource<WarehouseConfigOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.WarehouseConfig]
  );

  useEffect(() => {
    const options = [{ value: 'all', label: t(`${intlKey}.Filter.All`) }];
    if (operations?.data) {
      operations.data.forEach(operation => {
        options.push({
          value: operation.id as string,
          label: operation.name as string,
        });
      });
    }
    setOperationOptions(options);
  }, [operations]);

  const filterOrders = values => {
    const filters: any = [];
    if (values.operation) {
      filters.push(
        new StringFilter({
          property: 'operation.id',
          value: values.operation,
          op: StringFilterOperation.Equals,
        })
      );
    }
    if (values.referenceNumber) {
      filters.push(
        new StringFilter({
          property: 'referenceNumber',
          value: values.referenceNumber,
          op: StringFilterOperation.Contains,
        })
      );
    }
    if (values.isCutOff) {
      filters.push(
        new BooleanFilter({
          property: 'isCutOff',
          value: values.isCutOff,
          op: BooleanFilterOperation.Equals,
        })
      );
    }
    if (values.isLate) {
      filters.push(
        new BooleanFilter({
          property: 'isLate',
          value: values.isLate,
          op: BooleanFilterOperation.Equals,
        })
      );
    }
    if (values.priority) {
      filters.push(
        new StringFilter({
          property: 'priority',
          value: values.priority,
          op: StringFilterOperation.Equals,
        })
      );
    }
    if (values.deliveryType) {
      filters.push(
        new StringFilter({
          property: 'deliveryType',
          value: values.deliveryType,
          op: StringFilterOperation.Equals,
        })
      );
    }
    if (values.salesChannel) {
      filters.push(
        new StringFilter({
          property: 'salesChannel',
          op: StringFilterOperation.Equals,
          value: values.salesChannel
        })
      );
    }
    if (values.onlyErrors) {
      filters.push(
        new BooleanFilter({
          property: 'isSuspended',
          op: BooleanFilterOperation.Equals,
          value: true,
        })
      );
    }

    ListTypes.forEach(listType => {
      if (listType === SalesOrderState.Sorting && !warehouseConfig?.data?.batchPickingEnabled) null;
      else {
        const builder = new QueryBuilder({
          filters: filters,
          pagination: new Pagination({ offset: 0, count: 10 }),
          sortBy: new SortField({
            property: listTypeToSortMap(listType),
            by: SortDirection.ASC,
          }),
        });
        const query = builder.build();
        dispatch(resourceActions.resourceRequested(listTypeToResourceTypeMap(listType), { query }));
      }
    });
    const builder = new QueryBuilder({
      filters: filters,
    });
    const query = builder.build();
    dispatch(resourceActions.resourceRequested(ResourceType.GetSalesOrdersOperationCount, { query }));

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

  const resetModifiedStates = () => {
    orderManagementActions.setModifiedSalesOrders({
      Created: undefined,
      Picking: undefined,
      Sorting: undefined,
      Packing: undefined,
      SLAM: undefined,
      Dispatch: undefined,
      Cancelled: undefined,
    });
  };

  const cutOffOptions = [
    { value: cutOffStatus.all, label: t(`${intlKey}.Filter.All`) },
    { value: cutOffStatus.cutOff, label: t(`${intlKey}.CutOffStatus.CutOff`) },
    { value: cutOffStatus.late, label: t(`${intlKey}.CutOffStatus.Late`) },
  ];

  const salesChannelOptions = [
    { value: 'all', label: t(`${intlKey}.Filter.All`) },
    ...Object.keys(SalesChannel)
      .map(channel => ({ value: channel, label: t(`Enum.${channel}`) })),
  ];

  const priorityOptions = [
    { value: 'all', label: t(`${intlKey}.Filter.All`) },
    ...Object.keys(SalesOrderPickingPriority)
      .filter(priority => priority !== SalesOrderPickingPriority.None)
      .map(priority => ({ value: priority, label: t(`Enum.${priority}`) })),
  ];

  const deliveryTypeOptions = [
    { value: 'all', label: t(`${intlKey}.Filter.All`) },
    ...Object.keys(DeliveryTypeTag).map(DeliveryType => ({ value: DeliveryType, label: t(`Enum.${DeliveryType}`) })),
  ];

  const handleFilterClick = e => {
    e.preventDefault();
    resetModifiedStates();
    filterOrders(orderManagementStore.filterData);
  };

  return (
    <Panel bg="palette.white" p="10px 16px" borderRadius="sm">
      <form>
        <Flex gutter={8}>
          <Box width={1 / 8}>
            <Select
              options={operationOptions}
              value={orderManagementStore.filterData.operation}
              onChange={e =>
                orderManagementActions.setFilterData({
                  ...orderManagementStore.filterData,
                  operation: e.currentTarget.value === 'all' ? '' : e.currentTarget.value,
                })
              }
              placeholder={t(`${intlKey}.Filter.SelectOperation`)}
              width="full"
              flex="auto"
            />
          </Box>
          <Box width={1 / 8}>
            <Input
              value={orderManagementStore.filterData.referenceNumber}
              onChange={(e: React.SyntheticEvent<HTMLInputElement>) =>
                orderManagementActions.setFilterData({
                  ...orderManagementStore.filterData,
                  referenceNumber: e.currentTarget.value,
                })
              }
              placeholder={t(`${intlKey}.Filter.OrderNumber`)}
              width="full"
              flex="auto"
            />
          </Box>
          <Box width={1 / 8}>
            <Select
              options={cutOffOptions}
              value={orderManagementStore.filterData.isCutOff}
              onChange={e => {
                let filter = {};
                if (e.value.value == cutOffStatus.cutOff) filter = { isCutOff: true, isLate: false };
                if (e.value.value == cutOffStatus.late) filter = { isCutOff: false, isLate: true };
                if (e.value.value == cutOffStatus.all) filter = { isCutOff: '', isLate: '' };
                orderManagementActions.setFilterData({ ...orderManagementStore.filterData, ...filter });
              }}
              placeholder={t(`${intlKey}.Filter.CutOffStatus`)}
              width="full"
              flex="auto"
            />
          </Box>
          <Box width={1 / 8}>
            <Select
              options={priorityOptions}
              value={orderManagementStore.filterData.priority}
              onChange={e =>
                orderManagementActions.setFilterData({
                  ...orderManagementStore.filterData,
                  priority: e.currentTarget.value === 'all' ? '' : e.currentTarget.value,
                })
              }
              placeholder={t(`${intlKey}.Filter.SelectPriority`)}
              width="full"
              flex="auto"
            />
          </Box>
          <Box width={1 / 8}>
            <Select
              options={salesChannelOptions}
              value={orderManagementStore.filterData.priority}
              onChange={e =>
                orderManagementActions.setFilterData({
                  ...orderManagementStore.filterData,
                  salesChannel: e.currentTarget.value === 'all' ? '' : e.currentTarget.value,
                })
              }
              placeholder={t(`${intlKey}.Filter.SelectSalesChannel`)}
              width="full"
              flex="auto"
            />
          </Box>
          <Box width={1 / 8}>
            <Select
              options={deliveryTypeOptions}
              value={orderManagementStore.filterData.deliveryType}
              placeholder={t(`${intlKey}.Filter.SelectDeliveryType`)}
              onChange={e =>
                orderManagementActions.setFilterData({
                  ...orderManagementStore.filterData,
                  deliveryType: e.currentTarget.value === 'all' ? '' : e.currentTarget.value,
                })
              }
              width="full"
              flex="auto"
            />
          </Box>
          <Flex alignItems="center" flexShrink={0} width={1 / 8}>
            <Toggle
              id="order-with-errors"
              checked={orderManagementStore.filterData.onlyErrors}
              onChange={e =>
                orderManagementActions.setFilterData({
                  ...orderManagementStore.filterData,
                  onlyErrors: e.currentTarget.checked,
                })
              }
            />
            <Box as="label" htmlFor="order-with-errors" ml="6">
              {t(`${intlKey}.Filter.OnlyErrors`)}
            </Box>
          </Flex>
          <Button
            flexShrink={0}
            disabled={orderManagementStore.isResourceBusy}
            fontSize={12}
            marginLeft={64}
            onClick={e => handleFilterClick(e)}
            width={1 / 8}
          >
            <Icon name="fas fa-filter" mr="6" />
            {t(`${intlKey}.Filter.ApplyFilters`)}
          </Button>
        </Flex>
      </form>
    </Panel>
  );
};
