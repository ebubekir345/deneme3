import { Box, BoxProps } from '@oplog/express';
import React, { forwardRef } from 'react';

export interface GridProps extends BoxProps {
  children?: React.ReactNode;
  className?: string;
  ref?: any;
}

const Grid: React.FC<GridProps> = forwardRef(({ ...otherProps }, ref) => {
  const { children } = otherProps;
  return (
    <Box display="grid" ref={ref} {...otherProps}>
      {children}
    </Box>
  );
});

export default Grid;
