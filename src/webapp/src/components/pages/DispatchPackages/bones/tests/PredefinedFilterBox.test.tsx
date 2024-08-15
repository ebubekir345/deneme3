import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PredefinedFilterBox, { PredefinedFilterBoxProps } from '../PredefinedFilterBox';
import { renderWithRedux } from '../../../../../utils/testUtils';

let props: PredefinedFilterBoxProps;
const mockBorder = `border: 1px solid`;
const mockBorderColor = `borderColor: text.link`;

describe('PredefinedFilterBox', () => {
  beforeEach(() => {
    props = {
      filterBoxInfo: {
        title: 'Sevk Edilmemişler',
        count: 100,
        iconName: 'fal fa-shipping-timed',
        filter: jest.fn(),
        isFilterApplied: true,
      },
    };
  });

  test('it receives the correct props and displays them correctly', () => {
    renderWithRedux(<PredefinedFilterBox {...props} />);
    expect(screen.getByText(100)).toBeInTheDocument();
    expect(screen.getByText(/Sevk Edilmemişler/)).toBeInTheDocument();
  });
  test('it shows a border if its filter is applied', () => {
    props = { ...props, filterBoxInfo: { ...props.filterBoxInfo} };
    renderWithRedux(<PredefinedFilterBox {...props} />);
    expect(screen.getByTestId('filter-box')).toHaveStyle(mockBorder);
  });
  test('it shows a border color if its filter is applied', () => {
    props = { ...props, filterBoxInfo: { ...props.filterBoxInfo} };
    renderWithRedux(<PredefinedFilterBox {...props} />);
    expect(screen.getByTestId('filter-box')).toHaveStyle(mockBorderColor);
  });
});
