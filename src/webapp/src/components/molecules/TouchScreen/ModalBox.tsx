import React from 'react';
import { Box, Flex, Modal, ModalContent, ModalProps, BoxProps } from '@oplog/express';

interface ModalBoxProps extends ModalProps {
  icon: React.ReactNode;
  headerText?: string | React.ReactNode;
  subHeaderText?: string | React.ReactNode;
  contentBoxProps?: BoxProps;
}

const ModalBox: React.FC<ModalBoxProps> = ({
  children,
  icon,
  headerText,
  subHeaderText,
  contentBoxProps,
  ...otherProps
}) => {
  return (
    <Modal
      showOverlay
      boxShadow="unset"
      borderRadius="8px"
      maxWidth="unset"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      data-testid={otherProps.testId ? otherProps.testId : ''}
      {...otherProps}
    >
      <ModalContent
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        fontFamily="touchScreen"
        {...contentBoxProps}
      >
        {icon}
        {headerText && (
          <Box fontSize="32px" letterSpacing="-1px" fontWeight="bold" mt={20} textAlign="center" lineHeight="xxLarge">
            {headerText}
          </Box>
        )}
        {subHeaderText && (
          <Box fontSize="20px" letterSpacing="-0.5px" textAlign="center" mt={16}>
            {subHeaderText}
          </Box>
        )}
        {children && (
          <Flex gutter={25} mt={32} width={1} justifyContent="center">
            {children}
          </Flex>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalBox;
