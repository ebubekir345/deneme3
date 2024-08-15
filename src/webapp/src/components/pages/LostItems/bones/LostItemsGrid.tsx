import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { LostItemLostDuringProcess } from '../../../../services/swagger';
import {
  appendImageToTextFieldFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'LostItems.Grid';
const titleKey = 'LostItems.Grid.Title';

const lostItemsGridInitialSort: SortField = new SortField({
  property: 'lostDateTime',
  by: SortDirection.DESC,
});

const LostItemsGrid: React.FC = () => {
  const { t } = useTranslation();
  const LostItemsGridColumns: Array<any> = [
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
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => appendImageToTextFieldFormatter(props, 'operationImageUrl'),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('SKU', t, intlKey),
      key: 'sku',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: ProductDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ProductBarcodes', t, intlKey),
      key: 'productBarcodes',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('LostFrom', t, intlKey),
      key: 'lostFrom',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('LostDateTime', t, intlKey),
      key: 'lostDateTime',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('OperatorName', t, intlKey),
      key: 'operatorName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('LostDuringProcess', t, intlKey),
      key: 'lostDuringProcess',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, LostItemLostDuringProcess),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.LostItems}
      columns={LostItemsGridColumns}
      predefinedFilters={[]}
      sortField={lostItemsGridInitialSort}
    />
  );
};

export default LostItemsGrid;
