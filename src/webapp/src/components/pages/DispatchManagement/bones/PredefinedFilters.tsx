import { gridActions, gridSelectors, PredefinedFilter } from '@oplog/data-grid';
import { Box, Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import {
  BooleanFilter,
  BooleanFilterOperation,
  StringFilter,
  StringFilterOperation,
} from 'dynamic-query-builder-client';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import { QueryDispatchManagementCountsOutputDTO, SalesOrderDispatchStateSteps } from '../../../../services/swagger';
import PredefinedFilterBox from './PredefinedFilterBox';

const intlKey = 'DispatchManagement';

export enum FilterIds {
  DispatchState = 'DispatchState',
  PickingState = 'PickingState',
  PackingState = 'PackingState',
  PickingStateCompleted = 'PickingStateCompleted',
  PackingStateCompleted = 'PackingStateCompleted',
  SlamStateNotCompleted = 'SlamStateNotCompleted',
  DispatchNotCompleted = 'DispatchNotCompleted',
  SlamStateCompleted = 'SlamStateCompleted',
  SortingNotCompleted = 'SortingNotCompleted',
  SortingCompleted = 'SortingCompleted',
  Suspended = 'Suspended',
  CutOff = 'CutOff',
  Late = 'Late',
}

export enum FilterProperties {
  DispatchState = 'dispatchState',
  PickingState = 'pickingState',
  SortingState = 'sortingState',
  PackingState = 'packingState',
  SlamState = 'slamState',
  State = 'state',
  CutOff = 'isCutOff',
  Late = 'isLate',
  IsSuspended = 'isSuspended',
}

export enum FilterValue {
  Value = 'value',
}

export const PredefinedFilters: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.DispatchManagementCounts));
      dispatch(gridActions.gridStateCleared(GridType.DispatchManagement));
    };
  }, []);

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.DispatchManagementCounts));
  }, []);

  const appliedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.DispatchManagement, state.grid)
  );

  const getCountsResponse: Resource<QueryDispatchManagementCountsOutputDTO> = useSelector((state: StoreState) => {
    return state.resources[ResourceType.DispatchManagementCounts];
  });

  const getGridResponse: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.DispatchManagement, state.grid)
  );

  const initialFilters = [
    {
      filter: new StringFilter({
        property: FilterProperties.PickingState,
        op: StringFilterOperation.Equals,
        value: SalesOrderDispatchStateSteps.None,
        id: FilterIds.PickingState,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new StringFilter({
        property: FilterProperties.DispatchState,
        op: StringFilterOperation.Equals,
        value: SalesOrderDispatchStateSteps.None,
        id: FilterIds.DispatchState,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new StringFilter({
        property: FilterProperties.PickingState,
        op: StringFilterOperation.Equals,
        value: SalesOrderDispatchStateSteps.Completed,
        id: FilterIds.PickingStateCompleted,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new StringFilter({
        property: FilterProperties.PackingState,
        op: StringFilterOperation.Equals,
        value: SalesOrderDispatchStateSteps.None,
        id: FilterIds.PackingState,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new BooleanFilter({
        property: FilterProperties.IsSuspended,
        op: BooleanFilterOperation.Equals,
        value: true,
        id: FilterIds.Suspended,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new StringFilter({
        property: FilterProperties.PackingState,
        op: StringFilterOperation.Equals,
        value: SalesOrderDispatchStateSteps.Completed,
        id: FilterIds.PackingStateCompleted,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new StringFilter({
        property: FilterProperties.SlamState,
        op: StringFilterOperation.Equals,
        value: SalesOrderDispatchStateSteps.None,
        id: FilterIds.SlamStateNotCompleted,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new StringFilter({
        property: FilterProperties.SlamState,
        op: StringFilterOperation.Equals,
        value: SalesOrderDispatchStateSteps.Completed,
        id: FilterIds.SlamStateCompleted,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new StringFilter({
        property: FilterProperties.DispatchState,
        op: StringFilterOperation.Equals,
        value: SalesOrderDispatchStateSteps.None,
        id: FilterIds.DispatchNotCompleted,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new BooleanFilter({
        property: FilterProperties.CutOff,
        op: BooleanFilterOperation.Equals,
        value: true,
        id: FilterIds.CutOff,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new BooleanFilter({
        property: FilterProperties.Late,
        op: BooleanFilterOperation.Equals,
        value: true,
        id: FilterIds.Late,
      }),
      selected: false,
      visibility: true,
    },
  ];

  const dispatcher = () => {
    dispatch(gridActions.gridPaginationOffsetReset(GridType.DispatchManagement));
    dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.DispatchManagement, initialFilters));
    dispatch(gridActions.gridFetchRequested(GridType.DispatchManagement));
  };

  const pickingNotStartedFilter = () => {
    initialFilters.forEach((el, i) => {
      el.filter.id === FilterIds.PickingState
        ? (initialFilters[i].selected = true)
        : (initialFilters[i].selected = false);
    });
    dispatcher();
  };
  const notDispatchedTotalFilter = () => {
    initialFilters.forEach((el, i) => {
      el.filter.id === FilterIds.DispatchState
        ? (initialFilters[i].selected = true)
        : (initialFilters[i].selected = false);
    });

    dispatcher();
  };
  const waitingForPackingFilter = () => {
    initialFilters.forEach((el, i) => {
      el.filter.id === FilterIds.PickingStateCompleted || el.filter.id === FilterIds.PackingState
        ? (initialFilters[i].selected = true)
        : (initialFilters[i].selected = false);
    });

    dispatcher();
  };
  const suspendedFilter = () => {
    initialFilters.forEach((el, i) => {
      el.filter.id === FilterIds.Suspended ? (initialFilters[i].selected = true) : (initialFilters[i].selected = false);
    });

    dispatcher();
  };
  const waitingForSLAMFilter = () => {
    initialFilters.forEach((el, i) => {
      el.filter.id === FilterIds.PackingStateCompleted || el.filter.id === FilterIds.SlamStateNotCompleted
        ? (initialFilters[i].selected = true)
        : (initialFilters[i].selected = false);
    });

    dispatcher();
  };
  const slamCompletedDispatchNotCompletedFilter = () => {
    initialFilters.forEach((el, i) => {
      el.filter.id === FilterIds.SlamStateCompleted || el.filter.id === FilterIds.DispatchNotCompleted
        ? (initialFilters[i].selected = true)
        : (initialFilters[i].selected = false);
    });

    dispatcher();
  };
  const isCutOffFilter = () => {
    initialFilters.forEach((el, i) => {
      el.filter.id === FilterIds.CutOff || el.filter.id === FilterIds.DispatchNotCompleted
        ? (initialFilters[i].selected = true)
        : (initialFilters[i].selected = false);
    });

    dispatcher();
  };
  const isLateFilter = () => {
    initialFilters.forEach((el, i) => {
      el.filter.id === FilterIds.Late || el.filter.id === FilterIds.DispatchNotCompleted
        ? (initialFilters[i].selected = true)
        : (initialFilters[i].selected = false);
    });

    dispatcher();
  };

  const filterBoxInfo = [
    {
      title: t(`${intlKey}.Filters.NotDispatchedTotal`),
      count: getCountsResponse?.data?.totalNotDispatchedCount,
      iconName: 'fal fa-boxes',
      filter: notDispatchedTotalFilter,
      isFilterApplied: appliedFilters?.find(
        filters =>
          filters.filter.id === FilterIds.DispatchState &&
          filters.selected &&
          filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None
      ),
      isClickable:
        !appliedFilters?.find(filters => filters.selected) ||
        appliedFilters?.filter(
          filters =>
            filters.filter.id === FilterIds.DispatchState &&
            filters.selected &&
            filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None
        ).length !== appliedFilters?.filter(filters => filters.selected).length,
    },
    {
      title: t(`${intlKey}.Filters.WaitingForPicking`),
      count: getCountsResponse?.data?.waitingForPickingCount,
      iconName: 'fal fa-person-dolly',
      filter: pickingNotStartedFilter,
      isFilterApplied: appliedFilters?.find(
        filters =>
          filters.filter.property === FilterProperties.PickingState &&
          filters.selected &&
          filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None
      ),
      isClickable:
        !appliedFilters?.find(filters => filters.selected) ||
        appliedFilters?.filter(
          filters =>
            filters.filter.id === FilterIds.PickingState &&
            filters.selected &&
            filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None
        ).length !== appliedFilters?.filter(filters => filters.selected).length,
    },
    {
      title: t(`${intlKey}.Filters.WaitingForPacking`),
      count: getCountsResponse?.data?.waitingForPackingCount,
      iconName: 'fal fa-box-full',
      filter: waitingForPackingFilter,
      isFilterApplied:
        appliedFilters?.find(
          filters =>
            filters.filter.property === FilterProperties.PackingState &&
            filters.selected &&
            filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None
        ) &&
        appliedFilters?.find(
          filters =>
            filters.filter.property === FilterProperties.PickingState &&
            filters.selected &&
            filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.Completed
        ),
      isClickable:
        !appliedFilters?.find(filters => filters.selected) ||
        appliedFilters?.filter(
          filters =>
            (filters.filter.id === FilterIds.PackingState &&
              filters.selected &&
              filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None) ||
            (filters.filter.id === FilterIds.PickingStateCompleted &&
              filters.selected &&
              filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.Completed)
        ).length !== 2,
    },
    {
      title: t(`${intlKey}.Filters.WaitingForSLAM`),
      count: getCountsResponse?.data?.waitingForSLAMCount,
      iconName: 'fal fa-barcode-read',
      filter: waitingForSLAMFilter,
      isFilterApplied:
        appliedFilters?.find(
          filters =>
            filters.filter.property === FilterProperties.PackingState &&
            filters.selected &&
            filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.Completed
        ) &&
        appliedFilters?.find(
          filters =>
            filters.filter.property === FilterProperties.SlamState &&
            filters.selected &&
            filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None
        ),
      isClickable:
        !appliedFilters?.find(filters => filters.selected) ||
        appliedFilters?.filter(
          filters =>
            (filters.filter.id === FilterIds.PackingStateCompleted &&
              filters.selected &&
              filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.Completed) ||
            (filters.filter.id === FilterIds.SlamStateNotCompleted &&
              filters.selected &&
              filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None)
        ).length !== 2,
    },
    {
      title: t(`${intlKey}.Filters.Suspended`),
      count: getCountsResponse?.data?.suspendedSalesOrdersCount,
      iconName: 'fal fa-engine-warning',
      filter: suspendedFilter,
      isFilterApplied: appliedFilters?.find(
        filters =>
          filters.filter.property === FilterProperties.IsSuspended &&
          filters.selected &&
          filters.filter[FilterValue.Value] === true
      ),
      isClickable:
        !appliedFilters?.find(filters => filters.selected) ||
        appliedFilters?.filter(
          filters =>
            filters.filter.id === FilterIds.Suspended && filters.selected && filters.filter[FilterValue.Value] === true
        ).length !== appliedFilters?.filter(filters => filters.selected).length,
    },
    {
      title: t(`${intlKey}.Filters.ReadyForDispatch`),
      count: getCountsResponse?.data?.readyForDispatchCount,
      iconName: 'fal fa-box-alt',
      filter: slamCompletedDispatchNotCompletedFilter,
      isFilterApplied:
        appliedFilters?.find(
          filters =>
            filters.filter.property === FilterProperties.SlamState &&
            filters.selected &&
            filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.Completed
        ) &&
        appliedFilters?.find(
          filters =>
            filters.filter.id === FilterIds.DispatchNotCompleted &&
            filters.selected &&
            filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None
        ),
      isClickable:
        !appliedFilters?.find(filters => filters.selected) ||
        appliedFilters?.filter(
          filters =>
            (filters.filter.id === FilterIds.SlamStateCompleted &&
              filters.selected &&
              filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.Completed) ||
            (filters.filter.id === FilterIds.DispatchNotCompleted &&
              filters.selected &&
              filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None)
        ).length !== 2,
    },
    {
      title: t(`${intlKey}.Filters.TotalCutOff`),
      count: getCountsResponse?.data?.notDispatchedCutOffCount,
      iconName: 'fal fa-shipping-timed',
      filter: isCutOffFilter,
      isFilterApplied:
        appliedFilters?.find(
          filters =>
            filters.filter.property === FilterProperties.CutOff &&
            filters.selected &&
            filters.filter[FilterValue.Value] === true
        ) &&
        appliedFilters?.find(
          filters =>
            filters.filter.id === FilterIds.DispatchNotCompleted &&
            filters.selected &&
            filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None
        ),
      isClickable:
        !appliedFilters?.find(filters => filters.selected) ||
        appliedFilters?.filter(
          filters =>
            (filters.filter.id === FilterIds.CutOff &&
              filters.selected &&
              filters.filter[FilterValue.Value] === true) ||
            (filters.filter.id === FilterIds.DispatchNotCompleted &&
              filters.selected &&
              filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None)
        ).length !== 2,
    },
    {
      title: t(`${intlKey}.Filters.TotalLate`),
      count: getCountsResponse?.data?.notDispatchedLateCount,
      iconName: 'fal fa-alarm-clock',
      filter: isLateFilter,
      isFilterApplied:
        appliedFilters?.find(
          filters =>
            filters.filter.property === FilterProperties.Late &&
            filters.selected &&
            filters.filter[FilterValue.Value] === true
        ) &&
        appliedFilters?.find(
          filters =>
            filters.filter.id === FilterIds.DispatchNotCompleted &&
            filters.selected &&
            filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None
        ),
      isClickable:
        !appliedFilters?.find(filters => filters.selected) ||
        appliedFilters?.filter(
          filters =>
            (filters.filter.id === FilterIds.Late && filters.selected && filters.filter[FilterValue.Value] === true) ||
            (filters.filter.id === FilterIds.DispatchNotCompleted &&
              filters.selected &&
              filters.filter[FilterValue.Value] === SalesOrderDispatchStateSteps.None)
        ).length !== 2,
    },
  ];
  return (
    <Flex fontFamily="heading" pl={16}>
      {getCountsResponse?.isBusy || getGridResponse
        ? Array.from({ length: 8 }).map((skeleton, i) => {
            return <Skeleton width={185} height={95} style={{ margin: '16px 8px 8px 8px' }} key={i.toString()} />;
          })
        : filterBoxInfo?.map((info, i) => {
            return (
              <Box key={i.toString()}>
                <PredefinedFilterBox filterBoxInfo={info} />
              </Box>
            );
          })}
    </Flex>
  );
};

export default PredefinedFilters;
