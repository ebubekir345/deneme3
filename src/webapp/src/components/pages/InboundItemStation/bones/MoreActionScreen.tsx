import { Box, Flex } from '@oplog/express';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import useInboundItemStationStore from '../../../../store/global/inboundItemStationStore';
import { ActionButton } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen';

interface IMoreActionScreen {
  handleLogout: Function;
}

const MoreActionScreen: React.FC<IMoreActionScreen> = ({ handleLogout }): ReactElement => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();

  return (
    <>
      <Box
        onClick={() => inboundStationAction.setIsMoreActionsOpen(false)}
        position="fixed"
        width="100%"
        height="100%"
        left={0}
        top={0}
        zIndex={2}
        opacity={0.6}
        bg="palette.black"
      />
      <Flex
        position="absolute"
        flexDirection="column"
        transform="translateY(-142px)"
        width="auto"
        height="auto"
        zIndex={2}
      >
        <Box width="fit-content">
          <ActionButton
            onClick={() => {
              inboundStationAction.setIsMoreActionsOpen(false);
              inboundStationAction.setIsManuelBarcodeInputOpen(true);
            }}
            icon="fal fa-keyboard"
            iconColor="palette.white"
            height="36px"
            backgroundColor="palette.softBlue"
            color="palette.white"
            fontSize="16px"
            fontWeight={500}
            letterSpacing="negativeLarge"
            border="unset"
            borderRadius="4px"
            mb="16"
            px={12}
          >
            {t(`${intlKey}.ActionButtons.BarcodeInput`)}
          </ActionButton>
        </Box>
        <Box width="fit-content">
          <ActionButton
            onClick={() => handleLogout()}
            icon="far fa-arrow-from-right"
            iconColor="palette.softBlue_light"
            height={36}
            backgroundColor="palette.slate_lighter"
            color="palette.softBlue_light"
            fontSize="16px"
            fontWeight={500}
            border="unset"
            borderRadius={4}
            px={12}
          >
            {t(`${intlKey}.ActionButtons.Logout`)}
          </ActionButton>
        </Box>
      </Flex>
    </>
  );
};

export default MoreActionScreen;
