import React from 'react';
import { Flex, PseudoBox, Icon } from '@oplog/express';
import { PseudoBoxProps } from '@oplog/express/dist/components/PseudoBox/PseudoBox';

interface ActionButtonProps extends PseudoBoxProps {
  icon?: string;
  iconColor?: string;
  onClick?: () => void;
}

export type Ref = HTMLButtonElement;

const ActionButton = React.forwardRef<Ref, ActionButtonProps>(
  ({ children, icon, iconColor, onClick, ...pseudoBoxProps }, ref) => {
    return (
      <PseudoBox
        as="button"
        onClick={e => {
          e.stopPropagation();
          onClick && onClick();
        }}
        ref={ref}
        _focus={{ outline: 'none' }}
        data-testid={pseudoBoxProps.testId ? pseudoBoxProps.testId : undefined}
        {...pseudoBoxProps}
      >
        <Flex alignItems="center" justifyContent="center">
          {icon && <Icon name={icon} fontSize="19px" pr={children ? 9 : 0} color={iconColor} />}
          {children && <Flex>{children}</Flex>}
        </Flex>
      </PseudoBox>
    );
  }
);

export default ActionButton;
