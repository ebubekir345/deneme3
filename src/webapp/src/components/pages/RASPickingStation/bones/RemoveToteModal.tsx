import { Box, Button, Icon } from '@oplog/express';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '../../../../config';
import useRASPickingStore, { RASPickingModals } from '../../../../store/global/rasPickingStore';
import useWebSocket, { MessageTypes } from '../../../../utils/useWebSocket';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen.RASPickingStation.RemoveToteModal';
const terminalWebSocketUrl = config.api.terminalWebSocketUrl;

interface IRemoveToteModal {
  isRemoveToteButtonClicked: boolean;
  setIsRemoveToteButtonClicked: Function;
}

const RemoveToteModal: FC<IRemoveToteModal> = ({ isRemoveToteButtonClicked, setIsRemoveToteButtonClicked }) => {
  const { t } = useTranslation();
  const [pickingState, pickingAction] = useRASPickingStore();
  const [slotMessage, state, sendSlotMessage] = useWebSocket(terminalWebSocketUrl);

  return (
    <ModalBox
      onClose={() => null}
      isOpen={pickingState.modals.RemoveTote}
      width={1 / 2}
      headerText={
        <Box px={90}>{t(`${intlKey}.${pickingState.selectedSlot !== undefined ? 'ScanToteToAdd' : 'SelectSlot'}`)}</Box>
      }
      contentBoxProps={{
        py: '60',
        px: '30',
        color: 'palette.slate_dark',
        bg: 'palette.softGrey',
        borderRadius: 'md',
        justifyContent: 'center',
      }}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      icon={
        <>
          {pickingState.selectedSlot !== undefined && (
            <Box mb={60} fontSize={48} fontWeight={900}>
              {`${t(`TouchScreen.RASPickingStation.TopBar.Slot`)} ${pickingState.selectedSlot + 1}`}
            </Box>
          )}
          <Icon
            name={pickingState.selectedSlot !== undefined ? 'fal fa-barcode-read' : 'fad fa-circle'}
            fontSize={96}
          />
        </>
      }
    >
      <Button
        fontFamily="Jost"
        fontSize={26}
        mt={30}
        variant="danger"
        _focus={{ outline: 'none' }}
        onClick={() => {
          if (pickingState.selectedSlot !== undefined && isRemoveToteButtonClicked) {
            const fullSlots = pickingState.slots
              .map((slot: SlotInterface, index: number) => (slot?.toteName ? index : null))
              .filter((index: number | null): index is number => index !== null);

            sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
            sendSlotMessage({
              MessageType: MessageTypes.TurnOnButtons,
              Slots: fullSlots,
            });
          } else {
            sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
            setIsRemoveToteButtonClicked(false);
            pickingAction.toggleModalState(RASPickingModals.RemoveTote);
          }
          pickingAction.setSelectedSlot(undefined);
          pickingAction.setToteToBeRemoved('');
        }}
      >
        {t(
          `${
            pickingState.selectedSlot !== undefined && isRemoveToteButtonClicked
              ? 'TouchScreen.ActionButtons.Return'
              : 'Modal.Cancel'
          }`
        )}
      </Button>{' '}
    </ModalBox>
  );
};

export default RemoveToteModal;
