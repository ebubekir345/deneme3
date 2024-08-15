import { Box, Flex, Icon, Text } from '@oplog/express';
import React from 'react';

export interface IBubblePipeline {
  content: IBubblePipelineContent[];
}

export interface IBubblePipelineContent {
  isActive: boolean;
  iconName: string;
  name: string | JSX.Element;
  date?: string;
}

export const BubblePipeline: React.FC<IBubblePipeline> = ({ content }) => {
  return (
    <Flex>
      {content.map((status, i, contentArr) => (
        <Flex key={i.toString()} flexDirection="column" width={168}>
          <Flex alignItems="center">
            <Flex
              justifyContent="center"
              alignItems="center"
              borderRadius="full"
              bg={status.isActive ? 'palette.green_darker' : 'transparent'}
              width={48}
              height={48}
              border={status.isActive ? 'unset' : '2px solid'}
              borderColor={status.isActive ? 'unset' : 'palette.blue_lighter'}
              color={status.isActive ? 'palette.white' : 'palette.blue_lighter'}
              flexShrink={0}
            >
              <Icon name={status.iconName} fontSize={20} />
            </Flex>
            {contentArr.length - 1 !== i && <Box height={2} width={1} bg={status.isActive ? 'palette.green_darker' : 'palette.blue_lighter'} />}
          </Flex>
          <Flex
            flexDirection="column"
            justifyContent="flex-end"
            mt={8}
            height={52}
            fontSize="12"
            letterSpacing="negativeLarge"
            paddingRight={40}
          >
            <Text color="palette.hardBlue_darker">{status.name}</Text>
            <Text color="palette.blue_light">{status.isActive ? status.date : ''}</Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};

export default BubblePipeline;
