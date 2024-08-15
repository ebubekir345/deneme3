import {
  DataGridRow,
  dateTimeFormatter,
  FormatterProps
} from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { AutomaticStockCountingState, StockCountingType } from '../../../../services/swagger';
import {
  coloredDifferenceFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
  SystemCountingListDetailsLinkFormatter
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'OtherCountings.SystemCountingsGrid';
const titleKey = 'OtherCountings.SystemCountingsGrid.Title';

interface IInventoryCellCountingsGrid {
  cellLabel: string;
}

const InventoryCellCountingsGrid: React.FC<IInventoryCellCountingsGrid> = ({ cellLabel }) => {
  const { t } = useTranslation();

  const systemCountingsGridColumns: Array<any> = [
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
      name: geti18nName('ReferenceNumber', t, intlKey),
      key: 'stockCountingListReferenceNumber',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: SystemCountingListDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('StockCountingType', t, intlKey),
      key: 'stockCountingType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, StockCountingType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, AutomaticStockCountingState),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
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
      formatter: (props: FormatterProps) => props.value === "N/A" ? "-" : dateTimeFormatter(props)
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.InventoryCellCountings}
      columns={systemCountingsGridColumns}
      predefinedFilters={[]}
      apiArgs={[cellLabel]}
    />
  );
};

export default InventoryCellCountingsGrid;
