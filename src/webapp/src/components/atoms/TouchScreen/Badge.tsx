import React, { ReactElement } from 'react';
import { Flex } from '@oplog/express';
import { FlexProps } from '@oplog/express/dist/components/Flex/Flex';

interface BadgeProps extends FlexProps {
  outlined: boolean;
  badgeColor: string;
}

const Badge: React.FC<BadgeProps> = ({ children, outlined, badgeColor, ...otherProps }): ReactElement => {
  return (
    <Flex
      borderRadius="4px"
      fontWeight="bold"
      mr={4}
      justifyContent="center"
      alignItems="center"
      flexShrink={0}
      border={outlined ? `solid 1px` : 'none'}
      borderColor={outlined ? badgeColor : 'unset'}
      color={outlined ? badgeColor : 'palette.white'}
      bg={outlined ? 'transparent' : badgeColor}
      {...otherProps}
    >
      <span>{children}</span>
    </Flex>
  );
};

export default Badge;
