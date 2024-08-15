import { ColumnSize, dateTimeFormatter } from '@oplog/data-grid';
import { ArrayFilterOperation, SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { barcodeFormatter, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'WarehouseManagement.PrintersGrid';
const titleKey = 'WarehouseManagement.PrintersGrid.Title';

const printersGridInitialSort: SortField = new SortField({
  property: 'printerName',
  by: SortDirection.ASC,
});

const PrintersGrid: React.FC = () => {
  const { t } = useTranslation();
  const printersGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      cellClass: 'index-column',
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('PrinterName', t, intlKey),
      key: 'printerName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Address', t, intlKey),
      key: 'addressLabel',
      type: 'string',
      filterable: true,
      fieldType: 'array',
      searchField: '_',
      outerOp: ArrayFilterOperation.Any,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: barcodeFormatter,
    },
    {
      name: geti18nName('SelectedPrinter', t, intlKey),
      key: 'selectedPrinterName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('MachineName', t, intlKey),
      key: 'machineName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
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
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.Printers}
      columns={printersGridColumns}
      sortField={printersGridInitialSort}
      predefinedFilters={[]}
    />
  );
};

export default PrintersGrid;
