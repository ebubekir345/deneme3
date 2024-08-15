import { gridActions, gridSelectors, PredefinedFilter } from '@oplog/data-grid';
import { StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType } from '../../../../models';
import { LogicalOperator } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import QuickFilterBar from '../../../molecules/QuickFilterBar';
import { ProductsByAllStockGridProps, ProductStatusFilters } from './ProductsByAllStockGrid';

const QuickFilters: React.FC<ProductsByAllStockGridProps> = ({ productIdFromRoute }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeQuickFilters, setActiveQuickFilters] = useState([ProductStatusFilters.All_Ops]);

  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.ProductsByAllStock, state.grid)
  );

  const appliedPredefinedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.ProductsByAllStock, state.grid)
  );

  const quickFilterButtons = Object.keys(ProductStatusFilters).map(status => ({
    key: status,
    title: t(`StockManagement.InventoryItemType.${status}`),
    isSelected: activeQuickFilters.includes(status),
    onClick: () => {
      if (!isGridBusy) {
        let filters = appliedPredefinedFilters
          .filter(filter => filter.filter.id !== 'preAppliedFoundandLost')
          .map(filter => {
            return {
              ...filter,
              selected: filter.filter.valueToString() === status,
              visibility:
              filter.filter.valueToString() === status &&
              filter.filter.valueToString() !== ProductStatusFilters.All_Ops,
            };
          });
        if (status === ProductStatusFilters.All_Ops) {
          filters = [
            ...filters,
            {
              filter: new StringFilter({
                property: 'itemType',
                op: StringFilterOperation.NotEqual,
                value: [ProductStatusFilters.FoundItem],
                logicalOperator: LogicalOperator.AndAlso,
                id: 'preAppliedFoundandLost',
              }),
              selected: true,
              visibility: false,
            },
            {
              filter: new StringFilter({
                property: 'itemType',
                op: StringFilterOperation.NotEqual,
                value: [ProductStatusFilters.LostItem],
                id: 'preAppliedFoundandLost',
              }),
              selected: true,
              visibility: false,
            },
          ];
        }
        filters.length && applyQuickFilter(filters);
      }
    },
  }));

  const applyQuickFilter = (filters: PredefinedFilter[]) => {
    dispatch(gridActions.gridPaginationOffsetReset(GridType.ProductsByAllStock));
    dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.ProductsByAllStock, filters));
    dispatch(gridActions.gridFetchRequested(GridType.ProductsByAllStock, [decodeURI(productIdFromRoute)]));
  };

  useEffect(() => {
    const appliedQuickFilters = appliedPredefinedFilters
      .filter(filter => filter.selected)
      .map(filter => filter.filter.valueToString());
    setActiveQuickFilters(appliedQuickFilters.length === 2 ? [ProductStatusFilters.All_Ops] : appliedQuickFilters);
  }, [appliedPredefinedFilters]);

  return <QuickFilterBar filterButtons={quickFilterButtons} />;
};

export default QuickFilters;
