import { DataGridRow } from '@oplog/data-grid';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { filterApplier } from '../../../../utils/filterApplier';
import {
  geti18nName,
  InventoryCellLinkFormatter,
  ProductDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'W2WPlanReports.W2WPlanReportsDamagedItemsGrid';
const titleKey = 'W2WPlanReports.W2WPlanReportsDamagedItemsGrid.Title';

interface IW2WPlanReportsDamagedItemsGrid {
  stockCountingPlanId: string;
}

const W2WPlanReportsDamagedItemsGrid: FC<IW2WPlanReportsDamagedItemsGrid> = ({ stockCountingPlanId }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    filterApplier(GridType.QueryWallToWallStockCountingDamagedItemsReport, dispatch, history, stockCountingPlanId);
  }, []);

  const W2WPlanReportsDamagedItemsGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: false,
    },
    {
      name: geti18nName('SKU', t, intlKey),
      key: 'sku',
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
      key: 'damagedItemAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Operator', t, intlKey),
      key: 'operator',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('DetectedList', t, intlKey),
      key: 'stockCountingListName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('RestockQuantity', t, intlKey),
      key: 'restowItemAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('CellAddress', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: InventoryCellLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.QueryWallToWallStockCountingDamagedItemsReport}
      columns={W2WPlanReportsDamagedItemsGridColumns}
      predefinedFilters={[]}
      apiArgs={[stockCountingPlanId]}
    />
  );
};

export default W2WPlanReportsDamagedItemsGrid;
