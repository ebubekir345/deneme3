import { ColumnSize, DataGridRow, FormatterProps, ImageFormatter } from '@oplog/data-grid';
import { ArrayFilterOperation, SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../models';
import { OutOfStockItemQueryOutputDTO, ProductType } from '../../../services/swagger';
import {
  barcodeFormatter,
  chipFormatter,
  ChipFormatterProps,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  ProductDetailsLinkFormatter,
} from '../../../utils/formatters';
import GenericDataGrid from '../../atoms/GenericDataGrid';

export enum ProductStateColors {
  ReceivedItem = 'palette.blue_dark',
  StockItem = 'palette.green_dark',
  CellAllocatedItem = 'palette.lime_dark',
  PickingItem = 'palette.brown_dark',
  PackingItem = 'palette.violet_dark',
  ShippingItem = 'palette.purple_dark',
  DeliveredItem = 'palette.teal_dark',
  DamagedItem = 'palette.red_dark',
  LostItem = 'palette.orange',
  OutboundItem = 'palette.grey_darker',
  FoundItem = 'palette.brown_dark',
  RestowItem = 'palette.blue_darker',
  ReservedItem = 'palette.green_dark',
}

const intlKey = 'StockManagement.StocksNoStockGrid';
const titleKey = 'StockManagement.StocksNoStockGrid.Title';

const stocksNoStockGridInitialSort: SortField = new SortField({
  property: 'sku',
  by: SortDirection.ASC,
});

const StocksNoStockGrid: React.FC = () => {
  const { t } = useTranslation();
  const stocksNoStockGridColumns: Array<any> = [
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
      key: 'operation.name',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: OutOfStockItemQueryOutputDTO) => {
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
      name: geti18nName('SKU', t, intlKey),
      key: 'sku',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'barcodes',
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
      name: geti18nName('ImageUrl', t, intlKey),
      key: 'imageURL',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: ImageFormatter,
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('ProductName', t, intlKey),
      key: 'name',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: ProductDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ProductType', t, intlKey),
      key: 'type',
      locked: true,
      sortable: true,
      type: 'enum',
      visibility: true,
      filterable: true,
      formatter: enumFormatter,
      options: getEnumOptions(t, ProductType),
      getRowMetaData: () => {
        return t;
      },
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.StocksNoStock}
      columns={stocksNoStockGridColumns}
      sortField={stocksNoStockGridInitialSort}
      predefinedFilters={[]}
    />
  );
};

export default StocksNoStockGrid;
