import { Box, Button, Icon } from '@oplog/express';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RASPickingModals } from '../../../../store/global/rasPickingStore';
import useRASPutAwayStore from '../../../../store/global/rasPutAwayStore';
import { MessageTypes } from '../../../../utils/useWebSocket';
import { ModalBox } from '../../../molecules/TouchScreen';
import { Sounds } from '../../RASPickingStation/RASPickingStation';

const intlKey = 'TouchScreen.RASPutAwayStation.ForceRemoveToteModal';
const successKey = 'TouchScreen.RASPutAwayStation.LastSuccessfulOperation';

interface IForceRemoveToteModal {
  sendSlotMessage: Function;
}

const ForceRemoveToteModal: FC<IForceRemoveToteModal> = ({ sendSlotMessage }) => {
  const { t } = useTranslation();
  const [putAwayState, putAwayAction] = useRASPutAwayStore();

  return (
    <ModalBox
      onClose={() => null}
      isOpen={putAwayState.modals.ForceRemoveTote}
      width={1 / 2}
      headerText={
        <Box px={30}>
          {t(
            `${
              putAwayState.selectedSlot !== undefined && !putAwayState.slots[putAwayState.selectedSlot]?.toteName
                ? 'TouchScreen.RASPutAwayStation.RemoveToteModal.ScanToteToAdd'
                : `${intlKey}.SelectSlot`
            }`
          )}
        </Box>
      }
      contentBoxProps={{
        py: '60',
        px: '30',
        color:
          putAwayState.selectedSlot !== undefined && !putAwayState.slots[putAwayState.selectedSlot]?.toteName
            ? 'palette.slate_dark'
            : 'palette.white',
        bg:
          putAwayState.selectedSlot !== undefined && !putAwayState.slots[putAwayState.selectedSlot]?.toteName
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
        <>
          {putAwayState.selectedSlot === undefined && (
            <>
              <Box mb={16} fontSize={48} fontWeight={900}>
                {`${t(`TouchScreen.RASPickingStation.TopBar.Slot`)} ${putAwayState.slots.findIndex(
                  (slot: SlotInterface) => slot?.isSelected
                ) + 1}`}
              </Box>
              <Box mb={52} fontSize={48} fontWeight={900}>
                {putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteName}
              </Box>
            </>
          )}
          <Icon
            name={
              putAwayState.selectedSlot !== undefined && !putAwayState.slots[putAwayState.selectedSlot]?.toteName
                ? 'fal fa-barcode-read'
                : 'fad fa-circle'
            }
            fontSize={96}
            mb={16}
          />
        </>
      }
    >
      {putAwayState.selectedSlot !== undefined && !putAwayState.slots[putAwayState.selectedSlot]?.toteName && (
        <Button
          fontFamily="Jost"
          fontSize={26}
          mt={30}
          variant="danger"
          _focus={{ outline: 'none' }}
          onClick={() => {
            sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
            if (!putAwayState.slots.some((slot: SlotInterface) => slot?.toteName)) {
              putAwayAction.toggleModalState(RASPickingModals.ForceAddTote);
            } else {
              new Audio(Sounds.Approve4).play();
              putAwayAction.setSuccessMessage(
                <>
                  <Box>{t(`${successKey}.ToteRemoved`)}</Box>
                  <Box color="palette.hardGrey" fontWeight={900} mt={8}>{`${
                    putAwayState.toteToBeRemoved
                  } (Slot${(putAwayState.selectedSlot as number) + 1})`}</Box>
                  <Box mt={16}>{t(`${successKey}.ToteChanged`)}</Box>
                  <Box color="palette.hardGrey" fontWeight={900} mt={8}>{`${
                    putAwayState.slots.find((slot: SlotInterface) => slot?.toteName)?.toteName
                  }(Slot${putAwayState.slots.findIndex((slot: SlotInterface) => slot?.toteName) + 1})`}</Box>
                </>
              );
              sendSlotMessage({
                MessageType: MessageTypes.TurnOnButtons,
                Slots: [putAwayState.slots.findIndex((slot: SlotInterface) => slot?.toteName)],
              });
              const slots = putAwayState.slots.map((slot: SlotInterface, index: number) => ({
                ...slot,
                isSelected:
                  putAwayState.slots.findIndex((slot: SlotInterface) => slot?.toteName) === index ? true : false,
              }));
              putAwayAction.setSlots(slots);
            }
            putAwayAction.setToteToBeRemoved('');
            putAwayAction.setSelectedSlot(undefined);
            putAwayAction.toggleModalState(RASPickingModals.ForceRemoveTote);
          }}
        >
          {t('Modal.Cancel')}
        </Button>
      )}
    </ModalBox>
  );
};

export default ForceRemoveToteModal;
