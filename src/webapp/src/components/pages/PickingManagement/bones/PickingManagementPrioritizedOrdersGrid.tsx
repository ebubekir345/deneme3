import {
  ColumnSize,
  DataGridRow,
  dateTimeFormatter,
  FormatterProps,
  gridActions,
  gridSelectors,
  PredefinedFilter,
} from '@oplog/data-grid';
import { Box, Button, Dialog, DialogTypes, Flex, Icon, PseudoBox, Text, useToast } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { ArrayFilterOperation, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import {
  DeliveryTypeTag,
  PrioritizedSalesOrderOutputDTO,
  RemovePickingPrioritiesCommand,
  SalesChannel,
  SalesOrderPickingPriority,
} from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import {
  BatchDetailsLinkFormatter,
  chipFormatter,
  ChipFormatterProps,
  coloredBadgeFormatter,
  cutOffStatusFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  OrderDetailsLinkFormatter,
  priorityFormatter,
  uniqueValuesOfArrayToStringFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { VehicleTypes } from '../../FlowManagement/bones/FlowManagementGrid';
import { DeliveryTypeColors } from './PickingManagementWaitingOrdersGrid';

const intlKey = 'PickingManagement.PrioritizedOrdersGrid';
const titleKey = 'PickingManagement.PrioritizedOrdersGrid.Title';

const commonButtonProps = {
  height: '44px',
  marginLeft: 20,
  color: 'palette.white !important',
  fontSize: '16',
  borderRadius: '6px',
  border: 'none',
  letterSpacing: '-0.63px',
  mb: '0',
  fontWeight: 600,
  _focus: {
    outline: 'none !important',
  },
  backgroundColor: 'palette.softBlue',
  _hover: { bg: 'palette.softBlue' },
};

const prioritizedSalesOrderGridPredefinedFilters: PredefinedFilter[] = Object.values(SalesOrderPickingPriority)
  .filter(priority => priority !== SalesOrderPickingPriority.None)
  .map(filter => ({
    filter: new StringFilter({
      property: 'priority',
      op: StringFilterOperation.Equals,
      value: filter,
      id: filter,
    }),
    selected: false,
    visibility: false,
  }));

const PriorityFilters = {
  All: 'All',
  ...SalesOrderPickingPriority,
};

const PickingManagementPrioritizedOrdersGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const [isMultiDialogOpen, setIsMultiDialogOpen] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [isProblematicPrioritizeDialogOpen, setIsProblematicPrioritizeDialogOpen] = useState(false);

  const [activeQuickFilters, setActiveQuickFilters] = useState([PriorityFilters.All]);

  const appliedPredefinedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.PrioritizedSalesOrders, state.grid)
  );

  const gridRawData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.PrioritizedSalesOrders, state.grid)
  );

  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.PrioritizedSalesOrders, state.grid)
  );

  const quickFilterButtons = Object.keys(PriorityFilters)
    .filter(priority => priority !== PriorityFilters.None)
    .map(priority => ({
      key: priority,
      title: t(`Enum.${priority}`),
      isSelected: activeQuickFilters.includes(priority),
      onClick: () => {
        if (!isGridBusy) {
          const filters = appliedPredefinedFilters.map(filter => ({
            ...filter,
            selected: filter.filter.valueToString() === priority,
            visibility: filter.filter.valueToString() === priority,
          }));
          filters.length && applyQuickFilter(filters);
          setActiveQuickFilters([priority]);
        }
      },
    }));

  const applyQuickFilter = (filters: PredefinedFilter[]) => {
    dispatch(gridActions.gridPaginationOffsetReset(GridType.PrioritizedSalesOrders));
    dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.PrioritizedSalesOrders, filters));
    dispatch(gridActions.gridFetchRequested(GridType.PrioritizedSalesOrders));
  };

  useEffect(() => {
    const appliedQuickFilters = appliedPredefinedFilters
      .filter(filter => filter.filter.property === 'priority' && filter.selected)
      .map(filter => filter.filter.valueToString());
    setActiveQuickFilters(appliedQuickFilters.length ? appliedQuickFilters : [PriorityFilters.All]);
  }, [appliedPredefinedFilters]);

  useEffect(() => {
    setSelectedIndexes([]);
    setSelectedRows([]);
  }, [gridRawData]);

  const removePickingPrioritiesResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RemovePickingPriorities]
  );

  const removePickingPriorities = (params: RemovePickingPrioritiesCommand) => {
    dispatch(resourceActions.resourceRequested(ResourceType.RemovePickingPriorities, { params }));
  };

  const totalPrioritizedOrderCount =
    useSelector(
      (state: StoreState) =>
        gridSelectors.getGridFooterPagination(GridType.PrioritizedSalesOrders, state.grid)?.rowCount
    ) || 0;

  const isTotalPrioritizedOrderBusy = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.PrioritizedSalesOrders, state.grid)
  );

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.RemovePickingPriorities));
    };
  }, []);

  useEffect(() => {
    if (removePickingPrioritiesResponse?.isSuccess) {
      if (removePickingPrioritiesResponse?.data.length) {
        setIsProblematicPrioritizeDialogOpen(true);
      }
      setIsMultiDialogOpen(false);
      setSelectedIndexes([]);
      setSelectedRows([]);
      setTimeout(() => {
        dispatch(gridActions.gridFetchRequested(GridType.PrioritizedSalesOrders));
      }, 500);
      toast({
        position: 'bottom-left',
        variant: 'success',
        title: t(`${intlKey}.Toast.Title`),
        description: t(`${intlKey}.Toast.Description`, {
          count: selectedRows.length - removePickingPrioritiesResponse?.data.length,
        }),
        duration: 5000,
        icon: { name: 'fas fa-check-circle' },
      });
    }
  }, [removePickingPrioritiesResponse]);

  const onRowsSelected = rows => {
    setSelectedIndexes(selectedIndexes.concat(rows.map(r => r.rowIdx)));
    setSelectedRows(selectedRows.concat(rows));
  };

  const onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    setSelectedIndexes(selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1));
    setSelectedRows(selectedRows.filter(selectedRow => rowIndexes.indexOf(selectedRow.rowIdx) === -1));
  };

  const FilterBar = () => (
    <Flex height="54px" px={24} mb={16} bg="palette.white" alignItems="center">
      {isTotalPrioritizedOrderBusy ? (
        <Skeleton width={82} height={36} />
      ) : (
        <Flex flexDirection="column">
          <Box fontSize={12} lineHeight={1.17} letterSpacing="-0.2px" color="#bdbdbd">
            {t(`${intlKey}.StatusBar.Total`)}
          </Box>
          <Box fontFamily="Montserrat" fontSize={20} fontWeight="bold" lineHeight={1.1} color="palette.slate_dark">
            {totalPrioritizedOrderCount} {t(`${intlKey}.StatusBar.Order`)}
          </Box>
        </Flex>
      )}
      <Flex
        gutter={8}
        alignItems="center"
        borderLeft="xs"
        borderColor="palette.slate_lighter"
        pl="24px"
        ml="24px"
        bg="palette.white"
        flexWrap="wrap"
      >
        {quickFilterButtons.map(button => (
          <PseudoBox
            as="button"
            key={button.key}
            onClick={e => {
              e.preventDefault();
              button.onClick();
            }}
            height={32}
            borderRadius="18px"
            fontSize="13px"
            fontWeight={button.isSelected ? 'bold' : 'normal'}
            padding="8px 15px"
            kind={button.isSelected ? 'solid' : 'outline'}
            color={button.isSelected ? 'palette.white' : 'text.input'}
            bg={button.isSelected ? 'palette.teal' : 'palette.white'}
            border="solid 1px"
            borderColor={button.isSelected ? 'palette.teal' : 'palette.snow_dark'}
            flexShrink={0}
            marginY="5px"
            transition="all 0.25s"
            _focus={{ outline: 'none' }}
          >
            {button.title}
          </PseudoBox>
        ))}
      </Flex>
      <Flex alignItems="center" marginLeft={24}>
        <Icon name="fas fa-info-circle" fontSize={16} color="#2f80ed" />
        <Text ml={8} color="#264472" fontSize="12">
          {t(`${intlKey}.StatusBar.InfoNote`)}
        </Text>
      </Flex>
    </Flex>
  );

  const prioritizedOrdersGridColumns: Array<any> = [
    {
      name: geti18nName('ReferenceNumber', t, intlKey),
      key: 'referenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: OrderDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: PrioritizedSalesOrderOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '15px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          text: row.operationName,
          imageUrl: row.operationImageUrl,
          isUpperCase: true,
        } as ChipFormatterProps;
      },
    },
    {
      name: geti18nName('Priority', t, intlKey),
      key: 'priority',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, SalesOrderPickingPriority),
      formatter: (props: FormatterProps) => priorityFormatter(t, props),
    },
    {
      name: geti18nName('OrderCount', t, intlKey),
      key: 'itemCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('SalesChannel', t, intlKey),
      key: 'salesChannel',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, SalesChannel),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('DeliveryType', t, intlKey),
      key: 'deliveryType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, DeliveryTypeTag),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, DeliveryTypeColors),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('OrderCreatedAt', t, intlKey),
      key: 'createdAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('CutOffStatus', t, intlKey),
      key: 'isCutOff',
      type: 'boolean',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      columnSize: ColumnSize.Small,
      formatter: (props: FormatterProps) => cutOffStatusFormatter(props, t, intlKey),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('TrolleyType', t, intlKey),
      key: 'vehicleType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, VehicleTypes),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('StagedZones', t, intlKey),
      key: 'stagedZones',
      type: 'string',
      filterable: true,
      fieldType: 'array',
      searchField: '_',
      outerOp: ArrayFilterOperation.Any,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: uniqueValuesOfArrayToStringFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('BatchName', t, intlKey),
      key: 'batchName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PickListName', t, intlKey),
      key: 'pickListName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('CandidateZones', t, intlKey),
      key: 'candidateZones',
      type: 'string',
      filterable: true,
      fieldType: 'array',
      searchField: '_',
      outerOp: ArrayFilterOperation.Any,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: uniqueValuesOfArrayToStringFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('City', t, intlKey),
      key: 'city',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Province', t, intlKey),
      key: 'province',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProblemCount', t, intlKey),
      key: 'problemCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      columnSize: ColumnSize.Small,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        return (
          <Flex
            bg={value > 0 ? '#ffd986' : '#9ad6a6'}
            justifyContent="center"
            alignItems="center"
            color="palette.white"
            borderRadius={10}
            fontWeight={700}
          >
            {value}
          </Flex>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];

  return (
    <>
      <FilterBar />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.PrioritizedSalesOrders}
        columns={prioritizedOrdersGridColumns}
        predefinedFilters={prioritizedSalesOrderGridPredefinedFilters}
        rowSelection={{
          showCheckbox: true,
          enableShiftSelect: true,
          onRowsSelected: onRowsSelected,
          onRowsDeselected: onRowsDeselected,
          selectBy: {
            indexes: selectedIndexes,
          },
        }}
        headerContent={
          selectedIndexes.length ? (
            <Flex alignItems="center" gap={24}>
              <Text fontFamily="heading" fontSize="12" color="palette.black" marginLeft={20}>
                <b>{selectedIndexes.length} </b>
                {t(`${intlKey}.SelectedOrders`)}
              </Text>
              <Button onClick={() => setIsMultiDialogOpen(true)} {...commonButtonProps}>
                {t(`${intlKey}.RePrioritize`)}
              </Button>
            </Flex>
          ) : (
            undefined
          )
        }
      />
      <Dialog
        isOpen={isMultiDialogOpen}
        isLoading={removePickingPrioritiesResponse?.isBusy}
        onApprove={() =>
          removePickingPriorities({
            salesOrderIds: selectedRows.map(row => row.row.id),
          })
        }
        onCancel={() => {
          setSelectedIndexes([]);
          setSelectedRows([]);
          setIsMultiDialogOpen(false);
          dispatch(gridActions.gridFetchRequested(GridType.PrioritizedSalesOrders));
        }}
        type={DialogTypes.Information}
        text={{
          approve: t(`Modal.Confirmation.Okay`),
          cancel: t(`Modal.Warning.Cancel`),
        }}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.5,
        }}
      >
        <Text fontSize="14" fontWeight="500" lineHeight="small" mb={32} color="palette.black">
          <Trans i18nKey={`${intlKey}.SureToReprioritize`} count={selectedRows.length} />
        </Text>
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
        <Flex flexDirection="column" fontSize="14" color="palette.black">
          <Text fontWeight="500" lineHeight="xxLarge">
            {t(`${intlKey}.CouldNotRePrioritizedMulti`)}
          </Text>
          <Text mt={20} fontWeight="600" mb={12}>
            {t(`${intlKey}.SalesOrderNumber`)}
          </Text>
          <ul>
            {removePickingPrioritiesResponse?.data?.map(problematicOrder => (
              <li key={problematicOrder.salesOrderReferenceNumber}>{problematicOrder.salesOrderReferenceNumber}</li>
            ))}
          </ul>
        </Flex>
      </Dialog>
    </>
  );
};

export default PickingManagementPrioritizedOrdersGrid;
