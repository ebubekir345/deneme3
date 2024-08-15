import { Box, Flex, Icon, PseudoBox, Text } from '@oplog/express';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

export interface IModalFancyHeader {
  title: string;
  content?: JSX.Element[];
  onClose: () => void;
  isBusy?: boolean;
  length?: any;
}

export const ModalFancyHeader: React.FC<IModalFancyHeader> = ({ title, content, onClose, isBusy, length }) => {
  return (
    <Flex
      width={1}
      height={60}
      justifyContent="space-between"
      alignItems="center"
      bg="palette.white"
      borderRadius="lg"
      p={16}
      boxShadow="xlarge"
    >
      <Flex alignItems="center">
        {isBusy ? (
          <Skeleton height={28} width={200} />
        ) : (
          <Text
            fontFamily="heading"
            fontSize="28"
            fontWeight="800"
            letterSpacing="negativeLarge"
            color="palette.grey_darker"
            textTransform="uppercase"
            data-testid="fancy-header-title"
          >
            {title}
          </Text>
        )}
        {!isBusy &&
          content &&
          content.map((item, i) => (
            <Box
              key={i.toString()}
              ml={16}
              pl={16}
              height={18}
              borderLeft="xs"
              borderColor="palette.snow_light"
              color="palette.grey"
              data-testid="fancy-header-content"
            >
              {item}
            </Box>
          ))}
        {isBusy &&
          [...Array(length ?? 4)].map(each => <Skeleton height={18} width={100} style={{ marginLeft: '16px' }} />)}
      </Flex>
      <PseudoBox
        as="button"
        onClick={() => onClose()}
        border="none"
        bg="transparent"
        mr={10}
        data-testid="fancy-header-close-button"
      >
        <Icon name="fal fa-times" fontSize={28} color="palette.grey_dark" />
      </PseudoBox>
    </Flex>
  );
};

export default ModalFancyHeader;
