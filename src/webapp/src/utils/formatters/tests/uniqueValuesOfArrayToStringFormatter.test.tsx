import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormatterProps } from '@oplog/data-grid';
import { uniqueValuesOfArrayToStringFormatter } from '../uniqueValuesOfArrayToStringFormatter';

let props: FormatterProps;

jest.mock('use-resize-observer', () => () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
  ref: { current: 'Ref' },
}));

describe('uniqueValuesOfArrayToStringFormatter', () => {
  beforeEach(() => {
    props = {
      value: ['mock1', 'mock1', 'mock2'],
      dependentValues: {},
    };
  });
  test('it filters unique values of given array and shows the correct string correctly', () => {
    render(uniqueValuesOfArrayToStringFormatter(props));
    expect(screen.getByText('mock1, mock2')).toBeTruthy();
  });
});
