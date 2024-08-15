import { gridActions, gridSelectors, PredefinedFilter } from '@oplog/data-grid';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import { InventoryItemTypeForQueries } from '../../../../typings/globalStore/enums';
import QuickFilterBar from '../../../molecules/QuickFilterBar';

const QuickFilters = () => {
  const ProductStatusFilters = { All_Ops: 'All_Ops', ...InventoryItemTypeForQueries };
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeQuickFilters, setActiveQuickFilters] = useState(['']);

  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.StocksCurrentStatus, state.grid)
  );

  const appliedPredefinedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.StocksCurrentStatus, state.grid)
  );

  const quickFilterButtons = Object.keys(ProductStatusFilters).map(status => ({
    key: status,
    title: t(`StockManagement.InventoryItemType.${status}`),
    isSelected: activeQuickFilters.includes(status),
    onClick: () => {
      if (!isGridBusy) {
        let filters = appliedPredefinedFilters.map(filter => ({
          ...filter,
          selected: filter.filter.valueToString() === status,
          visibility:
            filter.filter.valueToString() === status && filter.filter.valueToString() !== ProductStatusFilters.All_Ops,
        }));
        filters.length && applyQuickFilter(filters);
      }
    },
  }));

  const applyQuickFilter = (filters: PredefinedFilter[]) => {
    dispatch(gridActions.gridPaginationOffsetReset(GridType.StocksCurrentStatus));
    dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.StocksCurrentStatus, filters));
    dispatch(gridActions.gridFetchRequested(GridType.StocksCurrentStatus));
  };

  useEffect(() => {
    const appliedQuickFilters = appliedPredefinedFilters
      .filter(filter => filter.selected)
      .map(filter => filter.filter.valueToString());
    setActiveQuickFilters(appliedQuickFilters.length ? appliedQuickFilters : ['']);
  }, [appliedPredefinedFilters]);

  return <QuickFilterBar filterButtons={quickFilterButtons} />;
};

export default QuickFilters;
