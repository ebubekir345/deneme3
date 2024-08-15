import React from 'react';
import { Box, Flex, PseudoBox } from '@oplog/express';
import useReturnStore, { ReturnTooltips } from '../../../../store/global/returnStore';

const CustomerInfoScreen: React.FC = (): React.ReactElement => {
  const [returnState, returnAction] = useReturnStore();
  const { name, tel, address } = returnState.customerInfo;

  return (
    <>
      <Box
        onClick={() => returnAction.toggleTooltipState(ReturnTooltips.CustomerInfo, false)}
        position="fixed"
        width="100%"
        height="100%"
        left={0}
        top={0}
        zIndex={2}
        bg="rgba(0, 0, 0, 0.5)" /* todo: add this colors to theme.ts later */
        data-cy="customer-info-tooltip-backdrop"
      />
      <PseudoBox
        position="absolute"
        transform="translate3d(-151px, -184px, 0px)"
        bg="palette.white"
        width="302px"
        height="136px"
        borderRadius="md"
        zIndex={2}
        _after={{
          border: 'solid transparent',
          content: '" "',
          height: 0,
          width: 0,
          position: 'absolute',
          pointerEvents: 'none',
          borderColor: 'transparent',
          borderWidth: '6px',
          right: '30px',
          marginLeft: '2',
          boxShadow: 'medium',
          borderTop: '8px solid #fff',
          top: '100%',
        }}
        data-cy="customer-info-tooltip"
      >
        <Flex
          p={22}
          justifyContent="center"
          flexDirection="column"
          height="100%"
          fontSize="16"
          letterSpacing="negativeLarge"
        >
          <Box fontWeight={700} color="palette.purple_darker">
            {name}
          </Box>
          <Box color="palette.snow_darker" fontWeight={700} mt={4}>
            {tel}
          </Box>
          <Box
            color="palette.snow_darker"
            fontWeight={700}
            mt={11}
            textOverflow="ellipsis"
            display="-webkit-box"
            overflow="hidden"
            style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {address}
          </Box>
        </Flex>
      </PseudoBox>
    </>
  );
};

export default CustomerInfoScreen;
