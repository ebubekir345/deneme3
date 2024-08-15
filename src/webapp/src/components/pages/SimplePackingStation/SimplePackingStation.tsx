import { Box, Button, Flex, Icon, Input } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isBarcodeDebuggingEnabled } from '../../../config/config.default';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import {
  AddCargoPackageCommandOutputDTO,
  PrintSLAMDocumentsOnPackingOutputDTO,
  SimplePackingProcessOutputDTO,
} from '../../../services/swagger';
import useSimplePackingStore, {
  initialSimplePackingState,
  SimplePackingModals,
} from '../../../store/global/simplePackingStore';
import { StoreState } from '../../../store/initState';
import ErrorOverlay, { ErrorOverlayRotationX } from '../../molecules/ErrorOverlay/ErrorOverlay';
import GenericErrorModal from '../../molecules/GenericErrorModal';
import InfoMessageBox, { InfoMessageBoxState } from '../../molecules/InfoMessageBox/InfoMessageBox';
import ReturnDialogModal from '../../molecules/ReturnDialogModal/ReturnDialogModal';
import { StationBox } from '../../molecules/TouchScreen';
import { DiscriminatorTypes } from '../../molecules/TouchScreen/StationBox';
import CargoPackagePickerModal from '../../organisms/CargoPackagePickerModal/CargoPackagePickerModal';
import ManuelBarcodeInput from '../../organisms/ManuelBarcodeInput';
import BoxItemList from './bones/BoxItemList';
import InfoBoxes from './bones/InfoBoxes';
import MoreActionScreen from './bones/MoreActionScreen';
import RightBar from './bones/RightBar';
import StationEffectTrigger from './bones/StationEffectTrigger';

const intlKey = 'TouchScreen';

declare global {
  interface Window {
    simplePackingTimeInterval: any;
  }
}

const SimplePackingStation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [packingState, packingAction] = useSimplePackingStore();
  const [isGenericErrorModalOpen, setIsGenericErrorModalOpen] = useState(false);

  const checkPackingProcessExistsResponse: Resource<SimplePackingProcessOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SimplePackingProcessCheckPackingProcessExists]
  );
  const createPackingProcessExistsResponse: Resource<SimplePackingProcessOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SimplePackingProcessCreatePackingProcess]
  );
  const addCargoPackageResponse: Resource<AddCargoPackageCommandOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SimplePackingProcessAddCargoPackage]
  );
  const queueItemsIntoCargoPackageResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SimplePackingProcessQueueItemsIntoCargoPackage]
  );
  const completePackingProcessResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SimplePackingProcessCompletePackingProcess]
  );
  const printCargoPackageLabelsResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SimplePackingProcessPrintCargoPackageLabels]
  );
  const printSLAMDocumentsResponse: Resource<PrintSLAMDocumentsOnPackingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SimplePackingProcessPrintSLAMDocuments]
  );

  useEffect(() => {
    window.simplePackingTimeInterval = setInterval(() => packingAction.setSimplePackingTime(true), 1000);
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.SimplePackingAddress) {
      packingAction.setStation(stationObject);
      dispatch(
        resourceActions.resourceRequested(ResourceType.SimplePackingProcessCheckPackingProcessExists, {
          simplePackingAddress: stationObject.label,
        })
      );
    } else history.push(urls.stationLogin);
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.SimplePackingProcessCheckPackingProcessExists));
      dispatch(resourceActions.resourceInit(ResourceType.SimplePackingProcessCreatePackingProcess));
      dispatch(resourceActions.resourceInit(ResourceType.SimplePackingProcessAddCargoPackage));
      dispatch(resourceActions.resourceInit(ResourceType.SimplePackingProcessQueueItemsIntoCargoPackage));
      dispatch(resourceActions.resourceInit(ResourceType.SimplePackingProcessCompletePackingProcess));
      dispatch(resourceActions.resourceInit(ResourceType.SimplePackingProcessPrintCargoPackageLabels));
      dispatch(resourceActions.resourceInit(ResourceType.SimplePackingProcessPrintSLAMDocuments));
      packingAction.clearState(initialSimplePackingState);
    };
  }, []);

  const messageHandler = (state: InfoMessageBoxState, text: string) =>
    packingAction.callInfoMessageBox({
      state: state,
      text: text,
    });

  const handleOrderDetails = data => {
    const {
      packingProcessId,
      salesOrderReferenceNumber,
      salesOrderId,
      operation,
      isEligibleForSLAMPrint,
      shippingFlow,
      operationCargoPackageTypes,
      oplogCargoPackageTypes,
    } = data as any;
    packingAction.setOperation(operation);
    packingAction.setOrderNumber(salesOrderReferenceNumber);
    packingAction.setOrderId(salesOrderId);
    packingAction.setProcessId(packingProcessId);
    packingAction.setIsEligibleForSLAMPrint(isEligibleForSLAMPrint);
    packingAction.setShippingFlow(shippingFlow);
    packingAction.setOperationCargoPackageTypes(operationCargoPackageTypes);
    packingAction.setOplogCargoPackageTypes(oplogCargoPackageTypes);
  };

  const handleBarcodeScan = (data: string) => {
    data = data.trim();

    if (
      checkPackingProcessExistsResponse?.isBusy ||
      createPackingProcessExistsResponse?.isBusy ||
      addCargoPackageResponse?.isBusy ||
      queueItemsIntoCargoPackageResponse?.isBusy ||
      completePackingProcessResponse?.isBusy ||
      printCargoPackageLabelsResponse?.isBusy ||
      printSLAMDocumentsResponse?.isBusy
    )
      return;

    messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Barcode.Scanning`));
    packingAction.setBarcodeData(data);

    if (packingState.modals.CargoPackagePick)
      return dispatch(
        resourceActions.resourceRequested(ResourceType.SimplePackingProcessAddCargoPackage, {
          params: {
            packingProcessId: packingState.processId,
            cargoPackageTypeBarcode: data,
            packageIndex: packingState.boxItems.length + 1,
          },
        })
      );
    if (!packingState.orderItems.length || packingState.isOrderCompleted)
      return dispatch(
        resourceActions.resourceRequested(ResourceType.SimplePackingProcessCreatePackingProcess, {
          payload: {
            packingAddressLabel: packingState.station.label,
            productBarcode: data,
          },
        })
      );
    if (packingState.orderItems.length) {
      const orderItemToBeScanned = packingState.orderItems.find(orderItem =>
        orderItem.barcodes?.find(barcode => barcode === data)
      );

      if (orderItemToBeScanned && orderItemToBeScanned?.scannedCount !== orderItemToBeScanned?.amountInOrder) {
        packingState.orderItems.reduce((a, c) => a + c.amountInOrder, 0) -
          packingState.orderItems.reduce((a, c) => a + (c.scannedCount || 0), 0) ===
          1 && packingAction.toggleModalState(SimplePackingModals.CargoPackagePick);
        packingAction.setOrderItems(
          packingState.orderItems.map((orderItem: OrderItemsInterface) =>
            orderItem.productId === orderItemToBeScanned.productId
              ? { ...orderItem, scannedCount: (orderItem.scannedCount || 0) + 1 }
              : orderItem
          )
        );
        packingAction.setIsProductAddedIntoPackage(true);
        return messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.SimplePackingStation.Success.ItemScanned`));
      }
    }

    packingAction.setIsProductAddedIntoPackage(false);
    return messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.Barcode.Error`));
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
    <Flex height="100vh" flexGrow={1} fontFamily="Jost" overflow="hidden">
      <BarcodeReader onScan={handleBarcodeScan} avgTimeByChar={100} testCode={barcodeTestInput} minLength={2} />
      <ErrorOverlay
        isOpen={
          packingState?.infoMessageBox?.state === InfoMessageBoxState.Error && packingState?.infoMessageBox?.text !== ''
        }
        width={2 / 3}
        rotationX={ErrorOverlayRotationX.right}
      />
      <Flex
        bg="palette.softGrey"
        flexDirection="column"
        justifyContent="center"
        width={packingState.isOrderCompleted ? 2 / 3 : 1 / 3}
        transition="width 1s"
        p={32}
        pt={44}
        mt={-16}
        position="relative"
      >
        <Flex flexDirection="column" height="100%">
          <StationBox station={packingState.station} />
          <InfoBoxes />
          <BoxItemList />
          <Flex justifyContent="space-between" width="30vw" my={8} position="absolute" bottom={8}>
            <Button variant="light" outline="none !important" onClick={() => packingAction.setIsMoreActionsOpen(true)}>
              <Icon name="fas fa-ellipsis-v" color="palette.softBlue" />
            </Button>
            {packingState.isMoreActionsOpen && <MoreActionScreen />}
            {isBarcodeDebuggingEnabled && (
              <Input onChange={handleTestBarcodeInputChange} zIndex={5000} width={120} height={32} autoFocus />
            )}
          </Flex>
        </Flex>
      </Flex>

      <Box
        bg="palette.slate_lighter"
        width={packingState.isOrderCompleted ? 1 / 3 : 2 / 3}
        pt={44}
        pb={32}
        px={32}
        position="relative"
      >
        <Flex flexDirection="column" height="100%">
          <RightBar />
        </Flex>
        {packingState.infoMessageBox.text && (
          <InfoMessageBox message={packingState.infoMessageBox} callInfoMessageBox={packingAction.callInfoMessageBox} />
        )}
      </Box>
      {packingState.isManuelBarcodeInputOpen && (
        <ManuelBarcodeInput
          placeholder={t(`${intlKey}.SingleItemPackingStation.ManuelBarcodeInput.Placeholder`)}
          closeScreenKeyboard={() => packingAction.setIsManuelBarcodeInputOpen(false)}
          getBarcodeDataFromScreenKeyboard={data => handleBarcodeScan(data)}
        />
      )}
      {packingState.modals.Logout && (
        <ReturnDialogModal
          modals={packingState.modals}
          toggleModalState={packingAction.toggleModalState}
          type={`${intlKey}.LogoutModal.Types.Packing`}
        />
      )}
      {packingState.modals.CargoPackagePick && (
        <CargoPackagePickerModal
          isOpen={packingState.modals.CargoPackagePick}
          onClose={() => packingAction.toggleModalState(SimplePackingModals.CargoPackagePick)}
          handleSelectCargoPackage={barcode => handleBarcodeScan(barcode)}
          packingState={packingState}
        />
      )}
      {isGenericErrorModalOpen && <GenericErrorModal isOpen={isGenericErrorModalOpen} />}
      <StationEffectTrigger
        messageHandler={messageHandler}
        handleOrderDetails={handleOrderDetails}
        setIsGenericErrorModalOpen={setIsGenericErrorModalOpen}
      />
    </Flex>
  );
};

export default SimplePackingStation;
