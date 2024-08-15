import React from 'react';
import { screen, render } from '@testing-library/react';
import ProgressBar, { ProgressBarProps } from '../ProgressBar';
import '@testing-library/jest-dom';

let props: ProgressBarProps;

describe('ProgressBar', () => {
  beforeEach(() => {
    props = {
      current: 50,
      total: 100,
      barColor: 'blue',
      containerColor: 'black',
      completeColor: 'green',
      label: true,
      height: '10px',
      borderRadius: '15px',
      withPercentage: true,
      labelSize: '16px',
      containerProps: {},
    };
  });

  test('it calculates the given numbers correctly and shows correct percentages if labelProp and withPercentageProp is true', () => {
    render(<ProgressBar {...props} />);
    expect(screen.getByText('%50')).toBeTruthy();
  });
  test('it shows current number and total number with a slash between them if withPercentageProps is false ', () => {
    props = { ...props, withPercentage: false };
    render(<ProgressBar {...props} />);
    expect(screen.getByText('50 / 100')).toBeTruthy();
  });
  test('it does not show any label if labelProps is false', () => {
    props = { ...props, label: false };
    render(<ProgressBar {...props} />);
    expect(screen.queryByText('%50')).toBeFalsy();
  });
  test('it calculates the width of the current number bar correctly', () => {
    render(<ProgressBar {...props} />);
    expect(screen.getByTestId('progressBar')).toHaveStyle({ width: '50%' });
  });
  test('it shows the correct colors for container and bar', () => {
    render(<ProgressBar {...props} />);
    expect(screen.getByTestId('progressBar')).toHaveStyle({ background: 'blue' });
    expect(screen.getByTestId('progressContainer')).toHaveStyle({ background: 'black' });
  });
  test('it shows the correct color for bar if current number is equal to total number', () => {
    props = { ...props, current: 100 };
    render(<ProgressBar {...props} />);
    expect(screen.getByTestId('progressBar')).toHaveStyle({ background: 'green' });
  });
});
