import { Flex, Text } from '@oplog/express';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface IFirstRow {
  title: string;
  key?: number | string;
}

interface ISecondRow {
  title: string;
  key?: number | string;
  color?: string;
}

interface IInfoPanel {
  isBusy: boolean;
  firstRow: IFirstRow[];
  secondRow: ISecondRow[];
}

const InfoPanel: React.FC<IInfoPanel> = ({ firstRow, secondRow, isBusy }) => {
  return (
    <Flex
      bg="palette.white"
      height={150}
      flexDirection="column"
      p={24}
      boxShadow="0 6px 10px 0 rgba(199, 200, 204, 0.15)"
      m={15}
    >
      <Flex mb={25}>
        {firstRow.map((data, i) => {
          return (
            <Flex flexDirection="column" mr={100} key={i.toString()} width={300} minWidth={300}>
              {isBusy ? (
                <>
                  <Skeleton width="100%" style={{ marginBottom: '6px' }}></Skeleton>
                  <Skeleton width="100%"></Skeleton>
                </>
              ) : (
                <>
                  <Text fontSize={11} fontFamily="Lato" fontWeight={700} color="#b8b9c1" mb={6}>
                    {data.title}
                  </Text>
                  <Text
                    fontSize={16}
                    fontFamily="Montserrat"
                    fontWeight={700}
                    color="#707070"
                    textOverflow="ellipsis"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    maxWidth={300}
                  >
                    {data.key}
                  </Text>
                </>
              )}
            </Flex>
          );
        })}
      </Flex>
      <Flex>
        {secondRow.map((data, i) => {
          return (
            <Flex flexDirection="column" mr={100} key={i.toString()} width={300} minWidth={300}>
              {isBusy ? (
                <>
                  <Skeleton width="100%" style={{ marginBottom: '6px' }}></Skeleton>
                  <Skeleton width="100%"></Skeleton>
                </>
              ) : (
                <>
                  <Text fontSize={11} fontFamily="Lato" fontWeight={700} color="#b8b9c1" mb={6}>
                    {data.title}
                  </Text>
                  <Text
                    fontSize={16}
                    fontFamily="Montserrat"
                    fontWeight={700}
                    color={data?.color ? data.color : '#707070'}
                  >
                    {data.key}
                  </Text>
                </>
              )}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default InfoPanel;
