import { gridActions } from '@oplog/data-grid';
import { Flex, NULL_DATE } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { DateFilter, DateFilterOperation } from 'dynamic-query-builder-client';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { InventoryItemExpirationDateTrackingCountOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import PredefinedFilterBox, { FilterBoxInfo } from './PredefinedFilterBox';

const intlKey = 'ExpirationDateTrack';

export enum FilterProperty {
  CustomerExpirationDate = 'customerExpirationDate',
}

export enum FilterID {
  TotalCount = 'totalCount',
  All = 'All',
  LessThanOneHundredEightyDays = 'LessThanOneHundredEightyDays',
  GreaterThanNinetyDays = 'GreaterThanNinetyDays',
  LessThanNinetyDays = 'LessThanNinetyDays',
  GreaterThanThirtyDays = 'GreaterThanThirtyDays',
  LessThanThirtyDays = 'LessThanThirtyDays',
  GreaterThanSevenDays = 'GreaterThanSevenDays',
  LessThanSevenDays = 'LessThanSevenDays',
  GreaterThanToday = 'GreaterThanToday',
  Today = 'Today',
  ExpiredDate = 'ExpiredDate',
}

export enum ExpirationAnalyticsFilterType {
  Null,
  AllDates,
  OneHundredEightyToExpiryDateCount,
  NinetyToExpiryDateCount,
  ThirtyToExpiryDateCount,
  SevenToExpiryDateCount,
  DateExpiredCount,
}

export const initialFilters = [
  {
    filter: new DateFilter({
      property: FilterProperty.CustomerExpirationDate,
      op: DateFilterOperation.NotEqual,
      value: NULL_DATE,
      id: FilterID.All,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new DateFilter({
      property: FilterProperty.CustomerExpirationDate,
      op: DateFilterOperation.LessThan,
      value: moment().add('181', 'days').toISOString(),
      id: FilterID.LessThanOneHundredEightyDays,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new DateFilter({
      property: FilterProperty.CustomerExpirationDate,
      op: DateFilterOperation.GreaterThan,
      value: moment().add('90', 'days').toISOString(),
      id: FilterID.GreaterThanNinetyDays,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new DateFilter({
      property: FilterProperty.CustomerExpirationDate,
      op: DateFilterOperation.LessThan,
      value: moment().add('91', 'days').toISOString(),
      id: FilterID.LessThanNinetyDays,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new DateFilter({
      property: FilterProperty.CustomerExpirationDate,
      op: DateFilterOperation.GreaterThan,
      value: moment().add('30', 'days').toISOString(),
      id: FilterID.GreaterThanThirtyDays,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new DateFilter({
      property: FilterProperty.CustomerExpirationDate,
      op: DateFilterOperation.LessThan,
      value: moment().add('31', 'days').toISOString(),
      id: FilterID.LessThanThirtyDays,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new DateFilter({
      property: FilterProperty.CustomerExpirationDate,
      op: DateFilterOperation.GreaterThan,
      value: moment().add('7', 'days').toISOString(),
      id: FilterID.GreaterThanSevenDays,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new DateFilter({
      property: FilterProperty.CustomerExpirationDate,
      op: DateFilterOperation.LessThan,
      value: moment().add('8', 'days').toISOString(),
      id: FilterID.LessThanSevenDays,
    }),
    selected: false,
    visibility: true,
  },
  {
    filter: new DateFilter({
      property: FilterProperty.CustomerExpirationDate,
      op: DateFilterOperation.GreaterThan,
      value: moment().subtract('1', 'days').toISOString(),
      id: FilterID.Today,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new DateFilter({
      property: FilterProperty.CustomerExpirationDate,
      op: DateFilterOperation.LessThan,
      value: moment().toISOString(),
      id: FilterID.ExpiredDate,
    }),
    selected: true,
    visibility: true,
  },
];

export const PredefinedFilters: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState<ExpirationAnalyticsFilterType>(
    ExpirationAnalyticsFilterType.DateExpiredCount
  );
  const [didMount, setDidMount] = useState(false)

  const IdFilterTypeMap = {
    [ExpirationAnalyticsFilterType.OneHundredEightyToExpiryDateCount]: [
      FilterID.LessThanOneHundredEightyDays,
      FilterID.GreaterThanNinetyDays,
    ],
    [ExpirationAnalyticsFilterType.OneHundredEightyToExpiryDateCount]: [
      FilterID.LessThanOneHundredEightyDays,
      FilterID.GreaterThanNinetyDays,
    ],
    [ExpirationAnalyticsFilterType.NinetyToExpiryDateCount]: [
      FilterID.LessThanNinetyDays,
      FilterID.GreaterThanThirtyDays,
    ],
    [ExpirationAnalyticsFilterType.ThirtyToExpiryDateCount]: [
      FilterID.LessThanThirtyDays,
      FilterID.GreaterThanSevenDays,
    ],
    [ExpirationAnalyticsFilterType.SevenToExpiryDateCount]: [FilterID.LessThanSevenDays, FilterID.Today],
    [ExpirationAnalyticsFilterType.DateExpiredCount]: [FilterID.ExpiredDate],
    [ExpirationAnalyticsFilterType.AllDates]: [FilterID.All],
  };

  const getCountsResponse: Resource<InventoryItemExpirationDateTrackingCountOutputDTO> = useSelector(
    (state: StoreState) => {
      return state.resources[ResourceType.ExpirationDateTrackingCounts];
    }
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.ExpirationDateTrackingCounts));
    setDidMount(true)
  }, []);

  useEffect(() => {
    if (didMount) {
      initialFilters.forEach((x): any => {
        x.selected = false;
        if (IdFilterTypeMap[activeFilter].includes(x.filter.id)) {
          x.selected = true;
        }
      });
      dispatch(gridActions.gridPaginationOffsetReset(GridType.ExpirationDateTrackings));
      dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.ExpirationDateTrackings, initialFilters));
      dispatch(gridActions.gridFetchRequested(GridType.ExpirationDateTrackings));
    } 
  }, [activeFilter]);

  const filterBoxInfo: FilterBoxInfo[] = [
    {
      title: t(`${intlKey}.InfoBoxTitles.TotalCount`),
      count: getCountsResponse?.data?.totalCount,
      iconName: 'fal fa-calendar-exclamation',
      onClick: () => setActiveFilter(ExpirationAnalyticsFilterType.AllDates),
      isFilterApplied: activeFilter === ExpirationAnalyticsFilterType.AllDates,
    },
    {
      title: t(`${intlKey}.InfoBoxTitles.OneHundredEightyToExpiryDateCount`),
      count: getCountsResponse?.data?.oneHundredEightyToExpiryDateCount,
      iconName: 'fal fa-calendar-exclamation',
      onClick: () => setActiveFilter(ExpirationAnalyticsFilterType.OneHundredEightyToExpiryDateCount),
      isFilterApplied: activeFilter === ExpirationAnalyticsFilterType.OneHundredEightyToExpiryDateCount,
    },
    {
      title: t(`${intlKey}.InfoBoxTitles.NinetyToExpiryDateCount`),
      count: getCountsResponse?.data?.ninetyToExpiryDateCount,
      iconName: 'fal fa-calendar-exclamation',
      onClick: () => setActiveFilter(ExpirationAnalyticsFilterType.NinetyToExpiryDateCount),
      isFilterApplied: activeFilter === ExpirationAnalyticsFilterType.NinetyToExpiryDateCount,
    },
    {
      title: t(`${intlKey}.InfoBoxTitles.ThirtyToExpiryDateCount`),
      count: getCountsResponse?.data?.thirtyToExpiryDateCount,
      iconName: 'fal fa-calendar-exclamation',
      onClick: () => setActiveFilter(ExpirationAnalyticsFilterType.ThirtyToExpiryDateCount),
      isFilterApplied: activeFilter === ExpirationAnalyticsFilterType.ThirtyToExpiryDateCount,
    },
    {
      title: t(`${intlKey}.InfoBoxTitles.SevenToExpiryDateCount`),
      count: getCountsResponse?.data?.sevenToExpiryDateCount,
      iconName: 'fal fa-calendar-exclamation',
      onClick: () => setActiveFilter(ExpirationAnalyticsFilterType.SevenToExpiryDateCount),
      isFilterApplied: activeFilter === ExpirationAnalyticsFilterType.SevenToExpiryDateCount,
    },
    {
      title: t(`${intlKey}.InfoBoxTitles.DateExpiredCount`),
      count: getCountsResponse?.data?.dateExpiredCount,
      iconName: 'fal fa-calendar-exclamation',
      onClick: () => setActiveFilter(ExpirationAnalyticsFilterType.DateExpiredCount),
      isFilterApplied: activeFilter === ExpirationAnalyticsFilterType.DateExpiredCount,
    },
  ];

  return (
    <Flex fontFamily="heading" pl={8}>
      {getCountsResponse?.isBusy
        ? Array.from({ length: 6 }).map((_, i) => {
            return <Skeleton width={185} height={95} style={{ margin: '16px 8px 8px 8px' }} key={i.toString()} />;
          })
        : filterBoxInfo.map((info, i) => <PredefinedFilterBox filterBoxInfo={info} key={i.toString()} />)}
    </Flex>
  );
};

export default PredefinedFilters;
