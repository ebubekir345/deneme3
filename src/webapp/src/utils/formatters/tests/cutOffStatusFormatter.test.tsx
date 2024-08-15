import { create } from 'react-test-renderer';
import { Flex } from '@oplog/express';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { intl } from '../../testUtils';
import { cutOffStatusFormatter } from '../cutOffStatusFormatter';

let mockProps;
const intlKey = 'DispatchManagement';

describe('cutOffStatusFormatter', () => {
  beforeEach(() => {
    mockProps = { value: [], dependentValues: { isLate: true, isCutOff: false } };
  });

  test('it shows red background color if order dispatch status is late', () => {
    const component = create(cutOffStatusFormatter(mockProps, () => `${intlKey}.CutOffStatus.Late`, intlKey));
    expect(component.root.findByType(Flex).props.bg).toBe('palette.red');
  });
  test('it shows purple background color if order dispatch status is cutOff', () => {
    mockProps = { value: [], dependentValues: { isLate: false, isCutOff: true } };
    const component = create(cutOffStatusFormatter(mockProps, () => `${intlKey}.CutOffStatus.CutOff`, intlKey));
    expect(component.root.findByType(Flex).props.bg).toBe('palette.purple');
  });
  test('it shows correct text if order dispatch status is late', () => {
    render(cutOffStatusFormatter(mockProps, () => `${intlKey}.CutOffStatus.Late`, intlKey));
    expect(screen.getByText(`${intlKey}.CutOffStatus.Late`)).toBeInTheDocument();
  });
  test('it shows correct text if order dispatch status is cutOff', () => {
    mockProps = { value: [], dependentValues: { isLate: false, isCutOff: true } };
    render(cutOffStatusFormatter(mockProps, () => `${intlKey}.CutOffStatus.CutOff`, intlKey));
    expect(screen.getByText(`${intlKey}.CutOffStatus.CutOff`)).toBeInTheDocument();
  });
  test('it shows no text if order dispatch status is neither cutOff nor late', () => {
    mockProps = { value: [], dependentValues: { isLate: false, isCutOff: false } };
    render(cutOffStatusFormatter(mockProps, () => 'test', intlKey));
    expect(screen.queryByText(`${intlKey}.CutOffStatus.CutOff`)).not.toBeInTheDocument();
    expect(screen.queryByText(`${intlKey}.CutOffStatus.Late`)).not.toBeInTheDocument();
  });
});
