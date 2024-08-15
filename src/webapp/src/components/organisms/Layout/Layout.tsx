/* eslint-disable consistent-return */
/* eslint-disable dot-notation */
import React from 'react';
import ActionBar from '../ActionBar/ActionBar';
import { Drawer, Box, BoxProps } from '@oplog/express';
import SideBar from '../Sidebar/Sidebar';


export interface LayoutProps extends BoxProps {
  children: React.ReactNode;
}

export const LayoutContent: React.FC<BoxProps> = ({ children, ...otherProps }: BoxProps) => {
  return (
    <Box p="16px 22px" {...otherProps}>
      {children}
    </Box>
  );
};

LayoutContent.displayName = 'LayoutContent';

const Layout: React.FC<LayoutProps> = ({ children, ...otherProps }) => {
  let headerHeight: any = '0';
  let sidebarWidth: any = '0';
  let drawerWidth: any = '0';
  const newChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return;

    if (child.type === Drawer) {
      drawerWidth = child.props['width'] || '413px';
    }

    if (child.type === SideBar) {
      sidebarWidth = '66px';
    }

    if (child.type === ActionBar) {
      return React.cloneElement(child, { top: '6px' });
    }
    return React.cloneElement(child);
  });

  return (
    <Box pt={0} pl={sidebarWidth} pr={drawerWidth} overflowX="hidden" {...otherProps}>
      {newChildren}
    </Box>
  );
};

Layout.displayName = 'Layout';

export default Layout;
