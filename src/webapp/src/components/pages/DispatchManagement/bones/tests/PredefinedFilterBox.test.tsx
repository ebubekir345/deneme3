import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PredefinedFilterBox, { PredefinedFilterBoxProps } from '../PredefinedFilterBox';
import { renderWithRedux } from '../../../../../utils/testUtils';

let props: PredefinedFilterBoxProps;
const mockBorder = `border: 1px solid #4a90e2`;

describe('PredefinedFilterBox', () => {
  beforeEach(() => {
    props = {
      filterBoxInfo: {
        title: 'Sevk Edilmemişler',
        count: 100,
        iconName: 'fal fa-shipping-timed',
        filter: jest.fn(),
        isFilterApplied: true,
        isClickable: true,
      },
    };
  });

  test('it receives the correct props and displays them correctly', () => {
    renderWithRedux(<PredefinedFilterBox {...props} />);
    expect(screen.getByText(100)).toBeInTheDocument();
    expect(screen.getByText(/Sevk Edilmemişler/)).toBeInTheDocument();
  });
  test('it doesnt call its action if isClickable is false', () => {
    props = { ...props, filterBoxInfo: { ...props.filterBoxInfo, isClickable: false } };
    renderWithRedux(<PredefinedFilterBox {...props} />);
    fireEvent.click(screen.getByTestId('filter-box'));
    expect(props.filterBoxInfo.filter).not.toHaveBeenCalled();
  });
  test('it does call its action if isClickable is true', () => {
    props = { ...props, filterBoxInfo: { ...props.filterBoxInfo } };
    renderWithRedux(<PredefinedFilterBox {...props} />);
    fireEvent.click(screen.getByTestId('filter-box'));
    expect(props.filterBoxInfo.filter).toHaveBeenCalled();
  });
  test('it shows a border if its filter is applied', () => {
    props = { ...props, filterBoxInfo: { ...props.filterBoxInfo, isClickable: false } };
    renderWithRedux(<PredefinedFilterBox {...props} />);
    expect(screen.getByTestId('filter-box')).toHaveStyle(mockBorder);
  });
});
