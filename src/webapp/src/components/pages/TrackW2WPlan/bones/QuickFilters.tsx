import { gridActions, gridSelectors, PredefinedFilter } from '@oplog/data-grid';
import {
  NumericFilter,
  NumericFilterOperation,
  StringFilter,
  StringFilterOperation,
} from 'dynamic-query-builder-client';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType } from '../../../../models';
import { StockCountingListState } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import QuickFilterBar from '../../../molecules/QuickFilterBar';

const intlKey = 'TrackW2WPlan';

export const initialFilters: PredefinedFilter[] = [
  ...Object.values(StockCountingListState)
    .filter(status => status !== StockCountingListState.None && status !== StockCountingListState.InProgres)
    .map(filter => ({
      filter: new StringFilter({
        property: 'state',
        op: StringFilterOperation.Equals,
        value: filter,
        id: filter,
      }),
      selected: false,
      visibility: false,
    })),
  ...[
    {
      filter: new NumericFilter({
        property: 'incorrectCountedCellCount',
        op: NumericFilterOperation.GreaterThan,
        value: 0,
        id: 'incorrectCountedCellCount',
      }),
      selected: false,
      visibility: false,
    },
  ],
];

interface IQuickFilters {
  grid?: any;
  stockCountingPlanId: string;
}

const StateFilters = {
  ...StockCountingListState,
  All: 'All',
};

const QuickFilters: FC<IQuickFilters> = ({ grid, stockCountingPlanId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeQuickFilters, setActiveQuickFilters] = useState([StateFilters.All]);
  const isGridBusy: boolean = useSelector((state: StoreState) => gridSelectors.isBusy(grid, state.grid));
  const appliedPredefinedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(grid, state.grid)
  );

  const quickFilterButtons = Object.keys(StateFilters)
    .filter(status => {
      if (grid === GridType.QueryWallToWallStockCountingAddresses) {
        return status !== StockCountingListState.InProgres && status !== StockCountingListState.None;
      } else {
        return status !== StockCountingListState.None;
      }
    })
    .map(status => ({
      key: status,
      title: t(`${intlKey}.QuickFilters.${status}`),
      isSelected: activeQuickFilters.includes(status) ||
      (status === StockCountingListState.InProgres && activeQuickFilters.includes('0')),
      onClick: () => {
        if (!isGridBusy) {
          let filters = appliedPredefinedFilters.map(filter => ({
            ...filter,
            selected:
              filter.filter.valueToString() === status ||
              (status === StockCountingListState.InProgres && filter.filter.valueToString() === '0')
          }));

          if (filters.length) {
            dispatch(gridActions.gridPaginationOffsetReset(grid));
            dispatch(gridActions.gridPredefinedFiltersInitialized(grid, filters));
            dispatch(gridActions.gridFetchRequested(grid, [stockCountingPlanId]));
          }
          setActiveQuickFilters([status]);
        }
      },
    }));
  quickFilterButtons.reverse();

  useEffect(() => {
    const appliedQuickFilters = appliedPredefinedFilters
      .filter(filter => filter.selected)
      .map(filter => filter.filter.valueToString());
    setActiveQuickFilters(appliedQuickFilters.length ? appliedQuickFilters : [StateFilters.All]);
  }, [appliedPredefinedFilters]);

  return <QuickFilterBar filterButtons={quickFilterButtons} />;
};

export default QuickFilters;
