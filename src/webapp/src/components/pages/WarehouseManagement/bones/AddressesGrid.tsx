import { ColumnSize, dateTimeFormatter } from '@oplog/data-grid';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'WarehouseManagement.AddressesGrid';
const titleKey = 'WarehouseManagement.AddressesGrid.Title';

const adressesGridInitialSort: SortField = new SortField({
  property: 'createdAt',
  by: SortDirection.DESC,
});

enum AddressType {
  None = 'None',
  DispatchAddress = 'DispatchAddress',
  InboundAddress = 'InboundAddress',
  LostItemAddress = 'LostItemAddress',
  PackingAddress = 'PackingAddress',
  ParkAddress = 'ParkAddress',
  ReturnAddress = 'ReturnAddress',
  StockAddress = 'StockAddress',
  PickingTrolley = 'PickingTrolley',
  PutAwayTrolley = 'PutAwayTrolley',
  ReturnTrolley = 'ReturnTrolley',
  SlamAddress = 'SLAMAddress',
  ProblemSolverAddress = 'ProblemSolverAddress',
  QuarantineAddress = 'QuarantineAddress',
  TransferTrolley = 'TransferTrolley',
  MissingItemTransferAddress = 'MissingItemTransferAddress',
  SingleItemPackingAddress = 'SingleItemPackingAddress',
  DropAddress = 'DropAddress',
  ManualDeliveryAddress = 'ManualDeliveryAddress',
  ReceivingAddress = 'ReceivingAddress',
  HOVPackingAddress = 'HOVPackingAddress',
  RebinAddress = 'RebinAddress',
  HOVRebinAddress = 'HOVRebinAddress',
  RebinSingleAddress = 'RebinSingleAddress',
  SimplePackingAddress = 'SimplePackingAddress',
  BatchTrolley = 'BatchTrolley',
  RebinTrolley = 'RebinTrolley',
  VirtualTrolley = 'VirtualTrolley',
  RasStowStation = 'RasStowStation',
  RasPickStation = 'RasPickStation',
  RasDropAddress = 'RasDropAddress',
  HoldingZoneAddress = 'HoldingZoneAddress'
}

const AddressesGrid: React.FC = () => {
  const { t } = useTranslation();
  const addressesGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      filterable: false,
      cellClass: 'index-column',
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('Label', t, intlKey),
      key: 'label',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Type', t, intlKey),
      key: 'type',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, AddressType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('Section', t, intlKey),
      key: 'section',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Side', t, intlKey),
      key: 'side',
      locked: true,
      sortable: true,
      type: 'string',
      visibility: true,
      filterable: true,
    },
    {
      name: geti18nName('Slot', t, intlKey),
      key: 'slot',
      locked: true,
      sortable: true,
      type: 'string',
      visibility: true,
      filterable: true,
    },
    {
      name: geti18nName('Level', t, intlKey),
      key: 'level',
      locked: true,
      sortable: true,
      type: 'string',
      visibility: true,
      filterable: true,
    },
    {
      name: geti18nName('Depth', t, intlKey),
      key: 'depth',
      locked: true,
      sortable: true,
      type: 'string',
      visibility: true,
      filterable: true,
    },
    {
      name: geti18nName('AddressFormat', t, intlKey),
      key: 'labelFormat',
      locked: true,
      sortable: true,
      type: 'string',
      visibility: true,
      filterable: true,
    },
    {
      name: geti18nName('CreatedAt', t, intlKey),
      key: 'createdAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
      columnSize: ColumnSize.XLarge,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.Adresses}
      columns={addressesGridColumns}
      sortField={adressesGridInitialSort}
      predefinedFilters={[]}
    />
  );
};

export default AddressesGrid;
