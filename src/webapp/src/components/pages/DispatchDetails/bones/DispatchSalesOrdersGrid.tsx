import { ColumnSize, DataGridRow } from '@oplog/data-grid';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { GridType } from '../../../../models';
import { geti18nName, OrderDetailsLinkFormatter } from '../../../../utils/formatters';
import { useTranslation } from 'react-i18next';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'DispatchDetails.SalesOrdersGrid';
const titleKey = 'DispatchDetails.SalesOrdersGrid.Title';

const DispatchSalesOrdersInitialSort: SortField = new SortField({
  property: 'referenceNumber',
  by: SortDirection.DESC,
});

interface IDispatchSalesOrdersGrid {
  dispatchProcessId: string;
}

const DispatchSalesOrdersGrid: React.FC<IDispatchSalesOrdersGrid> = ({ dispatchProcessId }) => {
  const { t } = useTranslation();
  const dispatchSalesOrdersGridColumns: Array<any> = [
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
      name: geti18nName('ReferenceNumber', t, intlKey),
      key: 'referenceNumber',
      locked: true,
      sortable: true,
      type: 'string',
      visibility: true,
      filterable: true,
      formatter: OrderDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('CargoPackagesCount', t, intlKey),
      key: 'cargoPackagesCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.DispatchSalesOrders}
      columns={dispatchSalesOrdersGridColumns}
      sortField={DispatchSalesOrdersInitialSort}
      apiArgs={[dispatchProcessId]}
      predefinedFilters={[]}
    />
  );
};

export default DispatchSalesOrdersGrid;
