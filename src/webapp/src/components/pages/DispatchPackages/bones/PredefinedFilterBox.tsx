import { PredefinedFilter } from '@oplog/data-grid';
import { Flex, Icon, Text } from '@oplog/express';
import React from 'react';
export interface FilterBoxInfo {
  title: string;
  count: number | undefined;
  iconName: string;
  filter: any;
  isFilterApplied: boolean | undefined | PredefinedFilter;
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
      boxShadow="xlarge"
      onClick={!filterBoxInfo.isFilterApplied ? filterBoxInfo.filter : null}
      border={filterBoxInfo.isFilterApplied ? '1px solid' : null}
      borderColor="text.link"
      cursor="pointer"
      data-testid="filter-box"
    >
      <Text fontSize={10} color={filterBoxInfo.isFilterApplied ? 'text.link' : 'palette.grey'} lineHeight="sm" mb={18}>
        {filterBoxInfo.title}
      </Text>
      <Flex alignItems="flex-end">
        <Icon
          name={filterBoxInfo.iconName}
          fontSize={14}
          color={filterBoxInfo.isFilterApplied ? 'text.link' : 'palette.grey'}
          mr={16}
        />
        <Text fontSize={40} color="palette.grey_darker" fontWeight="300" lineHeight="0.75">
          {filterBoxInfo.count}
        </Text>
      </Flex>
    </Flex>
  );
};
export default PredefinedFilterBox;