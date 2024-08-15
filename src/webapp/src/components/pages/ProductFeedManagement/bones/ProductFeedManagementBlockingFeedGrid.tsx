import { ColumnSize, DataGridRow, FormatterProps, ImageFormatter } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { StockItemQueryOutputDTO } from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'ProductFeedManagement.BlockingFeedGrid';
const titleKey = 'ProductFeedManagement.BlockingFeedGrid.Title';

const ProductFeedManagementBlockingFeedGrid: React.FC = () => {
  const { t } = useTranslation();
  const productFeedManagementBlockingFeedGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: StockItemQueryOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '16px',
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
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('ImageUrl', t, intlKey),
      key: 'productImageUrl',
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
      key: 'productName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: ProductDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Quantity', t, intlKey),
      key: 'productAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Large,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('Zone', t, intlKey),
      key: 'zoneLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('AffectedOrders', t, intlKey),
      key: 'salesOrderReferenceNumbers',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.ReservedProductManagementBlockerFeeds}
      columns={productFeedManagementBlockingFeedGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default ProductFeedManagementBlockingFeedGrid;
