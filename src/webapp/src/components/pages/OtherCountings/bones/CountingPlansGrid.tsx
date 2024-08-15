import {
  ColumnSize,
  DataGridRow,
  dateTimeFormatter,
  FormatterProps,
  gridActions,
  gridSelectors,
  PredefinedFilter,
} from '@oplog/data-grid';
import { PseudoBox, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { DateFilter, DateFilterOperation, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GridType, ResourceType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import { StockCountingPlanState, StockCountingType } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { coloredDifferenceFormatter, enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import QuickFilterBar from '../../../molecules/QuickFilterBar';

const intlKey = 'OtherCountings.CountingPlansGrid';
const titleKey = 'OtherCountings.CountingPlansGrid.Title';

const countingPlansGridPredefinedFilters: PredefinedFilter[] = [
  ...Object.values(StockCountingPlanState).map(filter => ({
    filter: new StringFilter({
      property: 'state',
      op: StringFilterOperation.Equals,
      value: filter,
      id: filter,
    }),
    selected: false,
    visibility: false,
  })),
  {
    filter: new DateFilter({
      property: 'priorityTimestamp',
      op: DateFilterOperation.LessThanOrEqual,
      dateFormat: 'YYYY-MM-DDTHH:mm',
      value: moment()
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm')
        .toString(),
      id: 'Prioritized',
    }),
    selected: false,
    visibility: false,
  },
];

const CountingStatusFilters = {
  All: 'All',
  Completed: 'Completed',
  InProgress: 'InProgress',
  WaitingForCounting: 'WaitingForCounting',
  Prioritized: 'Prioritized',
};

const CountingPlansGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeQuickFilters, setActiveQuickFilters] = useState([CountingStatusFilters.All]);
  const history = useHistory();

  const appliedPredefinedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.CountingPlans, state.grid)
  );
  const prioritizeStockCountingPlanResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PrioritizeStockCountingPlan]
  );
  const deprioritizeStockCountingPlanResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.DeprioritizeStockCountingPlan]
  );

  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.CountingPlans, state.grid)
  );

  const prioritize = (referenceNumber: number) => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.PrioritizeStockCountingPlan, {
        payload: {
          referenceNumber: referenceNumber,
        },
      })
    );
  };
  const deprioritize = (referenceNumber: number) => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.DeprioritizeStockCountingPlan, {
        payload: {
          referenceNumber: referenceNumber,
        },
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.PrioritizeStockCountingPlan));
      dispatch(resourceActions.resourceInit(ResourceType.DeprioritizeStockCountingPlan));
    };
  }, []);

  useEffect(() => {
    if (prioritizeStockCountingPlanResponse?.isSuccess || deprioritizeStockCountingPlanResponse?.isSuccess) {
      dispatch(gridActions.gridFetchRequested(GridType.CountingPlans));
    }
  }, [prioritizeStockCountingPlanResponse, deprioritizeStockCountingPlanResponse]);

  const quickFilterButtons = Object.keys(CountingStatusFilters).map(status => ({
    key: status,
    title: t(`${intlKey}.QuickFilters.${status}`),
    isSelected: activeQuickFilters.includes(status),
    onClick: () => {
      if (!isGridBusy) {
        const filters = appliedPredefinedFilters.map(filter => {
          return {
            ...filter,
            selected: filter.filter.id === status,
            visibility: filter.filter.id === status,
          };
        });
        filters.length && applyQuickFilter(filters);
        setActiveQuickFilters([status]);
      }
    },
  }));

  const applyQuickFilter = (filters: PredefinedFilter[]) => {
    dispatch(gridActions.gridPaginationOffsetReset(GridType.CountingPlans));
    dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.CountingPlans, filters));
    dispatch(gridActions.gridFetchRequested(GridType.CountingPlans));
  };

  React.useEffect(() => {
    const appliedQuickFilters = appliedPredefinedFilters
      .filter(
        filter =>
          (filter.filter.property === 'state' || filter.filter.property === 'priorityTimestamp') && filter.selected
      )
      .map(filter => filter.filter.id);

    setActiveQuickFilters(appliedQuickFilters.length ? appliedQuickFilters : [CountingStatusFilters.All]);
  }, [appliedPredefinedFilters]);

  const countingPlansGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      filterable: false,
      cellClass: 'index-column',
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('ReferenceNumber', t, intlKey),
      key: 'referenceNumber',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { id } = props.dependentValues;
        const { value } = props;
        return (
          <PseudoBox
            onClick={() =>
              history.push(
                urls.countingPlanDetails.replace(':referenceNumber', encodeURI(value)).replace(':id', encodeURI(id))
              )
            }
            color="text.link"
            width={1}
            _hover={{ cursor: 'pointer' }}
          >
            {value}
          </PseudoBox>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Name', t, intlKey),
      key: 'name',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, StockCountingPlanState),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('StockCountingType', t, intlKey),
      key: 'stockCountingType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, StockCountingType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('BeforeStockCountingTotalAmount', t, intlKey),
      key: 'beforeStockCountingTotalAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('AfterStockCountingTotalAmount', t, intlKey),
      key: 'afterStockCountingTotalAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('TotalDifferenceInAmount', t, intlKey),
      key: 'totalDifferenceInAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : coloredDifferenceFormatter(props)),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('CreatedByFullName', t, intlKey),
      key: 'createdByFullName',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('CreatedAt', t, intlKey),
      key: 'createdAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('PriorityTimestamp', t, intlKey),
      key: 'priorityTimestamp',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: false,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('Priority', t, intlKey),
      key: 'priorityTimestamp',
      type: 'moment',
      filterable: false,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        if (
          (dependentValues.state === StockCountingPlanState.Completed ||
            dependentValues.state === StockCountingPlanState.InProgress) &&
          dependentValues.priorityTimestamp === 'N/A'
        ) {
          return '-';
        } else if (
          (dependentValues.state === StockCountingPlanState.Completed ||
            dependentValues.state === StockCountingPlanState.InProgress) &&
          dependentValues.priorityTimestamp !== 'N/A'
        ) {
          return (
            <Text color="#8F90A6" fontWeight={700}>
              {t(`${intlKey}.Prioritized`)}
            </Text>
          );
        } else if (
          dependentValues.state === StockCountingPlanState.WaitingForCounting &&
          dependentValues.isEligibleForPrioritization
        ) {
          return (
            <PseudoBox
              onClick={() => prioritize(dependentValues.referenceNumber)}
              color="#0063F7"
              width={1}
              _hover={{ cursor: 'pointer' }}
            >
              {t(`${intlKey}.Prioritize`)}
            </PseudoBox>
          );
        } else if (
          dependentValues.state === StockCountingPlanState.WaitingForCounting &&
          dependentValues.priorityTimestamp !== 'N/A'
        ) {
          return (
            <PseudoBox
              onClick={() => deprioritize(dependentValues.referenceNumber)}
              width={1}
              _hover={{ cursor: 'pointer' }}
            >
              <Text color="#FF8800" fontWeight={700}>
                {t(`${intlKey}.Prioritized`)}
              </Text>
              <Text color="#8F90A6"> | {t(`${intlKey}.Revert`)}</Text>
            </PseudoBox>
          );
        } else {
          return '-';
        }
      },
    },
  ];

  return (
    <>
      <QuickFilterBar filterButtons={quickFilterButtons} />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.CountingPlans}
        columns={countingPlansGridColumns}
        predefinedFilters={countingPlansGridPredefinedFilters}
      />
    </>
  );
};

export default CountingPlansGrid;
