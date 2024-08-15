import React, { ReactElement } from 'react';
import { Box, Flex, BoxProps, Ellipsis } from '@oplog/express';
import { FlexProps } from '@oplog/express/dist/components/Flex';

interface InfoBoxProps {
  content?: string;
  icon: React.ReactNode;
  wrapperProps?: FlexProps;
  contentBoxProps?: BoxProps;
  iconBoxProps?: BoxProps;
  isExpanded?: boolean;
}

declare global {
  interface Window {
    returnTimeInterval: any;
  }
}

const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  content,
  icon,
  wrapperProps,
  contentBoxProps,
  iconBoxProps,
  isExpanded,
}): ReactElement => {
  return (
    <Flex
      maxWidth={isExpanded ? '310px' : undefined}
      height="62px"
      bg="palette.white"
      borderRadius="md"
      boxShadow="small" /* todo: add this colors to theme.ts later */
      py="11"
      px="16"
      position="relative"
      alignItems="center"
      data-cy={wrapperProps?.dataCy}
      {...wrapperProps}
    >
      <Box width={1}>
        <Box fontSize="14" letterSpacing="small" color="palette.snow_darker" fontWeight={700}>
          <Ellipsis>{children}</Ellipsis>
        </Box>
        <Box fontSize="22" fontWeight={500} letterSpacing="negativeLarge" pt={4} {...contentBoxProps}>
          <Ellipsis>{content}</Ellipsis>
        </Box>
      </Box>
      <Box width="36px" height="36px" position="absolute" right="-4px" top="-4px" borderRadius="lg" {...iconBoxProps}>
        <Flex alignItems="center" height="100%" justifyContent="center">
          {icon}
        </Flex>
      </Box>
    </Flex>
  );
};

export default InfoBox;
