import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps, gridSelectors } from '@oplog/data-grid';
import { Button, Flex, Icon, PseudoBox } from '@oplog/express';
import { ArrayFilterOperation } from 'dynamic-query-builder-client';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GridType } from '../../../../../models';
import { DeliveryTypeTag, SalesChannel, WaitingForPickingSalesOrdersOutputDTO } from '../../../../../services/swagger';
import { StoreState } from '../../../../../store/initState';
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
  uniqueValuesOfArrayToStringFormatter,
} from '../../../../../utils/formatters';
import GenericDataGrid from '../../../../atoms/GenericDataGrid';
import { VehicleTypes } from '../../../FlowManagement/bones/FlowManagementGrid';
import { DeliveryTypeColors } from '../PickingManagementWaitingOrdersGrid';

const intlKey = 'PickingManagement.WaitingOrdersGrid';
const titleKey = 'PickingManagement.WaitingOrdersGrid.Title';

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

const PickingManagementWaitingOrdersColumns = ({
  selectedRows,
  selectedIndexes,
  setSelectedRows,
  setSelectedIndexes,
  setIsMultiDialogOpen,
  isSelectAllOrdersCalled,
  setIsSelectAllOrdersCalled,
  totalOrderCount,
}) => {
  const { t } = useTranslation();

  const gridRawData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.PickingManagementWaitingOrdersGrid, state.grid)
  );

  useEffect(() => {
    setSelectedIndexes([]);
    setSelectedRows([]);
    setIsSelectAllOrdersCalled(false);
  }, [gridRawData]);

  const selectAllOrders = () => {
    setIsSelectAllOrdersCalled(true);
    setSelectedRows(gridRawData.map(row => ({ row: row })));
    setSelectedIndexes(gridRawData.map((_, i) => i));
    setIsMultiDialogOpen(true);
  };

  const onRowsSelected = rows => {
    setSelectedIndexes(selectedIndexes.concat(rows.map(r => r.rowIdx)));
    setSelectedRows(selectedRows.concat(rows));
  };

  const onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    setSelectedIndexes(selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1));
    setSelectedRows(selectedRows.filter(selectedRow => rowIndexes.indexOf(selectedRow.rowIdx) === -1));
  };

  const waitingOrdersGridColumns: Array<any> = [
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
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: WaitingForPickingSalesOrdersOutputDTO) => {
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
      name: geti18nName('OrderCount', t, intlKey),
      key: 'lineItemsCount',
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
      name: geti18nName('TargetedDispatchDate', t, intlKey),
      key: 'targetDispatchDateTime',
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
            bg={value > 0 ? 'palette.orange_light' : 'palette.green'}
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
    {
      name: '',
      key: '',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: props => {
        const {
          dependentValues: { index },
        } = props;
        return (
          <Icon
            name="far fa-arrow-alt-from-bottom"
            color="text.body"
            fontSize={16}
            onClick={() => {
              setSelectedRows([{ row: gridRawData.filter((_, i) => i === index - 1)[0] }]);
              setSelectedIndexes([index - 1]);
              setIsMultiDialogOpen(true);
            }}
            cursor="pointer"
          />
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
      width: ColumnSize.Small,
    },
  ];
  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.PickingManagementWaitingOrdersGrid}
      columns={waitingOrdersGridColumns}
      predefinedFilters={[]}
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
            <Flex alignItems="center" fontFamily="heading" fontSize={12} color="palette.black" marginLeft={20}>
              <b>{isSelectAllOrdersCalled ? totalOrderCount : selectedIndexes.length}</b><pre> </pre>
              {t(`${intlKey}.SelectedOrders`)}
            </Flex>
            <Button onClick={() => setIsMultiDialogOpen(true)} {...commonButtonProps}>
              {t(`${intlKey}.Prioritize`)}
            </Button>
            <PseudoBox
              onClick={selectAllOrders}
              color="text.link"
              _hover={{ cursor: 'pointer' }}
              fontSize={12}
              marginLeft={20}
            >
              {t(`${intlKey}.SelectAllOrders`, { count: totalOrderCount })}
            </PseudoBox>
          </Flex>
        ) : (
          undefined
        )
      }
    />
  );
};

export default PickingManagementWaitingOrdersColumns;
