import React from 'react';
import { create } from 'react-test-renderer';
import { Button, Flex, Icon } from '@oplog/express';
import { ToteBox, IToteBox } from '../ToteBox';
import '@testing-library/jest-dom';
import { urls } from '../../../../../routers/urls';

let mockProps: IToteBox;
let mockHistory: any;
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useHistory: () => mockHistory,
}));

describe('ToteBox', () => {
  beforeEach(() => {
    mockProps = {
      title: 'Test-Tote-01',
    };
    mockHistory = {
      push: jest.fn(),
    };
  });

  test('it shows empty box with title only when there is no orderId attached', () => {
    const component = create(<ToteBox {...mockProps} />);
    expect(component.root.findAllByType('span')[0].children).toEqual(['Test-Tote-01']);
    expect(component.root.findAllByType('span')[1].children).toEqual(['-']);
    expect(component.root.findByType('button').children).toEqual(['-']);
    expect(component.root.findByType(Button).props.color).toEqual('text.body');
    expect(component.root.findAllByType(Flex)[6].props.bg).toEqual('palette.snow_light');
    component.root.findByType(Button).props.onClick();
    expect(mockHistory.push).not.toHaveBeenCalled();
  });

  test('it shows box with completed state when current and total equals', () => {
    mockProps = { ...mockProps, current: 5, total: 5, orderId: 'test-id', orderName: 'test-name' };
    const component = create(<ToteBox {...mockProps} />);
    expect(component.root.findAllByType('span')[0].children).toEqual(['Test-Tote-01']);
    expect(component.root.findAllByType('span')[1].children).toEqual(['5/5']);
    expect(component.root.findByType('button').children).toEqual(['test-name']);
    expect(component.root.findByType(Button).props.color).toEqual('text.link');
    expect(component.root.findAllByType(Flex)[6].props.bg).toEqual('palette.green');
    component.root.findByType(Button).props.onClick();
    expect(mockHistory.push).toHaveBeenCalledWith(urls.orderDetails.replace(':id', encodeURI('test-id')));
    expect(component.root.findByType(Icon).props.name).toEqual('far fa-check');
  });

  test('it shows box with picking state when current and total not equal and current is not 0', () => {
    mockProps = { ...mockProps, current: 3, total: 5, orderId: 'test-id', orderName: 'test-name' };
    const component = create(<ToteBox {...mockProps} />);
    expect(component.root.findAllByType('span')[0].children).toEqual(['Test-Tote-01']);
    expect(component.root.findAllByType('span')[1].children).toEqual(['3/5']);
    expect(component.root.findByType('button').children).toEqual(['test-name']);
    expect(component.root.findByType(Button).props.color).toEqual('text.link');
    expect(component.root.findAllByType(Flex)[6].props.bg).toEqual('palette.blue');
    component.root.findByType(Button).props.onClick();
    expect(mockHistory.push).toHaveBeenCalledWith(urls.orderDetails.replace(':id', encodeURI('test-id')));
    expect(component.root.findAllByType('span')[2].children).toEqual(['%', '60']);
  });

  test('it shows box with picking state when current and total not equal and current is 0', () => {
    mockProps = { ...mockProps, current: 0, total: 5, orderId: 'test-id', orderName: 'test-name' };
    const component = create(<ToteBox {...mockProps} />);
    expect(component.root.findAllByType('span')[0].children).toEqual(['Test-Tote-01']);
    expect(component.root.findAllByType('span')[1].children).toEqual(['0/5']);
    expect(component.root.findByType('button').children).toEqual(['test-name']);
    expect(component.root.findByType(Button).props.color).toEqual('text.link');
    expect(component.root.findAllByType(Flex)[6].props.bg).toEqual('palette.grey_lighter');
    component.root.findByType(Button).props.onClick();
    expect(mockHistory.push).toHaveBeenCalledWith(urls.orderDetails.replace(':id', encodeURI('test-id')));
    expect(component.root.findAllByType('span')[2].children).toEqual(['%0']);
  });

  test('it shows box with orderDetails link is unlinked when isLinked is false', () => {
    mockProps = { ...mockProps, current: 0, total: 5, orderId: 'test-id', orderName: 'test-name', isLinked: false };
    const component = create(<ToteBox {...mockProps} />);
    expect(component.root.findAllByType('span')[0].children).toEqual(['Test-Tote-01']);
    expect(component.root.findAllByType('span')[1].children).toEqual(['0/5']);
    expect(component.root.findByType('button').children).toEqual(['test-name']);
    expect(component.root.findByType(Button).props.color).toEqual('text.body');
    expect(component.root.findAllByType(Flex)[6].props.bg).toEqual('palette.grey_lighter');
    component.root.findByType(Button).props.onClick();
    expect(mockHistory.push).not.toHaveBeenCalled();
    expect(component.root.findAllByType('span')[2].children).toEqual(['%0']);
  });
});
