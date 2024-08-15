import { Button, Flex } from '@oplog/express';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '../../../../config';
import useRASPickingStore, { RASPickingModals } from '../../../../store/global/rasPickingStore';
import useWebSocket, { MessageTypes, slotLimit, SlotButton} from '../../../../utils/useWebSocket';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import { buttonProps } from '../../RASPutAwayStation/bones/BottomBar';
import { RasMetricType } from "../../../../services/swagger/api"
import { useDispatch, useSelector } from 'react-redux';
import { resourceActions } from '@oplog/resource-redux';
import { ResourceType } from '../../../../models/resource';
const intlKey = 'TouchScreen.RASPickingStation.BottomBar';
const terminalWebSocketUrl = config.api.terminalWebSocketUrl;

interface IBottomBar {
  setIsRemoveToteButtonClicked: Function;
}

const BottomBar: FC<IBottomBar> = ({ setIsRemoveToteButtonClicked }) => {
  const { t } = useTranslation();
  const [pickingState, pickingAction] = useRASPickingStore();
  const [slotMessage, state, sendSlotMessage] = useWebSocket(terminalWebSocketUrl);
  const dispatch = useDispatch();

  return (
    <Flex width={3 / 4} alignSelf="flex-end" mb={16} pr={32} pl={44} justifyContent="space-between">
      <Button
        {...buttonProps}
        width={1 / 5}
        variant="light"
        disabled={
          !pickingState.slots.some((slot: SlotInterface) => slot?.toteName) ||
          (pickingState.infoMessageBox.state === InfoMessageBoxState.Scan && Boolean(pickingState.infoMessageBox.text))
        }
        onClick={() => {
          const fullSlots = pickingState.slots
            .map((slot: SlotInterface, index: number) => (slot?.toteName ? index : null))
            .filter((index: number | null): index is number => index !== null);

          sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
          sendSlotMessage({
            MessageType: MessageTypes.TurnOnButtons,
            Slots: fullSlots,
          });
          setIsRemoveToteButtonClicked(true);

          dispatch(resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
            payload: {
            metricType: RasMetricType.ToteReplace,
            station: pickingState?.station?.label || 'DefaultLabel',
            stationType: 'Pick',
            Time: new Date().toISOString(),
            }
           }))
           
          pickingAction.toggleModalState(RASPickingModals.RemoveTote);
        }}
      >
        {t(`${intlKey}.RemoveTote`)}
      </Button>
      <Button
        {...buttonProps}
        width={1 / 5}
        variant="success"
        disabled={
          pickingState.slots.filter((slot: SlotInterface) => slot?.toteName).length === slotLimit ||
          (pickingState.infoMessageBox.state === InfoMessageBoxState.Scan && Boolean(pickingState.infoMessageBox.text))
        }
        onClick={() => {
          sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
          pickingAction.setSelectedSlot(undefined);
          pickingAction.toggleModalState(RASPickingModals.AddTote);
        }}
      >
        {t(`${intlKey}.AddTote`)}
      </Button>
      <Button
        {...buttonProps}
        width={1 / 5}
        variant="alternative"
        disabled={!pickingState.phases.Product}
        onClick={() => pickingAction.toggleModalState(RASPickingModals.ProblemProduct)}
      >
        {t(`${intlKey}.MissingProduct`)}
      </Button>
      <Button
        {...buttonProps}
        width={1 / 5}
        variant="warning"
        disabled
        onClick={() => pickingAction.toggleModalState(RASPickingModals.ProblemProduct)}
      >
        {t(`${intlKey}.DamagedProduct`)}
      </Button>
    </Flex>
  );
};

export default BottomBar;
