import { Flex, FlexProps } from '@oplog/express';
import React from 'react';

interface IBadge {
  label: string;
  bg: string;
  styleProps?: FlexProps;
}

const Badge: React.FC<IBadge> = ({ label, bg, styleProps }) => {
  return (
    <Flex
      fontFamily="heading"
      fontWeight={500}
      height={18}
      fontSize={10}
      py={2}
      px={6}
      textTransform="none"
      borderRadius={5}
      bg={bg}
      width="fit-content"
      color="palette.white"
      {...styleProps}
    >
      {label}
    </Flex>
  );
};

export default Badge;
