import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { PutAwayReceivedItemsOutputDTO } from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'PutAwayManagement.PutAwayManagementWaitingProductsGrid';
const titleKey = 'PutAwayManagement.PutAwayManagementWaitingProductsGrid.Title';

const PutAwayManagementWaitingProductsGrid: React.FC = () => {
  const { t } = useTranslation();
  const putAwayManagementWaitingProductsGridColumns: Array<any> = [
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
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: PutAwayReceivedItemsOutputDTO) => {
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
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'barcodes',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
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
      name: geti18nName('ProductAmount', t, intlKey),
      key: 'productAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Large,
    },
    {
      name: geti18nName('CurrentTote', t, intlKey),
      key: 'toteLabel',
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
      gridKey={GridType.PutAwayManagementWaitingProducts}
      columns={putAwayManagementWaitingProductsGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default PutAwayManagementWaitingProductsGrid;
