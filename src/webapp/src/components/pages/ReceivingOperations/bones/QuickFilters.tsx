import { gridActions, gridSelectors } from '@oplog/data-grid';
import { DateFilter, DateFilterOperation, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ReceivingState } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import QuickFilterBar from '../../../molecules/QuickFilterBar';

export enum FilterIds {
  ReceivingNotCompleted = 'ReceivingNotCompleted',
  Date = 'Date',
  AwaitingInventory = 'AwaitingInventory',
  ReceivingOnHold = 'ReceivingOnHold',
  ReceivingOnHoldEquals = 'ReceivingOnHoldEquals',
  ReceivingCompletedEquals = 'ReceivingCompletedEquals',
}

export enum FilterProperties {
  State = 'state',
  TargetedRecivingCompletionDateTime = 'targetedRecivingCompletionDateTime',
}

const QuickFilterStatus = {
  InCompleted: 'InCompleted',
  Delayed: 'Delayed',
  InTheQueue: 'InTheQueue',
  Waiting: 'Waiting',
  Completed: 'Completed',
};

export const initialFilters = [
  {
    filter: new StringFilter({
      property: FilterProperties.State,
      op: StringFilterOperation.NotEqual,
      value: ReceivingState.ReceivingCompleted,
      id: FilterIds.ReceivingNotCompleted,
    }),
    selected: true,
    visibility: false,
  },
  {
    filter: new DateFilter({
      property: FilterProperties.TargetedRecivingCompletionDateTime,
      op: DateFilterOperation.LessThan,
      value: moment().toISOString(),
      dateFormat: 'YYYY-MM-DDTHH:mm',
      id: FilterIds.Date,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.State,
      op: StringFilterOperation.NotEqual,
      value: ReceivingState.AwaitingInventory,
      id: FilterIds.AwaitingInventory,
    }),
    selected: true,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.State,
      op: StringFilterOperation.NotEqual,
      value: ReceivingState.ReceivingOnHold,
      id: FilterIds.ReceivingOnHold,
    }),
    selected: true,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.State,
      op: StringFilterOperation.Equals,
      value: ReceivingState.ReceivingOnHold,
      id: FilterIds.ReceivingOnHoldEquals,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.State,
      op: StringFilterOperation.Equals,
      value: ReceivingState.ReceivingCompleted,
      id: FilterIds.ReceivingCompletedEquals,
    }),
    selected: false,
    visibility: false,
  },
];

interface IQuickFilters {
  grid?: any;
}

const QuickFilters: React.FC<IQuickFilters> = ({ grid }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeQuickFilters, setActiveQuickFilters] = useState(QuickFilterStatus.InTheQueue);

  const isGridBusy: boolean = useSelector((state: StoreState) => gridSelectors.isBusy(grid, state.grid));

  const dispatcher = () => {
    dispatch(gridActions.gridPaginationOffsetReset(grid));
    dispatch(gridActions.gridPredefinedFiltersInitialized(grid, initialFilters));
    dispatch(gridActions.gridFetchRequested(grid));
  };

  const quickFilterButtons = Object.keys(QuickFilterStatus).map(status => ({
    key: status,
    title: t(`ReceivingPurchaseOrders.Grid.QuickFilters.${status}`),
    isSelected: activeQuickFilters === status,
    onClick: () => {
      if (!isGridBusy) {
        if (status === QuickFilterStatus.InCompleted) {
          initialFilters.forEach((el, i) => {
            el.filter.id === FilterIds.ReceivingNotCompleted
              ? (initialFilters[i].selected = true)
              : (initialFilters[i].selected = false);
          });
          dispatcher();
        }
        if (status === QuickFilterStatus.Delayed) {
          initialFilters.forEach((el, i) => {
            el.filter.id === FilterIds.Date || el.filter.id === FilterIds.ReceivingNotCompleted
              ? (initialFilters[i].selected = true)
              : (initialFilters[i].selected = false);
          });
          dispatcher();
        }
        if (status === QuickFilterStatus.InTheQueue) {
          initialFilters.forEach((el, i) => {
            el.filter.id === FilterIds.ReceivingNotCompleted ||
            el.filter.id === FilterIds.AwaitingInventory ||
            el.filter.id === FilterIds.ReceivingOnHold
              ? (initialFilters[i].selected = true)
              : (initialFilters[i].selected = false);
          });
          dispatcher();
        }
        if (status === QuickFilterStatus.Waiting) {
          initialFilters.forEach((el, i) => {
            el.filter.id === FilterIds.ReceivingOnHoldEquals
              ? (initialFilters[i].selected = true)
              : (initialFilters[i].selected = false);
          });
          dispatcher();
        }
        if (status === QuickFilterStatus.Completed) {
          initialFilters.forEach((el, i) => {
            el.filter.id === FilterIds.ReceivingCompletedEquals
              ? (initialFilters[i].selected = true)
              : (initialFilters[i].selected = false);
          });
          dispatcher();
        }
        setActiveQuickFilters(status);
      }
    },
  }));

  return <QuickFilterBar filterButtons={quickFilterButtons} />;
};

export default QuickFilters;
