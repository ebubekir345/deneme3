import { Flex, PseudoBox } from '@oplog/express';
import React from 'react';

export interface IQuickFilterBar {
  filterButtons: { key: string; title: string; isSelected: boolean; onClick: () => void }[];
}

const QuickFilterBar: React.FC<IQuickFilterBar> = ({ filterButtons }) => (
  <Flex gutter={8} p={11} mb={16} bg="palette.white" flexWrap="wrap">
    {filterButtons.map(button => (
      <PseudoBox
        as="button"
        key={button.key}
        onClick={e => {
          e.preventDefault();
          button.onClick();
        }}
        height={32}
        borderRadius="18px"
        fontSize="13px"
        fontWeight={button.isSelected ? 'bold' : 'normal'}
        padding="8px 15px"
        kind={button.isSelected ? 'solid' : 'outline'}
        color={button.isSelected ? 'palette.white' : 'text.input'}
        bg={button.isSelected ? 'palette.teal' : 'palette.white'}
        border="solid 1px"
        borderColor={button.isSelected ? 'palette.teal' : 'palette.snow_dark'}
        flexShrink={0}
        transition="all 0.25s"
        marginY="5px"
        _focus={{ outline: 'none' }}
      >
        {button.title}
      </PseudoBox>
    ))}
  </Flex>
);

export default QuickFilterBar;
