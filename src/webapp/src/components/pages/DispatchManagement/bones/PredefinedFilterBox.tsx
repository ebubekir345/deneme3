import { PredefinedFilter } from '@oplog/data-grid';
import { Flex, Icon, Text } from '@oplog/express';
import React from 'react';

interface FilterBoxInfo {
  title: string;
  count: number | undefined;
  iconName: string;
  filter: any;
  isFilterApplied: boolean | undefined | PredefinedFilter;
  isClickable: boolean | undefined;
}

export interface PredefinedFilterBoxProps {
  filterBoxInfo: FilterBoxInfo;
}

const PredefinedFilterBox: React.FC<PredefinedFilterBoxProps> = ({ filterBoxInfo }) => {
  return (
    <Flex
      width={185}
      height={95}
      p={16}
      pr={0}
      flexDirection="column"
      mx={8}
      my={16}
      backgroundColor="palette.white"
      borderRadius={10}
      boxShadow="2px 6px 5px rgba(88, 88, 88, 0.1)"
      onClick={filterBoxInfo.isClickable ? filterBoxInfo.filter : null}
      border={filterBoxInfo.isFilterApplied ? '1px solid #4a90e2' : null}
      cursor="pointer"
      data-testid="filter-box"
    >
      <Text fontSize={10} color={filterBoxInfo.isFilterApplied ? '#4a90e2' : '#9b9b9b'} lineHeight="sm" mb={18}>
        {filterBoxInfo.title}
      </Text>
      <Flex alignItems="flex-end">
        <Icon
          name={filterBoxInfo.iconName}
          fontSize={14}
          color={filterBoxInfo.isFilterApplied ? '#4a90e2' : '#9b9b9b'}
          mr={16}
        />
        <Text fontSize={40} color="#4a4a4a" fontWeight="300" lineHeight="0.75">
          {filterBoxInfo.count}
        </Text>
      </Flex>
    </Flex>
  );
};

export default PredefinedFilterBox;
