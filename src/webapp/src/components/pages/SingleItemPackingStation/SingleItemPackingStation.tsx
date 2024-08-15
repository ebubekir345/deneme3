import { Box, Flex, Icon } from '@oplog/express';
import { Resource, resourceActions, resourceSelectors } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isBarcodeDebuggingEnabled } from '../../../config/config.default';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import {
  CompleteToteSingleItemPackingProcessCommand,
  CreateSalesOrderPackingProcessOutputDTO,
  CreateToteSingleItemPackingProcessIfNotExistsCommand,
  CreateToteSingleItemPackingProcessOutputDTO,
  GetOngoingToteSingleItemPackingProcessOutputDTO,
  OutputVASType,
  PrintSingleItemSalesOrderCargoPackageLabelsCommand,
  PrintSingleItemSalesOrderVASCommand,
  PrintSLAMDocumentsOnSingleItemPackingOutputDTO,
  PrintSLAMDocumentsOnSingleItemSalesOrderPackingCommand,
  SingleItemCheckProductBarcodeOutputDTO,
  SingleItemSalesOrderState,
  SingleItemSalesOrderStateOutputDTO,
  SingleItemSalesOrdersToteRemainingItemsOutputDTO,
} from '../../../services/swagger';
import useSingleItemPackingStore, {
  initialSingleItemPackingState,
  SingleItemPackingModals,
} from '../../../store/global/singleItemPackingStore';
import { StoreState } from '../../../store/initState';
import { actionBarcodes } from '../../../typings/globalStore/enums';
import { ActionButton } from '../../atoms/TouchScreen';
import ErrorModal from '../../molecules/ErrorModal';
import ErrorOverlay, { ErrorOverlayRotationX } from '../../molecules/ErrorOverlay/ErrorOverlay';
import GenericErrorModal from '../../molecules/GenericErrorModal';
import InfoMessageBox, { InfoMessageBoxState } from '../../molecules/InfoMessageBox/InfoMessageBox';
import InfoPopup from '../../molecules/InfoPopup';
import { StationBox } from '../../molecules/TouchScreen';
import { DiscriminatorTypes } from '../../molecules/TouchScreen/StationBox';
import WarningModal from '../../molecules/WarningModal/WarningModal';
import ManuelBarcodeInput from '../../organisms/ManuelBarcodeInput';
import {
  CargoPackagePickerModal,
  DropToteDialogModal,
  MiddleBar,
  MoreActionScreen,
  OrderStatusModal,
  PackingTimeBox,
  ReturnDialogModal,
  RightBar,
  SerialNumberModal,
  TotePanel,
} from './bones';

const intlKey = 'TouchScreen';

declare global {
  interface Window {
    singleItemPackingTimeInterval: any;
  }
}

const SingleItemPackingStation: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useSingleItemPackingStore();
  const [isGenericErrorModalOpen, setIsGenericErrorModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');
  const [errorSubHeader, setErrorSubHeader] = useState('');
  const [isBoxItemPreviouslyAdded, setIsBoxItemPreviouslyAdded] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const history = useHistory();
  const cargoPackagesTypes = [
    ...packingState.operationCargoPackageTypes,
    ...packingState.oplogCargoPackageTypes,
    ...packingState.ownContainerCargoPackageTypes,
  ];

  const getOngoingSingleItemPackingProcessToteResponse: Resource<GetOngoingToteSingleItemPackingProcessOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetOngoingSingleItemPackingProcessTote]
  );
  const checkProductBarcodeResponse: Resource<SingleItemCheckProductBarcodeOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CheckProductBarcode]
  );
  const createToteSingleItemPackingProcessIfNotExistsResponse: Resource<CreateToteSingleItemPackingProcessOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateToteSingleItemPackingProcessIfNotExists]
  );
  const getSingleItemSalesOrderStateResponse: Resource<SingleItemSalesOrderStateOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSingleItemSalesOrderState]
  );
  const createSalesOrderPackingProcessIfNotExistsResponse: Resource<CreateSalesOrderPackingProcessOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateSalesOrderPackingProcessIfNotExists]
  );
  const completeSalesOrderPackingProcessResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CompleteSalesOrderPackingProcess]
  );
  const getSingleItemSalesOrdersToteRemainingItemsResponse: Resource<SingleItemSalesOrdersToteRemainingItemsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSingleItemSalesOrdersToteRemainingItems]
  );
  const completeToteSingleItemPackingProcessResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CompleteToteSingleItemPackingProcess]
  );
  const completeSingleItemPackingQuarantineProcessResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CompleteSingleItemPackingQuarantineProcess]
  );
  const printSingleItemSalesOrderCargoPackageLabelsResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PrintSingleItemSalesOrderCargoPackageLabels]
  );
  const printSingleItemSalesOrderVASResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PrintSingleItemSalesOrderVAS]
  );
  const printSLAMDocumentsOnSingleItemSalesOrderPackingResponse: Resource<PrintSLAMDocumentsOnSingleItemPackingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PrintSLAMDocumentsOnSingleItemSalesOrderPacking]
  );
  const getSingleItemRemainingToteSalesOrdersCountResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSingleItemRemainingToteSalesOrdersCount]
  );
  const isCompletePackingBusy = useSelector((state: StoreState) =>
    resourceSelectors.isBusy(state.resources, ResourceType.CompleteSalesOrderPackingProcess)
  );
  const npsMatchResponse: Resource<any> = useSelector((state: StoreState) => state.resources[ResourceType.NpsMatch]);

  const getOngoingSingleItemPackingProcessTote = params => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetOngoingSingleItemPackingProcessTote, params));
  };
  const createToteSingleItemPackingProcessIfNotExists = (
    params: CreateToteSingleItemPackingProcessIfNotExistsCommand
  ) => {
    dispatch(resourceActions.resourceRequested(ResourceType.CreateToteSingleItemPackingProcessIfNotExists, { params }));
  };
  const getSingleItemSalesOrderState = params => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetSingleItemSalesOrderState, params));
  };
  const completeToteSingleItemPackingProcess = (params: CompleteToteSingleItemPackingProcessCommand) => {
    dispatch(resourceActions.resourceRequested(ResourceType.CompleteToteSingleItemPackingProcess, { params }));
  };
  const printSingleItemSalesOrderCargoPackageLabels = (params: PrintSingleItemSalesOrderCargoPackageLabelsCommand) => {
    dispatch(resourceActions.resourceRequested(ResourceType.PrintSingleItemSalesOrderCargoPackageLabels, { params }));
  };
  const printSingleItemSalesOrderVAS = (params: PrintSingleItemSalesOrderVASCommand) => {
    dispatch(resourceActions.resourceRequested(ResourceType.PrintSingleItemSalesOrderVAS, { params }));
  };
  const printSLAMDocumentsOnSingleItemSalesOrderPacking = (
    params: PrintSLAMDocumentsOnSingleItemSalesOrderPackingCommand
  ) => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.PrintSLAMDocumentsOnSingleItemSalesOrderPacking, { params })
    );
  };
  const getSingleItemRemainingToteSalesOrdersCount = params => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetSingleItemRemainingToteSalesOrdersCount, params));
  };

  const handleInfoPopup = (content: any, iconSize: string | number, time?: number) => {
    packingAction.setInfoPopup({
      isOpen: true,
      header: content,
      subHeader: '',
      icon: (
        <Flex
          width={120}
          height={120}
          borderRadius="full"
          bg="palette.softBlue_lighter"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            name={time ? 'far fa-print' : 'fal fa-engine-warning'}
            fontSize={iconSize}
            color="palette.softBlue_light"
          />
        </Flex>
      ),
    });
    time &&
      setTimeout(() => {
        packingAction.setInfoPopup({ ...packingState.infoPopup, isOpen: false });
      }, time);
  };

  useEffect(() => {
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.SingleItemPackingAddress) {
      packingAction.setStation(stationObject);
      setTimeout(() => {
        getOngoingSingleItemPackingProcessTote({ singleItemPackingAddressLabel: stationObject.label });
      }, 1000);
    } else {
      history.push(urls.stationLogin);
    }
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetOngoingSingleItemPackingProcessTote));
      dispatch(resourceActions.resourceInit(ResourceType.GetSingleItemSalesOrderState));
      dispatch(resourceActions.resourceInit(ResourceType.CreateToteSingleItemPackingProcessIfNotExists));
      dispatch(resourceActions.resourceInit(ResourceType.CreateSalesOrderPackingProcessIfNotExists));
      dispatch(resourceActions.resourceInit(ResourceType.CompleteSalesOrderPackingProcess));
      dispatch(resourceActions.resourceInit(ResourceType.GetSingleItemSalesOrdersToteRemainingItems));
      dispatch(resourceActions.resourceInit(ResourceType.CompleteToteSingleItemPackingProcess));
      dispatch(resourceActions.resourceInit(ResourceType.CompleteSingleItemPackingQuarantineProcess));
      dispatch(resourceActions.resourceInit(ResourceType.PrintSingleItemSalesOrderCargoPackageLabels));
      dispatch(resourceActions.resourceInit(ResourceType.PrintSingleItemSalesOrderVAS));
      dispatch(resourceActions.resourceInit(ResourceType.PrintSLAMDocumentsOnSingleItemSalesOrderPacking));
      packingAction.clearState(initialSingleItemPackingState);
    };
  }, []);

  useEffect(() => {
    if (
      getOngoingSingleItemPackingProcessToteResponse?.isSuccess &&
      getOngoingSingleItemPackingProcessToteResponse.data?.isOngoingProcessExists
    ) {
      handleBarcodeScan(getOngoingSingleItemPackingProcessToteResponse.data?.toteLabel as string);
    }
  }, [getOngoingSingleItemPackingProcessToteResponse]);

  useEffect(() => {
    if (checkProductBarcodeResponse?.isSuccess) {
      if (
        checkProductBarcodeResponse.data?.isSerialNumberTrackRequiredProduct ||
        checkProductBarcodeResponse.data?.isSimpleSerialNumberTrackRequiredProduct
      ) {
        const product = [checkProductBarcodeResponse.data];
        packingAction.setProduct(product as any);
        packingAction.toggleModalState(SingleItemPackingModals.SerialNumber);
      } else
        getSingleItemSalesOrderState({ toteLabel: packingState.toteLabel, productBarcode: packingState.barcodeData });
    } else if (checkProductBarcodeResponse?.error) {
      return packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Error,
        text: t(`${intlKey}.Barcode.Error`),
      });
    }
  }, [checkProductBarcodeResponse]);

  useEffect(() => {
    if (createToteSingleItemPackingProcessIfNotExistsResponse?.isSuccess) {
      if (createToteSingleItemPackingProcessIfNotExistsResponse.data?.isSioc) {
        packingAction.setIsSioc(true);
        setIsWarningModalOpen(true);
      }
      packingAction.setProcessId(
        createToteSingleItemPackingProcessIfNotExistsResponse.data?.singleItemPackingProcessId || ''
      );
      packingAction.setToteLabel(createToteSingleItemPackingProcessIfNotExistsResponse.data?.toteLabel || '');
      packingAction.setToteContainedItemCount(
        createToteSingleItemPackingProcessIfNotExistsResponse.data?.toteContainedItemsCount || 0
      );
      if (createToteSingleItemPackingProcessIfNotExistsResponse.data?.toteContainedItemsCount === 0) {
        packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Success,
          text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessTote`),
        });
        return packingAction.toggleModalState(SingleItemPackingModals.ParkAreaScan, true);
      }
      if (!createToteSingleItemPackingProcessIfNotExistsResponse.data?.ongoingPackingProcessSalesOrderProduct)
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Success,
          text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessTote`),
        });

      if (createToteSingleItemPackingProcessIfNotExistsResponse.data?.ongoingPackingProcessSalesOrderProduct) {
        const {
          packingProcessId,
          salesOrderReferenceNumber,
          salesOrderId,
          operation,
          salesOrderLineItems,
          vas,
          shippingFlow,
          isEligibleForSLAMPrint,
          operationCargoPackageTypes,
          oplogCargoPackageTypes,
          ownContainerCargoPackageTypes,
          salesChannel,
          marketPlaceName,
          selectedCargoPackageTypeBarcode,
          orderSerialNumber,
          simpleSerialNumber,
          siocVolumetricWeight,
        } = createToteSingleItemPackingProcessIfNotExistsResponse.data?.ongoingPackingProcessSalesOrderProduct as any;
        packingAction.setSalesChannel(salesChannel);
        packingAction.setMarketPlaceName(marketPlaceName);
        packingAction.setOperation(operation);
        packingAction.setShippingFlow(shippingFlow);
        packingAction.setOrderNumber(salesOrderReferenceNumber);
        packingAction.setOrderId(salesOrderId);
        packingAction.setPackingProcessId(packingProcessId);
        packingAction.setIsEligibleForSLAMPrint(isEligibleForSLAMPrint);
        packingAction.setOperationCargoPackageTypes(operationCargoPackageTypes);
        packingAction.setOplogCargoPackageTypes(oplogCargoPackageTypes);
        packingAction.setOwnContainerCargoPackageTypes(ownContainerCargoPackageTypes);
        packingAction.setSelectedCargoPackageTypeBarcode(selectedCargoPackageTypeBarcode);
        packingAction.setSerialNumber(orderSerialNumber);
        packingAction.setSimpleSerialNumber(simpleSerialNumber);
        const orderItems = salesOrderLineItems.map(orderItem => {
          return { ...orderItem, boxedCount: 1 };
        });
        packingAction.setOrderItems(orderItems);
        const vasItems = vas.map(vasItem => {
          const amountInOrder = vas.filter(vas => vas.barcode === vasItem.barcode).length;
          return {
            ...vasItem,
            amountInOrder: amountInOrder,
            boxedCount: 0,
          };
        });
        const orderedVasItems = vasItems
          .filter(i => i.vasType !== OutputVASType.CustomActionVas)
          .concat(vasItems.filter(i => i.vasType === OutputVASType.CustomActionVas));
        packingAction.setVasItems(orderedVasItems);

        const boxItemToBeAdded = [
          ...oplogCargoPackageTypes,
          ...operationCargoPackageTypes,
          ...ownContainerCargoPackageTypes,
        ].find(type => type.barcode === selectedCargoPackageTypeBarcode);
        if (boxItemToBeAdded) {
          const boxItems = [
            {
              key: 1,
              title: boxItemToBeAdded?.barcode || '',
              selected: true,
              volume: siocVolumetricWeight
                ? siocVolumetricWeight.toString()
                : boxItemToBeAdded?.volumetricWeight.toString(),
              content: salesOrderLineItems.map(orderItem => ({
                productId: orderItem.productId,
                count: 1,
                barcodes: orderItem.barcodes,
                productName: orderItem.productName,
                imageUrl: orderItem.imageUrl,
              })),
            },
          ];
          packingAction.setBoxItems(boxItems);
        }

        if (
          createToteSingleItemPackingProcessIfNotExistsResponse.data.ongoingPackingProcessSalesOrderProduct
            ?.selectedCargoPackageTypeBarcode
        ) {
          return packingAction.callInfoMessageBox({
            state: InfoMessageBoxState.Success,
            text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessPackage`),
          });
        }
        if (!createToteSingleItemPackingProcessIfNotExistsResponse.data.isSioc) {
          packingAction.toggleModalState(SingleItemPackingModals.CargoPackagePick);
          return packingAction.callInfoMessageBox({
            state: InfoMessageBoxState.Success,
            text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessPackage`),
          });
        }
      }
    }
    if (createToteSingleItemPackingProcessIfNotExistsResponse?.error) {
      if (
        createToteSingleItemPackingProcessIfNotExistsResponse?.error?.exceptionContent?.includes(
          'operator already started packing'
        )
      ) {
        setErrorHeader(
          t(`${intlKey}.SingleItemPackingStation.Error.AlreadyStartedWithOtherOperator`, {
            value: createToteSingleItemPackingProcessIfNotExistsResponse?.error?.exceptionContent
              ?.split(': ')[1]
              .split(' operator')[0],
          })
        );
        setErrorSubHeader(t(`${intlKey}.SingleItemPackingStation.Error.ScanOther`));
        setIsErrorModalOpen(true);
      } else if (
        createToteSingleItemPackingProcessIfNotExistsResponse?.error?.exceptionContent?.includes('must placed')
      ) {
        setErrorHeader(t(`${intlKey}.SingleItemPackingStation.Error.MustPlaced`));
        setErrorSubHeader(t(`${intlKey}.SingleItemPackingStation.Error.ScanOther`));
        setIsErrorModalOpen(true);
      } else if (
        createToteSingleItemPackingProcessIfNotExistsResponse?.error?.message?.includes('not contains any item')
      ) {
        setErrorHeader(t(`${intlKey}.SingleItemPackingStation.Error.NotContainsAnyItem`));
        setErrorSubHeader(t(`${intlKey}.SingleItemPackingStation.Error.ScanOther`));
        setIsErrorModalOpen(true);
      } else {
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
    }
  }, [createToteSingleItemPackingProcessIfNotExistsResponse]);

  useEffect(() => {
    packingState.isSioc &&
      !packingState.selectedCargoPackageTypeBarcode &&
      packingState.orderItems.length &&
      handleBoxAdding(packingState.ownContainerCargoPackageTypes[0].barcode as string);
  }, [packingState.orderItems.length]);

  useEffect(() => {
    if (getSingleItemSalesOrderStateResponse?.isSuccess) {
      if (packingState.isOrderCompleted) {
        packingAction.clearState({
          ...initialSingleItemPackingState,
          processId: packingState.processId,
          toteLabel: packingState.toteLabel,
          toteContainedItemCount: packingState.toteContainedItemCount,
          station: packingState.station,
          barcodeData: packingState.barcodeData,
          isSioc: packingState.isSioc,
        });
      }
      packingAction.setToteContainedItemCount(getSingleItemSalesOrderStateResponse?.data?.toteRemainingItemsCount || 0);
      packingAction.setOrderId(getSingleItemSalesOrderStateResponse?.data?.salesOrderId || '');
      if (getSingleItemSalesOrderStateResponse.data?.state === SingleItemSalesOrderState.PickingCompleted) {
        packingAction.setOrderId(getSingleItemSalesOrderStateResponse?.data?.salesOrderId || '');
        dispatch(
          resourceActions.resourceRequested(ResourceType.CreateSalesOrderPackingProcessIfNotExists, {
            payload: {
              salesOrderId: getSingleItemSalesOrderStateResponse?.data?.salesOrderId || '',
              singleItemPackingAddressLabel: packingState.station.label,
              ...(packingState.simpleSerialNumber ? { simpleSerialNumber: packingState.simpleSerialNumber } : null),
            },
          })
        );
      } else {
        packingAction.toggleModalState(SingleItemPackingModals.OrderStatus, true);
      }
    }
    if (getSingleItemSalesOrderStateResponse?.error) {
      if (getSingleItemSalesOrderStateResponse?.error.message.includes('Tote with ToteLabel')) {
        setErrorHeader(t(`${intlKey}.SingleItemPackingStation.Error.HasNoTote`));
        setErrorSubHeader(t(`${intlKey}.SingleItemPackingStation.Error.ScanOtherTote`));
        setIsErrorModalOpen(true);
      } else if (getSingleItemSalesOrderStateResponse?.error.message.includes('Product with ProductBarcode')) {
        setErrorHeader(t(`${intlKey}.SingleItemPackingStation.Error.HasNoProduct`));
        setErrorSubHeader(t(`${intlKey}.SingleItemPackingStation.Error.ScanOtherProduct`));
        setIsErrorModalOpen(true);
      } else if (
        getSingleItemSalesOrderStateResponse?.error?.exceptionContent?.includes('not suitable for single item packing')
      ) {
        setErrorHeader(t(`${intlKey}.SingleItemPackingStation.Error.SalesOrderNotSuitable`));
        setErrorSubHeader(t(`${intlKey}.SingleItemPackingStation.Error.ScanOtherProduct`));
        setIsErrorModalOpen(true);
      } else if (getSingleItemSalesOrderStateResponse?.error?.exceptionContent?.includes('not contains')) {
        setErrorHeader(t(`${intlKey}.SingleItemPackingStation.Error.NotInTote`));
        setErrorSubHeader(t(`${intlKey}.SingleItemPackingStation.Error.ScanOtherProduct`));
        setIsErrorModalOpen(true);
      } else if (
        getSingleItemSalesOrderStateResponse?.error?.exceptionContent?.includes('is serial number required product')
      ) {
        setErrorHeader(t(`${intlKey}.SingleItemPackingStation.Error.SerialNoEmpty`));
        setErrorSubHeader(t(`${intlKey}.SingleItemPackingStation.Error.SerialNoRequired`));
        setIsErrorModalOpen(true);
      } else if (
        getSingleItemSalesOrderStateResponse?.error?.exceptionContent?.includes(
          'tote in which the missing products are picked'
        )
      ) {
        setErrorHeader(t(`${intlKey}.SingleItemPackingStation.Error.ToteNotAvailable`));
        setErrorSubHeader(t(`${intlKey}.SingleItemPackingStation.Error.ToteNotAvailableMissing`));
        setIsErrorModalOpen(true);
      } else {
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
    }
  }, [getSingleItemSalesOrderStateResponse]);

  useEffect(() => {
    if (createSalesOrderPackingProcessIfNotExistsResponse?.isSuccess) {
      const {
        packingProcessId,
        salesOrderReferenceNumber,
        salesOrderId,
        operation,
        salesOrderLineItems,
        vas,
        shippingFlow,
        isEligibleForSLAMPrint,
        operationCargoPackageTypes,
        oplogCargoPackageTypes,
        ownContainerCargoPackageTypes,
        salesChannel,
        marketPlaceName,
        serialNumber,
        simpleSerialNumber,
      } = createSalesOrderPackingProcessIfNotExistsResponse.data as any;
      packingAction.setSalesChannel(salesChannel);
      packingAction.setMarketPlaceName(marketPlaceName);
      packingAction.setOperation(operation);
      packingAction.setShippingFlow(shippingFlow);
      packingAction.setOrderNumber(salesOrderReferenceNumber);
      packingAction.setOrderId(salesOrderId);
      packingAction.setPackingProcessId(packingProcessId);
      packingAction.setIsEligibleForSLAMPrint(isEligibleForSLAMPrint);
      packingAction.setOperationCargoPackageTypes(operationCargoPackageTypes);
      packingAction.setOplogCargoPackageTypes(oplogCargoPackageTypes);
      packingAction.setOwnContainerCargoPackageTypes(ownContainerCargoPackageTypes);
      packingAction.setSerialNumber(serialNumber);
      packingAction.setSimpleSerialNumber(simpleSerialNumber);
      const orderItems = salesOrderLineItems.map(orderItem => {
        return { ...orderItem, boxedCount: 1 };
      });
      packingAction.setOrderItems(orderItems);
      const vasItems = vas.map(vasItem => {
        const amountInOrder = vas.filter(vas => vas.barcode === vasItem.barcode).length;
        return {
          ...vasItem,
          amountInOrder: amountInOrder,
          boxedCount: 0,
        };
      });
      const orderedVasItems = vasItems
        .filter(i => i.vasType !== OutputVASType.CustomActionVas)
        .concat(vasItems.filter(i => i.vasType === OutputVASType.CustomActionVas));
      packingAction.setVasItems(orderedVasItems);
      !packingState.isSioc && packingAction.toggleModalState(SingleItemPackingModals.CargoPackagePick);
      return packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessProduct`),
      });
    }
    if (createSalesOrderPackingProcessIfNotExistsResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [createSalesOrderPackingProcessIfNotExistsResponse]);

  useEffect(() => {
    if (completeSalesOrderPackingProcessResponse?.isSuccess) {
      printSingleItemSalesOrderCargoPackageLabels({ salesOrderId: packingState.orderId });
      packingAction.setIsOrderCompleted(true);
      getSingleItemRemainingToteSalesOrdersCount({ toteLabel: packingState.toteLabel });
      clearInterval(window.singleItemPackingTimeInterval);
      packingAction.setSimpleSerialNumber('');
    }
    if (completeSalesOrderPackingProcessResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [completeSalesOrderPackingProcessResponse]);

  useEffect(() => {
    if (completeToteSingleItemPackingProcessResponse?.isSuccess) {
      clearInterval(window.singleItemPackingTimeInterval);
      dispatch(resourceActions.resourceInit(ResourceType.GetSingleItemSalesOrderState));
      dispatch(resourceActions.resourceInit(ResourceType.CreateToteSingleItemPackingProcessIfNotExists));
      dispatch(resourceActions.resourceInit(ResourceType.CreateSalesOrderPackingProcessIfNotExists));
      dispatch(resourceActions.resourceInit(ResourceType.CompleteSalesOrderPackingProcess));
      dispatch(resourceActions.resourceInit(ResourceType.GetSingleItemSalesOrdersToteRemainingItems));
      dispatch(resourceActions.resourceInit(ResourceType.CompleteToteSingleItemPackingProcess));
      dispatch(resourceActions.resourceInit(ResourceType.CompleteSingleItemPackingQuarantineProcess));
      dispatch(resourceActions.resourceInit(ResourceType.PrintSingleItemSalesOrderCargoPackageLabels));
      dispatch(resourceActions.resourceInit(ResourceType.PrintSingleItemSalesOrderVAS));
      dispatch(resourceActions.resourceInit(ResourceType.PrintSLAMDocumentsOnSingleItemSalesOrderPacking));
      packingAction.clearState({
        ...initialSingleItemPackingState,
        station: packingState.station,
      });
    }
    if (completeToteSingleItemPackingProcessResponse?.error) {
      return packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Error,
        text: t(`${intlKey}.Barcode.Error`),
      });
    }
  }, [completeToteSingleItemPackingProcessResponse]);

  useEffect(() => {
    if (completeSingleItemPackingQuarantineProcessResponse?.isSuccess) {
      getSingleItemRemainingToteSalesOrdersCount({ toteLabel: packingState.toteLabel });
      packingAction.toggleModalState(SingleItemPackingModals.OrderStatus, false);
      packingAction.clearState({
        ...initialSingleItemPackingState,
        processId: packingState.processId,
        toteLabel: packingState.toteLabel,
        toteContainedItemCount: packingState.toteContainedItemCount,
        station: packingState.station,
        barcodeData: packingState.barcodeData,
        isSioc: packingState.isSioc,
      });
    }
    if (completeSingleItemPackingQuarantineProcessResponse?.error) {
      packingAction.setQuarantineAddressLabel('');
      packingAction.setQuarantineToteLabel('');
      return packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Error,
        text: t(`${intlKey}.Barcode.Error`),
      });
    }
  }, [completeSingleItemPackingQuarantineProcessResponse]);

  useEffect(() => {
    if (printSingleItemSalesOrderCargoPackageLabelsResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [printSingleItemSalesOrderCargoPackageLabelsResponse]);

  useEffect(() => {
    if (printSLAMDocumentsOnSingleItemSalesOrderPackingResponse?.isSuccess) {
      if (printSLAMDocumentsOnSingleItemSalesOrderPackingResponse?.data?.isSuspended) {
        packingAction.setIsSuspendedSLAM(true);
      }
      handleInfoPopup(
        t(
          `${intlKey}.SingleItemPackingStation.InfoPopup.${
            printSLAMDocumentsOnSingleItemSalesOrderPackingResponse?.data?.isSuspended
              ? 'SuspendedPrinting'
              : 'Printing'
          }`
        ),
        52,
        printSLAMDocumentsOnSingleItemSalesOrderPackingResponse?.data?.isSuspended ? 3000 : 1500
      );
    }
    if (printSLAMDocumentsOnSingleItemSalesOrderPackingResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [printSLAMDocumentsOnSingleItemSalesOrderPackingResponse]);

  useEffect(() => {
    if (printSingleItemSalesOrderVASResponse?.isSuccess) {
      const vasItemToBeAdded = packingState.vasItems.find(vasItem => vasItem.barcode === packingState.barcodeData);
      const updatedVasItems = packingState.vasItems.map(item => {
        if (item.barcode === vasItemToBeAdded?.barcode) {
          item.boxedCount += 1;
        }
        return item;
      });
      packingAction.setVasItems(updatedVasItems);
      packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessVas`),
      });
    }
    if (printSingleItemSalesOrderVASResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [printSingleItemSalesOrderVASResponse]);

  useEffect(() => {
    if (npsMatchResponse?.isSuccess) {
      const vasItemToBeAdded = packingState.vasItems.find(vasItem => vasItem.vasType === OutputVASType.NpsVas);
      const updatedVasItems = packingState.vasItems.map(item => {
        if (item.barcode === vasItemToBeAdded?.barcode) {
          item.boxedCount += 1;
        }
        return item;
      });
      packingAction.setVasItems(updatedVasItems);
      packingAction.setInfoPopup({ ...packingState.infoPopup, isOpen: false });
      return packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessVas`),
      });
    }
    if (npsMatchResponse?.error) {
      if (npsMatchResponse?.error?.code === 404 || npsMatchResponse?.error?.code === 409)
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      if (npsMatchResponse?.error?.code !== 458) return setIsGenericErrorModalOpen(true);
    }
  }, [npsMatchResponse]);

  useEffect(() => {
    if (getSingleItemRemainingToteSalesOrdersCountResponse?.isSuccess) {
      packingAction.setToteContainedItemCount(
        getSingleItemRemainingToteSalesOrdersCountResponse?.data?.remainingToteSalesOrdersCount || 0
      );
    }
  }, [getSingleItemRemainingToteSalesOrdersCountResponse]);

  const handleBoxAdding = (data: string) => {
    const boxItemToBeAdded = cargoPackagesTypes.find(type => type.barcode === data);
    if (boxItemToBeAdded) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.AddOrUpdateCargoPackageToQueueForSingleItemPacking, {
          params: {
            packingProcessId: packingState.packingProcessId,
            cargoPackageTypeBarcode: boxItemToBeAdded?.barcode,
          },
        })
      );
      packingAction.setSelectedCargoPackageTypeBarcode(boxItemToBeAdded.barcode as string);
      const boxItems = [
        {
          key: 1,
          title: boxItemToBeAdded?.barcode || '',
          selected: true,
          volume: packingState.isSioc
            ? createSalesOrderPackingProcessIfNotExistsResponse?.data?.siocVolumetricWeight?.toString()
            : boxItemToBeAdded?.volumetricWeight?.toString(),
          content: packingState.orderItems.map(orderItem => ({
            productId: orderItem.productId,
            count: 1,
            barcodes: orderItem.barcodes,
            productName: orderItem.productName,
            imageUrl: orderItem.imageUrl,
          })),
        },
      ];
      packingAction.setBoxItems(boxItems);
      if (packingState.isEligibleForSLAMPrint) {
        printSLAMDocumentsOnSingleItemSalesOrderPacking({
          salesOrderId: packingState.orderId,
          singleItemPackingAddress: packingState.station.label,
        });
        handleInfoPopup(t(`${intlKey}.PackingStation.InfoPopup.Printing`), 52, 1500);
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Success,
          text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessPackage`),
        });
      } else {
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Success,
          text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessPackage`),
        });
      }
    } else {
      return packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Error,
        text: t(`${intlKey}.Barcode.Error`),
      });
    }
  };

  const onCompletePacking = () => {
    setIsBoxItemPreviouslyAdded(false);
    const vasItems = packingState.vasItems.map(vasItem => ({ barcode: vasItem.barcode }));
    dispatch(
      resourceActions.resourceRequested(ResourceType.CompleteSalesOrderPackingProcess, {
        payload: {
          salesOrderId: packingState.orderId,
          cargoPackageTypeBarcode: packingState.boxItems[0].title,
          singleItemPackingAddressLabel: packingState.station.label,
          insertToPackageVAS: vasItems,
        },
      })
    );
  };

  const handleBarcodeScan = (data: string) => {
    data = data.trim();

    packingAction.callInfoMessageBox({
      state: InfoMessageBoxState.Scan,
      text: t(`${intlKey}.Barcode.Scanning`),
    });
    if (
      createToteSingleItemPackingProcessIfNotExistsResponse?.isBusy ||
      getSingleItemSalesOrderStateResponse?.isBusy ||
      createSalesOrderPackingProcessIfNotExistsResponse?.isBusy ||
      completeSalesOrderPackingProcessResponse?.isBusy ||
      getSingleItemSalesOrdersToteRemainingItemsResponse?.isBusy ||
      completeToteSingleItemPackingProcessResponse?.isBusy ||
      completeSingleItemPackingQuarantineProcessResponse?.isBusy ||
      printSingleItemSalesOrderCargoPackageLabelsResponse?.isBusy ||
      printSingleItemSalesOrderVASResponse?.isBusy ||
      printSLAMDocumentsOnSingleItemSalesOrderPackingResponse?.isBusy ||
      getOngoingSingleItemPackingProcessToteResponse?.isBusy ||
      npsMatchResponse?.isBusy
    ) {
      return;
    }
    packingAction.setBarcodeData(data);
    setIsErrorModalOpen(false);
    packingAction.toggleModalState(SingleItemPackingModals.CargoPackagePick, false);

    // Process Adding
    if (!packingState.processId) {
      createToteSingleItemPackingProcessIfNotExists({
        toteLabel: data,
        singleItemPackingAddressLabel: packingState.station.label,
      });
    } else if (packingState.modals.OrderStatus) {
      if (packingState.quarantineToteLabel) {
        packingAction.setQuarantineAddressLabel(data);
      } else {
        packingAction.setQuarantineToteLabel(data);
      }
    } else if (packingState.modals.ParkAreaScan) {
      completeToteSingleItemPackingProcess({
        singleItemPackingProcessId: packingState.processId,
        dropAddressLabel: data,
      });
    } else if (packingState.orderItems.length === 0 || packingState.isOrderCompleted) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.CheckProductBarcode, {
          toteLabel: packingState.toteLabel,
          productBarcode: data,
        })
      );
    } else if (packingState.boxItems.length === 0) {
      // Box Adding
      handleBoxAdding(data);
    } else if (
      packingState.infoPopup.isOpen &&
      packingState.infoPopup.header.includes(t(`${intlKey}.PackingStation.InfoPopup.ScanQR`))
    ) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.NpsMatch, {
          params: { qrCode: data, salesOrderId: packingState.orderId },
        })
      );
    } else {
      const vasItemToBeAdded = packingState.vasItems.find(vasItem => vasItem.barcode === data);
      if (vasItemToBeAdded && vasItemToBeAdded.boxedCount !== vasItemToBeAdded.amountInOrder) {
        vasItemToBeAdded.vasType === OutputVASType.NpsVas
          ? handleInfoPopup(t(`${intlKey}.PackingStation.InfoPopup.ScanQR`), 52)
          : printSingleItemSalesOrderVAS({
              barcode: data,
              singleItemPackingAddressLabel: packingState.station.label,
            });
      } else if (
        data === actionBarcodes.Enter &&
        !packingState.isOrderCompleted &&
        packingState.boxItems.length !== 0 &&
        !isCompletePackingBusy &&
        packingState.orderItems[0].boxedCount === packingState.orderItems[0].amountInOrder &&
        packingState.vasItems.every(i => i.boxedCount === i.amountInOrder)
      ) {
        onCompletePacking();
      } else if (data === actionBarcodes.PackageNote) {
        const updatedVasItems = packingState.vasItems;
        for (let i = 0; i < updatedVasItems.length; i++) {
          const item = updatedVasItems[i];
          if (item.vasType === OutputVASType?.PackingNoteVas && item.boxedCount < item.amountInOrder) {
            item.boxedCount += 1;
            break;
          }
        }
        packingAction.setVasItems(updatedVasItems);
      } else {
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
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
    <Flex height="100vh" flexGrow={1} fontFamily="Jost" overflow="hidden">
      <BarcodeReader onScan={handleBarcodeScan} avgTimeByChar={100} testCode={barcodeTestInput} minLength={2} />
      <ErrorOverlay
        isOpen={
          packingState?.infoMessageBox?.state === InfoMessageBoxState.Error && packingState?.infoMessageBox?.text !== ''
        }
        width={3 / 4}
        rotationX={ErrorOverlayRotationX.right}
      />
      <Box bg="#E2E8F0" width={1 / 4} padding="44px 32px 32px 32px">
        <Flex flexDirection="column" height="100%">
          <StationBox station={packingState.station} />
          <PackingTimeBox />
          <TotePanel isErrorModalOpen={isErrorModalOpen} />
          <Flex justifyContent="space-between" mt={32}>
            <Box>
              <ActionButton
                onClick={() => packingAction.setIsMoreActionsOpen(true)}
                icon="fas fa-ellipsis-v"
                iconColor="palette.softBlue"
                height={38}
                px={16}
                backgroundColor="palette.blue_lighter"
                br="4px"
                border="0"
                data-cy="more-actions-button"
              />
              {packingState.isMoreActionsOpen && <MoreActionScreen />}
            </Box>
            {isBarcodeDebuggingEnabled && <input onChange={handleTestBarcodeInputChange} style={{ zIndex: 5000 }} />}
          </Flex>
        </Flex>
      </Box>

      <Box bg="palett.softBlue_lighter" width={2 / 4} padding="44px 32px 32px 32px" position="relative">
        <Flex flexDirection="column" height="100%">
          <MiddleBar
            isBoxItemPreviouslyAdded={isBoxItemPreviouslyAdded}
            setIsBoxItemPreviouslyAdded={setIsBoxItemPreviouslyAdded}
            onCompletePacking={onCompletePacking}
          />
        </Flex>
        <InfoMessageBox message={packingState.infoMessageBox} callInfoMessageBox={packingAction.callInfoMessageBox} />
      </Box>
      <Box bg="palette.slate_lighter" width={1 / 4} padding="44px 18px 8px 14px">
        {packingState.isOrderCompleted && <RightBar />}
      </Box>
      {packingState.isManuelBarcodeInputOpen && (
        <ManuelBarcodeInput
          placeholder={t(`${intlKey}.SingleItemPackingStation.ManuelBarcodeInput.Placeholder`)}
          closeScreenKeyboard={() => packingAction.setIsManuelBarcodeInputOpen(false)}
          getBarcodeDataFromScreenKeyboard={data => handleBarcodeScan(data)}
        />
      )}
      <OrderStatusModal />
      <ReturnDialogModal
        modals={packingState.modals}
        toggleModalState={packingAction.toggleModalState}
        type={`${intlKey}.LogoutModal.Types.Packing`}
      />
      <DropToteDialogModal />
      {packingState.modals.SerialNumber && <SerialNumberModal />}
      <CargoPackagePickerModal
        isOpen={packingState.modals.CargoPackagePick}
        onClose={() => packingAction.toggleModalState(SingleItemPackingModals.CargoPackagePick)}
        handleSelectCargoPackage={barcode => handleBarcodeScan(barcode)}
        packingState={packingState}
      />
      {packingState.infoPopup.isOpen && (
        <InfoPopup
          isOpen={packingState.infoPopup.isOpen}
          header={packingState.infoPopup.header}
          subHeader={packingState.infoPopup.subHeader}
          icon={packingState.infoPopup.icon}
        />
      )}
      <WarningModal
        isOpen={isWarningModalOpen}
        setModal={setIsWarningModalOpen}
        header={t(`${intlKey}.SingleItemPackingStation.NoNeedToScanCargoPackage`)}
      />
      <GenericErrorModal isOpen={isGenericErrorModalOpen} />
      <ErrorModal isOpen={isErrorModalOpen} header={errorHeader} subHeader={errorSubHeader} />
    </Flex>
  );
};

export default SingleItemPackingStation;
