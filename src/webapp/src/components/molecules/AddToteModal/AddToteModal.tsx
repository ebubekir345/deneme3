import { Box, Button, Flex, Icon } from '@oplog/express';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '../../../config';
import { IRASPickingActions, IRASPickingStore, RASPickingModals } from '../../../store/global/rasPickingStore';
import { IRASPutAwayActions, IRASPutAwayStore } from '../../../store/global/rasPutAwayStore';
import useWebSocket, { MessageTypes, slotLimit } from '../../../utils/useWebSocket';
import { ModalBox } from '../TouchScreen';

const intlKey = 'TouchScreen.RASPickingStation.AddToteModal';
const terminalWebSocketUrl = config.api.terminalWebSocketUrl;

interface IAddToteModal {
  state: IRASPickingStore | IRASPutAwayStore;
  action: IRASPickingActions | IRASPutAwayActions;
}

const AddToteModal: FC<IAddToteModal> = ({ state, action }) => {
  const { t } = useTranslation();
  const [slotMessage, slotState, sendSlotMessage] = useWebSocket(terminalWebSocketUrl);

  return (
    <ModalBox
      onClose={() => null}
      isOpen={state.modals.AddTote}
      width={1 / 2}
      headerText={t(`${intlKey}.${state.toteToBeAdded ? 'SelectSlot' : 'ScanToteToAdd'}`)}
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
        <Icon
          name={state.toteToBeAdded ? 'fad fa-circle' : 'fal fa-barcode-read'}
          fontSize={96}
          color="palette.slate_dark"
        />
      }
    >
      <Flex flexDirection="column" alignItems="center" width={1}>
        {state.toteToBeAdded && (
          <Box fontSize={18} mt={30}>
            {t(`${intlKey}.ToteToBeAdded`)}
            <Box fontWeight={700} display="inline">
              {state.toteToBeAdded}
            </Box>
          </Box>
        )}
        <Button
          fontFamily="Jost"
          fontSize={26}
          mt={state.toteToBeAdded ? 60 : 30}
          variant="danger"
          _focus={{ outline: 'none' }}
          onClick={() => {
            if (state.toteToBeAdded) {
              const emptySlots = Array.from({ length: slotLimit })
                .map((_, i) => {
                  if (!state.slots[i]?.toteName) return i;
                  return undefined;
                })
                .filter((i): i is number => i !== undefined);

              sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
              sendSlotMessage({
                MessageType: MessageTypes.TurnOnButtons,
                Slots: emptySlots,
              });
            } else {
              sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
              state.slots.some((slot: SlotInterface) => slot?.isSelected) &&
                sendSlotMessage({
                  MessageType: MessageTypes.TurnOnButtons,
                  Slots: [state.slots.findIndex((slot: SlotInterface) => slot?.isSelected)],
                });
              action.setSelectedSlot(undefined);
              action.toggleModalState(RASPickingModals.AddTote);
            }
            action.setToteToBeAdded('');
          }}
        >
          {t(`${state.toteToBeAdded ? 'TouchScreen.ActionButtons.Return' : 'Modal.Cancel'}`)}
        </Button>{' '}
      </Flex>
    </ModalBox>
  );
};

export default AddToteModal;
