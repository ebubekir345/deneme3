// TODO: fix useSelector resource selector routes
import { Box, Flex } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useRef, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isBarcodeDebuggingEnabled } from '../../../config/config.default';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import {
  AddressTypeOutputDTO,
  ContainedItemsType,
  InternalErrorNumber,
  ReturnPackageState,
} from '../../../services/swagger';
import useReturnStore, { initialReturnState, ReturnModals } from '../../../store/global/returnStore';
import { StoreState } from '../../../store/initState';
import isErrorMatches from '../../../utils/isErrorMatches';
import { ActionButton } from '../../atoms/TouchScreen';
import ErrorModal from '../../molecules/ErrorModal';
import GenericErrorModal from '../../molecules/GenericErrorModal';
import InfoMessageBox, { InfoMessageBoxState } from '../../molecules/InfoMessageBox/InfoMessageBox';
import { StationBox } from '../../molecules/TouchScreen';
import { DiscriminatorTypes } from '../../molecules/TouchScreen/StationBox';
import ManuelBarcodeInput from '../../organisms/ManuelBarcodeInput';
import {
  CompleteReturnDialogModal,
  CustomerInfoButton,
  InfoBoxes,
  LeftBar,
  MoreActionButton,
  ParcelSearchResults,
  ReturnButton,
  ReturnDialogModal,
  RightBar,
  UndefinedReturnInputScreen,
} from './bones';
import SerialNumberModal from './bones/SerialNumberModal';

const intlKey = 'TouchScreen';

declare global {
  interface Window {
    returnTimeInterval: any;
  }
}

const ReturnStation: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [returnState, returnAction] = useReturnStore();
  const [station, setStation] = useState<AddressTypeOutputDTO>({ id: 0, label: '', discriminator: '' });
  const bottomButtonGroupRef = useRef<null | HTMLDivElement>(null);

  const selectToteForReturnProcessResponse = useSelector((state: StoreState) =>
    state.resources.selectToteForReturnProcess ? state.resources.selectToteForReturnProcess : null
  );
  const createReturnProcessIfNotExistResponse = useSelector((state: StoreState) =>
    state.resources.createReturnProcessIfNotExist ? state.resources.createReturnProcessIfNotExist : null
  );
  const selectSalesOrderForReturnResponse = useSelector((state: StoreState) =>
    state.resources.selectSalesOrderForReturn ? state.resources.selectSalesOrderForReturn : null
  );

  // componentDidMount
  useEffect(() => {
    window.returnTimeInterval = setInterval(() => returnAction.setReturnTime(true), 1000);
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.ReturnAddress) {
      setStation(stationObject);
    } else {
      history.push(urls.stationLogin);
    }
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetOperations));
      dispatch(resourceActions.resourceInit(ResourceType.GetCargoCarriers));
      dispatch(resourceActions.resourceInit(ResourceType.GetOperatorsByFullName));
      dispatch(resourceActions.resourceInit(ResourceType.SearchSalesOrders));
      dispatch(resourceActions.resourceInit(ResourceType.GetSalesOrderDetails));
      dispatch(resourceActions.resourceInit(ResourceType.SelectToteForReturnProcess));
      dispatch(resourceActions.resourceInit(ResourceType.CreateReturnProcessIfNotExist));
      dispatch(resourceActions.resourceInit(ResourceType.SelectSalesOrderForReturn));
      dispatch(resourceActions.resourceInit(ResourceType.CompleteReturnProcess));
      dispatch(resourceActions.resourceInit(ResourceType.UpdateTrackingInfo));
      clearInterval(window.returnTimeInterval);
      returnAction.clearState(initialReturnState);
    };
  }, []);

  useEffect(() => {
    if (createReturnProcessIfNotExistResponse?.isSuccess) {
      if (returnState.isReturnCompleted) {
        returnAction.clearState(initialReturnState);
        window.returnTimeInterval = setInterval(() => returnAction.setReturnTime(true), 1000);
      }
      returnAction.setReturnProcessId(createReturnProcessIfNotExistResponse.data.id);

      if (createReturnProcessIfNotExistResponse.data.state === ReturnPackageState.InProcess) {
        const {
          id,
          referenceNumber,
          lineItems,
          operation,
          recipient,
          contactInfo,
          details,
        } = createReturnProcessIfNotExistResponse.data.salesOrderInfo;

        returnAction.setSalesOrderId(id);
        returnAction.setIsParcelSearchScreenOpen(false);
        returnAction.setOrderNumber(referenceNumber);
        operation && returnAction.setOperation(operation);
        returnAction.setCustomerInfo({
          name: recipient?.fullName || '',
          tel: contactInfo?.phone || '',
          address: `${details?.firstLine || ''} ${details?.secondLine || ''}`,
        });
        const orderItems =
          (lineItems &&
            lineItems?.map(item => {
              return {
                ...item,
                returnState: item.returnState,
                boxedCount: 0,
                damagedBoxedCount: 0,
                controlBoxedCount: 0,
              };
            })) ||
          [];
        returnAction.setOrderItems(orderItems);
        dispatch(resourceActions.resourceRequested(ResourceType.GetSalesOrderDetails, { salesOrderId: id }));
      } else {
        if (createReturnProcessIfNotExistResponse.data.trackingInfo) {
          returnAction.setParcelInfo({
            trackingId: createReturnProcessIfNotExistResponse.data.trackingInfo?.trackingId || '',
            cargoCarrierName: createReturnProcessIfNotExistResponse?.data?.trackingInfo?.cargoCarrierName || '',
            carrierId: createReturnProcessIfNotExistResponse?.data?.trackingInfo?.cargoCarrierId || '',
            recipientName: createReturnProcessIfNotExistResponse.data.trackingInfo?.fullName || '',
            phone: createReturnProcessIfNotExistResponse.data.trackingInfo?.phone || '',
            address: createReturnProcessIfNotExistResponse.data.trackingInfo?.address || '',
            cargoTrackingNumber: createReturnProcessIfNotExistResponse.data.trackingInfo?.cargoTrackingNumber || '',
            cargoCarrierLogoUrl: createReturnProcessIfNotExistResponse.data.trackingInfo?.cargoCarrierLogoUrl || '',
          });
        }
        returnAction.setIsParcelSearchScreenOpen(true);
        returnAction.setSearchQueries({
          customerName: '',
          recipientName: createReturnProcessIfNotExistResponse.data.trackingInfo?.fullName || '',
          referenceNumber: '',
          cargoPackageLabel: '',
          barcodes: [],
          operationId: '',
          displayAll: false,
          serialNumber: '',
        });
      }
    }
    if (createReturnProcessIfNotExistResponse?.error) {
      if (isErrorMatches(createReturnProcessIfNotExistResponse?.error, 'ResourceNotFound', 'id')) {
        returnAction.setError(
          t(`${intlKey}.ReturnStation.Error.NotAuthorized`),
          t(`${intlKey}.ReturnStation.Error.LoginWithOperator`)
        );
        returnAction.toggleModalState(ReturnModals.Error, true);
      } else if (createReturnProcessIfNotExistResponse?.error.message.includes('ReturnPackage already Resolved')) {
        returnAction.setError(
          t(`${intlKey}.ReturnStation.Error.AlreadyInResolved`),
          t(`${intlKey}.ReturnStation.Error.ScanNextTrackingId`)
        );
        returnAction.toggleModalState(ReturnModals.Error, true);
      } else {
        returnAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
    }
  }, [createReturnProcessIfNotExistResponse]);

  useEffect(() => {
    if (selectSalesOrderForReturnResponse?.isSuccess) {
      const { id, referenceNumber, lineItems, operation, recipient, contactInfo, details } = returnState.selectedOrder;

      returnAction.setSalesOrderId(id as string);
      returnAction.setReturnProcessId(selectSalesOrderForReturnResponse?.data.id);
      returnAction.setIsParcelSearchScreenOpen(false);
      returnAction.setOrderNumber(referenceNumber as string);
      operation && returnAction.setOperation(operation);
      returnAction.setCustomerInfo({
        name: recipient?.fullName || '',
        tel: contactInfo?.phone || '',
        address: `${details?.firstLine || ''} ${details?.secondLine || ''}`,
      });
      const orderItems =
        (lineItems &&
          lineItems?.map(item => {
            return {
              ...item,
              returnState: item.returnState,
              boxedCount: 0,
              damagedBoxedCount: 0,
              controlBoxedCount: 0,
            };
          })) ||
        [];
      returnAction.setOrderItems(orderItems as any);
      dispatch(resourceActions.resourceRequested(ResourceType.GetSalesOrderDetails, { salesOrderId: id }));
    } else if (selectSalesOrderForReturnResponse?.error) {
      if (selectSalesOrderForReturnResponse?.error.message.includes('already assigned to')) {
        returnAction.setError(
          t(`${intlKey}.ReturnStation.Error.AlreadyAssigned`),
          t(`${intlKey}.ReturnStation.Error.SelectOtherOrder`)
        );
        returnAction.toggleModalState(ReturnModals.Error, true);
      } else if (selectSalesOrderForReturnResponse?.error.message.includes('All items processed')) {
        returnAction.setError(
          t(`${intlKey}.ReturnStation.Error.AllItemsProcessed`),
          t(`${intlKey}.ReturnStation.Error.SelectOtherOrder`)
        );
        returnAction.toggleModalState(ReturnModals.Error, true);
      } else if (selectSalesOrderForReturnResponse?.error.message.includes('ReturnPackage already InProcess')) {
        returnAction.setError(
          t(`${intlKey}.ReturnStation.Error.AlreadyInProcess`),
          t(`${intlKey}.ReturnStation.Error.ContactSupport`)
        );
        returnAction.toggleModalState(ReturnModals.Error, true);
      } else if (isErrorMatches(selectSalesOrderForReturnResponse?.error, 'ResourceNotFound', 'SalesOrderId')) {
        returnAction.setError(
          t(`${intlKey}.ReturnStation.Error.TrackingIdNotFound`),
          t(`${intlKey}.ReturnStation.Error.ScanTrackingIdBeforeProceed`)
        );
        returnAction.toggleModalState(ReturnModals.Error, true);
      } else if (isErrorMatches(selectSalesOrderForReturnResponse?.error, 'ResourceNotFound', 'id')) {
        returnAction.setError(
          t(`${intlKey}.ReturnStation.Error.NotAuthorized`),
          t(`${intlKey}.ReturnStation.Error.LoginWithOperator`)
        );
        returnAction.toggleModalState(ReturnModals.Error, true);
      } else {
        returnAction.toggleModalState(ReturnModals.GenericError, true);
      }
    }
  }, [selectSalesOrderForReturnResponse]);

  useEffect(() => {
    if (selectToteForReturnProcessResponse?.isSuccess) {
      if (!returnState.boxItems.filter(item => item.title === selectToteForReturnProcessResponse?.data.label).length) {
        // Store previous state
        returnAction.setPreviousBoxItems(returnState.boxItems);
        // Tote Adding
        const updatedPrevBoxItems = returnState.boxItems.map(item => {
          return { ...item, selected: false };
        });
        const boxItems = [
          ...updatedPrevBoxItems,
          {
            key:
              (updatedPrevBoxItems.length
                ? updatedPrevBoxItems.reduce((prev, curr) => (prev.key > curr.key ? prev : curr)).key
                : 0) + 1,
            title: selectToteForReturnProcessResponse?.data.label,
            selected: true,
            content: [],
            containedItemsType:
              selectToteForReturnProcessResponse?.data.containedItemsType === ContainedItemsType.Empty
                ? undefined
                : selectToteForReturnProcessResponse?.data.containedItemsType,
          },
        ].sort(item1 => (item1.selected ? -1 : 1));
        returnAction.setBoxItems(boxItems);
      } else {
        returnAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
    }
    if (selectToteForReturnProcessResponse?.error) {
      if (
        selectToteForReturnProcessResponse.error.internalErrorNumber ===
        InternalErrorNumber.ToteToteIsUsedForSingleItemPackingProcess
      ) {
        returnAction.setError(t(`${intlKey}.ReturnStation.Error.ToteToteIsUsedForSingleItemPackingProcess`), '');
        returnAction.toggleModalState(ReturnModals.Error, true);
      } else {
        returnAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
    }
  }, [selectToteForReturnProcessResponse]);

  const handleBarcodeScan = (data: string) => {
    data = data.trim();

    returnAction.toggleModalState(ReturnModals.SerialNumber, false);
    returnAction.setBarcodeData(data);

    if (selectToteForReturnProcessResponse?.isBusy || createReturnProcessIfNotExistResponse?.isBusy) {
      return;
    }

    if (returnState.orderNumber && !returnState.isReturnCompleted) {
      const orderItemToBeAdded = returnState.orderItems.filter(orderItem => orderItem.barcodes?.includes(data))[0];

      if (returnState.isHighlighted) {
        returnAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.ReturnStation.Error.ToteTypeNotChosen`),
        });
      } else if (
        orderItemToBeAdded &&
        returnState.boxItems.length &&
        orderItemToBeAdded.boxedCount !== orderItemToBeAdded.amountInOrder
      ) {
        (orderItemToBeAdded.isTrackSerialNumber || orderItemToBeAdded.isTrackSimpleSerialNumber) &&
          returnAction.toggleModalState(ReturnModals.SerialNumber);
        // Store previous state
        returnAction.setPreviousBoxItems(returnState.boxItems);

        // Add OrderItem to Tote
        const updatedBoxItems = returnState.boxItems.map(item => {
          const updatedItemContent = JSON.parse(JSON.stringify(item.content)); // TODO: search for a better json array deep clone implementation
          if (item.selected) {
            const placedSameLineItem = updatedItemContent.filter(
              contentItem => contentItem.productId === orderItemToBeAdded.productId
            )[0];
            if (placedSameLineItem) {
              placedSameLineItem.count += 1;
            } else {
              updatedItemContent.push({
                productId: orderItemToBeAdded.productId,
                count: 1,
                barcodes: orderItemToBeAdded.barcodes,
                productName: orderItemToBeAdded.productName,
                imageUrl: orderItemToBeAdded.imageUrl,
              });
            }
          }
          return { ...item, content: updatedItemContent };
        });
        !orderItemToBeAdded.isTrackSerialNumber &&
          !orderItemToBeAdded.isTrackSimpleSerialNumber &&
          returnAction.setBoxItems(updatedBoxItems);
      } else {
        const payload = {
          toteLabel: data,
          returnAddressLabel: station.label,
        };
        dispatch(resourceActions.resourceRequested(ResourceType.SelectToteForReturnProcess, { payload }));
      }
    } else if (returnState.isParcelSearchScreenOpen && !returnState.isUndefinedReturnInputScreenOpen) {
      if (returnState.isReferenceNumberActive) {
        returnAction.setSearchQueries({ ...returnState.searchQueries, referenceNumber: data });
      } else if (data.substring(0, 3).toLowerCase() === 'opp') {
        returnAction.setSearchQueries({ ...returnState.searchQueries, cargoPackageLabel: data });
      } else if (!returnState.searchQueries.barcodes.includes(data)) {
        returnAction.setSearchQueries({
          ...returnState.searchQueries,
          barcodes: [...returnState.searchQueries.barcodes, data],
        });
      }
    } else if (returnState.isUndefinedReturnInputScreenOpen) {
      if (!returnState.undefinedReturnValidProductBarcodes.includes(data)) {
        returnAction.setUndefinedReturnProductBarcodes([...returnState.undefinedReturnProductBarcodes, data]);
      } else {
        returnAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
    } else {
      const payload = {
        trackingId: data,
        coOperatorId: returnState.selectedCoOp.id ? returnState.selectedCoOp.id : undefined,
      };
      dispatch(resourceActions.resourceRequested(ResourceType.CreateReturnProcessIfNotExist, { payload }));
    }
  };

  // Testing Purpose
  const [barcodeTestInput, setBarcodeTestInput] = useState('');
  useEffect(() => {
    setBarcodeTestInput('');
  });
  const handleTestBarcodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcodeTestInput(e.target.value.trim());
  };
  // END Testing Purpose

  return (
    <Flex height="100vh" flexGrow={1} fontFamily="ModernEra" overflow="hidden">
      <BarcodeReader onScan={handleBarcodeScan} avgTimeByChar={100} testCode={barcodeTestInput} minLength={2} />
      <Box
        bg="palette.softGrey"
        width={returnState.isLeftBarExpanded ? 2 / 3 : 1 / 3}
        transition="width 1s"
        padding="44px 32px 32px 32px"
      >
        <Flex flexDirection="column" height="100%">
          <StationBox station={station} />
          <InfoBoxes />
          <LeftBar bottomButtonGroupRef={bottomButtonGroupRef} />
          <Flex ref={bottomButtonGroupRef} justifyContent="space-between" mt={32}>
            <MoreActionButton />
            {isBarcodeDebuggingEnabled && <input onChange={handleTestBarcodeInputChange} style={{ zIndex: 5000 }} />}
            {returnState.isParcelSearchScreenOpen && <ReturnButton />}
            {returnState.orderNumber && <CustomerInfoButton />}
          </Flex>
        </Flex>
      </Box>
      <Box
        bg="palette.slate_lighter"
        width={returnState.isLeftBarExpanded ? 1 / 3 : 2 / 3}
        transition="width 1s"
        padding="44px 32px 32px 32px"
        position="relative"
      >
        <Flex flexDirection="column" height="100%">
          {returnState.isParcelSearchScreenOpen && !returnState.orderNumber ? <ParcelSearchResults /> : <RightBar />}
          <InfoMessageBox message={returnState.infoMessageBox} callInfoMessageBox={returnAction.callInfoMessageBox} />
        </Flex>
      </Box>
      {returnState.isUndefinedReturnInputScreenOpen && <UndefinedReturnInputScreen />}
      {returnState.isManuelBarcodeInputOpen && (
        <ManuelBarcodeInput
          placeholder={t(`${intlKey}.ReturnStation.ManuelBarcodeInput.Placeholder`)}
          closeScreenKeyboard={() => returnAction.setIsManuelBarcodeInputOpen(false)}
          getBarcodeDataFromScreenKeyboard={data => handleBarcodeScan(data)}
        />
      )}
      <ReturnDialogModal
        modals={returnState.modals}
        toggleModalState={returnAction.toggleModalState}
        type={`${intlKey}.LogoutModal.Types.Return`}
      />
      <CompleteReturnDialogModal />
      <SerialNumberModal />
      <GenericErrorModal isOpen={returnState.modals.GenericError} />
      <ErrorModal
        isOpen={returnState.modals.Error}
        header={returnState.error.header}
        subHeader={returnState.error.subHeader}
      >
        <ActionButton
          onClick={() => returnAction.toggleModalState(ReturnModals.Error)}
          height={52}
          width={126}
          backgroundColor="palette.softBlue"
          color="palette.white"
          fontSize="22"
          letterSpacing="negativeLarge"
          borderRadius="md"
          fontWeight={700}
          px={11}
          border="none"
        >
          {t(`Modal.Success.Okay`)}
        </ActionButton>
      </ErrorModal>
    </Flex>
  );
};

export default ReturnStation;
