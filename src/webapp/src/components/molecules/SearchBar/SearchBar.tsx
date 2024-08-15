import { gridActions, gridSelectors, PredefinedFilter } from '@oplog/data-grid';
import { Icon, Input, InputGroup, InputLeftElement } from '@oplog/express';
import { Filter, Pagination, QueryBuilder, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GridType } from '../../../models';
import { StoreState } from '../../../store/initState';
import { actionBarcodes } from '../../../typings/globalStore/enums';

interface ISearchBar {
  grid: GridType;
  searchProperty: string;
  placeholder?: string;
  width?: any;
  getResultsOnChange?: boolean;
  minLength?: number;
  count?: number;
  apiArg?: any;
}

export const SearchBar: FC<ISearchBar> = ({
  grid,
  searchProperty,
  placeholder,
  width,
  getResultsOnChange = false,
  minLength = 1,
  count = 25,
  apiArg,
}) => {
  const [searchState, setSearchState] = useState<string>('');
  const dispatch = useDispatch();
  const history = useHistory();
  const appliedPredefinedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(grid, state.grid)
  );
  const appliedFilters: Filter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridAppliedFilters(grid, state.grid)
  );

  const handleEnter = () => {
    const builder = new QueryBuilder({
      filters: [
        new StringFilter({
          property: searchProperty,
          op: StringFilterOperation.Contains,
          value: searchState,
        }),
      ],
      pagination: new Pagination({ offset: 0, count: count }),
    });
    const query = builder.build();

    dispatch(gridActions.gridFiltersSubmitted(grid, builder.filters, appliedPredefinedFilters));
    dispatch(gridActions.gridPaginationOffsetReset(grid));
    dispatch(gridActions.gridFetchRequested(grid, [...(apiArg ? [apiArg] : []), query], history));
  };

  useEffect(() => {
    !appliedFilters.length && setSearchState('');
  }, [appliedFilters]);

  useEffect(() => {
    getResultsOnChange && searchState.length >= minLength && handleEnter();
  }, [searchState]);

  return (
    <InputGroup width={width ? width : 1 / 5} ml={16}>
      <InputLeftElement>
        <Icon name="fal fa-search" fontSize={16} mt={6} ml={4} />
      </InputLeftElement>
      <Input
        height={44}
        borderRadius="xl"
        onChange={e => setSearchState(e.target.value)}
        value={searchState}
        maxLength={50}
        placeholder={placeholder}
        data-testid="search-box"
        autoFocus
        onKeyDown={e => {
          if (e.key === actionBarcodes.Enter || e.keyCode === 13) searchState.trim() && handleEnter();
        }}
      />
    </InputGroup>
  );
};
