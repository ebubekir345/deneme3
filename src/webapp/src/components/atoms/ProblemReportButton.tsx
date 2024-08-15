import { Button, Icon } from '@oplog/express';
import React from 'react';

interface IProblemReportButton {
  handleClick: Function;
  isDisabled: boolean;
}

export const ProblemReportButton: React.FC<IProblemReportButton> = ({ handleClick, isDisabled }) => {
  return (
    <Button
      position="absolute"
      onClick={() => {
        handleClick();
      }}
      height={32}
      width={32}
      backgroundColor={'palette.orange_dark'}
      disabled={isDisabled}
      variant="warning"
      borderRadius={50}
      border="none"
      zIndex={100}
    >
      <Icon name="fas fa-exclamation" fontSize={18} color="white" />
    </Button>
  );
};
