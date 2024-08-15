import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps, ImageFormatter } from '@oplog/data-grid';
import { ArrayFilterOperation, SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { GridType } from '../../../../models';
import { ProductQueryOutputDTO, ProductType } from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  geti18nName,
  ProductDetailsLinkFormatter,
  barcodeFormatter,
  getEnumOptions,
  enumFormatter,
} from '../../../../utils/formatters';
import { useTranslation } from 'react-i18next';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'Products.ProductsGrid';
const titleKey = 'Products.ProductsGrid.Title';

const productsGridInitialSort: SortField = new SortField({
  property: 'createdAt',
  by: SortDirection.DESC,
});

const ProductsGrid: React.FC = () => {
  const { t } = useTranslation();
  const productsGridColumns: Array<any> = [
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
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Big,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: ProductQueryOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '15px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          text: row.operationName,
          imageUrl: row.operationImageUrl,
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
      width: ColumnSize.XLarge,
      formatter: ProductDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
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
    },
    {
      name: geti18nName('ProductType', t, intlKey),
      key: 'type',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, ProductType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
      width: ColumnSize.XLarge,
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
      width: ColumnSize.XLarge,
    },
    {
      name: geti18nName('StockZones', t, intlKey),
      key: 'stockZones',
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
  ];


  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.Products}
      columns={productsGridColumns}
      sortField={productsGridInitialSort}
      predefinedFilters={[]}
    />
  );
};

export default ProductsGrid;
