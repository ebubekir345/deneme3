import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps, ImageFormatter } from '@oplog/data-grid';
import { ArrayFilterOperation, SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { MasterCartonQueryOutputDTO, ProductType } from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  geti18nName,
  barcodeFormatter,
  MasterCartonDetailsLinkFormatter,
  getEnumOptions,
  enumFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'Products.MasterCartonsGrid';
const titleKey = 'Products.MasterCartonsGrid.Title';

const masterCartonsGridInitialSort: SortField = new SortField({
  property: 'createdAt',
  by: SortDirection.DESC,
});

const MasterCartonsGrid: React.FC = () => {
  const { t } = useTranslation();
  const masterCartonsGridColumns: Array<any> = [
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
      width: ColumnSize.Big,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: MasterCartonQueryOutputDTO) => {
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
      key: 'masterCartonSKU',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
      formatter: MasterCartonDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'masterCartonBarcodes',
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
      key: 'masterCartonImageURL',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: ImageFormatter,
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('MasterCartonName', t, intlKey),
      key: 'masterCartonName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('InnerProductSKU', t, intlKey),
      key: 'innerProductSKU',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
    },
    {
      name: geti18nName('InnerProductAmount', t, intlKey),
      key: 'innerProductAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
    },
    {
      name: geti18nName('InnerProductName', t, intlKey),
      key: 'innerProductName',
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
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.MasterCartons}
      columns={masterCartonsGridColumns}
      sortField={masterCartonsGridInitialSort}
      predefinedFilters={[]}
    />
  );
};

export default MasterCartonsGrid;
