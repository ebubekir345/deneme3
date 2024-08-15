import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import { ArrayFilterOperation } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { geti18nName, ProductDetailsLinkFormatterForOtherRoutes } from '../../../../utils/formatters';
import { barcodeFormatter } from '../../../../utils/formatters/barcodeFormatter';
import { receivingDifferenceFormatter } from '../../../../utils/formatters/receivingDifferenceFormatter';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

interface ReceivingProductsGridProps {
  purchaseOrderId: string;
}

const intlKey = 'ReceivingOrderDetails.ProductsGrid';
const titleKey = 'ReceivingOrderDetails.ProductsGrid.Title';

const ReceivingProductsGrid: React.FC<ReceivingProductsGridProps> = ({ purchaseOrderId }) => {
  const { t } = useTranslation();
  const ReceivingProductsGridColumns: Array<any> = [
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
      name: geti18nName('Barcode', t, intlKey),
      key: 'barcodes',
      type: 'string',
      fieldType: 'array',
      searchField: '_',
      outerOp: ArrayFilterOperation.Any,
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: barcodeFormatter,
    },
    {
      name: geti18nName('ExpectedAmount', t, intlKey),
      key: 'expectedAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('AcceptedAmount', t, intlKey),
      key: 'acceptedAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('DamagedAmount', t, intlKey),
      key: 'damagedAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('Difference', t, intlKey),
      key: 'difference',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: receivingDifferenceFormatter,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.ReceivingProducts}
      columns={ReceivingProductsGridColumns}
      apiArgs={[purchaseOrderId]}
      predefinedFilters={[]}
    />
  );
};

export default ReceivingProductsGrid;
