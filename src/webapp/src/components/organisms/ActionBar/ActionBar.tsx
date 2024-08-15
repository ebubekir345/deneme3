import {
  Box,
  Flex,
  Header,
  Heading,
  Image,
  Popover,
  PopoverProps,
  PseudoBox,
  PseudoBoxProps,
  Text,
} from '@oplog/express';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import Breadcrumb, { BreadcrumbItemProps } from '../../molecules/Breadcrumb';

export interface ActionBarProps extends PseudoBoxProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  hasTooltip?: boolean;
  integration?: { name: string; icon: string };
  breadcrumb?: BreadcrumbItemProps[];
  children?: React.ReactNode;
}

const ActionBar: React.FC<ActionBarProps> = ({
  subtitle,
  isLoading,
  title,
  breadcrumb,
  integration,
  children,
  hasTooltip,
  ...otherProps
}) => {
  const headerContent = (
    <Text
      fontFamily="heading"
      fontSize="28"
      fontWeight={800}
      lineHeight="xxLarge"
      letterSpacing="negativeLarge"
      color="text.h1"
    >
      {isLoading ? <Skeleton /> : title}
    </Text>
  );

  const HeadingElement = hasTooltip ? Popover : React.Fragment;
  let popOverProps = {};

  if (hasTooltip) {
    popOverProps = {
      isDark: true,
      action: ['hover'],
      content: title,
      withPortal: true,
      followCursor: true,
    } as PopoverProps;
  }

  // todo: find a way to get header clientHeight.

  return (
    <PseudoBox
      as={Header}
      px="22"
      pt="16"
      pb="8"
      position="sticky"
      zIndex="actionBar"
      height="unset"
      boxShadow="small"
      {...otherProps}
    >
      <Box mr="16">
        {breadcrumb && (
          <>
            {isLoading ? <Skeleton width="200px" /> : <Breadcrumb containerProps={{ mb: '7px' }} items={breadcrumb} />}
          </>
        )}
        <Flex alignItems="center">
          {integration && (
            <Popover isDark action={['hover']} followCursor withPortal content={integration.name}>
              <Box height="28px" width="28px" mr="8" mb="5px">
                {isLoading ? (
                  <Skeleton width="28px" height="28px" />
                ) : (
                  <Image src={integration.icon} alt={integration.name} />
                )}
              </Box>
            </Popover>
          )}
          {isLoading ? (
            <Box mb="2px">
              <Skeleton width="65px" height="28px" />
            </Box>
          ) : (
            <HeadingElement {...(popOverProps as PopoverProps)}>
              <Heading as="h1" m="0">
                {headerContent}
              </Heading>
            </HeadingElement>
          )}
          {subtitle && (
            <Box as={Text} ml="8" mb={isLoading ? '2px' : '6'} fontSize="11" alignSelf="flex-end" color="palette.grey">
              {isLoading ? <Skeleton width="40px" height="14px" /> : subtitle}
            </Box>
          )}
        </Flex>
      </Box>
      {children}
    </PseudoBox>
  );
};

export default ActionBar;
