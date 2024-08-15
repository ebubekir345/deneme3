import React from 'react';
import { screen, render } from '@testing-library/react';
import DualProgressBar, { DualProgressBarProps } from '../DualProgressBar';
import '@testing-library/jest-dom';

let props: DualProgressBarProps;

describe('DualProgressBar', () => {
  beforeEach(() => {
    props = {
      innerBarCurrent: 20,
      outerBarCurrent: 10,
      total: 100,
      innerBarColor: '#ffffff',
      outerBarColor: 'grey',
      outerBarTitle: 'mockTitle1',
      innerBarTitle: 'mockTitle2',
      containerTitle: 'mockTitle3',
    };
  });

  test('it shows correct titles according to props', () => {
    render(<DualProgressBar {...props} />);
    expect(screen.getByText('mockTitle1')).toBeTruthy();
    expect(screen.getByText('mockTitle2')).toBeTruthy();
    expect(screen.getByText('mockTitle3')).toBeTruthy();
  });
  test('it shows correct percentages according to props', () => {
    render(<DualProgressBar {...props} />);
    expect(screen.getByText('%20')).toBeTruthy();
    expect(screen.getByText('%10')).toBeTruthy();
  });
  test('it shows full progress bar with the title "100%" if innerBarCurrent either innerBarCurrent or outerBarCurrent is greater than total', () => {
    props = {
      ...props,
      innerBarCurrent: 150,
      outerBarCurrent: 90,
    };
    render(<DualProgressBar {...props} />);
    expect(screen.getByText('%100')).toBeTruthy();
    expect(screen.queryByText('%150')).toBeFalsy();
  });
  test('it shows innerBarTitle and hide outerBarTitle if both of them is greater than total since outerBarCurrent cannot be greater than innerBarCurrent', () => {
    props = {
      ...props,
      innerBarCurrent: 150,
      outerBarCurrent: 140,
    };
    render(<DualProgressBar {...props} />);
    expect(screen.queryAllByText('%100')[0]).toBeTruthy();
    expect(screen.queryAllByText('%100')[1]).toBeFalsy();
  });
  test('it calculates the width of the bars correctly', () => {
    render(<DualProgressBar {...props} />);
    expect(screen.getByTestId('innerBar')).toHaveStyle({ width: '20%' });
    expect(screen.getByTestId('outerBar')).toHaveStyle({ width: '10%' });
  });
  test('it gives full width to bars if their current count is greater than total', () => {
    props = {
      ...props,
      innerBarCurrent: 150,
      outerBarCurrent: 140,
    };
    render(<DualProgressBar {...props} />);
    expect(screen.getByTestId('innerBar')).toHaveStyle({ width: '100%' });
    expect(screen.getByTestId('outerBar')).toHaveStyle({ width: '100%' });
  });
});
