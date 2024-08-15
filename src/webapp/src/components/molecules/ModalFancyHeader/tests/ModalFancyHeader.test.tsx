import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { create } from 'react-test-renderer';
import Skeleton from 'react-loading-skeleton';
import { ModalFancyHeader, IModalFancyHeader } from '../ModalFancyHeader';

let mockProps: IModalFancyHeader;

describe('ModalFancyHeader', () => {
  beforeEach(() => {
    mockProps = {
      title: 'Test-Trl-01',
      onClose: jest.fn(),
    };
  });

  test('it shows title as it expected', () => {
    render(<ModalFancyHeader {...mockProps} />);
    expect(screen.getByTestId('fancy-header-title').textContent).toBe('Test-Trl-01');
  });

  test('it calls onClose callback on close button click', () => {
    render(<ModalFancyHeader {...mockProps} />);
    fireEvent.click(screen.getByTestId('fancy-header-close-button'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('it displays contents obtained from props', () => {
    render(<ModalFancyHeader {...mockProps} />);
    expect(screen.queryByTestId('fancy-header-content')).toBeFalsy();
    mockProps = { ...mockProps, content: [<span>Test-1</span>, <div>Test-2</div>] };
    render(<ModalFancyHeader {...mockProps} />);
    expect(screen.queryAllByTestId('fancy-header-content').length).toBe(2);
    expect(screen.getAllByTestId('fancy-header-content')[0].textContent).toBe('Test-1');
    expect(screen.getAllByTestId('fancy-header-content')[1].textContent).toBe('Test-2');
  });

  test('it shows skelaton when is busy', () => {
    mockProps = { ...mockProps, isBusy: true };
    const component = create(<ModalFancyHeader {...mockProps} />);
    expect(component.root.findAllByType(Skeleton).length).toBe(5);
    expect(component.root.findAllByProps({ fontFamily: 'heading' })[0]).toBeFalsy();
    expect(component.root.findAllByProps({ color: 'palette.grey' })[0]).toBeFalsy();
    mockProps = { ...mockProps, isBusy: false, content: [<span>Test-1</span>, <div>Test-2</div>] };
    const component2 = create(<ModalFancyHeader {...mockProps} />);
    expect(component2.root.findAllByType(Skeleton).length).toBe(0);
    expect(component2.root.findAllByProps({ fontFamily: 'heading' })[0]).toBeTruthy();
    expect(component2.root.findAllByProps({ color: 'palette.grey' })[0]).toBeTruthy();
  });
});
