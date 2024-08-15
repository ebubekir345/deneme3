import { Box, Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  BarcodeType,
  CheckBarcodeTypeForRasOutputDTO,
  InternalErrorNumber, RasMetricType,
  RasStationToteOutputDTO,
  ToteContainedItemOutputDTO,
} from '../../../../services/swagger';
import { PickingPhases, RASPickingModals } from '../../../../store/global/rasPickingStore';
import useRASPutAwayStore from '../../../../store/global/rasPutAwayStore';
import { StoreState } from '../../../../store/initState';
import { MessageTypes, slotLimit } from '../../../../utils/useWebSocket';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import { Sounds } from '../../RASPickingStation/RASPickingStation';

const intlKey = 'TouchScreen.RASPickingStation';
const successKey = 'TouchScreen.RASPutAwayStation.LastSuccessfulOperation';

interface IStationEffectTrigger {
  messageHandler: (state: InfoMessageBoxState, text: string) => void;
  errorHandler: (error: any) => void;
  setButton: Function;
  setIsAddToteButtonClicked: Function;
  setIsRemoveToteButtonClicked: Function;
  productBarcode: string;
  setProductBarcode: Function;
  sendSlotMessage: Function;
}

const StationEffectTrigger: FC<IStationEffectTrigger> = ({
  messageHandler,
  errorHandler,
  setButton,
  setIsAddToteButtonClicked,
  setIsRemoveToteButtonClicked,
  productBarcode,
  setProductBarcode,
  sendSlotMessage,
}) => {
  const { t } = useTranslation();
  const [putAwayState, putAwayAction] = useRASPutAwayStore();
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

  const initializer = () => {
    sendSlotMessage({
      MessageType: MessageTypes.TurnOffAllButtons,
    });
    Object.values(RASPickingModals).forEach(modal => putAwayAction.toggleModalState(modal, false));
    putAwayAction.setToteToBeRemoved('');
    putAwayAction.setToteToBeAdded('');
    putAwayAction.setSelectedSlot(undefined);
    setIsAddToteButtonClicked(false);
    setIsRemoveToteButtonClicked(false);
    setButton(undefined);
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
              toteContent: tote.containedProducts || [],
            };
          }
        });

        const activeToteItem = localStorage.getItem('activeTote');
        if (activeToteItem) {
          const updatedSlots = slots.map((slot: SlotInterface, index: number) => {
            if (slot?.toteName?.toLowerCase() === JSON.parse(activeToteItem)?.toLowerCase()) {
              sendSlotMessage({
                MessageType: MessageTypes.TurnOnButtons,
                Slots: [index],
              });
              return {
                ...slot,
                isSelected: true,
              };
            }
            return slot;
          });
          putAwayAction.setSlots(updatedSlots);
          if (
            updatedSlots.some((slot: SlotInterface) => slot?.isSelected) &&
            !updatedSlots
              .find((slot: SlotInterface) => slot?.isSelected)
              ?.toteContent.some((item: ToteContainedItemOutputDTO) => item.amount)
          )
            putAwayAction.toggleModalState(RASPickingModals.ForceRemoveTote);
          return;
        }
        const updatedSlots = slots.map((slot: SlotInterface) =>
          slot?.toteName === slots.find((slot: SlotInterface) => slot?.toteName)?.toteName
            ? {
                ...slot,
                isSelected: true,
              }
            : slot
        );
        putAwayAction.setSlots(updatedSlots);
      } else {
        const phaseItem = localStorage.getItem('phase');
        phaseItem && putAwayAction.toggleModalState(RASPickingModals.ForceAddTote);
      }
    }
    if (rasStationTotesResponse?.error) {
      errorHandler(rasStationTotesResponse?.error?.internalErrorNumber);
    }
  }, [rasStationTotesResponse]);

  useEffect(() => {
    if (rasCheckBarcodeTypeResponse?.data) {
      if (rasCheckBarcodeTypeResponse.data.type === BarcodeType.Tote && !putAwayState.phases.Cell) {
        if (
          putAwayState.slots.some(
            (slot: SlotInterface) =>
              !slot?.isSelected && slot?.toteName?.toLowerCase() === putAwayState.barcodeData?.toLowerCase()
          )
        ) {
          messageHandler(InfoMessageBoxState.None, '');
          new Audio(Sounds.Approve4).play();
          putAwayAction.setSuccessMessage(
            <>
              <Box>{t(`${successKey}.ToteChanged`)}</Box>
              <Box color="palette.hardGrey" fontWeight={900} mt={8}>{`${
                putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteName
              }(Slot${putAwayState.slots.findIndex((slot: SlotInterface) => slot?.isSelected) + 1}) ->`}</Box>
              <Box color="palette.hardGrey" fontWeight={900}>{`${
                putAwayState.barcodeData
              }(Slot${putAwayState.slots.findIndex(
                (slot: SlotInterface) => slot?.toteName?.toLowerCase() === putAwayState.barcodeData?.toLowerCase()
              ) + 1}) ->`}</Box>
            </>
          );
          sendSlotMessage({
            MessageType: MessageTypes.TurnOffAllButtons,
          });
          sendSlotMessage({
            MessageType: MessageTypes.TurnOnButtons,
            Slots: [putAwayState.slots.findIndex((slot: SlotInterface) => slot?.toteName?.toLowerCase() === putAwayState.barcodeData?.toLowerCase())],
          });
          const slots = putAwayState.slots.map((slot: SlotInterface) => ({
            ...slot,
            isSelected: slot.toteName?.toLowerCase() === putAwayState.barcodeData?.toLowerCase() ? true : false,
          }));
          return putAwayAction.setSlots(slots);
        }
        if (putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteName?.toLowerCase() === putAwayState.barcodeData?.toLowerCase()) {
          putAwayAction.setSelectedSlot(putAwayState.slots.findIndex((slot: SlotInterface) => slot?.isSelected));
          putAwayAction.setToteToBeRemoved(putAwayState.barcodeData);
          putAwayAction.toggleModalState(RASPickingModals.RemoveTote);
        }
        if (!putAwayState.slots.find((slot: SlotInterface) => slot?.toteName?.toLowerCase() === putAwayState.barcodeData?.toLowerCase())) {
          return errorHandler(InternalErrorNumber.RasToteNotAtStation);
        }
        return;
      }
      if (
        rasCheckBarcodeTypeResponse.data.type === BarcodeType.Product &&
        (putAwayState.phases.Product || putAwayState.phases.Cell)
      ) {
        messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
        dispatch(
          resourceActions.resourceRequested(ResourceType.RasStowCheckProduct, {
            addressLabel: putAwayState.station.label,
            toteLabel: putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteName,
            productBarcode: putAwayState.barcodeData,
          })
        );
        return;
      }
      if (rasCheckBarcodeTypeResponse.data.type === BarcodeType.Cell && putAwayState.phases.Cell) {
        messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
        dispatch(
          resourceActions.resourceRequested(ResourceType.RasCheckCell, {
            addressLabel: putAwayState.station.label,
            cellLabel: putAwayState.barcodeData,
          })
        );
        return;
      }
      return errorHandler(InternalErrorNumber.RasBarcodeNotFound);
    }
    if (rasCheckBarcodeTypeResponse?.error) {
      errorHandler(rasCheckBarcodeTypeResponse?.error?.internalErrorNumber);
    }
  }, [rasCheckBarcodeTypeResponse]);

  useEffect(() => {
    if (rasStowCheckToteResponse?.isSuccess) {
      const emptySlots = Array.from({ length: slotLimit })
        .map((_, i) => {
          if (!putAwayState.slots[i]?.toteName) return i;
          return undefined;
        })
        .filter((i): i is number => i !== undefined);

      new Audio(Sounds.SideFlow).play();
      putAwayAction.setToteToBeAdded(putAwayState.barcodeData);
      if (putAwayState.selectedSlot !== undefined) {
        messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
        dispatch(
          resourceActions.resourceRequested(ResourceType.RasStowPlaceTote, {
            payload: {
              addressLabel: putAwayState.station.label,
              toteLabel: putAwayState.barcodeData,
              slot: putAwayState.selectedSlot,
            },
          })
        );
        return;
      }
      messageHandler(InfoMessageBoxState.None, '');
      sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
      sendSlotMessage({
        MessageType: MessageTypes.TurnOnButtons,
        Slots: emptySlots,
      });
    }
    if (rasStowCheckToteResponse?.error) {
      errorHandler(rasStowCheckToteResponse?.error?.internalErrorNumber);
    }
  }, [rasStowCheckToteResponse]);

  useEffect(() => {
    if (rasStowPlaceToteResponse?.data?.stationSlot !== undefined) {
      messageHandler(InfoMessageBoxState.None, '');
      new Audio(Sounds.AddTote).play();

      const metricType = putAwayState.modals.AddTote ? RasMetricType.AddTote : RasMetricType.ForceAddTote;

      dispatch(resourceActions.resourceRequested(ResourceType.RasStowStationMetric, {
        payload: {
          metricType: metricType,
          station: putAwayState?.station?.label || 'DefaultLabel',
          stationType: 'Stow',
          Time: new Date().toISOString(),
        }
      }));

      putAwayAction.setSuccessMessage(
        <>
          <Box>
            {t(
              `${successKey}.${
                putAwayState.modals.RemoveTote || putAwayState.modals.ForceRemoveTote
                  ? 'ToteRemovedToteAdded'
                  : 'ToteAdded'
              }`
            )}
          </Box>
          {putAwayState.modals.RemoveTote || putAwayState.modals.ForceRemoveTote ? (
            <Box
              color="palette.hardGrey"
              fontWeight={900}
            >{`${putAwayState.toteToBeRemoved} -> ${putAwayState.toteToBeAdded}`}</Box>
          ) : (
            <Box color="palette.hardGrey" fontWeight={900}>{`${putAwayState.toteToBeAdded} -> ${t(
              `${intlKey}.TopBar.Slot`
            )} ${rasStowPlaceToteResponse.data.stationSlot + 1}`}</Box>
          )}
          <Box>{t(`${successKey}.ToteIsStarted`)}</Box>
          <Box color="palette.hardGrey" fontWeight={900}>{`${putAwayState.toteToBeAdded} (${t(
            `${intlKey}.TopBar.Slot`
          )} ${rasStowPlaceToteResponse.data.stationSlot + 1})`}</Box>
        </>
      );

      const slots = putAwayState.slots.map((slot: SlotInterface) => ({
        ...slot,
        isSelected: false,
      }));
      slots[rasStowPlaceToteResponse.data.stationSlot] = {
        toteName: putAwayState.toteToBeAdded,
        isSelected: true,
        toteContent: rasStowPlaceToteResponse?.data?.containedProducts || [],
      };
      putAwayAction.setSlots(slots);
      initializer();
      sendSlotMessage({
        MessageType: MessageTypes.TurnOnButtons,
        Slots: [slots.findIndex((slot: SlotInterface) => slot?.isSelected)],
      });
      putAwayAction.togglePhaseState(PickingPhases.Product, true);
    }
    if (rasStowPlaceToteResponse?.error) {
      errorHandler(rasStowPlaceToteResponse?.error?.internalErrorNumber);
    }
  }, [rasStowPlaceToteResponse]);

  useEffect(() => {
    if (rasStowCheckProductResponse?.isSuccess) {
      messageHandler(InfoMessageBoxState.None, '');
      new Audio(Sounds.Approve).play();

      dispatch(resourceActions.resourceRequested(ResourceType.RasStowStationMetric, {
        payload: {
          metricType: RasMetricType.ScanItem,
          station: putAwayState?.station?.label || 'DefaultLabel',
          stationType: 'Stow',
          Time: new Date().toISOString(),
        }
      }))

      putAwayState.product?.barcodes && putAwayState.product.barcodes.includes(putAwayState.barcodeData)
        ? null
        : putAwayState.product?.barcodes
        ? putAwayAction.setSuccessMessage(
            <>
              <Box>{t(`${successKey}.ProductChanged`)}</Box>
              <Flex color="palette.hardGrey" mx="auto" mt={8}>
                <Box fontWeight={500}>{productBarcode.slice(0, -5)}</Box>
                <Box fontWeight={900}>
                  {productBarcode.slice(-5)} {'->'}
                </Box>
              </Flex>
              <Flex color="palette.hardGrey" mx="auto">
                <Box fontWeight={500}>{putAwayState.barcodeData.slice(0, -5)}</Box>
                <Box fontWeight={900}>{putAwayState.barcodeData.slice(-5)}</Box>
              </Flex>
            </>
          )
        : putAwayAction.setSuccessMessage(
            <>
              <Box>{t(`${successKey}.ProductScanned`)}</Box>
              <Box color="palette.hardGrey" fontWeight={500} mt={8}>{`${
                putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteName
              } ->`}</Box>
              <Flex color="palette.hardGrey" mx="auto">
                <Box fontWeight={500}>{putAwayState.barcodeData.slice(0, -5)}</Box>
                <Box fontWeight={900}>{putAwayState.barcodeData.slice(-5)}</Box>
              </Flex>
            </>
          );

      setProductBarcode(putAwayState.barcodeData);
      const product = putAwayState.slots
        .find((slot: SlotInterface) => slot?.isSelected)
        ?.toteContent.find((item: ToteContainedItemOutputDTO) =>
          item?.barcodes?.split(',').includes(putAwayState.barcodeData)
        );
      putAwayAction.setProduct(product);
      putAwayAction.togglePhaseState(PickingPhases.Cell, true);
    }
    if (rasStowCheckProductResponse?.error) {
      errorHandler(rasStowCheckProductResponse?.error?.internalErrorNumber);
    }
  }, [rasStowCheckProductResponse]);

  useEffect(() => {
    if (rasCheckCellResponse?.isSuccess) {
      messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
      dispatch(
        resourceActions.resourceRequested(ResourceType.RasStowPlaceProduct, {
          payload: {
            addressLabel: putAwayState.station.label,
            toteLabel: putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteName,
            cellLabel: putAwayState.barcodeData,
            productBarcode: productBarcode,
          },
        })
      );
    }
    if (rasCheckCellResponse?.error) {
      errorHandler(rasCheckCellResponse?.error?.internalErrorNumber);
    }
  }, [rasCheckCellResponse]);

  useEffect(() => {
    if (rasStowPlaceProductResponse?.isSuccess) {
      new Audio(Sounds.Approve2).play();

      dispatch(resourceActions.resourceRequested(ResourceType.RasStowStationMetric, {
        payload: {
          metricType: RasMetricType.ScanCell,
          station: putAwayState?.station?.label || 'DefaultLabel',
          stationType: 'Stow',
          Time: new Date().toISOString(),
        }
      }))

      putAwayAction.setSuccessMessage(
        <>
          <Box>{t(`${successKey}.ProductPlaced`)}</Box>
          <Flex color="palette.hardGrey" mx="auto" mt={16}>
            <Box fontWeight={500}>{productBarcode.slice(0, -5)}</Box>
            <Box fontWeight={900}>{productBarcode.slice(-5)}</Box>
            <Box fontWeight={500}>
              {' '}
              {`-> ${putAwayState.barcodeData
                .split('-')
                .slice(2)
                .join('-')}`}
            </Box>
          </Flex>
        </>
      );
      const slots = putAwayState.slots.map((slot: SlotInterface) =>
        slot?.isSelected
          ? {
              ...slot,
              toteContent: slot.toteContent.map((item: ToteContainedItemOutputDTO) =>
                putAwayState.product?.barcodes && item?.barcodes?.includes(putAwayState.product?.barcodes)
                  ? { ...item, amount: (item.amount || 0) - 1 }
                  : item
              ),
            }
          : slot
      );
      putAwayAction.setSlots(slots);
      putAwayAction.setProduct({});
      setProductBarcode('');
      putAwayAction.togglePhaseState(PickingPhases.Product);
      if (
        !slots
          .find((slot: SlotInterface) => slot?.isSelected)
          ?.toteContent.some((item: ToteContainedItemOutputDTO) => item.amount)
      ) {
        putAwayAction.setSelectedSlot(undefined);
        return putAwayAction.toggleModalState(RASPickingModals.ForceRemoveTote);
      }
      messageHandler(InfoMessageBoxState.None, '');
    }
    if (rasStowPlaceProductResponse?.error) {
      errorHandler(rasStowPlaceProductResponse?.error?.internalErrorNumber);
    }
  }, [rasStowPlaceProductResponse]);

  useEffect(() => {
    if (rasStowDropToteResponse?.isSuccess) {
      new Audio(Sounds.DropTote).play();
      
      const metricType = putAwayState.modals.RemoveTote ? RasMetricType.DropTote : RasMetricType.ForceDropTote;
      
      dispatch(resourceActions.resourceRequested(ResourceType.RasStowStationMetric, {
        payload: {
          metricType: metricType,
          station: putAwayState?.station?.label || 'DefaultLabel',
          stationType: 'Stow',
          Time: new Date().toISOString(),
        }
      }));

      messageHandler(InfoMessageBoxState.None, '');
      putAwayAction.setSuccessMessage(
        <>
          <Box>{t(`${successKey}.ToteRemoved`)}</Box>
          <Box color="palette.hardGrey" fontWeight={900} mt={16}>{`${putAwayState.toteToBeRemoved} (${t(
            `${intlKey}.TopBar.Slot`
          )} ${(putAwayState.selectedSlot as number) + 1})`}</Box>
        </>
      );
      sendSlotMessage({ MessageType: MessageTypes.TurnOffAllButtons });
      sendSlotMessage({
        MessageType: MessageTypes.TurnOnButtons,
        Slots: [putAwayState.selectedSlot],
      });
      const slots = putAwayState.slots;
      delete slots[putAwayState.selectedSlot as number];
      !slots.some((slot: SlotInterface) => slot?.isSelected) && localStorage.removeItem('activeTote');
      putAwayAction.setSlots(slots);
    }
    if (rasStowDropToteResponse?.error) {
      errorHandler(rasStowDropToteResponse?.error?.internalErrorNumber);
    }
  }, [rasStowDropToteResponse]);

  useEffect(() => {
    if (rasReleasePodResponse?.isSuccess) {
      dispatch(resourceActions.resourceRequested(ResourceType.RasStowStationMetric, {
        payload: {
          metricType: RasMetricType.ReleasePod,
          station: putAwayState?.station?.label || 'DefaultLabel',
          stationType: 'Stow',
          Time: new Date().toISOString(),
        }
      }))
      messageHandler(InfoMessageBoxState.None, '');
    }
    if (rasReleasePodResponse?.error) {
      errorHandler(rasReleasePodResponse?.error?.internalErrorNumber);
    }
  }, [rasReleasePodResponse]);

  return <></>;
};

export default StationEffectTrigger;
