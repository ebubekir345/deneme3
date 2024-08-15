import { ColumnSize, ImageFormatter } from '@oplog/data-grid';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'OperationManagement.OperationsGrid';
const titleKey = 'OperationManagement.OperationsGrid.Title';
const operationsGridInitialSort: SortField = new SortField({
  property: 'id',
  by: SortDirection.ASC,
});

const OperationsGrid: React.FC = () => {
  const { t } = useTranslation();
  const operationsGridColumns: Array<any> = [
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
      name: geti18nName('OperationName', t, intlKey),
      key: 'name',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ImageUrl', t, intlKey),
      key: 'imageUrl',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: ImageFormatter,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.Operations}
      columns={operationsGridColumns}
      sortField={operationsGridInitialSort}
      predefinedFilters={[]}
    />
  );
};

export default OperationsGrid;
