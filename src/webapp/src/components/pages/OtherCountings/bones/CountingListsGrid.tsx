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
import {
  BooleanFilter,
  BooleanFilterOperation,
  StringFilter,
  StringFilterOperation,
} from 'dynamic-query-builder-client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import { StockCountingListState, StockCountingType } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import {
  coloredDifferenceFormatter,
  CountingListDetailsLinkFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import QuickFilterBar from '../../../molecules/QuickFilterBar';

const intlKey = 'OtherCountings.CountingListsGrid';
const titleKey = 'OtherCountings.CountingListsGrid.Title';

const initialFilters = [
  ...Object.values(StockCountingListState).map(filter => ({
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
    filter: new BooleanFilter({
      property: 'isPrioritized',
      op: BooleanFilterOperation.Equals,
      value: true,
      id: 'Prioritized',
    }),
    selected: false,
    visibility: false,
  },
];

const CountingStatusFilters = {
  All: 'All',
  Completed: 'Completed',
  InProgres: 'InProgres',
  Created: 'Created',
  Prioritized: 'Prioritized',
};

const CountingListsGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeQuickFilters, setActiveQuickFilters] = useState([CountingStatusFilters.All]);
  const history = useHistory();

  const appliedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.CountingLists, state.grid)
  );

  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.CountingLists, state.grid)
  );

  const quickFilterButtons = Object.keys(CountingStatusFilters).map(status => ({
    key: status,
    title: t(`${intlKey}.QuickFilters.${status}`),
    isSelected: activeQuickFilters.includes(status),
    onClick: () => {
      if (!isGridBusy) {
        const filters = appliedFilters.map(filter => {
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
    dispatch(gridActions.gridPaginationOffsetReset(GridType.CountingLists));
    dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.CountingLists, filters));
    dispatch(gridActions.gridFetchRequested(GridType.CountingLists));
  };

  useEffect(() => {
    const appliedQuickFilters = appliedFilters
      .filter(
        filter => (filter.filter.property === 'state' || filter.filter.property === 'isPrioritized') && filter.selected
      )
      .map(filter => filter.filter.id);

    setActiveQuickFilters(appliedQuickFilters.length ? appliedQuickFilters : [CountingStatusFilters.All]);
  }, [appliedFilters]);

  const countingListsGridColumns: Array<any> = [
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
      formatter: CountingListDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, StockCountingListState),
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
      name: geti18nName('Source', t, intlKey),
      key: 'source',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) =>
        props.value === 'N/A' ? '-' : props.value === 'System' ? 'Sistem' : props.value,
    },
    {
      name: geti18nName('Zone', t, intlKey),
      key: 'zoneName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('StockCountingPlanReferenceNumber', t, intlKey),
      key: 'stockCountingPlanReferenceNumber',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { stockCountingPlanId } = props.dependentValues;
        const { value } = props;
        if (value !== 'N/A')
          return (
            <PseudoBox
              onClick={() =>
                history.push(
                  urls.countingPlanDetails.replace(':referenceNumber', encodeURI(value)).replace(':id', encodeURI(stockCountingPlanId))
                )
              }
              color="text.link"
              width={1}
              _hover={{ cursor: 'pointer' }}
            >
              {value}
            </PseudoBox>
          );
        return '-';
      },
      getRowMetaData: (row: DataGridRow) => row,
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
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? <Text>-</Text> : <Text>{props.value}</Text>),
    },
    {
      name: geti18nName('TotalDifferenceInAmount', t, intlKey),
      key: 'totalDifferenceInAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) =>
        props.value === 'N/A' ? <Text>-</Text> : coloredDifferenceFormatter(props),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('CreatedByFullName', t, intlKey),
      key: 'operatorFullName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? <Text>-</Text> : <Text>{props.value}</Text>),
    },
    {
      name: geti18nName('StartedAt', t, intlKey),
      key: 'startedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? <Text>-</Text> : dateTimeFormatter(props)),
    },
    {
      name: geti18nName('FinishedAt', t, intlKey),
      key: 'completedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? <Text>-</Text> : dateTimeFormatter(props)),
    },
    {
      name: geti18nName('PriorityStatus', t, intlKey),
      key: 'isPrioritized',
      type: 'boolean',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        if (!dependentValues.isPrioritized) {
          return '-';
        } else if (dependentValues.state === StockCountingListState.Completed && dependentValues.isPrioritized) {
          return <Text fontWeight={700}>{t(`${intlKey}.Prioritized`)}</Text>;
        } else {
          return (
            <Text color="palette.orange" fontWeight={700}>
              {t(`${intlKey}.Prioritized`)}
            </Text>
          );
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
        gridKey={GridType.CountingLists}
        columns={countingListsGridColumns}
        predefinedFilters={initialFilters}
      />
    </>
  );
};

export default CountingListsGrid;
