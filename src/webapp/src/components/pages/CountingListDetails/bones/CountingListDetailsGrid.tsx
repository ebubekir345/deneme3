import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { QueryStockCountingListDetailsByReferenceNumberOutputDTO, StockCountingType } from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  coloredDifferenceFormatter,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'CountingListDetails.CountingListDetailsGrid';
const titleKey = 'CountingListDetails.CountingListDetailsGrid.Title';

interface ICountingListDetailsGrid {
  stockCountingListId: string;
  stockCountingType?: StockCountingType;
}

const CountingListDetailsGrid: React.FC<ICountingListDetailsGrid> = ({ stockCountingListId, stockCountingType }) => {
  const { t } = useTranslation();

  const CountingListDetailsGridColumns: Array<any> = [
    {
      name: geti18nName('CellLabel', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductSKU', t, intlKey),
      key: 'sku',
      type: 'string',
      filterable: stockCountingType === StockCountingType.Sbc ? false : true,
      locked: true,
      sortable: stockCountingType === StockCountingType.Sbc ? false : true,
      visibility: stockCountingType === StockCountingType.Sbc ? false : true,
    },
    {
      name: geti18nName('ProductName', t, intlKey),
      key: 'productName',
      type: 'string',
      filterable: stockCountingType === StockCountingType.Sbc ? false : true,
      locked: true,
      sortable: stockCountingType === StockCountingType.Sbc ? false : true,
      visibility: stockCountingType === StockCountingType.Sbc ? false : true,
      formatter: ProductDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('OperationName', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: stockCountingType === StockCountingType.Sbc ? false : true,
      locked: true,
      sortable: stockCountingType === StockCountingType.Sbc ? false : true,
      visibility: stockCountingType === StockCountingType.Sbc ? false : true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: QueryStockCountingListDetailsByReferenceNumberOutputDTO) => {
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
      name: geti18nName('ZoneLabel', t, intlKey),
      key: 'zoneName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('TotalAmountBeforeCounting', t, intlKey),
      key: 'beforeCountingAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('TotalAmountAfterCounting', t, intlKey),
      key: 'afterCountingAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('TotalDifferenceInAmount', t, intlKey),
      key: 'totalDifferenceInAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : coloredDifferenceFormatter(props)),
    },
    {
      name: geti18nName('ProcessedByFullName', t, intlKey),
      key: 'operatorFullName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('StockCountingCreatedAt', t, intlKey),
      key: 'createdAt',
      type: 'moment',
      filterable: stockCountingType === StockCountingType.Sbc ? true : false,
      locked: true,
      sortable: stockCountingType === StockCountingType.Sbc ? true : false,
      visibility: stockCountingType === StockCountingType.Sbc ? true : false,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : dateTimeFormatter(props)),
    },
    {
      name: geti18nName('CountedAt', t, intlKey),
      key: 'countedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : dateTimeFormatter(props)),
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.CountingListDetail}
      columns={CountingListDetailsGridColumns}
      predefinedFilters={[]}
      apiArgs={[stockCountingListId]}
    />
  );
};

export default CountingListDetailsGrid;
