import { Box } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import {
  CheckBarcodeTypeForRasOutputDTO,
  InternalErrorNumber,
  RasStationToteOutputDTO,
} from '../../../../services/swagger';
import { PickingPhases, RASPickingModals } from '../../../../store/global/rasPickingStore';
import useRASPutAwayStore, { initialRASPutAwayState } from '../../../../store/global/rasPutAwayStore';
import { StoreState } from '../../../../store/initState';
import { MessageTypes } from '../../../../utils/useWebSocket';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import { DiscriminatorTypes } from '../../../molecules/TouchScreen/StationBox';
import { Sounds } from '../../RASPickingStation/RASPickingStation';

const intlKey = 'TouchScreen.RASPickingStation';
const successKey = 'TouchScreen.RASPutAwayStation.LastSuccessfulOperation';

interface IButtonEffectTrigger {
  messageHandler: (state: InfoMessageBoxState, text: string) => void;
  errorHandler: (error: any) => void;
  button: undefined | number;
  setButton: Function;
  setIsPodReady: Function;
  productBarcode: string;
  setProductBarcode: Function;
  sendSlotMessage: Function;
}

const ButtonEffectTrigger: FC<IButtonEffectTrigger> = ({
  messageHandler,
  errorHandler,
  button,
  setButton,
  setIsPodReady,
  productBarcode,
  setProductBarcode,
  sendSlotMessage,
}) => {
  const { t } = useTranslation();
  const [putAwayState, putAwayAction] = useRASPutAwayStore();
  const history = useHistory();
  const dispatch = useDispatch();

  const rasStationTotesResponse: Resource<RasStationToteOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasStationTotes]
  );
  const rasCheckBarcodeTypeResponse: Resource<CheckBarcodeTypeForRasOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasCheckBarcodeType]
  );
  const rasStowCheckToteResponse = useSelector((state: StoreState) => state.resources[ResourceType.RasStowCheckTote]);
  const rasStowPlaceToteResponse: Resource<RasStationToteOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasStowPlaceTote]
  );
  const rasStowCheckProductResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasStowCheckProduct]
  );
  const rasCheckCellResponse = useSelector((state: StoreState) => state.resources[ResourceType.RasCheckCell]);
  const rasStowPlaceProductResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasStowPlaceProduct]
  );
  const rasStowDropToteResponse = useSelector((state: StoreState) => state.resources[ResourceType.RasStowDropTote]);
  const rasReleasePodResponse = useSelector((state: StoreState) => state.resources[ResourceType.RasReleasePod]);

  useEffect(() => {
    sendSlotMessage({
      MessageType: MessageTypes.TurnOffAllButtons,
    });
    setIsPodReady(false);
    setButton(undefined);
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.RasStowStation) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.RasStationTotes, {
          addressLabel: stationObject.label,
        })
      );
      putAwayAction.setStation(stationObject);
    } else history.push(urls.stationLogin);
    const phaseItem = localStorage.getItem('phase');
    phaseItem && putAwayAction.togglePhaseState(PickingPhases[JSON.parse(phaseItem)]);
    const productItem = localStorage.getItem('product');
    productItem && putAwayAction.setProduct(JSON.parse(productItem));
    const productBarcodeItem = localStorage.getItem('productBarcode');
    productBarcodeItem && setProductBarcode(JSON.parse(productBarcodeItem));
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.RasStationTotes));
      dispatch(resourceActions.resourceInit(ResourceType.RasCheckBarcodeType));
      dispatch(resourceActions.resourceInit(ResourceType.RasStowCheckTote));
      dispatch(resourceActions.resourceInit(ResourceType.RasStowPlaceTote));
      dispatch(resourceActions.resourceInit(ResourceType.RasStowCheckProduct));
      dispatch(resourceActions.resourceInit(ResourceType.RasCheckCell));
      dispatch(resourceActions.resourceInit(ResourceType.RasStowPlaceProduct));
      dispatch(resourceActions.resourceInit(ResourceType.RasStowDropTote));
      dispatch(resourceActions.resourceInit(ResourceType.RasReleasePod));
      putAwayAction.clearState(initialRASPutAwayState);
    };
  }, []);

  useEffect(() => {
    Object.keys(PickingPhases).some(phase => putAwayState.phases[phase]) &&
      localStorage.setItem(
        'phase',
        JSON.stringify(Object.keys(PickingPhases).find(phase => putAwayState.phases[phase]))
      );
  }, [putAwayState.phases]);

  useEffect(() => {
    putAwayState.slots.some((slot: SlotInterface) => slot?.isSelected) &&
      localStorage.setItem(
        'activeTote',
        JSON.stringify(putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteName)
      );
  }, [putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteName]);

  useEffect(() => {
    productBarcode && localStorage.setItem('productBarcode', JSON.stringify(productBarcode));
  }, [productBarcode]);

  useEffect(() => {
    localStorage.setItem('product', JSON.stringify(putAwayState.product));
  }, [putAwayState.product]);

  useEffect(() => {
    if (button !== undefined) {
      if (
        rasStationTotesResponse?.isBusy ||
        rasCheckBarcodeTypeResponse?.isBusy ||
        rasStowCheckToteResponse?.isBusy ||
        rasStowPlaceToteResponse?.isBusy ||
        rasStowCheckProductResponse?.isBusy ||
        rasCheckCellResponse?.isBusy ||
        rasStowPlaceProductResponse?.isBusy ||
        rasStowDropToteResponse?.isBusy ||
        rasReleasePodResponse?.isBusy
      )
        return messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
      if (putAwayState.modals.Logout || putAwayState.isManuelBarcodeInputOpen || putAwayState.isMoreActionsOpen) {
        return setButton(undefined);
      }
      if (putAwayState.modals.ForceAddTote || putAwayState.modals.AddTote) {
        putAwayState.toteToBeAdded &&
          dispatch(
            resourceActions.resourceRequested(ResourceType.RasStowPlaceTote, {
              payload: {
                addressLabel: putAwayState.station.label,
                toteLabel: putAwayState.toteToBeAdded,
                slot: button,
              },
            })
          );
        return setButton(undefined);
      }
      if (putAwayState.modals.RemoveTote) {
        if (putAwayState.slots[button]?.toteName && !putAwayState.toteToBeRemoved) {
          new Audio(Sounds.SideFlow).play();
          putAwayAction.setToteToBeRemoved(putAwayState.slots[button].toteName);
          putAwayAction.setSelectedSlot(button);
          sendSlotMessage({
            MessageType: MessageTypes.TurnOffAllButtons,
          });
          sendSlotMessage({
            MessageType: MessageTypes.TurnOnButtons,
            Slots: [button],
          });
          dispatch(
            resourceActions.resourceRequested(ResourceType.RasStowDropTote, {
              payload: {
                addressLabel: putAwayState.station.label,
                toteLabel: putAwayState.slots[button].toteName,
              },
            })
          );
        } else if (putAwayState.selectedSlot === undefined) {
          errorHandler(InternalErrorNumber.RasNoAvailableToteFound);
        }
        return setButton(undefined);
      }
      if (putAwayState.modals.ForceRemoveTote) {
        if (!putAwayState.toteToBeRemoved) {
          if (putAwayState.slots.findIndex((slot: SlotInterface) => slot?.isSelected) === button) {
            messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
            putAwayAction.setSelectedSlot(button);
            putAwayAction.setToteToBeRemoved(putAwayState.slots[button].toteName);
            dispatch(
              resourceActions.resourceRequested(ResourceType.RasStowDropTote, {
                payload: {
                  addressLabel: putAwayState.station.label,
                  toteLabel: putAwayState.slots[button].toteName,
                },
              })
            );
          } else messageHandler(InfoMessageBoxState.Error, t('TouchScreen.RASPutAwayStation.Error.WrongSlotSelected'));
        }
        return setButton(undefined);
      }
      if (!putAwayState.slots[button]?.toteName) {
        sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
        sendSlotMessage({
          MessageType: MessageTypes.TurnOnButtons,
          Slots: [button],
        });
        putAwayAction.setSelectedSlot(button);
        putAwayAction.toggleModalState(RASPickingModals.AddTote);
        return setButton(undefined);
      }
      if (putAwayState.slots[button]?.isSelected) {
        if (!putAwayState.phases.Cell) {
          putAwayAction.setSelectedSlot(button);
          putAwayAction.setToteToBeRemoved(putAwayState.slots[button].toteName);
          putAwayAction.toggleModalState(RASPickingModals.RemoveTote);
        }
        return setButton(undefined);
      }
      if (!putAwayState.phases.Cell) {
        new Audio(Sounds.Approve4).play();
        putAwayAction.setSuccessMessage(
          <>
            <Box>{t(`${successKey}.ToteChanged`)}</Box>
            {putAwayState.slots.some((slot: SlotInterface) => slot?.isSelected) && (
              <Box color="palette.hardGrey" fontWeight={900} mt={8}>{`${
                putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteName
              }(Slot${putAwayState.slots.findIndex((slot: SlotInterface) => slot?.isSelected) + 1}) ->`}</Box>
            )}
            <Box color="palette.hardGrey" fontWeight={900}>{`${putAwayState.slots[button].toteName}(Slot${button +
              1}) ->`}</Box>
          </>
        );
        sendSlotMessage({
          MessageType: MessageTypes.TurnOffAllButtons,
        });
        sendSlotMessage({
          MessageType: MessageTypes.TurnOnButtons,
          Slots: [button],
        });
        const slots = putAwayState.slots.map((slot: SlotInterface, index: number) => ({
          ...slot,
          isSelected: button === index ? true : false,
        }));
        putAwayAction.setSlots(slots);
      }
      putAwayAction.setSelectedSlot(button);
      return setButton(undefined);
    }
  }, [button]);

  return <></>;
};

export default ButtonEffectTrigger;
