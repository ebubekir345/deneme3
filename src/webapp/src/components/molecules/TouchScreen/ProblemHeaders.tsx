import { Box, Flex, Image, Text } from '@oplog/express';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

export interface IProblemsHeader {
  title: string;
  titleImageUrl: string;
  content?: JSX.Element[];
  isBusy?: boolean;
}

export const ProblemsHeader: React.FC<IProblemsHeader> = ({ title, titleImageUrl, content, isBusy }) => {
  return (
    <Flex width={1} alignItems="center" bg="palette.white" my={24}>
      <Flex alignItems="center" flexShrink={0}>
        {isBusy ? (
          <Skeleton height={28} width={200} />
        ) : (
          <Flex alignItems="center">
            <Image mr={16} width={28} height={28} src={titleImageUrl} />
            <Text fontSize={24} fontWeight={500} letterSpacing="negativeLarge" color="palette.grey_darker">
              {title}
            </Text>
          </Flex>
        )}
        {!isBusy &&
          content &&
          content.map((item, i) => (
            <Box
              key={i.toString()}
              ml={16}
              pl={16}
              height={18}
              borderLeft="xs"
              borderColor="palette.snow_light"
              color="palette.grey"
            >
              {item}
            </Box>
          ))}
        {isBusy && [...Array(4)].map(each => <Skeleton height={18} width={100} style={{ marginLeft: '16px' }} />)}
      </Flex>
    </Flex>
  );
};

export default ProblemsHeader;
