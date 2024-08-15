import { Flex, Icon, Text } from '@oplog/express';
import React from 'react';
import DualProgressBar from '../DualProgressBar';

export interface IAnalyticsDisplayBoxProps {
  boxContent: IBoxContent[];
  boxWidth?: number;
}

export interface IBoxContent {
  type: string;
  title: string;
  count?: number | string;
  iconName?: string;
  tableCapacity?: number;
  totalTable?: number;
  innerProgressBarCurrent?: number;
  outerProgressBarCurrent?: number;
  innerBarTitle?: string;
  outerBarTitle?: string;
  containerTitle?: string;
  onClick?: Function;
}

export enum BoxTypes {
  CountInfoBox = 'countInfoBox',
  DualProgressBox = 'dualProgressBox',
}

const AnalyticsDisplayBox: React.FC<IAnalyticsDisplayBoxProps> = ({ boxContent, boxWidth }) => {
  return (
    <Flex fontFamily="heading" pl={8}>
      {boxContent?.map((info, i) => {
        return (
          <Flex
            width={boxWidth ? boxWidth : info.type === BoxTypes.CountInfoBox ? 220 : 300}
            height={95}
            p={16}
            pr={0}
            flexDirection="column"
            mx={8}
            my={16}
            backgroundColor="palette.white"
            borderRadius={10}
            boxShadow="2px 6px 5px rgba(88, 88, 88, 0.1)"
            key={i.toString()}
            justifyContent="space-between"
            onClick={info.onClick ? info.onClick : ()=>{}}
          >
            <Text fontSize={10} color="#9b9b9b" lineHeight="sm" mb={18}>
              {info.title}
            </Text>
            <Flex alignItems="flex-end">
              <Icon name={info.iconName} fontSize={14} color="#9b9b9b" mr={16} />
              {info.type === BoxTypes.CountInfoBox ? (
                <Text fontSize={40} color="#4a4a4a" fontWeight="300" lineHeight="0.75">
                  {info.count}
                </Text>
              ) : (
                <DualProgressBar
                  innerBarCurrent={info.innerProgressBarCurrent as number}
                  outerBarCurrent={info.outerProgressBarCurrent as number}
                  total={(info.tableCapacity as number) * (info.totalTable as number)}
                  innerBarTitle={info.innerBarTitle as string}
                  outerBarTitle={info.outerBarTitle as string}
                  containerTitle={info.containerTitle as string}
                  containerProps={{ width: '236px', height: '10px', borderRadius: '10px', bg: '#e8e8e8' }}
                />
              )}
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default AnalyticsDisplayBox;
