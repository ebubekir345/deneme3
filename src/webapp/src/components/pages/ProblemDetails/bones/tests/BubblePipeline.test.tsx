import React from 'react';
import { BubblePipeline, IBubblePipeline } from '../BubblePipeline';
import { create } from 'react-test-renderer';
import { Box, Flex, Icon } from '@oplog/express';

let props: IBubblePipeline;
let component;

describe('BubblePipeline', () => {
  beforeEach(() => {
    props = {
      content: [],
    };
  });

  it('displays nothing when no content passes', () => {
    component = create(<BubblePipeline {...props} />);
    expect(component.root.findAllByType(Icon)[0]).toBeFalsy();
    expect(component.root.findAllByType('span')[0]).toBeFalsy();
  });

  it('displays bubbles icon as expected with the provided content data ', () => {
    props = {
      content: [
        { isActive: true, iconName: 'fal fa-inbox-in', name: 'Problem Oluşturuldu', date: '03.12.2021 - 10:30' },
        { isActive: false, iconName: 'far fa-eye', name: 'İnceleme Bekliyor' },
      ],
    };
    component = create(<BubblePipeline {...props} />);
    expect(component.root.findAllByType(Flex)[3].props.bg).not.toBe('transparent');
    expect(component.root.findAllByType(Flex)[7].props.bg).toBe('transparent');
    expect(component.root.findAllByType(Flex)[3].props.border).toBe('unset');
    expect(component.root.findAllByType(Flex)[7].props.border).not.toBe('unset');
    expect(component.root.findAllByType(Flex)[3].props.borderColor).toBe('unset');
    expect(component.root.findAllByType(Flex)[7].props.borderColor).not.toBe('unset');
    expect(component.root.findAllByType(Flex)[3].props.color).toBe('palette.white');
    expect(component.root.findAllByType(Flex)[7].props.color).not.toBe('palette.white');

    expect(component.root.findAllByType(Icon)[0].props.name).toBe(props.content[0].iconName);
    expect(component.root.findAllByType(Icon)[1].props.name).toBe(props.content[1].iconName);
  });

  it('displays bubbles connected line as expected with the provided content data and hides on the last bubble ', () => {
    props = {
      content: [
        { isActive: true, iconName: 'fal fa-inbox-in', name: 'Problem Oluşturuldu', date: '03.12.2021 - 10:30' },
        { isActive: false, iconName: 'far fa-eye', name: 'İnceleme Bekliyor' },
      ],
    };
    component = create(<BubblePipeline {...props} />);
    expect(component.root.findAllByProps({ height: 2 }).length).toBe(2);
  });

  it('displays bubbles content texts as expected with the provided content data ', () => {
    props = {
      content: [
        { isActive: true, iconName: 'fal fa-inbox-in', name: 'Problem Oluşturuldu', date: '03.12.2021 - 10:30' },
        { isActive: false, iconName: 'far fa-eye', name: 'İnceleme Bekliyor' },
      ],
    };
    component = create(<BubblePipeline {...props} />);
    expect(component.root.findAllByType('span')[0].props.children).toEqual(props.content[0].name);
    expect(component.root.findAllByType('span')[1].props.children).toEqual(props.content[0].date);
    expect(component.root.findAllByType('span')[2].props.children).toEqual(props.content[1].name);
    expect(component.root.findAllByType('span')[3].props.children).toEqual('');
  });
});
