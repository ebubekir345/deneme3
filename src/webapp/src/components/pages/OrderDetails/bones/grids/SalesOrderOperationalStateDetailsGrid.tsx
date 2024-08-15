import { ColumnSize, dateTimeFormatter } from '@oplog/data-grid';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../../models';
import { SalesOrderStateOperationEnum } from '../../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../../utils/formatters';
import GenericDataGrid from '../../../../atoms/GenericDataGrid';

const intlKey = 'OrderDetails.SalesOrderOperationalStateDetailsGrid';
const titleKey = 'OrderDetails.SalesOrderOperationalStateDetailsGrid.Title';

interface ISalesOrderOperationalStateDetailsGrid {
  orderId: string;
}

const operationalStateDetailsGridInitialSort: SortField = new SortField({
  property: 'doneAt',
  by: SortDirection.DESC,
});

const SalesOrderOperationalStateDetailsGrid: React.FC<ISalesOrderOperationalStateDetailsGrid> = ({ orderId }) => {
  const { t } = useTranslation();
  const salesOrderOperationalStateDetailsGridColumns: Array<any> = [
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
      name: geti18nName('Operation', t, intlKey),
      key: 'operation',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, SalesOrderStateOperationEnum),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('DoneBy', t, intlKey),
      key: 'doneBy',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('DoneAt', t, intlKey),
      key: 'doneAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('DoneAtAddress', t, intlKey),
      key: 'doneAtAddress',
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
      gridKey={GridType.SalesOrderOperationalStateDetails}
      columns={salesOrderOperationalStateDetailsGridColumns}
      predefinedFilters={[]}
      sortField={operationalStateDetailsGridInitialSort}
      apiArgs={[orderId]}
      hideHeader
      filtersDisabled
    />
  );
};

export default SalesOrderOperationalStateDetailsGrid;
