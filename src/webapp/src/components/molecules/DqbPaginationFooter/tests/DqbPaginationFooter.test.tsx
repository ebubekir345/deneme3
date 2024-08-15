import React from 'react';
import { Pagination } from 'dynamic-query-builder-client';
import { PseudoBox, ThemeProvider } from '@oplog/express';
import { DqbPaginationFooter, fetchPageNumbers, IDqbPaginationFooter, range } from '../DqbPaginationFooter';
import { intl, locale } from '../../../../utils/testUtils';
import { mockStoreWithState } from '../../../../store/configure.mock';
import { initialState, StoreState } from '../../../../store/initState';
import { create } from 'react-test-renderer';
import theme from '../../../../theme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl-redux';

const createWithReduxIntl = (node: React.ReactNode, mockState?: Partial<StoreState>) => {
  let store = mockStoreWithState({ ...initialState, ...mockState });

  return create(
    <ThemeProvider customTheme={theme as any}>
      <Provider store={store}>
        <IntlProvider {...locale}>{node}</IntlProvider>
      </Provider>
    </ThemeProvider>
  );
};

let mockProps: IDqbPaginationFooter;

describe('DqbPaginationFooter', () => {
  beforeEach(() => {
    mockProps = {
      intl,
      footerPagination: {
        pageCount: 5,
        rowCount: 100,
        pagination: new Pagination({ count: 20, offset: 0 }),
      },
      handlePageNumberChange: jest.fn(),
    };
  });

  test('range function generate expected array', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(range(1, 8, 2)).toEqual([1, 3, 5, 7]);
    expect(range(4, 8, 1)).toEqual([4, 5, 6, 7, 8]);
  });

  test('fetchPageNumbers function generates pageNumber array as expected', () => {
    expect(fetchPageNumbers(10, 1, 1)).toEqual([1, 2, 3, 4, 5, 'RIGHT', 10]);
    expect(fetchPageNumbers(10, 1, 6)).toEqual([1, 'LEFT', 5, 6, 7, 'RIGHT', 10]);
    expect(fetchPageNumbers(12, 2, 6)).toEqual([1, 'LEFT', 4, 5, 6, 7, 8, 'RIGHT', 12]);
  });

  test('left button should be disabled when current page is 1', () => {
    const component = createWithReduxIntl(<DqbPaginationFooter {...mockProps} />);
    expect(component.root.findAllByType(PseudoBox)[1].props.disabled).toBe(true);
  });

  test('right button should be disabled when current page is the last', () => {
    mockProps = {
      ...mockProps,
      footerPagination: { ...mockProps.footerPagination, pagination: new Pagination({ count: 20, offset: 80 }) },
    };
    const component = createWithReduxIntl(<DqbPaginationFooter {...mockProps} />);
    expect(component.root.findAllByType(PseudoBox)[7].props.disabled).toBe(true);
  });

  test('it displays active page button with correct props', () => {
    const component = createWithReduxIntl(<DqbPaginationFooter {...mockProps} />);
    expect(component.root.findAllByType(PseudoBox)[2].props.bg).toBe('text.link');
    expect(component.root.findAllByType(PseudoBox)[2].props.color).toBe('palette.white');
    expect(component.root.findAllByType(PseudoBox)[2].props.border).toBe('0');
    expect(component.root.findAllByType(PseudoBox)[3].props.bg).toBe('transparent');
    expect(component.root.findAllByType(PseudoBox)[3].props.color).toBe('palette.grey');
    expect(component.root.findAllByType(PseudoBox)[3].props.border).toBe('xs');
  });

  test('it calls handlePageNumberChange callback with selected page number', () => {
    const component = createWithReduxIntl(<DqbPaginationFooter {...mockProps} />);
    component.root.findAllByType(PseudoBox)[3].props.onClick();
    expect(mockProps.handlePageNumberChange).toHaveBeenCalledWith(2);
    component.root.findAllByType(PseudoBox)[4].props.onClick();
    expect(mockProps.handlePageNumberChange).toHaveBeenCalledWith(3);
  });

  test('it calls handlePageNumberChange callback with back and next buttons', () => {
    const component = createWithReduxIntl(<DqbPaginationFooter {...mockProps} />);
    component.root.findAllByType(PseudoBox)[7].props.onClick();
    expect(mockProps.handlePageNumberChange).toHaveBeenCalledWith(2);
    mockProps = {
      ...mockProps,
      footerPagination: { ...mockProps.footerPagination, pagination: new Pagination({ count: 20, offset: 80 }) },
    };
    const component2 = createWithReduxIntl(<DqbPaginationFooter {...mockProps} />);
    component2.root.findAllByType(PseudoBox)[1].props.onClick();
    expect(mockProps.handlePageNumberChange).toHaveBeenCalledWith(4);
  });
});
