import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import {
  CheckBarcodeTypeForRasOutputDTO,
  CheckProductForPickOutputDTO,
  InternalErrorNumber,
  RasPlaceProductOutputDTO,
  RasStationToteOutputDTO,
  ToteForPickOutputDTO,
} from '../../../../services/swagger';
import useRASPickingStore, {
  initialRASPickingState,
  PickingPhases,
  RASPickingModals,
} from '../../../../store/global/rasPickingStore';
import { StoreState } from '../../../../store/initState';
import { MessageTypes } from '../../../../utils/useWebSocket';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import { DiscriminatorTypes } from '../../../molecules/TouchScreen/StationBox';
import { Sounds } from '../RASPickingStation';

const intlKey = 'TouchScreen.RASPickingStation';

interface IButtonEffectTrigger {
  messageHandler: (state: InfoMessageBoxState, text: string) => void;
  errorHandler: (error: any) => void;
  button: undefined | number;
  setButton: Function;
  completedTotes: (
    | undefined
    | {
        toteName: string;
        isSelected: boolean;
        isRemoved: boolean;
        isNewToteAdded: boolean;
      }
  )[];
  setCompletedTotes: Function;
  productBarcode: string;
  setProductBarcode: Function;
  sendSlotMessage: Function;
  setIsPodReady: Function;
}

const ButtonEffectTrigger: FC<IButtonEffectTrigger> = ({
  messageHandler,
  errorHandler,
  button,
  setButton,
  completedTotes,
  setCompletedTotes,
  productBarcode,
  setProductBarcode,
  sendSlotMessage,
  setIsPodReady,
}) => {
  const { t } = useTranslation();
  const [pickingState, pickingAction] = useRASPickingStore();
  const history = useHistory();
  const dispatch = useDispatch();

  const rasStationTotesResponse: Resource<RasStationToteOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasStationTotes]
  );
  const rasCheckBarcodeTypeResponse: Resource<CheckBarcodeTypeForRasOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasCheckBarcodeType]
  );
  const rasPickCheckToteResponse = useSelector((state: StoreState) => state.resources[ResourceType.RasPickCheckTote]);
  const rasPickPlaceToteResponse = useSelector((state: StoreState) => state.resources[ResourceType.RasPickPlaceTote]);
  const rasPickCheckProductResponse: Resource<CheckProductForPickOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasPickCheckProduct]
  );
  const rasPickPlaceProductResponse: Resource<RasPlaceProductOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasPickPlaceProduct]
  );
  const rasPickDropToteResponse = useSelector((state: StoreState) => state.resources[ResourceType.RasPickDropTote]);
  const rasPickLostItemResponse: Resource<RasPlaceProductOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasPickLostItem]
  );

  useEffect(() => {
    sendSlotMessage({
      MessageType: MessageTypes.TurnOffAllButtons,
    });
    setIsPodReady(false);
    setButton(undefined);
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.RasPickStation) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.RasStationTotes, {
          addressLabel: stationObject.label,
        })
      );
      pickingAction.setStation(stationObject);
    } else history.push(urls.stationLogin);
    const phaseItem = localStorage.getItem('phase');
    phaseItem
      ? pickingAction.togglePhaseState(PickingPhases[JSON.parse(phaseItem)])
      : pickingAction.togglePhaseState(PickingPhases.POD);
    const productBarcodeItem = localStorage.getItem('productBarcode');
    productBarcodeItem && setProductBarcode(JSON.parse(productBarcodeItem));
    const cellLabelItem = localStorage.getItem('cellLabel');
    cellLabelItem && pickingAction.setCellLabel(JSON.parse(cellLabelItem));
    const pickListIdItem = localStorage.getItem('pickListId');
    pickListIdItem && pickingAction.setPickListId(JSON.parse(pickListIdItem));
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.RasStationTotes));
      dispatch(resourceActions.resourceInit(ResourceType.RasCheckBarcodeType));
      dispatch(resourceActions.resourceInit(ResourceType.RasPickCheckTote));
      dispatch(resourceActions.resourceInit(ResourceType.RasPickPlaceTote));
      dispatch(resourceActions.resourceInit(ResourceType.RasPickCheckProduct));
      dispatch(resourceActions.resourceInit(ResourceType.RasCheckCell));
      dispatch(resourceActions.resourceInit(ResourceType.RasPickPlaceProduct));
      dispatch(resourceActions.resourceInit(ResourceType.RasPickDropTote));
      dispatch(resourceActions.resourceInit(ResourceType.RasPickLostItem));
      pickingAction.clearState(initialRASPickingState);
    };
  }, []);

  useEffect(() => {
    Object.keys(PickingPhases).some(phase => pickingState.phases[phase]) &&
      localStorage.setItem(
        'phase',
        JSON.stringify(Object.keys(PickingPhases).find(phase => pickingState.phases[phase]))
      );
  }, [pickingState.phases]);

  useEffect(() => {
    productBarcode && localStorage.setItem('productBarcode', JSON.stringify(productBarcode));
  }, [productBarcode]);

  useEffect(() => {
    pickingState.cellLabel && localStorage.setItem('cellLabel', JSON.stringify(pickingState.cellLabel));
  }, [pickingState.cellLabel]);

  useEffect(() => {
    pickingState.pickListId && localStorage.setItem('pickListId', JSON.stringify(pickingState.pickListId));
  }, [pickingState.pickListId]);

  useEffect(() => {
    if (button !== undefined) {
      if (
        rasStationTotesResponse?.isBusy ||
        rasCheckBarcodeTypeResponse?.isBusy ||
        rasPickCheckToteResponse?.isBusy ||
        rasPickPlaceToteResponse?.isBusy ||
        rasPickCheckProductResponse?.isBusy ||
        rasPickPlaceProductResponse?.isBusy ||
        rasPickDropToteResponse?.isBusy ||
        rasPickLostItemResponse?.isBusy
      )
        return messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
      if (
        pickingState.modals.ProblemProduct ||
        pickingState.modals.Logout ||
        pickingState.isManuelBarcodeInputOpen ||
        pickingState.isMoreActionsOpen
      ) {
        return setButton(undefined);
      }
      if (pickingState.modals.ForceAddTote || pickingState.modals.AddTote) {
        if (pickingState.toteToBeAdded) {
          messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
          pickingAction.setSelectedSlot(button);
          dispatch(
            resourceActions.resourceRequested(ResourceType.RasPickPlaceTote, {
              payload: {
                addressLabel: pickingState.station.label,
                toteLabel: pickingState.toteToBeAdded,
                slot: button,
              },
            })
          );
        }
        return setButton(undefined);
      }
      if (pickingState.modals.RemoveTote) {
        if (pickingState.slots[button]?.toteName && !pickingState.toteToBeRemoved) {
          new Audio(Sounds.SideFlow).play();
          pickingAction.setToteToBeRemoved(pickingState.slots[button].toteName);
          pickingAction.setSelectedSlot(button);
          sendSlotMessage({
            MessageType: MessageTypes.TurnOffAllButtons,
          });
          sendSlotMessage({
            MessageType: MessageTypes.TurnOnButtons,
            Slots: [button],
          });
          return setButton(undefined);
        }
        if (pickingState.selectedSlot === undefined) {
          errorHandler(InternalErrorNumber.RasNoAvailableToteFound);
        }
        return setButton(undefined);
      }
      if (pickingState.modals.ForceRemoveCandidateTote) {
        if (pickingState.toteToBeRemoved) {
          return setButton(undefined);
        }
        if (
          rasPickCheckProductResponse.data?.candidateDropTotes?.some(
            (tote: ToteForPickOutputDTO) => tote?.slot === button
          )
        ) {
          new Audio(Sounds.SideFlow).play();
          pickingAction.setToteToBeRemoved(pickingState.slots[button]?.toteName);
          pickingAction.setSelectedSlot(button);
          sendSlotMessage({
            MessageType: MessageTypes.TurnOffAllButtons,
          });
          sendSlotMessage({
            MessageType: MessageTypes.TurnOnButtons,
            Slots: [button],
          });
          return setButton(undefined);
        }
        messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.Error.WrongSlotSelected`));
        return setButton(undefined);
      }
      if (pickingState.modals.ForceRemoveTote) {
        if (completedTotes.some(tote => tote?.isSelected)) {
          return setButton(undefined);
        }
        if (
          completedTotes.filter(tote => tote).every(tote => tote?.isRemoved) &&
          completedTotes[button] &&
          !completedTotes[button]?.isNewToteAdded
        ) {
          sendSlotMessage({
            MessageType: MessageTypes.TurnOffAllButtons,
          });
          sendSlotMessage({
            MessageType: MessageTypes.TurnOnButtons,
            Slots: [button],
          });
          pickingAction.setSelectedSlot(button);
          const totes = completedTotes.map((tote, i) =>
            tote && i === button
              ? {
                  ...tote,
                  isSelected: true,
                }
              : tote
          );
          setCompletedTotes(totes);
          return setButton(undefined);
        }
        if (completedTotes[button] && !completedTotes[button]?.isRemoved) {
          messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
          pickingAction.setSelectedSlot(button);
          dispatch(
            resourceActions.resourceRequested(ResourceType.RasPickDropTote, {
              payload: {
                addressLabel: pickingState.station.label,
                toteLabel: pickingState.slots[button].toteName,
              },
            })
          );
          return setButton(undefined);
        }
        messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.Error.WrongSlotSelected`));
        return setButton(undefined);
      }
      if (pickingState.phases.Tote) {
        if (pickingState.slots[button]?.toteName && pickingState.slots[button]?.isSelectable) {
          messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
          dispatch(
            resourceActions.resourceRequested(ResourceType.RasPickPlaceProduct, {
              payload: {
                addressLabel: pickingState.station.label,
                toteLabel: pickingState.slots[button].toteName,
                cellLabel: pickingState.cellLabel,
                productBarcode: productBarcode,
                pickListId: pickingState.pickListId,
              },
            })
          );
          return setButton(undefined);
        }
        if (pickingState.slots[button]?.toteName) {
          errorHandler(InternalErrorNumber.RasToteBelongToAnotherPickList);
        }
        if (!pickingState.slots[button]?.toteName) {
          errorHandler(InternalErrorNumber.RasNoAvailableToteFound);
        }
        return setButton(undefined);
      }
      sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
      sendSlotMessage({
        MessageType: MessageTypes.TurnOnButtons,
        Slots: [button],
      });
      pickingState.slots[button]?.toteName && pickingAction.setToteToBeRemoved(pickingState.slots[button].toteName);
      pickingAction.toggleModalState(
        !pickingState.slots[button]?.toteName ? RASPickingModals.AddTote : RASPickingModals.RemoveTote
      );
      pickingAction.setSelectedSlot(button);
      return setButton(undefined);
    }
  }, [button]);

  return <></>;
};

export default ButtonEffectTrigger;
