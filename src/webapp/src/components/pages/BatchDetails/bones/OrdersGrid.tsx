import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { DeliveryTypeTag, PickListRequestSalesOrderDetailsOutputDTO, QuerySalesOrdersForDispatchOutputDTO, SalesChannel } from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  coloredBadgeFormatter,
  cutOffStatusFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  OrderDetailsLinkFormatter,
  pipelineFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { DeliveryTypeColors } from '../../PickingManagement/bones/PickingManagementWaitingOrdersGrid';

const intlKey = 'BatchDetails.OrdersGrid';
const titleKey = 'BatchDetails.OrdersGrid.Title';

interface IOrdersGrid {
  batchId: string;
}

const OrdersGrid: React.FC<IOrdersGrid> = ({ batchId }) => {
  const { t } = useTranslation();

  const ordersGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('OrderState', t, intlKey),
      key: 'state',
      type: 'string',
      filterable: false,
      locked: false,
      sortable: false,
      visibility: true,
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
      name: geti18nName('Operation', t, intlKey),
      key: 'operation',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: PickListRequestSalesOrderDetailsOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '15px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          text: row.operation?.name,
          imageUrl: row.operation?.imageUrl,
          isUpperCase: true,
        } as ChipFormatterProps;
      },
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
      name: geti18nName('ExpectedDispatchDate', t, intlKey),
      key: 'targetDispatchDateTime',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.PickListRequestSalesOrderDetails}
      columns={ordersGridColumns}
      apiArgs={[batchId]}
      predefinedFilters={[]}
    />
  );
};

export default OrdersGrid;
