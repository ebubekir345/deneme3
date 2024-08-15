import React, { ReactElement } from 'react';
import { Box } from '@oplog/express';

interface LongPressWrapperProps {
  onLongPress: () => void;
}

const LongPressWrapper: React.FC<LongPressWrapperProps> = ({ children, onLongPress }): ReactElement => {
  let buttonPressTimer;
  const handleButtonPress = () => {
    buttonPressTimer = setTimeout(() => onLongPress(), 400);
  };
  const handleButtonRelease = () => {
    clearTimeout(buttonPressTimer);
  };

  return (
    <Box
      onTouchStart={handleButtonPress}
      onTouchEnd={handleButtonRelease}
      onMouseDown={handleButtonPress}
      onMouseUp={handleButtonRelease}
      onMouseLeave={handleButtonRelease}
    >
      {children}
    </Box>
  );
};

export default LongPressWrapper;
