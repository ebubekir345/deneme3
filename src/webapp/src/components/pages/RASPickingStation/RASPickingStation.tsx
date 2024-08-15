import { Button, Flex, Icon, Input } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import Hotkeys from 'react-hot-keys';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { isBarcodeDebuggingEnabled } from '../../../config/config.default';
import { ResourceType } from '../../../models';
import { logEvent } from '../../../utils/logEvent';

import {
  CheckBarcodeTypeForRasOutputDTO,
  CheckProductForPickOutputDTO,
  InternalErrorNumber,
  RasMetricType,
  RasPlaceProductOutputDTO,
  RasStationToteOutputDTO,
} from '../../../services/swagger';
import useRASPickingStore, { PickingPhases, RASPickingModals } from '../../../store/global/rasPickingStore';
import { StoreState } from '../../../store/initState';
import useWebSocket, {
  MessageTypes,
  PodMessageType,
  SlotButton,
  slotLimit,
  terminalWebSocketUrl,
} from '../../../utils/useWebSocket';
import AddToteModal from '../../molecules/AddToteModal/AddToteModal';
import ErrorOverlay, { ErrorOverlayRotationX } from '../../molecules/ErrorOverlay/ErrorOverlay';
import ForceAddToteModal from '../../molecules/ForceAddModal/ForceAddToteModal';
import InfoMessageBox, { InfoMessageBoxState } from '../../molecules/InfoMessageBox/InfoMessageBox';
import ManuelBarcodeInput from '../../organisms/ManuelBarcodeInput';
import BottomBar from './bones/BottomBar';
import ButtonEffectTrigger from './bones/ButtonEffectTrigger';
import ForceRemoveCandidateToteModal from './bones/ForceRemoveCandidateToteModal';
import ForceRemoveToteModal from './bones/ForceRemoveToteModal';
import MiddleBar from './bones/MiddleBar';
import MoreActionScreen from './bones/MoreActionsScreen';
import ProblemProductModal from './bones/ProblemProductModal';
import RemoveToteModal from './bones/RemoveToteModal';
import ReturnDialogModal from './bones/ReturnDialogModal';
import StationEffectTrigger from './bones/StationEffectTrigger';
import TopBar from './bones/TopBar';

const intlKey = 'TouchScreen.RASPickingStation';

export enum Sounds {
  SideFlow = '/sounds/side-flow-success.mp3',
  Approve = '/sounds/approve.mp3',
  Approve2 = '/sounds/approve2.mp3',
  Approve3 = '/sounds/approve3.mp3',
  Approve4 = '/sounds/approve4.mp3',
  AddTote = '/sounds/add-tote.mp3',
  DropTote = '/sounds/drop-tote.mp3',
  Nextpod = '/sounds/nextpod.mp3',
}

const RASPickingStation = () => {
  const { t } = useTranslation();
  const [pickingState, pickingAction] = useRASPickingStore();
  const dispatch = useDispatch();
  const [slotMessage, state, sendSlotMessage] = useWebSocket(terminalWebSocketUrl);
  const [podMessage] = useWebSocket(`${terminalWebSocketUrl}Pick?id=${pickingState?.station?.label}`);
  const [isPodReady, setIsPodReady] = useState<boolean>(false);
  const [button, setButton] = useState<undefined | number>(undefined);
  const [productBarcode, setProductBarcode] = useState<string>('');
  const [isRemoveToteButtonClicked, setIsRemoveToteButtonClicked] = useState<boolean>(false);
  const [completedTotes, setCompletedTotes] = useState<
    (
      | undefined
      | {
        toteName: string;
        isSelected: boolean;
        isRemoved: boolean;
        isNewToteAdded: boolean;
      }
    )[]
  >([]);
  const [candidateDropTotes, setCandidateDropTotes] = useState<
    (
      | undefined
      | {
        toteName: string;
        isSelected: boolean;
      }
    )[]
  >([]);

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

  const messageHandler = (state: InfoMessageBoxState, text: string) =>
    pickingAction.callInfoMessageBox({
      state: state,
      text: text,
      timer: state === InfoMessageBoxState.Scan ? 10 : 3,
    });

  const errorHandler = error =>
    error &&
    error !== 'None' &&
    messageHandler(
      InfoMessageBoxState.Error,
      t(`${intlKey}.Error.${Object.keys(InternalErrorNumber).find(key => InternalErrorNumber[key] === error)}`)
    );

  useEffect(() => {
    messageHandler(InfoMessageBoxState.None, '');
    if (podMessage?.MessageType === PodMessageType.POD_READY){
      dispatch(resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
        payload: {
          metricType: RasMetricType.PodReady,
          station: pickingState?.station?.label || 'DefaultLabel',
          stationType: 'Pick',
          Time: podMessage.Time,
        }
      }))

      if(!isPodReady) {
        dispatch(resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
          payload: {
            metricType: RasMetricType.AwaitingPod,
            station: pickingState?.station?.label || 'DefaultLabel',
            stationType: 'Pick',
            Time: new Date().toISOString(),
          }
        }))

        dispatch(resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
          payload: {
            metricType: RasMetricType.AwaitingPicklist,
            station: pickingState?.station?.label || 'DefaultLabel',
            stationType: 'Pick',
            Time: new Date().toISOString(),
          }
        }))
        return setIsPodReady(true);
      }
    }
    if (podMessage?.MessageType === PodMessageType.POD_LEAVING) {
      new Audio(Sounds.Nextpod).play();
      pickingAction.togglePhaseState(PickingPhases.POD);

      dispatch(resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
        payload: {
          metricType: RasMetricType.PodLeaving,
          station: pickingState?.station?.label || 'DefaultLabel',
          stationType: 'Pick',
          Time: podMessage.Time,
        }
      }))

      dispatch(resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
        payload: {
          metricType: RasMetricType.ReleasePod,
          station: pickingState?.station?.label || 'DefaultLabel',
          stationType: 'Pick',
          Time: new Date().toISOString(),
        }
       }))

      return setIsPodReady(false);
    }
    if (podMessage?.MessageType === PodMessageType.CURRENT_PICK && isPodReady) {
      pickingAction.setProduct({
        productId: podMessage.ProductId,
        productName: podMessage.ProductName,
        imageURL: podMessage.ImageURL,
        operationName: podMessage.OperationName,
        barcodes: podMessage.Barcodes,
      });

      pickingAction.setCellLabel(podMessage.CellLabel);
      pickingAction.setPickListId(podMessage.PickListId);
      pickingAction.toggleModalState(RASPickingModals.ProblemProduct, false);
      pickingAction.setIsPalette(podMessage.IsPalette);
    }
  }, [podMessage]);

  useEffect(() => {
    if (isPodReady) {
      !pickingState.modals.ForceAddTote &&
        rasStationTotesResponse?.isSuccess &&
        !rasStationTotesResponse?.data?.length &&
        !pickingState.slots.some((slot: SlotInterface) => slot?.toteName) &&
        pickingAction.toggleModalState(RASPickingModals.ForceAddTote);

      dispatch(resourceActions.resourceRequested(ResourceType.RasPickStationMetric, {
        payload: {
          metricType: RasMetricType.ForceAddTote,
          station: pickingState?.station?.label || 'DefaultLabel',
          stationType: 'Pick',
          Time: new Date().toISOString(),
        }
      }))

      if (pickingState.phases.POD || !Object.keys(PickingPhases).some(phase => pickingState.phases[phase])) {
        new Audio(Sounds.Nextpod).play();
        pickingAction.togglePhaseState(PickingPhases.Cell);
      }
    }
  }, [isPodReady]);

  const handleBarcodeScan = (data: string) => {
    data = data.trim();
    if (
      pickingState.modals.Logout ||
      pickingState.isMoreActionsOpen ||
      (pickingState.modals.ForceRemoveTote &&
        completedTotes.filter(tote => tote).every(tote => tote?.isRemoved) &&
        !completedTotes.some(tote => tote?.isSelected)) ||
      ((pickingState.modals.ForceAddTote || pickingState.modals.AddTote) && pickingState.toteToBeAdded)
    )
      return;
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

    messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
    pickingAction.setBarcodeData(data);
    if (pickingState.modals.ForceAddTote || pickingState.modals.AddTote) {
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RasPickCheckTote, {
          addressLabel: pickingState.station.label,
          toteLabel: data,
        })
      );
    }
    if (
      (pickingState.modals.ForceRemoveCandidateTote || pickingState.modals.RemoveTote) &&
      pickingState.toteToBeRemoved
    ) {
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RasPickCheckTote, {
          addressLabel: pickingState.station.label,
          toteLabel: data,
        })
      );
    }
    if (pickingState.modals.RemoveTote || pickingState.modals.ForceRemoveCandidateTote) {
      if (
        pickingState.modals.RemoveTote
          ? pickingState.slots.find((slot: SlotInterface) => slot?.toteName === data)
          : candidateDropTotes.find(tote => tote?.toteName === data)
      ) {
        const slot = pickingState.slots.findIndex((slot: SlotInterface) => slot?.toteName === data);

        pickingAction.setToteToBeRemoved(data);
        pickingAction.setSelectedSlot(slot);
        sendSlotMessage({
          MessageType: MessageTypes.TurnOffAllButtons,
        });
        return sendSlotMessage({
          MessageType: MessageTypes.TurnOnButtons,
          Slots: [slot],
        });
      }
      return errorHandler(InternalErrorNumber.RasBarcodeNotFound);
    }
    if (
      pickingState.modals.ForceRemoveTote &&
      completedTotes.filter(tote => tote).every(tote => tote?.isRemoved) &&
      completedTotes.some(tote => tote?.isSelected)
    ) {
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RasPickCheckTote, {
          addressLabel: pickingState.station.label,
          toteLabel: data,
        })
      );
    }
    if (pickingState.modals.ForceRemoveTote) {
      if (completedTotes.find(tote => tote?.toteName === data && !tote?.isRemoved)) {
        pickingAction.setSelectedSlot(completedTotes.findIndex(tote => tote?.toteName === data));
        return dispatch(
          resourceActions.resourceRequested(ResourceType.RasPickDropTote, {
            payload: {
              addressLabel: pickingState.station.label,
              toteLabel: data,
            },
          })
        );
      }
      return errorHandler(InternalErrorNumber.RasBarcodeNotFound);
    }

    return dispatch(
      resourceActions.resourceRequested(ResourceType.RasCheckBarcodeType, {
        barcode: data,
      })
    );
  };

  // Testing Purpose
  const [barcodeTestInput, setBarcodeTestInput] = useState('');
  useEffect(() => {
    setBarcodeTestInput('');
  });
  const handleTestBarcodeInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    setBarcodeTestInput(e.currentTarget.value.trim());
  };
  // END Testing Purpose

  return (
    <Flex height="100vh" bg="palette.softGrey" flexDirection="column" fontFamily="touchScreen" overflow="hidden">
      <BarcodeReader onScan={handleBarcodeScan} avgTimeByChar={100} testCode={barcodeTestInput} minLength={2} />
      {Array.from({ length: slotLimit }).map((_, i) => (
        <Hotkeys keyName={SlotButton[i]} onKeyDown={() => setButton(i)} />
      ))}
      <ErrorOverlay
        isOpen={
          pickingState?.infoMessageBox?.state === InfoMessageBoxState.Error && pickingState?.infoMessageBox?.text !== ''
        }
        width={1}
        rotationX={ErrorOverlayRotationX.right}
      />
      <TopBar />
      <MiddleBar />
      <BottomBar setIsRemoveToteButtonClicked={setIsRemoveToteButtonClicked} />
      <Flex justifyContent="space-between" width="25vw" zIndex={5000} my={8} position="absolute" bottom={8}>
        <Button
          variant="light"
          outline="none !important"
          ml={32}
          onClick={() => pickingAction.setIsMoreActionsOpen(true)}
        >
          <Icon name="fas fa-ellipsis-v" color="palette.softBlue" />
        </Button>
        {pickingState.isMoreActionsOpen && <MoreActionScreen />}
        {isBarcodeDebuggingEnabled && (
          <Input onChange={handleTestBarcodeInputChange} width={120} height={32} autoFocus />
        )}
      </Flex>
      {pickingState.infoMessageBox.text && (
        <InfoMessageBox message={pickingState.infoMessageBox} callInfoMessageBox={pickingAction.callInfoMessageBox} />
      )}
      {pickingState.isManuelBarcodeInputOpen && (
        <ManuelBarcodeInput
          placeholder={t(`${intlKey}.ManuelBarcodeInput.Placeholder`)}
          closeScreenKeyboard={() => pickingAction.setIsManuelBarcodeInputOpen(false)}
          getBarcodeDataFromScreenKeyboard={data => handleBarcodeScan(data)}
        />
      )}
      {pickingState.modals.Logout && <ReturnDialogModal />}
      {pickingState.modals.AddTote && <AddToteModal state={pickingState} action={pickingAction} />}
      {pickingState.modals.RemoveTote && (
        <RemoveToteModal
          isRemoveToteButtonClicked={isRemoveToteButtonClicked}
          setIsRemoveToteButtonClicked={setIsRemoveToteButtonClicked}
        />
      )}
      {pickingState.modals.ForceAddTote && <ForceAddToteModal state={pickingState} />}
      {pickingState.modals.ForceRemoveTote && <ForceRemoveToteModal completedTotes={completedTotes} />}
      {pickingState.modals.ForceRemoveCandidateTote && (
        <ForceRemoveCandidateToteModal candidateDropTotes={candidateDropTotes} />
      )}
      {pickingState.modals.ProblemProduct && <ProblemProductModal />}
      <ButtonEffectTrigger
        messageHandler={messageHandler}
        errorHandler={errorHandler}
        button={button}
        setButton={setButton}
        completedTotes={completedTotes}
        setCompletedTotes={setCompletedTotes}
        productBarcode={productBarcode}
        setProductBarcode={setProductBarcode}
        sendSlotMessage={sendSlotMessage}
        setIsPodReady={setIsPodReady}
      />
      <StationEffectTrigger
        messageHandler={messageHandler}
        errorHandler={errorHandler}
        setButton={setButton}
        setIsRemoveToteButtonClicked={setIsRemoveToteButtonClicked}
        completedTotes={completedTotes}
        setCompletedTotes={setCompletedTotes}
        productBarcode={productBarcode}
        setProductBarcode={setProductBarcode}
        setCandidateDropTotes={setCandidateDropTotes}
        sendSlotMessage={sendSlotMessage}
        isPodReady={isPodReady}
      />
    </Flex>
  );
};

export default RASPickingStation;
