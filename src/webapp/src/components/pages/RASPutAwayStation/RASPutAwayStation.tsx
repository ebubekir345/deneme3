import { Button, Flex, Icon, Input } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import Hotkeys from 'react-hot-keys';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { isBarcodeDebuggingEnabled } from '../../../config/config.default';
import { ResourceType } from '../../../models';
import {
  CheckBarcodeTypeForRasOutputDTO,
  InternalErrorNumber, RasMetricType,
  RasStationToteOutputDTO,
} from '../../../services/swagger';
import { PickingPhases, RASPickingModals } from '../../../store/global/rasPickingStore';
import useRASPutAwayStore from '../../../store/global/rasPutAwayStore';
import { StoreState } from '../../../store/initState';
import useWebSocket, {
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
import { Sounds } from '../RASPickingStation/RASPickingStation';
import BottomBar from './bones/BottomBar';
import ButtonEffectTrigger from './bones/ButtonEffectTrigger';
import ForceRemoveToteModal from './bones/ForceRemoveToteModal';
import MiddleBar from './bones/MiddleBar';
import MoreActionScreen from './bones/MoreActionsScreen';
import RemoveToteModal from './bones/RemoveToteModal';
import ReturnDialogModal from './bones/ReturnDialogModal';
import StationEffectTrigger from './bones/StationEffectTrigger';
import TopBar from './bones/TopBar';

const intlKey = 'TouchScreen.RASPickingStation';

const RASPutAwayStation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [putAwayState, putAwayAction] = useRASPutAwayStore();
  const [slotMessage, state, sendSlotMessage] = useWebSocket(terminalWebSocketUrl);
  const [podMessage] = useWebSocket(`${terminalWebSocketUrl}Stow?id=${putAwayState?.station?.label}`);
  const [isPodReady, setIsPodReady] = useState<boolean>(false);
  const [button, setButton] = useState<undefined | number>(undefined);
  const [isAddToteButtonClicked, setIsAddToteButtonClicked] = useState<boolean>(false);
  const [isRemoveToteButtonClicked, setIsRemoveToteButtonClicked] = useState<boolean>(false);
  const [productBarcode, setProductBarcode] = useState<string>('');

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

  const messageHandler = (state: InfoMessageBoxState, text: string) =>
    putAwayAction.callInfoMessageBox({
      state: state,
      text: text,
      timer: state === InfoMessageBoxState.Scan ? 6 : 3,
    });

  const errorHandler = error =>
    error &&
    error !== 'None' &&
    messageHandler(
      InfoMessageBoxState.Error,
      t(`${intlKey}.Error.${Object.keys(InternalErrorNumber).find(key => InternalErrorNumber[key] === error)}`)
    );

  useEffect(() => {
    if (podMessage?.MessageType === PodMessageType.POD_READY) {
      dispatch(resourceActions.resourceRequested(ResourceType.RasStowStationMetric, {
        payload: {
          metricType: RasMetricType.PodReady,
          station: putAwayState?.station?.label || 'DefaultLabel',
          stationType: 'Stow',
          Time: podMessage.Time,
        }
      }))

      if (!isPodReady) {
        dispatch(resourceActions.resourceRequested(ResourceType.RasStowStationMetric, {
          payload: {
            metricType: RasMetricType.AwaitingPod,
            station: putAwayState?.station?.label || 'DefaultLabel',
            stationType: 'Stow',
            Time: new Date().toISOString(),
          }
        }))
        return setIsPodReady(true);
      }

      if (podMessage?.MessageType === PodMessageType.POD_LEAVING) {
        new Audio(Sounds.Nextpod).play();
        putAwayAction.togglePhaseState(PickingPhases.POD);

        dispatch(resourceActions.resourceRequested(ResourceType.RasStowStationMetric, {
          payload: {
            metricType: RasMetricType.PodLeaving,
            station: putAwayState?.station?.label || 'DefaultLabel',
            stationType: 'Stow',
            Time: podMessage.Time,
          }
        }))

        dispatch(resourceActions.resourceRequested(ResourceType.RasStowStationMetric, {
          payload: {
            metricType: RasMetricType.ReleasePod,
            station: putAwayState?.station?.label || 'DefaultLabel',
            stationType: 'Stow',
            Time: new Date().toISOString(),
          }
        }))
        return setIsPodReady(false);
      }
    }
  }, [podMessage]);

  useEffect(() => {
    if (isPodReady) {
      if (!putAwayState.modals.ForceAddTote && !putAwayState.slots.some((slot: SlotInterface) => slot?.toteName)) {
        putAwayAction.toggleModalState(RASPickingModals.ForceAddTote);

        dispatch(resourceActions.resourceRequested(ResourceType.RasStowStationMetric, {
          payload: {
            metricType: RasMetricType.ForceAddTote,
            station: putAwayState?.station?.label || 'DefaultLabel',
            stationType: 'Stow',
            Time: new Date().toISOString(),
          }
        }))

      }
      if (putAwayState.phases.POD || !Object.keys(PickingPhases).some(phase => putAwayState.phases[phase])) {
        new Audio(Sounds.Nextpod).play();
        putAwayAction.togglePhaseState(PickingPhases.Product);
      }
    }
  }, [isPodReady]);

  const handleBarcodeScan = (data: string) => {
    data = data.trim();
    if (
      putAwayState.modals.Logout ||
      putAwayState.isMoreActionsOpen ||
      (putAwayState.modals.ForceRemoveTote && putAwayState.toteToBeAdded) ||
      ((putAwayState.modals.ForceAddTote || putAwayState.modals.AddTote) && putAwayState.toteToBeAdded)
    )
      return;
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

    messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Processing`));
    putAwayAction.setBarcodeData(data);
    if (putAwayState.modals.ForceAddTote || putAwayState.modals.AddTote) {
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RasStowCheckTote, {
          addressLabel: putAwayState.station.label,
          toteLabel: data,
        })
      );
    }
    if (
      (putAwayState.modals.RemoveTote || putAwayState.modals.ForceRemoveTote) &&
      putAwayState.selectedSlot !== undefined &&
      !putAwayState.slots[putAwayState.selectedSlot]?.toteName
    ) {
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RasStowCheckTote, {
          addressLabel: putAwayState.station.label,
          toteLabel: data,
        })
      );
    }
    if (putAwayState.modals.RemoveTote) {
      if (putAwayState.slots.find((slot: SlotInterface) => slot?.toteName === data)) {
        putAwayAction.setToteToBeRemoved(data);
        putAwayAction.setSelectedSlot(putAwayState.slots.findIndex((slot: SlotInterface) => slot?.toteName === data));
        return dispatch(
          resourceActions.resourceRequested(ResourceType.RasStowDropTote, {
            payload: {
              addressLabel: putAwayState.station.label,
              toteLabel: data,
            },
          })
        );
      }
      return errorHandler(InternalErrorNumber.RasBarcodeNotFound);
    }
    if (putAwayState.modals.ForceRemoveTote) {
      if (putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteName === data) {
        putAwayAction.setToteToBeRemoved(data);
        putAwayAction.setSelectedSlot(putAwayState.slots.findIndex((slot: SlotInterface) => slot?.isSelected));
        return dispatch(
          resourceActions.resourceRequested(ResourceType.RasStowDropTote, {
            payload: {
              addressLabel: putAwayState.station.label,
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
      <Hotkeys
        keyName={'alt+t,alt+T'}
        disabled={
          rasReleasePodResponse?.isBusy ||
          putAwayState.phases.POD ||
          (putAwayState.infoMessageBox.state === InfoMessageBoxState.Scan && Boolean(putAwayState.infoMessageBox.text))
        }
        onKeyDown={() =>
          dispatch(
            resourceActions.resourceRequested(ResourceType.RasReleasePod, {
              payload: {
                addressLabel: putAwayState.station.label,
              },
            })
          )
        }
      />
      <ErrorOverlay
        isOpen={
          putAwayState?.infoMessageBox?.state === InfoMessageBoxState.Error && putAwayState?.infoMessageBox?.text !== ''
        }
        width={1}
        rotationX={ErrorOverlayRotationX.right}
      />
      <TopBar />
      <MiddleBar />
      <BottomBar sendSlotMessage={sendSlotMessage} />
      <Flex justifyContent="space-between" width="25vw" my={8} zIndex={5000} position="absolute" bottom={8}>
        <Button
          variant="light"
          outline="none !important"
          ml={32}
          onClick={() => putAwayAction.setIsMoreActionsOpen(true)}
        >
          <Icon name="fas fa-ellipsis-v" color="palette.softBlue" />
        </Button>
        {putAwayState.isMoreActionsOpen && <MoreActionScreen />}
        {isBarcodeDebuggingEnabled && (
          <Input onChange={handleTestBarcodeInputChange} width={120} height={32} autoFocus />
        )}
      </Flex>
      {putAwayState.infoMessageBox.state !== InfoMessageBoxState.Success && putAwayState.infoMessageBox.text && (
        <InfoMessageBox message={putAwayState.infoMessageBox} callInfoMessageBox={putAwayAction.callInfoMessageBox} />
      )}
      {putAwayState.isManuelBarcodeInputOpen && (
        <ManuelBarcodeInput
          placeholder={t(`${intlKey}.ManuelBarcodeInput.Placeholder`)}
          closeScreenKeyboard={() => putAwayAction.setIsManuelBarcodeInputOpen(false)}
          getBarcodeDataFromScreenKeyboard={data => handleBarcodeScan(data)}
        />
      )}
      {putAwayState.modals.Logout && <ReturnDialogModal />}
      {putAwayState.modals.AddTote && <AddToteModal state={putAwayState} action={putAwayAction} />}
      {putAwayState.modals.RemoveTote && (
        <RemoveToteModal
          setIsRemoveToteButtonClicked={setIsRemoveToteButtonClicked}
          sendSlotMessage={sendSlotMessage}
        />
      )}
      {putAwayState.modals.ForceAddTote && <ForceAddToteModal state={putAwayState} />}
      {putAwayState.modals.ForceRemoveTote && <ForceRemoveToteModal sendSlotMessage={sendSlotMessage} />}
      <ButtonEffectTrigger
        messageHandler={messageHandler}
        errorHandler={errorHandler}
        button={button}
        setButton={setButton}
        setIsPodReady={setIsPodReady}
        productBarcode={productBarcode}
        setProductBarcode={setProductBarcode}
        sendSlotMessage={sendSlotMessage}
      />
      <StationEffectTrigger
        messageHandler={messageHandler}
        errorHandler={errorHandler}
        setButton={setButton}
        setIsAddToteButtonClicked={setIsAddToteButtonClicked}
        setIsRemoveToteButtonClicked={setIsRemoveToteButtonClicked}
        productBarcode={productBarcode}
        setProductBarcode={setProductBarcode}
        sendSlotMessage={sendSlotMessage}
      />
    </Flex>
  );
};

export default RASPutAwayStation;
