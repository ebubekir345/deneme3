import { Flex, Text } from '@oplog/express';
import React from 'react';

interface IFilterButton {
  isSelected: boolean;
  isDisabled?: boolean;
  icon: React.ReactNode;
  title: string;
  count: number;
  onSelect: () => void;
}

const FilterButton: React.FC<IFilterButton> = ({ isSelected, isDisabled, icon, title, count, onSelect }) => {
  const isResourceBusy = isDisabled !== undefined ? isDisabled : false;
  return (
    <Flex
      onClick={() => !isResourceBusy && onSelect()}
      width={1}
      height={52}
      py={16}
      px={12}
      color="palette.hardBlue_darker"
      fontWeight={500}
      alignItems="center"
      justifyContent="space-between"
      bg={isSelected ? 'palette.white' : 'none'}
      borderRadius="lg"
      cursor="pointer"
      mb={4}
      data-testid="category-filter-button"
    >
      <Flex alignItems="center">
        <Flex justifyContent="center" alignItems="center" width={36} height={36}>
          {icon}
        </Flex>
        <Text pl={16} fontSize={16}>
          {title}
        </Text>
      </Flex>
      <Flex
        width={20}
        height={20}
        fontSize={12}
        justifyContent="center"
        alignItems="center"
        bg="palette.softGrey"
        borderRadius="sm"
      >
        {count}
      </Flex>
    </Flex>
  );
};

export default FilterButton;
