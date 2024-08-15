import { Button, Flex } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { RASPickingModals } from '../../../../store/global/rasPickingStore';
import useRASPutAwayStore from '../../../../store/global/rasPutAwayStore';
import { StoreState } from '../../../../store/initState';
import { MessageTypes, slotLimit } from '../../../../utils/useWebSocket';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';

export const buttonProps = {
  fontWeight: 400,
  fontFamily: 'touchScreen',
  fontSize: 22,
  py: 16,
  width: 1 / 4,
  borderRadius: 'md',
  _focus: {
    outline: 'none',
  },
};

const intlKey = 'TouchScreen.RASPutAwayStation.BottomBar';

interface IBottomBar {
  sendSlotMessage: Function;
}

const BottomBar: FC<IBottomBar> = ({ sendSlotMessage }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [putAwayState, putAwayAction] = useRASPutAwayStore();
  const rasReleasePodResponse = useSelector((state: StoreState) => state.resources[ResourceType.RasReleasePod]);

  return (
    <Flex width={3 / 4} alignSelf="flex-end" mb={16} pr={32} pl={48} justifyContent="space-between">
      <Button
        {...buttonProps}
        variant="light"
        disabled={
          !putAwayState.slots.some((slot: SlotInterface) => slot?.toteName) ||
          putAwayState.phases.Cell ||
          (putAwayState.infoMessageBox.state === InfoMessageBoxState.Scan && Boolean(putAwayState.infoMessageBox.text))
        }
        onClick={() => {
          const fullSlots = putAwayState.slots
            .map((slot: SlotInterface, index: number) => (slot?.toteName ? index : null))
            .filter((index: number | null): index is number => index !== null);

          sendSlotMessage({
            MessageType: MessageTypes.TurnOnButtons,
            Slots: fullSlots,
          });
          putAwayAction.setSelectedSlot(undefined);
          putAwayAction.toggleModalState(RASPickingModals.RemoveTote);
        }}
      >
        {t(`${intlKey}.RemoveTote`)}
      </Button>
      <Button
        {...buttonProps}
        variant="success"
        disabled={
          putAwayState.slots.filter((slot: SlotInterface) => slot?.toteName).length === slotLimit ||
          (putAwayState.infoMessageBox.state === InfoMessageBoxState.Scan && Boolean(putAwayState.infoMessageBox.text))
        }
        onClick={() => {
          sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
          putAwayAction.setSelectedSlot(undefined);
          putAwayAction.toggleModalState(RASPickingModals.AddTote);
        }}
      >
        {t(`${intlKey}.AddTote`)}
      </Button>
      <Button
        {...buttonProps}
        variant="info"
        disabled={
          putAwayState.phases.POD ||
          (putAwayState.infoMessageBox.state === InfoMessageBoxState.Scan && Boolean(putAwayState.infoMessageBox.text))
        }
        isLoading={rasReleasePodResponse?.isBusy}
        onClick={() =>
          dispatch(
            resourceActions.resourceRequested(ResourceType.RasReleasePod, {
              payload: {
                addressLabel: putAwayState.station.label,
              },
            })
          )
        }
      >
        {t(`${intlKey}.ReleasePOD`)}
      </Button>
    </Flex>
  );
};

export default BottomBar;
