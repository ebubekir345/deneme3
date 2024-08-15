import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { BooleanFilter, BooleanFilterOperation } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import {
  CutOffStatus,
  DeliveryTypeTag,
  DispatchCargoPackageState,
  DispatchProcessCargoPackagesCombinedOutputDTO,
  SalesChannel,
} from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  coloredBadgeFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  OrderDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import { DeliveryTypeColors } from '../../PickingManagement/bones/PickingManagementWaitingOrdersGrid';
import Badge from '../../../atoms/Badge';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { FilterProperties } from './PredefinedFilters';

const intlKey = 'DispatchPackages';
const titleKey = 'DispatchPackages.Title';

enum BadgeColorMap {
  Dispatched = 'palette.green_darker',
  Delivered = 'palette.green_darker',
  WaitingForSLAM = 'palette.blue',
  ReadyForDispatch = 'palette.blue',
  Suspended = 'palette.yellow_dark',
  Cancelled = 'palette.red',
  Transferred = 'palette.green_darker',
  WaitingForManualDelivery = 'palette.blue',
  ManuallyDelivered = 'palette.green_darker',
}

const initialFilters = [
  {
    filter: new BooleanFilter({
      property: FilterProperties.IsNotDispatched,
      op: BooleanFilterOperation.Equals,
      value: true,
    }),
    selected: true,
    visibility: true,
  },
  {
    filter: new BooleanFilter({
      property: FilterProperties.IsWaitingForSLAM,
      op: BooleanFilterOperation.Equals,
      value: true,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new BooleanFilter({
      property: FilterProperties.IsSuspended,
      op: BooleanFilterOperation.Equals,
      value: true,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new BooleanFilter({
      property: FilterProperties.IsReadyForDispatch,
      op: BooleanFilterOperation.Equals,
      value: true,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new BooleanFilter({
      property: FilterProperties.IsNotDispatchedCutOff,
      op: BooleanFilterOperation.Equals,
      value: true,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new BooleanFilter({
      property: FilterProperties.IsNotDispatchedLate,
      op: BooleanFilterOperation.Equals,
      value: true,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new BooleanFilter({
      property: FilterProperties.IsCancelled,
      op: BooleanFilterOperation.Equals,
      value: true,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new BooleanFilter({
      property: FilterProperties.IsTransferred,
      op: BooleanFilterOperation.Equals,
      value: true,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new BooleanFilter({
      property: FilterProperties.IsWaitingForManualDelivery,
      op: BooleanFilterOperation.Equals,
      value: true,
    }),
    selected: false,
    visibility: true,
  },
];

const DispatchPackagesGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatchPackagesGridColumns: Array<any> = [
    {
      name: geti18nName('PackageBarcode', t, intlKey),
      key: 'cargoPackageLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
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
      getRowMetaData: (row: DispatchProcessCargoPackagesCombinedOutputDTO) => {
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
      key: 'salesOrderReferenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: OrderDetailsLinkFormatterForOtherRoutes,
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
      name: geti18nName('Address', t, intlKey),
      key: 'address',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'cargoPackageState',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, DispatchCargoPackageState),
      formatter: (props: FormatterProps) => {
        const { value } = props;
        if (value !== 'None') return <Badge label={t(`Enum.${props.value}`)} bg={BadgeColorMap[props.value]} />;
        else return '-';
      },
    },
    {
      name: geti18nName('PackingDate', t, intlKey),
      key: 'packingDate',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : dateTimeFormatter(props)),
    },
    {
      name: geti18nName('SlamDate', t, intlKey),
      key: 'slamDate',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : dateTimeFormatter(props)),
    },
    {
      name: geti18nName('CutOffState', t, intlKey),
      key: 'cutOffStatus',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, CutOffStatus),
      formatter: (props: FormatterProps) => {
        const { value } = props;
        if (value !== 'None')
          return (
            <Badge
              bg={value === 'Late' ? 'palette.red' : 'palette.purple'}
              label={value === 'Late' ? t('Enum.Late') : t('Enum.CutOff')}
            />
          );
        else return '-';
      },
    },
    {
      name: geti18nName('ExpectedDispatchDate', t, intlKey),
      key: 'targetDispatchDate',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : dateTimeFormatter(props)),
    },
    {
      name: geti18nName('DispatchDate', t, intlKey),
      key: 'dispatchDate',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : dateTimeFormatter(props)),
    },
    {
      name: '',
      key: 'isNotDispatched',
      type: 'boolean',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
    },
    {
      name: '',
      key: 'isWaitingForSLAM',
      type: 'boolean',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
    },
    {
      name: '',
      key: 'isSuspended',
      type: 'boolean',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
    },
    {
      name: '',
      key: 'isReadyForDispatch',
      type: 'boolean',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
    },
    {
      name: '',
      key: 'isNotDispatchedCutOff',
      type: 'boolean',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
    },
    {
      name: '',
      key: 'isNotDispatchedLate',
      type: 'boolean',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
    },
    {
      name: '',
      key: 'isCancelled',
      type: 'boolean',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
    },
    {
      name: '',
      key: 'isTransferred',
      type: 'boolean',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
    },
    {
      name: '',
      key: 'isWaitingForManualDelivery',
      type: 'boolean',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: false,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.DispatchPackages}
      columns={dispatchPackagesGridColumns}
      predefinedFilters={initialFilters}
    />
  );
};

export default DispatchPackagesGrid;
