import { Box, Flex } from '@oplog/express';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { HovPackingModals } from '../../../store/global/hovPackingStore';
import { ActionButton } from '../../atoms/TouchScreen';

const intlKey = 'TouchScreen';

interface IMoreActionScreen {
  packingState: any;
  packingAction: any;
}

const MoreActionScreen: React.FC<IMoreActionScreen> = ({ packingState, packingAction }): ReactElement => {
  const { t } = useTranslation();

  return (
    <>
      <Box
        onClick={() => packingAction.setIsMoreActionsOpen(false)}
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
        transform={
          packingState.orderNumber &&
          !packingState.isOrderCompleted &&
          !packingState.isMissing &&
          !packingState.isCancelled
            ? 'translateY(-200px)'
            : 'translateY(-142px)'
        }
        width="auto"
        height="auto"
        zIndex={2}
      >
        <Box width="fit-content">
          <ActionButton
            onClick={() => {
              packingAction.setIsMoreActionsOpen(false);
              packingAction.setIsManuelBarcodeInputOpen(true);
            }}
            icon="fal fa-keyboard"
            iconColor="palette.white"
            height={38}
            backgroundColor="palette.softBlue"
            color="palette.white"
            fontSize="16"
            fontWeight={500}
            letterSpacing="negativeLarge"
            border="unset"
            borderRadius="sm"
            mb="16"
            px={11}
          >
            {t(`${intlKey}.ActionButtons.BarcodeInput`)}
          </ActionButton>
        </Box>
        {packingState.orderNumber &&
          !packingState.isOrderCompleted &&
          !packingState.isMissing &&
          !packingState.isCancelled && (
            <ActionButton
              onClick={() => {
                packingAction.setIsMoreActionsOpen(false);
                packingAction.toggleModalState(HovPackingModals.MissingItem);
              }}
              icon="far fa-eye"
              iconColor="palette.red_darker"
              height={38}
              backgroundColor="palette.red_lighter"
              color="palette.red_darker"
              fontSize="16"
              fontWeight={500}
              letterSpacing="negativeLarge"
              borderRadius="sm"
              mb="16"
              px={11}
              border="solid 1px  #ff5c5c"
            >
              {t(`${intlKey}.ActionButtons.Missing`)}
            </ActionButton>
          )}
        <Box width="fit-content">
          <ActionButton
            onClick={() => {
              packingAction.setIsMoreActionsOpen(false);
              packingAction.toggleModalState(HovPackingModals.Logout);
            }}
            icon="far fa-arrow-from-right"
            iconColor="palette.softBlue"
            height={38}
            backgroundColor="palette.slate_lighter"
            color="palette.softBlue"
            fontSize="16"
            fontWeight={500}
            letterSpacing="negativeLarge"
            border="unset"
            borderRadius="sm"
            px={11}
          >
            {t(`${intlKey}.ActionButtons.Logout`)}
          </ActionButton>
        </Box>
      </Flex>
    </>
  );
};

export default MoreActionScreen;
