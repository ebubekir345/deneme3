import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { WaybillState } from '../../../../services/swagger';
import {
  getEnumOptions,
  geti18nName,
  ReceivingWaybillDetailsLinkFormatter,
  waybillStatusBadgeFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

interface IReceivingWaybillsGrid {
  purchaseOrderId: string;
  operationId: string;
  operationName: string;
  orderId: string;
  referenceNumber: string;
  source: string;
}

const intlKey = 'ReceivingOrderDetails.WaybillsGrid';
const titleKey = 'ReceivingOrderDetails.WaybillsGrid.Title';
const ReceivingWaybillsGridInitialSort: SortField = new SortField({
  property: 'waybillDate',
  by: SortDirection.DESC,
});

const ReceivingWaybillsGrid: React.FC<IReceivingWaybillsGrid> = ({
  purchaseOrderId,
  operationId,
  operationName,
  orderId,
  referenceNumber,
  source,
}) => {
  const { t } = useTranslation();
  const ReceivingWaybillsGridColumns: Array<any> = [
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
      name: geti18nName('WaybillId', t, intlKey),
      key: 'referenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: ReceivingWaybillDetailsLinkFormatter(operationId, operationName, orderId, referenceNumber, source),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('WaybillDate', t, intlKey),
      key: 'waybillDate',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('Status', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.XLarge,
      options: getEnumOptions(t, WaybillState),
      formatter: (props: FormatterProps) => waybillStatusBadgeFormatter(t, props),
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.ReceivingWaybills}
      columns={ReceivingWaybillsGridColumns}
      apiArgs={[purchaseOrderId]}
      sortField={ReceivingWaybillsGridInitialSort}
      predefinedFilters={[]}
    />
  );
};

export default ReceivingWaybillsGrid;
