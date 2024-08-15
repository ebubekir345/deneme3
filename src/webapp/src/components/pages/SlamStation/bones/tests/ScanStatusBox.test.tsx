import React from 'react';
import { screen } from '@testing-library/react';
import ScanStatusBox from '../ScanStatusBox';
import '@testing-library/jest-dom';
import { StatusEnum } from '../BarcodeIcon';
import { renderWithRedux } from '../../../../../utils/testUtils';

let mockStatus;

describe('ScanStatusBox', () => {
  beforeEach(() => {
    mockStatus = StatusEnum.Loading;
  });
  test('it shows animation when status is loading', () => {
    renderWithRedux(<ScanStatusBox status={mockStatus} />);
    expect(screen.getByTestId('lottieAnimation')).toBeVisible();
  });

  test('it does not show animation when status is not loading', () => {
    renderWithRedux(<ScanStatusBox status={StatusEnum.Success} />);
    expect(screen.queryByTestId('lottieAnimation')).not.toBeInTheDocument();
  });
});
