import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Dialog, DialogTypes, Flex, Text, useToast } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { QueryBuilder } from 'dynamic-query-builder-client';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { SalesOrderPickingPriority } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import PickingManagementWaitingOrdersColumns from './columns/pickingManagementWaitingOrdersColumns';

const intlKey = 'PickingManagement.WaitingOrdersGrid';

export enum DeliveryTypeColors {
  ManualDelivery = 'palette.blue_darker',
  RegularDelivery = 'palette.green_darker',
  SameDayDelivery = 'palette.red_darker',
  ScheduledDelivery = 'palette.hardBlue',
}

const pickingPriorities = Object.values(SalesOrderPickingPriority)
  .filter(priority => priority !== SalesOrderPickingPriority.None)
  .map(priority => ({
    key: priority,
    name: `${intlKey}.Priorities.${priority}.Name`,
    description: `${intlKey}.Priorities.${priority}.Description`,
  }));

const PickingWaitingOrdersGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const [isMultiDialogOpen, setIsMultiDialogOpen] = useState(false);
  const [isProblematicPrioritizeDialogOpen, setIsProblematicPrioritizeDialogOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<SalesOrderPickingPriority>(
    SalesOrderPickingPriority.Priority3
  );
  const [selectedIndexes, setSelectedIndexes] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [isSelectAllOrdersCalled, setIsSelectAllOrdersCalled] = useState(false);
  const [query, setQuery] = useState('');

  const prioritizeSalesOrdersResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PrioritizeSalesOrders]
  );

  const prioritizeAllSalesOrdersResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PrioritizeAllSalesOrders]
  );

  const totalOrderCount =
    useSelector(
      (state: StoreState) =>
        gridSelectors.getGridFooterPagination(GridType.PickingManagementWaitingOrdersGrid, state.grid)?.rowCount
    ) || 0;

  const appliedFilters = useSelector((state: StoreState) =>
    gridSelectors.getGridAppliedFilters(GridType.PickingManagementWaitingOrdersGrid, state.grid)
  );

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.PrioritizeSalesOrders));
      dispatch(resourceActions.resourceInit(ResourceType.PrioritizeAllSalesOrders));
    };
  }, []);

  useEffect(() => {
    const builder = new QueryBuilder({
      filters: appliedFilters,
    });
    setQuery(builder.build());
  }, [isSelectAllOrdersCalled]);

  useEffect(() => {
    if (prioritizeSalesOrdersResponse?.isSuccess) {
      const count: number = selectedRows?.length - prioritizeSalesOrdersResponse?.data?.length;
      if (prioritizeSalesOrdersResponse?.data?.length) {
        setIsProblematicPrioritizeDialogOpen(true);
      }
      handlePrioritizeResponse(count);
    }
  }, [prioritizeSalesOrdersResponse]);

  useEffect(() => {
    if (prioritizeAllSalesOrdersResponse?.isSuccess) {
      const count: number = totalOrderCount;
      if (prioritizeAllSalesOrdersResponse?.data?.length) {
        setIsProblematicPrioritizeDialogOpen(true);
      }
      handlePrioritizeResponse(count);
    }
  }, [prioritizeAllSalesOrdersResponse]);

  const handlePrioritizeResponse = (count: number) => {
    setIsMultiDialogOpen(false);
    setSelectedIndexes([]);
    setSelectedRows([]);
    setSelectedPriority(SalesOrderPickingPriority.Priority3);
    setTimeout(() => {
      dispatch(gridActions.gridFetchRequested(GridType.PickingManagementWaitingOrdersGrid));
    }, 500); 
    toast({
      position: 'bottom-left',
      variant: 'success',
      title: t(`${intlKey}.Toast.Title`),
      description: t(`${intlKey}.Toast.Description`, {
        count: count,
      }),
      duration: 5000,
      icon: { name: 'fas fa-check-circle' },
    });
  };

  const multiSelectPrioritizeDialog = () => (
    <Flex flexDirection="column" fontSize={14} alignItems="flex-start">
      <Text fontWeight={500} lineHeight="small" color="palette.black">
        {selectedRows.length === 1 ? (
          <Trans
            i18nKey={`${intlKey}.SureToPrioritizeSingle`}
            values={{
              refNumber: selectedRows[0].row.referenceNumber,
              operationName: selectedRows[0].row.operationName,
            }}
          />
        ) : (
          <Trans
            i18nKey={`${intlKey}.SureToPrioritizeMulti`}
            count={isSelectAllOrdersCalled ? totalOrderCount : selectedRows?.length}
          />
        )}
      </Text>
      <Text marginTop={22} marginBottom={16} fontWeight={600}>
        {t(`${intlKey}.PrioritiesList`)}
      </Text>
      <Flex flexDirection="column-reverse" marginBottom={32}>
        {pickingPriorities.map((priority, i) => (
          <Flex
            key={i.toString()}
            onClick={() => setSelectedPriority(priority.key)}
            width={1}
            borderRadius={"sm"}
            border="xs"
            borderColor={selectedPriority === priority.key ? 'palette.blue_dark' : 'palette.steel_darker'}
            alignItems="center"
            px={22}
            height={80}
            marginBottom={11}
            color={selectedPriority === priority.key ? 'palette.blue_darker' : 'palette.black'}
            cursor="pointer"
          >
            <Text fontSize={24} fontWeight={900}>
              {(i + 1).toString()}
            </Text>
            <Flex flexDirection="column" gutter={5} marginLeft={22}>
              <Text fontWeight={600} lineHeight="large">
                {t(priority.name)}
              </Text>
              <Text fontSize={12} lineHeight="large" mt={6}>
                {t(priority.description)}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );

  return (
    <>
      <PickingManagementWaitingOrdersColumns
        selectedRows={selectedRows}
        selectedIndexes={selectedIndexes}
        setSelectedRows={setSelectedRows}
        setSelectedIndexes={setSelectedIndexes}
        setIsMultiDialogOpen={setIsMultiDialogOpen}
        isSelectAllOrdersCalled={isSelectAllOrdersCalled}
        setIsSelectAllOrdersCalled={setIsSelectAllOrdersCalled}
        totalOrderCount={totalOrderCount}
      />
      <Dialog
        isOpen={isMultiDialogOpen}
        isLoading={prioritizeSalesOrdersResponse?.isBusy || prioritizeAllSalesOrdersResponse?.isBusy}
        onApprove={() => {
          isSelectAllOrdersCalled
            ? dispatch(
                resourceActions.resourceRequested(ResourceType.PrioritizeAllSalesOrders, {
                  priority: selectedPriority,
                  dqb: query,
                })
              )
            : dispatch(
                resourceActions.resourceRequested(ResourceType.PrioritizeSalesOrders, {
                  params: { salesOrderIds: selectedRows.map(row => row.row.id), priority: selectedPriority },
                })
              );
        }}
        onCancel={() => {
          setSelectedIndexes([]);
          setSelectedRows([]);
          setIsMultiDialogOpen(false);
          setSelectedPriority(SalesOrderPickingPriority.Priority3);
          dispatch(gridActions.gridFetchRequested(GridType.PickingManagementWaitingOrdersGrid));
        }}
        type={DialogTypes.Information}
        text={{
          approve: t(`Modal.Confirmation.Prioritize`),
          cancel: t(`Modal.Warning.Cancel`),
        }}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.5,
        }}
        maxHeight={undefined}
      >
        {multiSelectPrioritizeDialog()}
      </Dialog>
      <Dialog
        isOpen={isProblematicPrioritizeDialogOpen}
        onApprove={() => setIsProblematicPrioritizeDialogOpen(false)}
        onCancel={() => setIsProblematicPrioritizeDialogOpen(false)}
        type={DialogTypes.Warning}
        text={{
          approve: t(`Modal.Warning.Okay`),
        }}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.5,
        }}
      >
        {prioritizeSalesOrdersResponse?.data?.length === 1 ? (
          <Text fontSize={14} fontWeight={500} lineHeight="small" color="palette.black">
            <Trans
              i18nKey={`${intlKey}.CouldNotPrioritizedSingle`}
              values={{
                refNumber: prioritizeSalesOrdersResponse?.data[0].salesOrderReferenceNumber,
                operationName: prioritizeSalesOrdersResponse?.data[0].operationName,
              }}
            />
          </Text>
        ) : (
          <Flex flexDirection="column" fontSize={14} color="palette.black">
            <Text fontWeight={500} lineHeight="xxLarge">
              {t(`${intlKey}.CouldNotPrioritizedMulti`)}
            </Text>
            <Text mt={20} fontWeight={600} mb={12}>
              {t(`${intlKey}.SalesOrderNumber`)}
            </Text>
            <ul>
              {prioritizeAllSalesOrdersResponse?.data
                ? prioritizeAllSalesOrdersResponse?.data?.map(problematicOrder => (
                    <li key={problematicOrder.salesOrderReferenceNumber}>
                      {problematicOrder.salesOrderReferenceNumber}
                    </li>
                  ))
                : prioritizeSalesOrdersResponse?.data?.map(problematicOrder => (
                    <li key={problematicOrder.salesOrderReferenceNumber}>
                      {problematicOrder.salesOrderReferenceNumber}
                    </li>
                  ))}
            </ul>
          </Flex>
        )}
      </Dialog>
    </>
  );
};

export default PickingWaitingOrdersGrid;
