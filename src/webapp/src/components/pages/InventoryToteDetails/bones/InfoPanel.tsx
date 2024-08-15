import { Ellipsis, Flex, Text } from '@oplog/express';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface IInfoRow {
  key: string;
  value?: string|number;
}

interface IInfoPanel {
  isBusy: boolean;
  rows: IInfoRow[][];
}

const InfoPanel: React.FC<IInfoPanel> = ({ rows, isBusy }) => {
  return (
    <Flex
      bg="palette.white"
      width={1}
      flexDirection="column"
      p={24}
      boxShadow="0 6px 10px 0 rgba(199, 200, 204, 0.15)"
      m={15}
    >
      {rows.map((row, i) => (
        <Flex key={i.toString()} mb={25}>
          {row.map((data, i) => (
            <Flex flexDirection="column" mr={5} key={data.key} width={300} minWidth={300}>
              {isBusy ? (
                <>
                  <Skeleton width="100%" style={{ marginBottom: '6px' }}></Skeleton>
                  <Skeleton width="100%"></Skeleton>
                </>
              ) : (
                <>
                  <Text fontSize={11} fontFamily="Lato" fontWeight={700} color="#b8b9c1" mb={6}>
                    {data.key}
                  </Text>

                  <Text fontSize={16} fontFamily="Montserrat" fontWeight={700} color="#707070" maxWidth={300}>
                    <Ellipsis hasTooltip>{data.value}</Ellipsis>
                  </Text>
                </>
              )}
            </Flex>
          ))}
        </Flex>
      ))}
    </Flex>
  );
};

export default InfoPanel;
