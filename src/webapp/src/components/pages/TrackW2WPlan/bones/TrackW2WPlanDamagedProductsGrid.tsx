import { DataGridRow, FormatterProps } from '@oplog/data-grid';
import { Icon } from '@oplog/express';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { filterApplier } from '../../../../utils/filterApplier';
import { geti18nName, InventoryCellLinkFormatter } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'TrackW2WPlan.TrackW2WPlanDamagedProductsGrid';
const titleKey = 'TrackW2WPlan.TrackW2WPlanDamagedProductsGrid.Title';

interface ITrackW2WPlanDamagedProductsGrid {
  stockCountingPlanId: string;
}

const TrackW2WPlanDamagedProductsGrid: FC<ITrackW2WPlanDamagedProductsGrid> = ({ stockCountingPlanId }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    filterApplier(GridType.QueryWallToWallStockCountingDamagedItems, dispatch, history, stockCountingPlanId);
  }, []);

  const trackW2WPlanDamagedProductsGridColumns: Array<any> = [
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
    {
      name: geti18nName('SKU', t, intlKey),
      key: 'sku',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('NumberOfDamagedItems', t, intlKey),
      key: 'damagedItemCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('DetectedList', t, intlKey),
      key: 'stockCountingList',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('DetectingOperator', t, intlKey),
      key: 'operator',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('Checking', t, intlKey),
      key: 'controlState',
      type: 'boolean',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (
        <Icon
          fontSize="26"
          color={props.value ? 'palette.green' : 'palette.red'}
          name={props.value ? 'fas fa-check-circle' : 'fas fa-times-circle'}
        />
      ),
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.QueryWallToWallStockCountingDamagedItems}
      columns={trackW2WPlanDamagedProductsGridColumns}
      predefinedFilters={[]}
      apiArgs={[stockCountingPlanId]}
    />
  );
};

export default TrackW2WPlanDamagedProductsGrid;
