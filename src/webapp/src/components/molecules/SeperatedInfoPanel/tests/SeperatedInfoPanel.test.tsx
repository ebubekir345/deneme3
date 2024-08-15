import React from 'react';
import { create } from 'react-test-renderer';
import { Ellipsis, Flex, Icon, Panel, Text } from '@oplog/express';
import SeperatedInfoPanel from '../SeperatedInfoPanel';
import Skeleton from 'react-loading-skeleton';

let mockProps;

jest.mock('use-resize-observer', () => () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
  ref: { current: 'Ref' },
}));

describe('SeperatedInfoPanel', () => {
  beforeEach(() => {
    mockProps = { panelProps: { title: 'Test-Title' }, divisions: [] };
  });

  it('passes panel props correctly', () => {
    const component = create(<SeperatedInfoPanel {...mockProps} />);
    const instance = component.root;
    expect(instance.findByType(Panel).props.title).toBe(mockProps.panelProps.title);
  });

  it('displays loading skelatons with selected amount when isLoading and hides contents', () => {
    mockProps.isLoading = true;
    const component = create(<SeperatedInfoPanel {...mockProps} />);
    const instance = component.root;
    expect(instance.findAllByType(Skeleton).length).toBe(4);
    mockProps.loadingItems = 4;
    const component2 = create(<SeperatedInfoPanel {...mockProps} />);
    const instance2 = component2.root;
    expect(instance2.findAllByType(Skeleton).length).toBe(8);

    expect(instance2.findAllByType(Icon)[0]).toBeFalsy();
  });

  it('maps divisions successfully', () => {
    mockProps.divisions = [
      {
        icon: 'fal fa-tag',
        fields: [
          {
            title: 'Test-1',
            value: 'Test-1-value',
          },
        ],
      },
      {
        icon: 'fal fa-box-open',
        fields: [
          {
            title: 'Test-2',
            value: 'Test-2-value',
          },
          {
            title: 'Test-3',
            value: 'Test-3-value',
          },
        ],
      },
    ];
    const component = create(<SeperatedInfoPanel {...mockProps} />);
    const instance = component.root;
    expect(instance.findAllByType(Icon).length).toBe(2);
    expect(instance.findAllByType(Icon)[0].props.name).toBe(mockProps.divisions[0].icon);
  });

  it('maps fields inside divisions successfully', () => {
    mockProps.divisions = [
      {
        icon: 'fal fa-tag',
        fields: [
          {
            title: 'Test-1',
            value: 'Test-1-value',
          },
        ],
      },
      {
        icon: 'fal fa-box-open',
        fields: [
          {
            title: 'Test-2',
            value: 'Test-2-value',
          },
          {
            title: 'Test-3',
            value: 'Test-3-value',
          },
        ],
      },
    ];
    const component = create(<SeperatedInfoPanel {...mockProps} />);
    const instance = component.root;
    expect(instance.findAllByType(Text).length).toBe(6);
    expect(instance.findAllByType(Text)[0].props.children).toEqual(mockProps.divisions[0].fields[0].title);
    expect(instance.findAllByType(Ellipsis)[0].props.children).toEqual(mockProps.divisions[0].fields[0].value);
    expect(instance.findAllByType(Text)[2].props.children).toEqual(mockProps.divisions[1].fields[0].title);
    expect(instance.findAllByType(Ellipsis)[1].props.children).toEqual(mockProps.divisions[1].fields[0].value);
  });
});
