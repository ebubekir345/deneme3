import { Box } from '@oplog/express';
import React from 'react';

interface IBlurOverlay {
  isOpen: boolean;
}

const BlurOverlay: React.FC<IBlurOverlay> = ({ children, isOpen }) => {
  return (
    <Box
      style={{
        filter: isOpen && 'blur(6px)' as any,
      }}
    >
      {children}
    </Box>
  );
};

export default BlurOverlay;
