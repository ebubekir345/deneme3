import React from 'react';
import { Box, Flex } from '@oplog/express';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../../atoms/TouchScreen';
import useSlamStationStore from '../../../../store/global/slamStationStore';
import { SlamStationModals } from '../../../../typings/globalStore/enums';

const intlKey = 'TouchScreen';

const MoreActionScreen: React.FC = () => {
  const { t } = useTranslation();
  const [{ isMoreActionsOpen }, { setIsMoreActionsOpen, toggleModalState }] = useSlamStationStore();
  if (isMoreActionsOpen) {
    return (
      <>
        <Box
          onClick={() => setIsMoreActionsOpen(false)}
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
          transform="translateY(-56px)"
          width="auto"
          height="auto"
          zIndex={2}
        >
          <Box width="fit-content">
            <ActionButton
              onClick={() => {
                toggleModalState(SlamStationModals.Logout);
                setIsMoreActionsOpen(false);
              }}
              icon="far fa-arrow-from-right"
              iconColor="palette.softBlue"
              height={38}
              backgroundColor="palette.slate_lighter"
              color="palette.softBlue"
              fontSize={16}
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
  }
  return <></>;
};

export default MoreActionScreen;
