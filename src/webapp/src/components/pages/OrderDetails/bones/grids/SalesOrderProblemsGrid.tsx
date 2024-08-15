import { ColumnSize, dateTimeFormatter } from '@oplog/data-grid';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../../models';
import { ProblemState, ProblemType } from '../../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../../utils/formatters';
import GenericDataGrid from '../../../../atoms/GenericDataGrid';

const intlKey = 'OrderDetails.SalesOrderProblemsGrid';
const titleKey = 'OrderDetails.SalesOrderProblemsGrid.Title';

interface ISalesOrderProblemsGridProps {
  orderId: string;
}

const problemsGridInitialSort: SortField = new SortField({
  property: 'openedAt',
  by: SortDirection.DESC,
});

const SalesOrderProblemsGrid: React.FC<ISalesOrderProblemsGridProps> = ({ orderId }) => {
  const { t } = useTranslation();
  const salesOrderProblemsGridColumns: Array<any> = [
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
      name: geti18nName('ProblemRefNo', t, intlKey),
      key: 'referenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProblemType', t, intlKey),
      key: 'type',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, ProblemType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('IssueDate', t, intlKey),
      key: 'openedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('Source', t, intlKey),
      key: 'source',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, ProblemState),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ResolvedAt', t, intlKey),
      key: 'resolvedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('Personal', t, intlKey),
      key: 'resolvedBy',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ResolutionInfo', t, intlKey),
      key: 'resolutionNote',
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
      gridKey={GridType.SalesOrderProblemsGrid}
      columns={salesOrderProblemsGridColumns}
      predefinedFilters={[]}
      sortField={problemsGridInitialSort}
      apiArgs={[orderId]}
    />
  );
};

export default SalesOrderProblemsGrid;
