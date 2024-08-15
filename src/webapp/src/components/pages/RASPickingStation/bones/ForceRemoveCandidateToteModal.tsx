import { Box, Flex, Icon } from '@oplog/express';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useRASPickingStore from '../../../../store/global/rasPickingStore';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen.RASPickingStation.ForceRemoveCandidateToteModal';

interface IForceRemoveCandidateToteModal {
  candidateDropTotes: (
    | undefined
    | {
        toteName: string;
        isSelected: boolean;
      }
  )[];
}

const ForceRemoveCandidateToteModal: FC<IForceRemoveCandidateToteModal> = ({ candidateDropTotes }) => {
  const { t } = useTranslation();
  const [pickingState] = useRASPickingStore();

  return (
    <ModalBox
      onClose={() => null}
      isOpen={pickingState.modals.ForceRemoveCandidateTote}
      width={5 / 6}
      headerText={
        <Box fontWeight={400}>
          <Trans>{t(`${intlKey}.${pickingState.toteToBeRemoved ? 'ScanToteToAdd' : 'SelectSlot'}`)}</Trans>
        </Box>
      }
      contentBoxProps={{
        py: '60',
        px: '30',
        color: pickingState.toteToBeRemoved ? 'palette.slate_dark' : 'palette.white',
        bg: pickingState.toteToBeRemoved ? 'palette.softGrey' : 'palette.red_darker',
        borderRadius: 'md',
        justifyContent: 'center',
      }}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      icon={
        <>
          {pickingState.toteToBeRemoved && (
            <Box mb={60} fontSize={48} fontWeight={900}>
              {`${t(`TouchScreen.RASPickingStation.TopBar.Slot`)} ${(pickingState.selectedSlot as number) + 1}`}
            </Box>
          )}
          <Icon name={pickingState.toteToBeRemoved ? 'fal fa-barcode-read' : 'fad fa-circle'} fontSize={96} />
        </>
      }
    >
      {!pickingState.toteToBeRemoved && (
        <Flex justifyContent="space-between" width={1} mt={30} px={16}>
          {candidateDropTotes
            .map((tote, i) => (
              <Flex key={i.toString()} flexDirection="column" width={1 / 6} mr={i && 16} opacity={!tote && 0.5}>
                <Box
                  bg="palette.softBlue"
                  color="palette.white"
                  borderTopLeftRadius="lg"
                  borderTopRightRadius="lg"
                  width={1}
                  pb={4}
                  pt={6}
                >
                  {`${t(`TouchScreen.RASPickingStation.TopBar.Slot`)} ${i + 1}`}
                </Box>
                <Box
                  p={16}
                  pt={18}
                  width={1}
                  height="50px"
                  borderBottomRightRadius="lg"
                  borderBottomLeftRadius="lg"
                  fontWeight={700}
                  fontSize={16}
                  bg="palette.white"
                  color="palette.black"
                >
                  {tote?.toteName}
                </Box>
              </Flex>
            ))
            .reverse()}
        </Flex>
      )}
    </ModalBox>
  );
};

export default ForceRemoveCandidateToteModal;
