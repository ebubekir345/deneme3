import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps, PredefinedFilter } from '@oplog/data-grid';
import { Flex } from '@oplog/express';
import {
  BooleanFilter,
  BooleanFilterOperation,
  StringFilter,
  StringFilterOperation,
} from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import {
  DeliveryTypeTag,
  QuerySalesOrdersForDispatchOutputDTO,
  SalesChannel,
  SalesOrderDispatchStateSteps,
  SalesOrderPickingPriority,
} from '../../../../services/swagger';
import {
  cargoImageFormatterForDispatchManagement,
  chipFormatter,
  ChipFormatterProps,
  coloredBadgeFormatter,
  cutOffStatusFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  OrderDetailsLinkFormatter,
  pipelineFormatter,
  priorityFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { DeliveryTypeColors } from '../../PickingManagement/bones/PickingManagementWaitingOrdersGrid';
import { FilterIds, FilterProperties } from './PredefinedFilters';

const intlKey = 'DispatchManagement';
const titleKey = 'DispatchManagement.Title';
const dispatchManagementGridPredefinedFilters: PredefinedFilter[] = [
  {
    filter: new StringFilter({
      property: FilterProperties.DispatchState,
      op: StringFilterOperation.Equals,
      value: SalesOrderDispatchStateSteps.None,
      id: FilterIds.DispatchState,
    }),
    selected: true,
    visibility: true,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.PickingState,
      op: StringFilterOperation.Equals,
      value: SalesOrderDispatchStateSteps.None,
      id: FilterIds.PickingState,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.PickingState,
      op: StringFilterOperation.Equals,
      value: SalesOrderDispatchStateSteps.Completed,
      id: FilterIds.PickingStateCompleted,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.SortingState,
      op: StringFilterOperation.Equals,
      value: SalesOrderDispatchStateSteps.None,
      id: FilterIds.SortingNotCompleted,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.SortingState,
      op: StringFilterOperation.Equals,
      value: SalesOrderDispatchStateSteps.Completed,
      id: FilterIds.SortingCompleted,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.PackingState,
      op: StringFilterOperation.Equals,
      value: SalesOrderDispatchStateSteps.None,
      id: FilterIds.PackingState,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.PackingState,
      op: StringFilterOperation.Equals,
      value: SalesOrderDispatchStateSteps.Completed,
      id: FilterIds.PackingStateCompleted,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.SlamState,
      op: StringFilterOperation.Equals,
      value: SalesOrderDispatchStateSteps.None,
      id: FilterIds.SlamStateNotCompleted,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new BooleanFilter({
      property: FilterProperties.IsSuspended,
      op: BooleanFilterOperation.Equals,
      value: true,
      id: FilterIds.Suspended,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.SlamState,
      op: StringFilterOperation.Equals,
      value: SalesOrderDispatchStateSteps.Completed,
      id: FilterIds.SlamStateCompleted,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.DispatchState,
      op: StringFilterOperation.Equals,
      value: SalesOrderDispatchStateSteps.None,
      id: FilterIds.DispatchNotCompleted,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new BooleanFilter({
      property: FilterProperties.CutOff,
      op: BooleanFilterOperation.Equals,
      value: true,
      id: FilterIds.CutOff,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new BooleanFilter({
      property: FilterProperties.Late,
      op: BooleanFilterOperation.Equals,
      value: true,
      id: FilterIds.Late,
    }),
    selected: false,
    visibility: true,
  },
];

const DispatchManagementGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatchManagementGridColumns: Array<any> = [
    {
      name: geti18nName('OrderState', t, intlKey),
      key: 'dispatchStatus',
      type: 'string',
      filterable: false,
      locked: false,
      sortable: false,
      visibility: true,
      width: ColumnSize.XLarge,
      formatter: (props: FormatterProps) => pipelineFormatter(props, t),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: '',
      key: 'pickingState',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
      width: 0,
    },
    {
      name: '',
      key: 'createState',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
      width: 0,
    },
    {
      name: '',
      key: 'sortingState',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
      width: 0,
    },
    {
      name: '',
      key: 'packingState',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
      width: 0,
    },
    {
      name: '',
      key: 'slamState',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
      width: 0,
    },
    {
      name: '',
      key: 'dispatchState',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
      width: 0,
    },
    {
      name: '',
      key: 'deliveringState',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
      width: 0,
    },
    {
      name: '',
      key: 'state',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
      width: 0,
    },
    {
      name: '',
      key: 'isCutOff',
      type: 'boolean',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
      width: 0,
    },
    {
      name: '',
      key: 'isLate',
      type: 'boolean',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
      width: 0,
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
      getRowMetaData: (row: QuerySalesOrdersForDispatchOutputDTO) => {
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
      name: geti18nName('CreatedAt', t, intlKey),
      key: 'orderCreatedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('CargoLabelledPackageCount', t, intlKey),
      key: 'totalSLAMSuccessfulCargoPackageCount',
      type: 'number',
      filterable: true,
      locked: false,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PackageCount', t, intlKey),
      key: 'totalCargoPackageCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('CargoCarrier', t, intlKey),
      key: 'carrierName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: cargoImageFormatterForDispatchManagement,
      getRowMetaData: (row: DataGridRow) => row,
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
      name: geti18nName('CutOff', t, intlKey),
      key: 'isCutOff',
      type: 'boolean',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => cutOffStatusFormatter(props, t, intlKey),
      getRowMetaData: (row: DataGridRow) => row,
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
      name: geti18nName('TargetedDispatchTime', t, intlKey),
      key: 'targetDispatchDateTime',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('ProblemCount', t, intlKey),
      key: 'problemCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
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
    {
      name: geti18nName('ProblemReferenceNumbers', t, intlKey),
      key: 'problemReferenceNumbers',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.DispatchManagement}
      columns={dispatchManagementGridColumns}
      predefinedFilters={dispatchManagementGridPredefinedFilters}
    />
  );
};

export default DispatchManagementGrid;
