import { DataGridRow, FormatterProps } from '@oplog/data-grid';
import { ArrayFilterOperation, SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { StockCellStatusOutputDTO, StockCellCategory } from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  InventoryCellLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'InventoryManagement.InventoryView.InventoryCellContainersGrid';
const titleKey = 'InventoryManagement.InventoryView.InventoryCellContainersGrid.Title';

const cellContainersGridInitialSort: SortField = new SortField({
  property: 'cellLabel',
  by: SortDirection.ASC,
});

const InventoryCellContainersGrid: React.FC = () => {
  const { t } = useTranslation();
  const cellContainersGridColumns: Array<any> = [
    {
      name: geti18nName('CellLabel', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: InventoryCellLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
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
      name: geti18nName('CellType', t, intlKey),
      key: 'stockCellType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, StockCellCategory),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('CurrentStockZone', t, intlKey),
      key: 'currentStockZone',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductAmount', t, intlKey),
      key: 'productAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductVariety', t, intlKey),
      key: 'productVariety',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('OperationCount', t, intlKey),
      key: 'operationCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Operations', t, intlKey),
      key: 'operations',
      type: 'string',
      filterable: true,
      fieldType: 'array',
      searchField: 'name',
      outerOp: ArrayFilterOperation.Any,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : chipFormatter(props)),
      getRowMetaData: (row: StockCellStatusOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '15px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          list: row.operations?.map(operation => ({ name: operation.name, imageUrl: operation.imageUrl })),
          imageUrlPropertyOfListItem: 'imageUrl',
          isUpperCase: true,
        } as ChipFormatterProps;
      },
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.InventoryCellContainersGrid}
      columns={cellContainersGridColumns}
      sortField={cellContainersGridInitialSort}
      predefinedFilters={[]}
    />
  );
};

export default InventoryCellContainersGrid;
