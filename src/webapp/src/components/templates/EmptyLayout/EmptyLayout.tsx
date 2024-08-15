import * as React from 'react';
import { Box } from '@oplog/express';

export interface EmptyLayoutProps {
  children: React.ReactNode;
}

const EmptyLayout: React.FC<EmptyLayoutProps> = ({ children }) => <Box>{children}</Box>;

export default EmptyLayout;
