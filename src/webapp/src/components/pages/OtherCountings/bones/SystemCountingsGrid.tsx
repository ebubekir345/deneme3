import {
  ColumnSize,
  DataGridRow,
  dateTimeFormatter,
  FormatterProps,
  gridActions,
  gridSelectors,
  PredefinedFilter,
} from '@oplog/data-grid';
import { StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType } from '../../../../models';
import { AutomaticStockCountingState, StockCountingType } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import {
  coloredDifferenceFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
  SystemCountingListDetailsLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import QuickFilterBar from '../../../molecules/QuickFilterBar';

const intlKey = 'OtherCountings.SystemCountingsGrid';
const titleKey = 'OtherCountings.SystemCountingsGrid.Title';

const initialFilters = [
  ...Object.values(AutomaticStockCountingState).map(filter => ({
    filter: new StringFilter({
      property: 'state',
      op: StringFilterOperation.Equals,
      value: filter,
      id: filter,
    }),
    selected: false,
    visibility: false,
  })),
];

const CountingStatusFilters = {
  All: 'All',
  Completed: 'Completed',
  InProgress: 'InProgress',
  Created: 'Created',
};

const CountingListsGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeQuickFilters, setActiveQuickFilters] = useState([CountingStatusFilters.All]);

  const appliedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.SystemCountings, state.grid)
  );

  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.SystemCountings, state.grid)
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
    dispatch(gridActions.gridPaginationOffsetReset(GridType.SystemCountings));
    dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.SystemCountings, filters));
    dispatch(gridActions.gridFetchRequested(GridType.SystemCountings));
  };

  useEffect(() => {
    const appliedQuickFilters = appliedFilters
      .filter(filter => filter.filter.property === 'state' && filter.selected)
      .map(filter => filter.filter.id);

    setActiveQuickFilters(appliedQuickFilters.length ? appliedQuickFilters : [CountingStatusFilters.All]);
  }, [appliedFilters]);

  const systemCountingsGridColumns: Array<any> = [
    {
      name: geti18nName('CellLabel', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductSKU', t, intlKey),
      key: 'sku',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductName', t, intlKey),
      key: 'productName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
      formatter: ProductDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('OperationName', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ReferenceNumber', t, intlKey),
      key: 'stockCountingListReferenceNumber',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: SystemCountingListDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
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
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, AutomaticStockCountingState),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('TotalAmountBeforeCounting', t, intlKey),
      key: 'beforeCountingAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('TotalAmountAfterCounting', t, intlKey),
      key: 'afterCountingAmount',
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
    },
    {
      name: geti18nName('ProcessedByFullName', t, intlKey),
      key: 'operatorFullName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('CountedAt', t, intlKey),
      key: 'countedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : dateTimeFormatter(props)),
    },
  ];

  return (
    <>
      <QuickFilterBar filterButtons={quickFilterButtons} />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.SystemCountings}
        columns={systemCountingsGridColumns}
        predefinedFilters={initialFilters}
      />
    </>
  );
};

export default CountingListsGrid;
