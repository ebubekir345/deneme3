import { Box, Flex, Icon } from '@oplog/express';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useRASPickingStore from '../../../../store/global/rasPickingStore';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen.RASPickingStation.ForceRemoveToteModal';

interface IForceRemoveToteModal {
  completedTotes: (
    | undefined
    | {
        toteName: string;
        isSelected: boolean;
        isRemoved: boolean;
        isNewToteAdded: boolean;
      }
  )[];
}

const ForceRemoveToteModal: FC<IForceRemoveToteModal> = ({ completedTotes }) => {
  const { t } = useTranslation();
  const [pickingState] = useRASPickingStore();

  return (
    <ModalBox
      onClose={() => null}
      isOpen={pickingState.modals.ForceRemoveTote}
      width={5 / 6}
      headerText={
        <Box fontWeight={400}>
          <Trans>
            {t(
              `${intlKey}.${
                completedTotes.filter(tote => tote).every(tote => tote?.isRemoved) ? 'ScanToteToAdd' : 'SelectSlot'
              }`
            )}
          </Trans>
        </Box>
      }
      contentBoxProps={{
        py: '60',
        px: '30',
        color: completedTotes.filter(tote => tote).every(tote => tote?.isRemoved)
          ? 'palette.slate_dark'
          : 'palette.white',
        bg: completedTotes.filter(tote => tote).every(tote => tote?.isRemoved)
          ? 'palette.softGrey'
          : 'palette.red_darker',
        borderRadius: 'md',
        justifyContent: 'center',
      }}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      icon={
        <Icon
          name={
            completedTotes.filter(tote => tote).every(tote => tote?.isRemoved) ? 'fal fa-barcode-read' : 'fad fa-circle'
          }
          fontSize={96}
        />
      }
    >
      <Flex justifyContent="space-between" width={1} mt={30} px={16}>
        {completedTotes
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
                bg={
                  tote?.toteName && (tote?.isRemoved || tote?.isNewToteAdded)
                    ? 'palette.green'
                    : tote?.isSelected
                    ? 'palette.orange_darker'
                    : 'palette.white'
                }
                color={tote?.isRemoved || tote?.isNewToteAdded ? 'palette.white' : 'palette.black'}
              >
                {tote?.toteName}
              </Box>
            </Flex>
          ))
          .reverse()}
      </Flex>
    </ModalBox>
  );
};

export default ForceRemoveToteModal;
