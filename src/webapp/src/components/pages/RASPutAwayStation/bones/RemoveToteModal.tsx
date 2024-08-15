import { Box, Button, Flex, Icon } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { RASPickingModals } from '../../../../store/global/rasPickingStore';
import useRASPutAwayStore from '../../../../store/global/rasPutAwayStore';
import { StoreState } from '../../../../store/initState';
import { MessageTypes } from '../../../../utils/useWebSocket';
import { ModalBox } from '../../../molecules/TouchScreen';
import { Sounds } from '../../RASPickingStation/RASPickingStation';

const intlKey = 'TouchScreen.RASPutAwayStation.RemoveToteModal';
const successKey = 'TouchScreen.RASPutAwayStation.LastSuccessfulOperation';

interface IRemoveToteModal {
  setIsRemoveToteButtonClicked: Function;
  sendSlotMessage: Function;
}

const RemoveToteModal: FC<IRemoveToteModal> = ({ setIsRemoveToteButtonClicked, sendSlotMessage }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [putAwayState, putAwayAction] = useRASPutAwayStore();
  const rasStowDropToteResponse = useSelector((state: StoreState) => state.resources[ResourceType.RasStowDropTote]);

  return (
    <ModalBox
      onClose={() => null}
      isOpen={putAwayState.modals.RemoveTote}
      width={1 / 2}
      headerText={
        <Box px={90} mt={16}>
          {t(
            `${intlKey}.${
              putAwayState.selectedSlot !== undefined && !putAwayState.slots[putAwayState.selectedSlot]?.toteName
                ? 'ScanToteToAdd'
                : putAwayState.selectedSlot !== undefined
                ? 'Approve'
                : 'SelectSlot'
            }`
          )}
        </Box>
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
          {putAwayState.selectedSlot !== undefined &&
            putAwayState.slots[putAwayState.selectedSlot]?.toteName &&
            !rasStowDropToteResponse?.isBusy && (
              <Box mb={60} fontSize={48} fontWeight={900}>
                {`${t(`TouchScreen.RASPickingStation.TopBar.Slot`)} ${putAwayState.selectedSlot + 1}`}
              </Box>
            )}
          <Icon
            name={
              putAwayState.selectedSlot !== undefined && !putAwayState.slots[putAwayState.selectedSlot]?.toteName
                ? 'fal fa-barcode-read'
                : 'fad fa-circle'
            }
            fontSize={96}
          />
        </>
      }
    >
      <Flex
        justifyContent="space-between"
        mt={30}
        width={
          putAwayState.selectedSlot !== undefined &&
          putAwayState.slots[putAwayState.selectedSlot]?.toteName &&
          !rasStowDropToteResponse?.isBusy &&
          1 / 3
        }
        mx="auto"
      >
        <Button
          fontFamily="Jost"
          fontSize={26}
          variant="danger"
          _focus={{ outline: 'none' }}
          onClick={() => {
            sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
            if (putAwayState.slots.some((slot: SlotInterface) => slot?.isSelected)) {
              sendSlotMessage({
                MessageType: MessageTypes.TurnOnButtons,
                Slots: [putAwayState.slots.findIndex((slot: SlotInterface) => slot?.isSelected)],
              });
            } else {
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
            }
            setIsRemoveToteButtonClicked(false);
            putAwayAction.setToteToBeRemoved('');
            putAwayAction.setSelectedSlot(undefined);
            putAwayAction.toggleModalState(RASPickingModals.RemoveTote);
          }}
        >
          {t('Modal.Cancel')}
        </Button>
        {putAwayState.selectedSlot !== undefined &&
          putAwayState.slots[putAwayState.selectedSlot]?.toteName &&
          !rasStowDropToteResponse?.isBusy && (
            <Button
              fontFamily="Jost"
              fontSize={26}
              variant="alternative"
              _focus={{ outline: 'none' }}
              isLoading={rasStowDropToteResponse?.isBusy}
              onClick={() =>
                dispatch(
                  resourceActions.resourceRequested(ResourceType.RasStowDropTote, {
                    payload: {
                      addressLabel: putAwayState.station.label,
                      toteLabel: putAwayState.toteToBeRemoved,
                    },
                  })
                )
              }
            >
              {t('Modal.Approve')}
            </Button>
          )}
      </Flex>
    </ModalBox>
  );
};

export default RemoveToteModal;
