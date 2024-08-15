import { gridActions, gridSelectors, PredefinedFilter } from '@oplog/data-grid';
import { Box, Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { BooleanFilter, BooleanFilterOperation } from 'dynamic-query-builder-client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { DispatchProcessCargoPackageManagementCountsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import PredefinedFilterBox, { FilterBoxInfo } from './PredefinedFilterBox';

const intlKey = 'DispatchPackages';

export enum FilterProperties {
  IsNotDispatched = 'isNotDispatched',
  IsWaitingForSLAM = 'isWaitingForSLAM',
  IsSuspended = 'isSuspended',
  IsReadyForDispatch = 'isReadyForDispatch',
  IsNotDispatchedCutOff = 'isNotDispatchedCutOff',
  IsNotDispatchedLate = 'isNotDispatchedLate',
  IsCancelled = 'isCancelled',
  IsTransferred = 'isTransferred',
  IsWaitingForManualDelivery = 'isWaitingForManualDelivery',
}

export const PredefinedFilters: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState<FilterProperties>(FilterProperties.IsNotDispatched);

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.DispatchPackagesCounts));
  }, []);

  const appliedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.DispatchPackages, state.grid)
  );

  useEffect(() => {
    appliedFilters.filter(i => i.selected).length === 1 &&
      setActiveFilter(
        FilterProperties[
          `${
            Object.entries(FilterProperties).find(
              j => j[1] === appliedFilters.find(k => k.selected)?.filter.property
            )?.[0]
          }`
        ]
      );
  }, [appliedFilters]);

  const getCountsResponse: Resource<DispatchProcessCargoPackageManagementCountsOutputDTO> = useSelector(
    (state: StoreState) => {
      return state.resources[ResourceType.DispatchPackagesCounts];
    }
  );

  const getGridResponse: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.DispatchPackages, state.grid)
  );

  const initialFilters = [
    {
      filter: new BooleanFilter({
        property: FilterProperties.IsNotDispatched,
        op: BooleanFilterOperation.Equals,
        value: true,
      }),
      selected: true,
      visibility: true,
    },
    {
      filter: new BooleanFilter({
        property: FilterProperties.IsWaitingForSLAM,
        op: BooleanFilterOperation.Equals,
        value: true,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new BooleanFilter({
        property: FilterProperties.IsSuspended,
        op: BooleanFilterOperation.Equals,
        value: true,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new BooleanFilter({
        property: FilterProperties.IsReadyForDispatch,
        op: BooleanFilterOperation.Equals,
        value: true,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new BooleanFilter({
        property: FilterProperties.IsNotDispatchedCutOff,
        op: BooleanFilterOperation.Equals,
        value: true,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new BooleanFilter({
        property: FilterProperties.IsNotDispatchedLate,
        op: BooleanFilterOperation.Equals,
        value: true,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new BooleanFilter({
        property: FilterProperties.IsCancelled,
        op: BooleanFilterOperation.Equals,
        value: true,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new BooleanFilter({
        property: FilterProperties.IsTransferred,
        op: BooleanFilterOperation.Equals,
        value: true,
      }),
      selected: false,
      visibility: true,
    },
    {
      filter: new BooleanFilter({
        property: FilterProperties.IsWaitingForManualDelivery,
        op: BooleanFilterOperation.Equals,
        value: true,
      }),
      selected: false,
      visibility: true,
    },
  ];

  const dispatcher = () => {
    dispatch(gridActions.gridPaginationOffsetReset(GridType.DispatchPackages));
    dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.DispatchPackages, initialFilters));
    dispatch(gridActions.gridFetchRequested(GridType.DispatchPackages));
  };

  const filterBoxInfo: FilterBoxInfo[] = [
    {
      title: t(`${intlKey}.Filters.NotDispatchedTotal`),
      count: getCountsResponse?.data?.totalNotDispatchedCount,
      iconName: 'fal fa-boxes',
      filter: () => {
        setActiveFilter(FilterProperties.IsNotDispatched);
        initialFilters.forEach((el, i) => {
          el.filter.property === FilterProperties.IsNotDispatched
            ? (initialFilters[i].selected = true)
            : (initialFilters[i].selected = false);
        });
        dispatcher();
      },
      isFilterApplied: appliedFilters.filter(i => i.selected).length === 1 && activeFilter === FilterProperties.IsNotDispatched,
    },
    {
      title: t(`${intlKey}.Filters.WaitingForSLAM`),
      count: getCountsResponse?.data?.waitingForSLAMCount,
      iconName: 'fal fa-barcode-read',
      filter: () => {
        setActiveFilter(FilterProperties.IsWaitingForSLAM);
        initialFilters.forEach((el, i) => {
          el.filter.property === FilterProperties.IsWaitingForSLAM
            ? (initialFilters[i].selected = true)
            : (initialFilters[i].selected = false);
        });
        dispatcher();
      },
      isFilterApplied: appliedFilters.filter(i => i.selected).length === 1 && activeFilter === FilterProperties.IsWaitingForSLAM,
    },
    {
      title: t(`${intlKey}.Filters.Suspended`),
      count: getCountsResponse?.data?.suspendedCount,
      iconName: 'fal fa-engine-warning',
      filter: () => {
        setActiveFilter(FilterProperties.IsSuspended);
        initialFilters.forEach((el, i) => {
          el.filter.property === FilterProperties.IsSuspended
            ? (initialFilters[i].selected = true)
            : (initialFilters[i].selected = false);
        });
        dispatcher();
      },
      isFilterApplied: appliedFilters.filter(i => i.selected).length === 1 && activeFilter === FilterProperties.IsSuspended,
    },
    {
      title: t(`${intlKey}.Filters.ReadyForDispatch`),
      count: getCountsResponse?.data?.readyForDispatchCount,
      iconName: 'fal fa-box-alt',
      filter: () => {
        setActiveFilter(FilterProperties.IsReadyForDispatch);
        initialFilters.forEach((el, i) => {
          el.filter.property === FilterProperties.IsReadyForDispatch
            ? (initialFilters[i].selected = true)
            : (initialFilters[i].selected = false);
        });
        dispatcher();
      },
      isFilterApplied: appliedFilters.filter(i => i.selected).length === 1 && activeFilter === FilterProperties.IsReadyForDispatch,
    },
    {
      title: t(`${intlKey}.Filters.TotalCutOff`),
      count: getCountsResponse?.data?.notDispatchedCutOffCount,
      iconName: 'fal fa-shipping-timed',
      filter: () => {
        setActiveFilter(FilterProperties.IsNotDispatchedCutOff);
        initialFilters.forEach((el, i) => {
          el.filter.property === FilterProperties.IsNotDispatchedCutOff
            ? (initialFilters[i].selected = true)
            : (initialFilters[i].selected = false);
        });
        dispatcher();
      },
      isFilterApplied: appliedFilters.filter(i => i.selected).length === 1 && activeFilter === FilterProperties.IsNotDispatchedCutOff,
    },
    {
      title: t(`${intlKey}.Filters.TotalLate`),
      count: getCountsResponse?.data?.notDispatchedLateCount,
      iconName: 'fal fa-alarm-clock',
      filter: () => {
        setActiveFilter(FilterProperties.IsNotDispatchedLate);
        initialFilters.forEach((el, i) => {
          el.filter.property === FilterProperties.IsNotDispatchedLate
            ? (initialFilters[i].selected = true)
            : (initialFilters[i].selected = false);
        });
        dispatcher();
      },
      isFilterApplied: appliedFilters.filter(i => i.selected).length === 1 && activeFilter === FilterProperties.IsNotDispatchedLate,
    },
    {
      title: t(`${intlKey}.Filters.Cancelled`),
      count: getCountsResponse?.data?.cancelledCount,
      iconName: 'fal fa-file-excel',
      filter: () => {
        setActiveFilter(FilterProperties.IsCancelled);
        initialFilters.forEach((el, i) => {
          el.filter.property === FilterProperties.IsCancelled
            ? (initialFilters[i].selected = true)
            : (initialFilters[i].selected = false);
        });
        dispatcher();
      },
      isFilterApplied: appliedFilters.filter(i => i.selected).length === 1 && activeFilter === FilterProperties.IsCancelled,
    },
    {
      title: t(`${intlKey}.Filters.Transferred`),
      count: getCountsResponse?.data?.transferredCount,
      iconName: 'fal fa-exchange',
      filter: () => {
        setActiveFilter(FilterProperties.IsTransferred);
        initialFilters.forEach((el, i) => {
          el.filter.property === FilterProperties.IsTransferred
            ? (initialFilters[i].selected = true)
            : (initialFilters[i].selected = false);
        });
        dispatcher();
      },
      isFilterApplied: appliedFilters.filter(i => i.selected).length === 1 && activeFilter === FilterProperties.IsTransferred,
    },
    {
      title: t(`${intlKey}.Filters.WaitingForManualDelivery`),
      count: getCountsResponse?.data?.waitingForManualDeliveryCount,
      iconName: 'fal fa-hand-holding-box',
      filter: () => {
        setActiveFilter(FilterProperties.IsWaitingForManualDelivery);
        initialFilters.forEach((el, i) => {
          el.filter.property === FilterProperties.IsWaitingForManualDelivery
            ? (initialFilters[i].selected = true)
            : (initialFilters[i].selected = false);
        });
        dispatcher();
      },
      isFilterApplied:
        appliedFilters.filter(i => i.selected).length === 1 && activeFilter === FilterProperties.IsWaitingForManualDelivery,
    },
  ];

  return (
    <Flex fontFamily="heading" pl={16}>
      {getCountsResponse?.isBusy || getGridResponse
        ? Array.from({ length: 9 }).map((_, i) => {
            return <Skeleton width={185} height={95} style={{ margin: '16px 8px 8px 8px' }} key={i.toString()} />;
          })
        : filterBoxInfo.map((info, i) => {
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
