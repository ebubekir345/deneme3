import { Box, Button, Flex, Icon } from '@oplog/express';
import React, { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { RASPickingModals } from '../../../../store/global/rasPickingStore';
import useRASPutAwayStore from '../../../../store/global/rasPutAwayStore';

const intlKey = 'TouchScreen';

const MoreActionScreen: FC = (): ReactElement => {
  const { t } = useTranslation();
  const [putAwayState, putAwayAction] = useRASPutAwayStore();

  return (
    <>
      <Box
        onClick={() => putAwayAction.setIsMoreActionsOpen(false)}
        position="fixed"
        width="100vw"
        height="100vh"
        left={0}
        top={0}
        zIndex={2}
        opacity={0.6}
        bg="palette.black"
      />
      <Flex
        position="absolute"
        flexDirection="column"
        transform="translateY(-120px)"
        width="auto"
        height="auto"
        zIndex={2}
        ml={32}
      >
        <Box width="fit-content">
          <Button
            onClick={() => {
              putAwayAction.setIsMoreActionsOpen(false);
              putAwayAction.setIsManuelBarcodeInputOpen(true);
            }}
            variant="alternative"
            fontFamily="Jost"
            fontWeight={500}
            mb="16"
          >
            <Icon name="fal fa-keyboard" mr={11} />
            {t(`${intlKey}.ActionButtons.BarcodeInput`)}
          </Button>
        </Box>
        <Box width="fit-content">
          <Button
            onClick={() => {
              putAwayAction.setIsMoreActionsOpen(false);
              putAwayAction.toggleModalState(RASPickingModals.Logout);
            }}
            disabled={
              putAwayState.phases.Cell ||
              Object.values(RASPickingModals)
                .filter(modal => modal !== RASPickingModals.ForceAddTote)
                .some(modal => putAwayState.modals[modal])
            }
            variant="light"
            fontFamily="Jost"
            fontWeight={500}
            mb="16"
            color="palette.softBlue_dark"
          >
            <Icon name="fas fa-ellipsis-v" mr={11} />
            {t(`${intlKey}.ActionButtons.Logout`)}
          </Button>
        </Box>
      </Flex>
    </>
  );
};

export default MoreActionScreen;
