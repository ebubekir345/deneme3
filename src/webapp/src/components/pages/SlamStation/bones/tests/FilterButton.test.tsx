import React from 'react';
import { create } from 'react-test-renderer';
import { Flex } from '@oplog/express';
import FilterButton from '../FilterButton';

let mockProps;

describe('FilterButton', () => {
  beforeEach(() => {
    mockProps = { isSelected: false, icon: <></>, title: '', count: 5, onSelect: () => null, isDisabled: false };
  });

  it('calls onSelect prop on filter button click', () => {
    const onSelect = jest.fn();
    const component = create(<FilterButton {...mockProps} onSelect={onSelect} />);
    const instance = component.root;
    instance.findAllByType(Flex)[0].props.onClick();
    expect(onSelect).toHaveBeenCalled();
  });
  it('cannot calls onSelect prop on filter button click when isDisabled true', () => {
    mockProps.isDisabled = true;
    const onSelect = jest.fn();
    const component = create(<FilterButton {...mockProps} onSelect={onSelect} />);
    const instance = component.root;
    instance.findAllByType(Flex)[0].props.onClick();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
