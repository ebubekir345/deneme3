import { ColumnSize, DataGridRow, FormatterProps, ImageFormatter } from '@oplog/data-grid';
import { Ellipsis } from '@oplog/express';
import { ArrayFilterOperation, SortDirection, SortField } from 'dynamic-query-builder-client';
import moment from 'moment';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { InventoryQueryByContainerLabelOutputDTO } from '../../../../services/swagger';
import { InventoryItemTypeForQueries } from '../../../../typings/globalStore/enums';
import {
  chipFormatter,
  ChipFormatterProps,
  coloredBadgeFormatter,
  getEnumOptions,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { ProductStateColors } from '../../../molecules/StocksNoStockGrid/StocksNoStockGrid';

const intlKey = 'InventoryToteListDetails.InventoryToteListDetailsGrid';
const titleKey = 'InventoryToteListDetails.InventoryToteListDetailsGrid.Title';

const stocksCurrentStatusGridInitialSort: SortField = new SortField({
  property: 'operationName',
  by: SortDirection.ASC,
});

interface IInventoryCellListDetailsGrid {
  cellLabel: string;
}

const InventoryCellListDetailsGrid: React.FC<IInventoryCellListDetailsGrid> = ({ cellLabel }) => {
  const { t } = useTranslation();

  const stocksCurrentStatusGridColumns: Array<any> = [
    {
      name: geti18nName('Operations', t, intlKey),
      key: 'operations',
      type: 'string',
      filterable: false,
      fieldType: 'array',
      searchField: 'name',
      outerOp: ArrayFilterOperation.Any,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: InventoryQueryByContainerLabelOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '15px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          text: row.operationName,
          imageUrl: row.operationImageUrl,
          imageUrlPropertyOfListItem: 'imageUrl',
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
      name: geti18nName('ProductNames', t, intlKey),
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
      name: geti18nName('ProductImages', t, intlKey),
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
      name: geti18nName('ItemType', t, intlKey),
      key: 'itemType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, InventoryItemTypeForQueries),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, ProductStateColors),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('Amount', t, intlKey),
      key: 'amount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Large,
    },
    {
      name: geti18nName('ExpirationDate', t, intlKey),
      key: 'expirationDate',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) =>
        props.value === 'N/A' ? '-' : <Ellipsis>{moment(props.value).format('DD.MM.YYYY')}</Ellipsis>,
    },
  ];

  return (
    <>
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.InventoryToteListDetailsGrid}
        columns={stocksCurrentStatusGridColumns}
        sortField={stocksCurrentStatusGridInitialSort}
        predefinedFilters={[]}
        apiArgs={[cellLabel]}
      />
    </>
  );
};

export default InventoryCellListDetailsGrid;
