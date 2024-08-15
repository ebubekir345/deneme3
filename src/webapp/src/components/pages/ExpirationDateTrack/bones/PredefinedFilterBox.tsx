import { PredefinedFilter } from '@oplog/data-grid';
import { Flex, Icon, Text } from '@oplog/express';
import React from 'react';
export interface FilterBoxInfo {
  title: string;
  count: number | undefined;
  iconName: string;
  onClick: () => void;
  isFilterApplied: boolean | undefined | PredefinedFilter;
}
export interface PredefinedFilterBoxProps {
  filterBoxInfo: FilterBoxInfo;
}
const PredefinedFilterBox: React.FC<PredefinedFilterBoxProps> = ({ filterBoxInfo }) => {
  return (
    <Flex
      width={300}
      height={95}
      p={16}
      pr={0}
      flexDirection="column"
      mx={8}
      mt={16}
      mb={32}
      backgroundColor="palette.white"
      borderRadius={10}
      boxShadow="2px 6px 5px rgba(88, 88, 88, 0.1)"
      justifyContent="space-between"
      onClick={!filterBoxInfo.isFilterApplied ? filterBoxInfo.onClick : null as any}
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
          fontSize={14}
          mr={16}
          name={filterBoxInfo.iconName}
          color={filterBoxInfo.isFilterApplied ? 'text.link' : 'palette.grey'}
        />
        <Text fontSize={40} color="palette.grey_darker" fontWeight="300" lineHeight="0.75">
          {filterBoxInfo.count}
        </Text>
      </Flex>
    </Flex>
  );
};
export default PredefinedFilterBox;
