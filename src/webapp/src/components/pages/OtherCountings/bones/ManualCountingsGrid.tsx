import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import {
  coloredDifferenceFormatter,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
  enumFormatter
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'OtherCountings.ManualCountingsGrid';
const titleKey = 'OtherCountings.ManualCountingsGrid.Title';

const ManualCountingsGrid: React.FC = () => {
  const { t } = useTranslation();

  const manualCountingsGridColumns: Array<any> = [
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
      name: geti18nName('OperationName', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('StockCountingType', t, intlKey),
      key: 'stockCountingType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
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
      formatter: (props: FormatterProps) => props.value === "N/A" ? "-" : props.value
    },
    {
      name: geti18nName('TotalDifferenceInAmount', t, intlKey),
      key: 'totalDifferenceInAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => props.value === "N/A" ? "-" : coloredDifferenceFormatter(props),
    },
    {
      name: geti18nName('ProcessedByFullName', t, intlKey),
      key: 'operatorFullName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => props.value === "N/A" ? "-" : props.value
    },
    {
      name: geti18nName('CountedAt', t, intlKey),
      key: 'countedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => props.value === "N/A" ? "-" : dateTimeFormatter(props),
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.ManualCountings}
      columns={manualCountingsGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default ManualCountingsGrid;
