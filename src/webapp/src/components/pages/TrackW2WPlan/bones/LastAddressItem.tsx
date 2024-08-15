import { Box, Flex, Icon } from '@oplog/express';
import React, { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import useIntersect from '../../../../utils/useIntersect';

export const LastAddressItem = props => {
  const { address, loadMore, isBusy, addresses, setAddresses } = props;
  const [ref, entry] = useIntersect({});

  const isVisible = entry && entry.isIntersecting;

  useEffect(() => {
    if (isVisible) {
      loadMore();
    }
  }, [isVisible]);

  return (
    <Box ref={ref}>
      <Flex
        border="xs"
        borderRadius="lg"
        fontSize="16"
        fontWeight={800}
        mt={8}
        ml={16}
        py={4}
        px={16}
        justifyContent="space-between"
        bg={address?.isSelected ? 'palette.grey' : 'palette.white'}
        color={address?.isSelected && "palette.black"}
        cursor={!address?.isSelected && 'pointer'}
        onClick={e => {
          console.log("last", address?.cellId, addresses)
          e.stopPropagation();
          const updatedAddresses = addresses
            .map(item => (item.cellId === address?.cellId ? { ...item, isSelected: true } : item))
            .sort((a, b) => {
              if (a.isSelected === b.isSelected) {
                return 0; // Keep the order unchanged for other items
              }
              return a.isSelected ? -1 : 1; // Place isSelected: true items first
            });
          setAddresses(updatedAddresses);
        }}
      >
        <Box>{address?.cellLabel}</Box>
        {address?.isSelected && (
          <Icon
            color="palette.black"
            onClick={() => {
              const updatedAddresses = addresses
                .map(item => (item.cellId === address?.cellId ? { ...item, isSelected: false } : item))
                .sort((a, b) => {
                  if (a.isSelected === b.isSelected) {
                    return 0; // Keep the order unchanged for other items
                  }
                  return a.isSelected ? -1 : 1; // Place isSelected: true items first
                });
              setAddresses(updatedAddresses);
            }}
            cursor="pointer"
            fontSize="22"
            name="fas fa-times"
          />
        )}
      </Flex>
      {isBusy && <Skeleton height={44} />}
    </Box>
  );
};
