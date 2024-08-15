import { Box, Flex } from '@oplog/express';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import useSingleItemPackingStore, { SingleItemPackingModals } from '../../../../store/global/singleItemPackingStore';
import { ActionButton } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen';

const MoreActionScreen: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const [_, packingAction] = useSingleItemPackingStore();

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
        transform="translateY(-142px)"
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
        <Box width="fit-content">
          <ActionButton
            onClick={() => {
              packingAction.setIsMoreActionsOpen(false);
              packingAction.toggleModalState(SingleItemPackingModals.Logout);
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
