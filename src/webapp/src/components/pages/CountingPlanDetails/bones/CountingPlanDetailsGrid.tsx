import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { StockCountingType } from '../../../../services/swagger';
import {
  coloredDifferenceFormatter,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
  SystemCountingListDetailsLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'CountingPlanDetails.CountingPlanDetailsGrid';
const titleKey = 'CountingPlanDetails.CountingPlanDetailsGrid.Title';

interface ICountingPlanDetailsGrid {
  referenceId: string;
  stockCountingType?: StockCountingType;
}

const CountingPlanDetailsGrid: React.FC<ICountingPlanDetailsGrid> = ({ referenceId, stockCountingType }) => {
  const { t } = useTranslation();
  const CountingPlanDetailsGridColumns: Array<any> = [
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
      key: 'productSKU',
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
    },
    {
      name: geti18nName('ZoneLabel', t, intlKey),
      key: 'zoneLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('TotalAmountBeforeCounting', t, intlKey),
      key: 'totalAmountBeforeCounting',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('TotalAmountAfterCounting', t, intlKey),
      key: 'totalAmountAfterCounting',
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
      name: geti18nName('StockCountingListReferenceNumber', t, intlKey),
      key: 'stockCountingListReferenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: SystemCountingListDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ProcessedByFullName', t, intlKey),
      key: 'processedByFullName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('CountedAt', t, intlKey),
      key: 'countedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.CountingPlanDetail}
      columns={CountingPlanDetailsGridColumns}
      predefinedFilters={[]}
      apiArgs={[referenceId]}
    />
  );
};

export default CountingPlanDetailsGrid;
