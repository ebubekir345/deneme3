import { Flex } from '@oplog/express';
import React from 'react';
import { Chrono } from 'react-chrono';
import { TimelineItemModel } from 'react-chrono/dist/models/TimelineItemModel';
import { TimelineMode } from 'react-chrono/dist/models/TimelineModel';

export interface ITimeline {
  items: any;
  mode?: TimelineMode;
  height?: number;
  scrollable?: boolean;
  cardHeight?: number;
}

const TimeLine: React.FC<ITimeline> = ({ items, mode, height, scrollable, cardHeight }) => {
  const TimeLineItems: TimelineItemModel[] = items;

  return (
    <Flex height={height ? height : 400}>
      <Chrono
        items={TimeLineItems}
        mode={mode ? mode : 'VERTICAL'}
        cardHeight={cardHeight ? cardHeight : 50}
        scrollable={scrollable ? scrollable : true}
        theme={{
          primary: '#2f80ed',
          secondary: '#fafafa',
          cardBgColor: '#ededf1',
          cardForeColor: '#5c5f68',
        }}
        useReadMore={false}
      />
    </Flex>
  );
};

export default TimeLine;
