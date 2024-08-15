import { gridActions } from '@oplog/data-grid';
import {
  BooleanFilter,
  DateFilter,
  NumericFilter,
  Pagination,
  QueryBuilder,
  StringFilter,
} from 'dynamic-query-builder-client';

const filterTypeConstructor = filter => {
  const filterParams = {
    property: filter.property,
    op: filter.op,
    value: filter.value,
  };
  switch (filter.type) {
    case 'StringFilter':
      return new StringFilter(filterParams);
    case 'NumericFilter':
      return new NumericFilter(filterParams);
    case 'BooleanFilter':
      return new BooleanFilter(filterParams);
    case 'DateFilter':
      return new DateFilter(filterParams);
    default:
      return;
  }
};

export const filterApplier = (grid, dispatch, history, apiArg?) => {
  const filtersItem = localStorage.getItem('filters');
  if (filtersItem) {
    const filters = JSON.parse(filtersItem);
    const builder = new QueryBuilder({
      filters: filters.map(filter => filterTypeConstructor(filter)),
    });

    dispatch(gridActions.gridFiltersSubmitted(grid, builder.filters, []));
    dispatch(gridActions.gridPaginationChanged(grid, new Pagination({ offset: 0, count: 25 })));
    dispatch(gridActions.gridFetchRequested(grid, [...(apiArg ? [apiArg] : []), builder.build()], history));
    localStorage.removeItem('filters');
  }
};
