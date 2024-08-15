import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  BarcodeType,
  CheckBarcodeTypeForRasOutputDTO,
  CheckProductForPickOutputDTO,
  InternalErrorNumber,
  RasPlaceProductOutputDTO,
  RasStationToteOutputDTO,
  ToteForPickOutputDTO,
} from '../../../../services/swagger';
import { RasMetricType } from '../../../../services/swagger/api';
import useRASPickingStore, { PickingPhases, RASPickingModals } from '../../../../store/global/rasPickingStore';
import { StoreState } from '../../../../store/initState';
import { MessageTypes, slotLimit } from '../../../../utils/useWebSocket';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import { Sounds } from '../RASPickingStation';

const intlKey = 'TouchScreen.RASPickingStation';

interface IStationEffectTrigger {
  messageHandler: (state: InfoMessageBoxState, text: string) => void;
  errorHandler: (error: any) => void;
  setButton: Function;
  setIsRemoveToteButtonClicked: Function;
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
  setCandidateDropTotes: Function;
  sendSlotMessage: Function;
  isPodReady: boolean;
}

const StationEffectTrigger: FC<IStationEffectTrigger> = ({
  messageHandler,
  errorHandler,
  setButton,
  setIsRemoveToteButtonClicked,
  completedTotes,
  setCompletedTotes,
  productBarcode,
  setProductBarcode,
  setCandidateDropTotes,
  sendSlotMessage,
  isPodReady,
}) => {
  const { t } = useTranslation();
  const [pickingState, pickingAction] = useRASPickingStore();
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

  const initializer = () => {
    sendSlotMessage({
      MessageType: MessageTypes.TurnOffAllButtons,
    });
    Object.values(RASPickingModals).forEach(modal => pickingAction.toggleModalState(modal, false));
    pickingAction.setToteToBeRemoved('');
    pickingAction.setToteToBeAdded('');
    pickingAction.setSelectedSlot(undefined);
    setCompletedTotes([]);
    setIsRemoveToteButtonClicked(false);
    setButton(undefined);
  };

  const productResponseHandler = (response: Resource<RasPlaceProductOutputDTO>) => {
    if (response?.isSuccess) {
      messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
      new Audio(Sounds.Approve3).play();
      pickingAction.setCellLabel('');
      pickingAction.setProduct({});
      setProductBarcode('');
      !pickingState.phases.POD &&
        pickingAction.togglePhaseState(pickingState.isPalette ? PickingPhases.Product : PickingPhases.Cell);
      const slots = pickingState.slots.map((slot: SlotInterface) => ({
        ...slot,
        isSelectable: false,
      }));
      pickingAction.setSlots(slots);
      initializer();

      if (response?.data?.completedTotes?.length) {
        messageHandler(InfoMessageBoxState.None, '');
        const totes = Array.from({ length: slotLimit }).map((_, i) => {
          const completedTote = response.data?.completedTotes?.find(
            (tote: RasStationToteOutputDTO) => tote?.stationSlot === i
          );
          if (completedTote) {
            return {
              toteName: completedTote?.label || '',
              isSelected: false,
              isRemoved: false,
              isNewToteAdded: false,
            };
          }
          return undefined;
        });
        sendSlotMessage({
          MessageType: MessageTypes.TurnOnButtons,
          Slots: response.data?.completedTotes?.map((tote: RasStationToteOutputDTO) => tote?.stationSlot),
        });
        setCompletedTotes(totes);
        pickingAction.toggleModalState(RASPickingModals.ForceRemoveTote, true);
      }
    }
    if (response?.error) {
      errorHandler(response?.error?.internalErrorNumber);
    }
  };

  useEffect(() => {
    if (rasStationTotesResponse?.isSuccess) {
      messageHandler(InfoMessageBoxState.None, '');
      if (rasStationTotesResponse?.data?.length) {
        const slots: SlotInterface[] = [];
        rasStationTotesResponse.data.forEach((tote: RasStationToteOutputDTO) => {
          if (tote?.stationSlot !== undefined) {
            slots[tote.stationSlot] = {
              toteName: tote.label || '',
              isSelected: false,
              isSelectable: false,
              toteContent: tote.containedProducts || [],
            };
          }
        });
        pickingAction.setSlots(slots);
        if (pickingState.phases.Tote) {
          pickingAction.setBarcodeData(productBarcode);
          messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
          dispatch(
            resourceActions.resourceRequested(ResourceType.RasPickCheckProduct, {
              addressLabel: pickingState.station.label,
              cellLabel: pickingState.cellLabel,
              productBarcode: productBarcode,
              pickListId: pickingState.pickListId,
            })
          );
        }
      } else isPodReady && pickingAction.toggleModalState(RASPickingModals.ForceAddTote);
    }
    if (rasStationTotesResponse?.error) {
      errorHandler(rasStationTotesResponse?.error?.internalErrorNumber);
    }
  }, [rasStationTotesResponse]);

  useEffect(() => {
    if (rasCheckBarcodeTypeResponse?.data) {
      if (rasCheckBarcodeTypeResponse.data.type === BarcodeType.Tote && pickingState.phases.Tote) {
        if (
          pickingState.slots.find((slot: SlotInterface) => slot?.toteName === pickingState.barcodeData)?.isSelectable
        ) {
          messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
          dispatch(
            resourceActions.resourceRequested(ResourceType.RasPickPlaceProduct, {
              payload: {
                addressLabel: pickingState.station.label,
                toteLabel: pickingState.barcodeData,
                cellLabel: pickingState.cellLabel,
                productBarcode: productBarcode,
                pickListId: pickingState.pickListId,
              },
            })
          );
          return;
        }
        if (pickingState.slots.find((slot: SlotInterface) => slot?.toteName === pickingState.barcodeData)) {
          return errorHandler(InternalErrorNumber.RasToteBelongToAnotherPickList);
        }
      }
      if (
        rasCheckBarcodeTypeResponse.data.type === BarcodeType.Product &&
        pickingState.phases.Product &&
        pickingState.product?.barcodes?.includes(pickingState.barcodeData)
      ) {
        dispatch(
          resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
            payload: {
              metricType: RasMetricType.ScanItem,
              station: pickingState?.station?.label || 'DefaultLabel',
              stationType: 'Pick',
              Time: new Date().toISOString(),
            },
          })
        );

        messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
        dispatch(
          resourceActions.resourceRequested(ResourceType.RasPickCheckProduct, {
            addressLabel: pickingState.station.label,
            cellLabel: pickingState.cellLabel,
            productBarcode: pickingState.barcodeData,
            pickListId: pickingState.pickListId,
          })
        );
        return;
      }
      if (
        rasCheckBarcodeTypeResponse.data.type === BarcodeType.Cell &&
        pickingState.phases.Cell &&
        pickingState.barcodeData.toLowerCase() === pickingState.cellLabel.toLowerCase()
      ) {
        messageHandler(InfoMessageBoxState.None, '');
        new Audio(Sounds.Approve).play();
        dispatch(
          resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
            payload: {
              metricType: RasMetricType.ScanCell,
              station: pickingState?.station?.label || 'DefaultLabel',
              stationType: 'Pick',
              Time: new Date().toISOString(),
            },
          })
        );
        return pickingAction.togglePhaseState(PickingPhases.Product);
      }
      return errorHandler(InternalErrorNumber.RasBarcodeNotFound);
    }
    if (rasCheckBarcodeTypeResponse?.error) {
      errorHandler(rasCheckBarcodeTypeResponse?.error?.internalErrorNumber);
    }
  }, [rasCheckBarcodeTypeResponse]);

  useEffect(() => {
    if (rasPickCheckToteResponse?.isSuccess) {
      new Audio(Sounds.SideFlow).play();
      pickingAction.setToteToBeAdded(pickingState.barcodeData);

      if (pickingState.selectedSlot !== undefined && pickingState.toteToBeRemoved) {
        messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
        dispatch(
          resourceActions.resourceRequested(ResourceType.RasPickDropTote, {
            payload: {
              addressLabel: pickingState.station.label,
              toteLabel: pickingState.toteToBeRemoved,
            },
          })
        );
        return;
      }
      if (pickingState.selectedSlot !== undefined) {
        messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
        dispatch(
          resourceActions.resourceRequested(ResourceType.RasPickPlaceTote, {
            payload: {
              addressLabel: pickingState.station.label,
              toteLabel: pickingState.barcodeData,
              slot: pickingState.selectedSlot,
            },
          })
        );
        return;
      }

      messageHandler(InfoMessageBoxState.None, '');
      const emptySlots = Array.from({ length: slotLimit })
        .map((_, i) => {
          if (!pickingState.slots[i]?.toteName) return i;
          return undefined;
        })
        .filter((i): i is number => i !== undefined);
      sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
      return sendSlotMessage({
        MessageType: MessageTypes.TurnOnButtons,
        Slots: emptySlots,
      });
    }
    if (rasPickCheckToteResponse?.error) {
      errorHandler(rasPickCheckToteResponse?.error?.internalErrorNumber);
    }
  }, [rasPickCheckToteResponse]);

  useEffect(() => {
    if (rasPickPlaceToteResponse?.isSuccess) {
      // Tote has been successfully placed - log the "Assign Tote" event

      const metricType = pickingState.modals.AddTote ? RasMetricType.AddTote : RasMetricType.ForceAddTote;

      dispatch(
        resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
          payload: {
            metricType: metricType,
            station: pickingState?.station?.label || 'DefaultLabel',
            stationType: 'Pick',
            Time: new Date().toISOString(),
          },
        })
      );

      /*
      dispatch(resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
        payload: {
          metricType: RasMetricType.AssignTote,
          station: pickingState?.station?.label || 'DefaultLabel',
          stationType: 'Pick',
          Time: new Date().toISOString(),
        }
      }))*/

      messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.Success.ToteAdded`));
      new Audio(Sounds.AddTote).play();

      if (pickingState.modals.ForceRemoveTote) {
        const totes = completedTotes.map((tote, i) =>
          tote && i === pickingState.selectedSlot
            ? {
                ...tote,
                isSelected: false,
                isNewToteAdded: true,
                toteName: pickingState.barcodeData,
              }
            : tote
        );
        if (totes.filter(tote => tote).every(tote => tote?.isNewToteAdded)) {
          messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.Success.ToteChanged`));
          const slots = pickingState.slots.map((slot: SlotInterface, index: number) =>
            totes[index]
              ? {
                  toteName: totes[index]?.toteName || '',
                  isSelected: false,
                  isSelectable: false,
                  toteContent: [],
                }
              : slot
          );
          pickingAction.setSlots(slots);
          initializer();
          return;
        }
        const emptySlots = totes
          .map((tote, i) => {
            if (tote && !tote?.toteName) return i;
            return undefined;
          })
          .filter(i => i !== undefined);
        sendSlotMessage({
          MessageType: MessageTypes.TurnOffAllButtons,
        });
        sendSlotMessage({
          MessageType: MessageTypes.TurnOnButtons,
          Slots: emptySlots,
        });
        pickingAction.setSelectedSlot(undefined);
        return setCompletedTotes(totes);
      }

      const slots = pickingState.slots;
      slots[pickingState.selectedSlot as number] = {
        toteName: pickingState.toteToBeAdded,
        isSelected: false,
        isSelectable:
          (pickingState.modals.ForceAddTote && pickingState.phases.Tote) || pickingState.modals.ForceRemoveCandidateTote
            ? true
            : false,
        toteContent: [],
      };
      pickingAction.setSlots(slots);
      initializer();
      ((pickingState.modals.ForceAddTote && pickingState.phases.Tote) ||
        pickingState.modals.ForceRemoveCandidateTote) &&
        sendSlotMessage({
          MessageType: MessageTypes.TurnOnButtons,
          Slots: [slots.findIndex(slot => slot?.isSelectable)],
        });
      return;
    }
    if (rasPickPlaceToteResponse?.error) {
      errorHandler(rasPickPlaceToteResponse?.error?.internalErrorNumber);
    }
  }, [rasPickPlaceToteResponse]);

  useEffect(() => {
    if (rasPickCheckProductResponse?.isSuccess) {
      messageHandler(InfoMessageBoxState.None, '');
      new Audio(Sounds.Approve2).play();
      setProductBarcode(pickingState.barcodeData);
      pickingAction.togglePhaseState(PickingPhases.Tote, true);
      if (
        !rasPickCheckProductResponse.data?.availableTotes?.length &&
        rasPickCheckProductResponse.data?.candidateDropTotes?.length
      ) {
        const totes = Array.from({ length: slotLimit }).map((_, i) => {
          const candidateDropTote = rasPickCheckProductResponse.data?.candidateDropTotes?.find(
            (tote: ToteForPickOutputDTO) => tote?.slot === i
          );
          if (candidateDropTote) {
            return {
              toteName: candidateDropTote?.label || '',
              isSelected: false,
            };
          }
          return undefined;
        });
        sendSlotMessage({
          MessageType: MessageTypes.TurnOnButtons,
          Slots: rasPickCheckProductResponse.data?.candidateDropTotes?.map((tote: ToteForPickOutputDTO) => tote?.slot),
        });
        setCandidateDropTotes(totes);
        return pickingAction.toggleModalState(RASPickingModals.ForceRemoveCandidateTote);
      }
      if (!rasPickCheckProductResponse.data?.availableTotes?.length) {
        return pickingAction.toggleModalState(RASPickingModals.ForceAddTote);
      }
      if (rasPickCheckProductResponse.data?.availableTotes?.length) {
        const slots = pickingState.slots.map((slot: SlotInterface) => ({
          ...slot,
          isSelectable: rasPickCheckProductResponse.data?.availableTotes?.find(
            (tote: ToteForPickOutputDTO) => tote?.label?.toLowerCase() === slot?.toteName?.toLowerCase()
          )
            ? true
            : false,
        }));
        sendSlotMessage({
          MessageType: MessageTypes.TurnOnButtons,
          Slots: rasPickCheckProductResponse.data?.availableTotes?.map((tote: ToteForPickOutputDTO) => tote?.slot),
        });
        return pickingAction.setSlots(slots);
      }
    }
    if (rasPickCheckProductResponse?.error) {
      errorHandler(rasPickCheckProductResponse?.error?.internalErrorNumber);
    }
  }, [rasPickCheckProductResponse]);

  useEffect(() => {
    productResponseHandler(rasPickPlaceProductResponse);
  }, [rasPickPlaceProductResponse]);

  useEffect(() => {
    if (rasPickDropToteResponse?.isSuccess) {
      new Audio(Sounds.DropTote).play();

      // Determine the metricType based on the condition in putAwayState-modals.RemoveTote
      const metricType = pickingState.modals.RemoveTote ? RasMetricType.DropTote : RasMetricType.ForceDropTote;

      // Dispatch the log event with the chosen metricType
      dispatch(
        resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
          payload: {
            metricType: metricType,
            station: pickingState?.station?.label || 'DefaultLabel',
            stationType: 'Pick',
            Time: new Date().toISOString(),
          },
        })
      );

      /*

      dispatch(resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
        payload: {
          metricType: RasMetricType.ToteRelease,
          station: pickingState?.station?.label || 'DefaultLabel',
          stationType: 'Pick',
          toteLabel: pickingState.toteToBeRemoved,
          Time: new Date().toISOString(),
        }
      }))
*/

      if (pickingState.modals.ForceRemoveTote) {
        messageHandler(InfoMessageBoxState.None, '');
        sendSlotMessage({
          MessageType: MessageTypes.TurnOffButtons,
          Slots: [pickingState.selectedSlot],
        });
        const totes = completedTotes.map((tote, i) =>
          tote && i === pickingState.selectedSlot
            ? {
                ...tote,
                isRemoved: true,
                toteName: '',
              }
            : tote
        );
        setCompletedTotes(totes);
        if (totes.filter(tote => tote?.toteName).every(tote => tote?.isRemoved)) {
          if (
            rasPickPlaceProductResponse?.data?.waitingListAmount ||
            rasPickLostItemResponse?.data?.waitingListAmount
          ) {
            sendSlotMessage({
              MessageType: MessageTypes.TurnOnButtons,
              Slots: totes.map((tote, index) => (tote ? index : null)).filter(index => index !== null),
            });
          } else {
            const slots = pickingState.slots.map((slot: SlotInterface, index: number) =>
              totes[index]
                ? {
                    toteName: '',
                    isSelected: false,
                    isSelectable: false,
                    toteContent: [],
                  }
                : slot
            );
            pickingAction.setSlots(slots);
            initializer();
            dispatch(resourceActions.resourceInit(ResourceType.RasPickPlaceProduct));
            dispatch(resourceActions.resourceInit(ResourceType.RasPickLostItem));
            return pickingAction.togglePhaseState(PickingPhases.POD, true);
          }
        }
        return;
      }
      messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
      dispatch(
        resourceActions.resourceRequested(ResourceType.RasPickPlaceTote, {
          payload: {
            addressLabel: pickingState.station.label,
            toteLabel: pickingState.toteToBeAdded,
            slot: pickingState.selectedSlot,
          },
        })
      );
      return;
    }
    if (rasPickDropToteResponse?.error) {
      errorHandler(rasPickDropToteResponse?.error?.internalErrorNumber);
    }
  }, [rasPickDropToteResponse]);

  useEffect(() => {
    productResponseHandler(rasPickLostItemResponse);
  }, [rasPickLostItemResponse]);

  return <></>;
};

export default StationEffectTrigger;
