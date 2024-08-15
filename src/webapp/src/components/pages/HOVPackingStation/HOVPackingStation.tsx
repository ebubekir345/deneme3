import { Box, Flex, Icon } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useRef, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isBarcodeDebuggingEnabled } from '../../../config/config.default';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import {
  InternalErrorNumber,
  OutputVASType,
  PackingBoxHOVItemOutputDTO,
  PackingQuarantineReason,
  QueuedHOVCargoPackageOutputDTO,
  SalesOrderStateForPacking,
  ShippingFlowTag,
} from '../../../services/swagger';
import useHovPackingStore, { HovPackingModals, initialHovPackingState } from '../../../store/global/hovPackingStore';
import { StoreState } from '../../../store/initState';
import { actionBarcodes } from '../../../typings/globalStore/enums';
import isErrorMatches from '../../../utils/isErrorMatches';
import { ActionButton } from '../../atoms/TouchScreen';
import ErrorModal from '../../molecules/ErrorModal';
import ErrorOverlay, { ErrorOverlayRotationX } from '../../molecules/ErrorOverlay/ErrorOverlay';
import GenericErrorModal from '../../molecules/GenericErrorModal';
import InfoMessageBox, { InfoMessageBoxState } from '../../molecules/InfoMessageBox/InfoMessageBox';
import InfoPopup from '../../molecules/InfoPopup';
import { StationBox } from '../../molecules/TouchScreen';
import { DiscriminatorTypes } from '../../molecules/TouchScreen/StationBox';
import ManuelBarcodeInput from '../../organisms/ManuelBarcodeInput';
import {
  BoxItemList,
  CargoPackagePickerModal,
  CompleteQuarantineDialogModal,
  ExpandButton,
  HovAddProductModal,
  InfoBoxes,
  MissingItemDialogModal,
  MoreActionScreen,
  OrderStatusModal,
  ReturnDialogModal,
  RightBar,
} from './bones/';
import SerialNumberAddModal from './bones/SerialNumberAddModal';
import SimpleSerialNumberAddModal from './bones/SimpleSerialNumberAddModal';

const intlKey = 'TouchScreen';

declare global {
  interface Window {
    packingTimeInterval: any;
  }
}

const HOVPackingStation: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [packingState, packingAction] = useHovPackingStore();
  const [isGenericErrorModalOpen, setIsGenericErrorModalOpen] = useState(false);
  const [isCancelledDuringPacking, setIsCancelledDuringPacking] = useState(false);
  const [isCompletePacking, setIsCompletePacking] = useState(false);
  const bottomButtonGroupRef = useRef<null | HTMLDivElement>(null);

  const resources = useSelector((state: StoreState) => state.resources);

  const checkOperationCargoPackageTypeBarcodeResponse = resources[ResourceType.CheckOperationCargoPackageTypeBarcode];
  const packingSalesOrderState = resources[ResourceType.GetHOVSalesOrderState];
  const createPackingProcessResponse = resources[ResourceType.CreateHovPackingProcess];
  const createPackingQuarantineProcessResponse = resources[ResourceType.CreateHovPackingQuarantineProcess];
  const addCargoPackageResponse = resources[ResourceType.AddHovCargoPackage];
  const removeCargoPackageResponse = resources[ResourceType.RemoveHovCargoPackage];
  const queueItemIntoCargoPackageResponse = resources[ResourceType.QueueHovItemIntoCargoPackage];
  const queueItemIntoQuarantineToteResponse = resources[ResourceType.QueueHovItemIntoQuarantineTote];
  const completePackingProcessResponse = resources[ResourceType.CompleteHovPackingProcess];
  const completePackingQuarantineProcessResponse = resources[ResourceType.CompleteHovPackingQuarantineProcess];
  const assignQuarantineToteResponse = resources[ResourceType.AssignHovQuarantineTote];
  const unassignQuarantineToteResponse = resources[ResourceType.UnassignHovQuarantineTote];
  const printSLAMDocumentsResponse = resources[ResourceType.HOVPrintSLAMDocuments];
  const printCargoPackageLabelsResponse = resources[ResourceType.PrintHovCargoPackageLabels];
  const printVASResponse = resources[ResourceType.HOVPrintVAS];
  const placeQuarantineToteToQuarantineAddressResponse =
    resources[ResourceType.PlaceHovQuarantineToteToQuarantineAddress];
  const printAdditionalCargoPackageLabelsResponse = resources[ResourceType.HOVPrintAdditionalCargoPackageLabels];
  const npsMatchResponse = resources[ResourceType.NpsMatch];

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
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.HOVPackingAddress) {
      packingAction.setStation(stationObject);
    } else {
      history.push(urls.stationLogin);
    }
    return () => {
      initializeResources();
    };
  }, []);

  useEffect(() => {
    if (packingSalesOrderState?.isSuccess) {
      if (packingState.isOrderCompleted) {
        packingAction.clearState({
          ...initialHovPackingState,
          orderBasket: packingState.orderBasket,
          station: packingState.station,
        });
      }
      !isCancelledDuringPacking && packingAction.setOrderBasket(packingState.barcodeData);
      if (
        packingSalesOrderState.data?.state === SalesOrderStateForPacking.Cancelled ||
        packingSalesOrderState.data?.state === SalesOrderStateForPacking.CompletedWithLostItems
      ) {
        dispatch(
          resourceActions.resourceRequested(ResourceType.CreateHovPackingQuarantineProcess, {
            params: {
              coOperatorId: packingState.selectedCoOp.id ? packingState.selectedCoOp.id : undefined,
              toteLabel: isCancelledDuringPacking ? packingState.orderBasket : packingState.barcodeData,
              hovPackingAddressLabel: packingState.station.label,
              state: PackingQuarantineReason[packingSalesOrderState.data.state],
            },
          })
        );
      } else {
        dispatch(
          resourceActions.resourceRequested(ResourceType.CreateHovPackingProcess, {
            params: {
              coOperatorId: packingState.selectedCoOp.id ? packingState.selectedCoOp.id : undefined,
              toteLabel: isCancelledDuringPacking ? packingState.orderBasket : packingState.barcodeData,
              hovPackingAddressLabel: packingState.station.label,
            },
          })
        );
      }
    }
    if (packingSalesOrderState?.error) {
      if (isErrorMatches(packingSalesOrderState?.error, 'ResourceNotFound', 'Tote')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.HasNoSalesOrder`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanOtherTote`),
        });
      } else if (createPackingProcessResponse?.error.message.includes('not contains any')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.ToteNotContainsSalesOrder`),
          subHeader: '',
        });
      } else if (createPackingProcessResponse?.error.message.includes('picking flow is not suitable for hov packing')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.NotSuitableHovPacking`),
          subHeader: '',
        });
      } else if (createPackingProcessResponse?.error.message.includes('already packed')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.AlreadyPacked`),
          subHeader: '',
        });
      } else if (createPackingProcessResponse?.error.message.includes('not available for packing operation')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.NotAvailablePacking`),
          subHeader: '',
        });
      } else {
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
    }
  }, [packingSalesOrderState]);

  useEffect(() => {
    if (createPackingProcessResponse?.isSuccess) {
      if (createPackingProcessResponse?.data?.failedMessage) {
        if (createPackingProcessResponse?.data?.failedMessage.includes('contains items that not in sales order')) {
          packingAction.setErrorModalData({
            header: t(`${intlKey}.HOVPackingStation.Error.ContainsItemsNotInOrder`),
            subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanOtherTote`),
          });
        } else if (
          createPackingProcessResponse?.data?.failedMessage.includes('amount different from salesOrderLineItems amount')
        ) {
          packingAction.setErrorModalData({
            header: t(`${intlKey}.HOVPackingStation.Error.HasDifferentAmount`),
            subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanOtherTote`),
          });
        } else if (
          createPackingProcessResponse?.data?.failedMessage.includes('contains items that not in sales order Tote')
        ) {
          packingAction.setErrorModalData({
            header: t(`${intlKey}.HOVPackingStation.Error.ContainsItemsNotInOrderAndHasDifferentAmount`),
            subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanOtherTote`),
          });
        } else if (createPackingProcessResponse?.data?.failedMessage.includes('\n -- id: Entity "Operator"')) {
          return packingAction.callInfoMessageBox({
            state: InfoMessageBoxState.Error,
            text: t(`${intlKey}.Barcode.Authorization`),
          });
        }
      } else {
        resetQueueState();
        const {
          packingProcessId,
          salesOrderReferenceNumber,
          salesOrderId,
          operation,
          pickingItems,
          pickingTrolleyLabel,
          vas,
          shippingFlow,
          isEligibleForSLAMPrint,
          cargoPackages,
          processedVASItems,
          operationCargoPackageTypes,
          oplogCargoPackageTypes,
          salesChannel,
          marketPlaceName,
          hovMultiplePackingItemCountThreshold,
          packedItemCount,
          salesOrderTotalItemCount,
        } = createPackingProcessResponse.data;
        dispatch(
          resourceActions.resourceRequested(ResourceType.GetPickingTrolleyDetails, {
            trolleyLabel: pickingTrolleyLabel,
          })
        );
        packingAction.setSalesChannel(salesChannel);
        packingAction.setMarketPlaceName(marketPlaceName);
        packingAction.setOperation(operation);
        packingAction.setShippingFlow(shippingFlow);
        packingAction.setOrderNumber(salesOrderReferenceNumber);
        packingAction.setOrderId(salesOrderId);
        packingAction.setProcessId(packingProcessId);
        packingAction.setItemCountThreshold(hovMultiplePackingItemCountThreshold);
        packingAction.setIsEligibleForSLAMPrint(isEligibleForSLAMPrint);
        packingAction.setOperationCargoPackageTypes(operationCargoPackageTypes);
        packingAction.setOplogCargoPackageTypes(oplogCargoPackageTypes);
        packingAction.setTrolleyDetails({
          label: pickingTrolleyLabel,
          packedCount: packedItemCount,
          totalCount: salesOrderTotalItemCount,
        });

        // Convert cargoPackageItems to OrderItemsInterface
        const cargoPackageItems: OrderItemsInterface[] = cargoPackages.reduce(
          (acc: OrderItemsInterface[], cargoPackage: QueuedHOVCargoPackageOutputDTO) => {
            if (cargoPackage.boxItems) {
              cargoPackage.boxItems.forEach(boxItem => {
                acc.push({
                  productId: boxItem.productId || '',
                  productName: boxItem.productName || '',
                  sku: boxItem.productSKU || '',
                  barcodes: boxItem.barcodes,
                  imageUrl: boxItem.productImageUrl || '',
                  amountInOrder: boxItem.amount || 0,
                  serialNumbers: boxItem.serialNumbers,
                  boxedCount: boxItem.amount || 0,
                });
              });
            }
            return acc;
          },
          []
        );
        // Combine cargoPackageItems with pickingItems
        const combinedItems = pickingItems.concat(cargoPackageItems);
        // Accumulate items by productId and convert directly to OrderItemsInterface[]
        const accumulatedItems: OrderItemsInterface[] = Object.values(
          combinedItems.reduce((acc: OrderItemsInterface[], item: OrderItemsInterface) => {
            const existingItem = acc.find(i => i.productId === item.productId);
            if (existingItem) {
              existingItem.amountInOrder += item.amountInOrder;
            } else {
              acc.push({ ...item });
            }
            return acc;
          }, [])
        );
        packingAction.setOrderItems(accumulatedItems);

        const vasItems = vas.map(vasItem => {
          const amountInOrder = vas.filter(vas => vas.barcode === vasItem.barcode).length;
          return {
            ...vasItem,
            amountInOrder: amountInOrder,
            boxedCount: processedVASItems.filter(processedVASItem => processedVASItem.barcode === vasItem.barcode)
              .length,
          };
        });
        const orderedVasItems = vasItems
          .filter(i => i.vasType !== OutputVASType.CustomActionVas)
          .concat(vasItems.filter(i => i.vasType === OutputVASType.CustomActionVas));
        packingAction.setVasItems(orderedVasItems);

        const boxItems = cargoPackages.map((cargoPackage: QueuedHOVCargoPackageOutputDTO, index) => ({
          key: cargoPackage.packageIndex,
          title: cargoPackage.cargoPackageTypeBarcode,
          selected: index === 0,
          volume: operationCargoPackageTypes
            .concat(oplogCargoPackageTypes)
            .find(type => type.barcode === cargoPackage.cargoPackageTypeBarcode)?.volumetricWeight,
          content: cargoPackage.boxItems?.map((boxItem: PackingBoxHOVItemOutputDTO) => ({
            productId: boxItem.productId,
            count: boxItem.amount,
            barcodes: boxItem.barcodes,
            productName: boxItem.productName,
            imageUrl: boxItem.productImageUrl,
            serialNumbers: boxItem.serialNumbers,
          })),
          cargoPackageIndex: cargoPackage.packageIndex,
          packageId: cargoPackage.packageId,
          type: operationCargoPackageTypes
            .concat(oplogCargoPackageTypes)
            .find(type => type.barcode === cargoPackage.cargoPackageTypeBarcode)?.type,
        }));
        packingAction.setBoxItems(boxItems);

        setIsCancelledDuringPacking(false);
        !boxItems.length && packingAction.toggleModalState(HovPackingModals.CargoPackagePick);
        boxItems.some(i => i.content.length)
          ? packingAction.callInfoMessageBox({
              state: InfoMessageBoxState.Success,
              text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessProduct`),
            })
          : boxItems.length
          ? packingAction.callInfoMessageBox({
              state: InfoMessageBoxState.Success,
              text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessPackage`),
            })
          : packingAction.callInfoMessageBox({
              state: InfoMessageBoxState.Success,
              text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessTote`),
            });
      }
    }
    if (createPackingProcessResponse?.error) {
      if (createPackingProcessResponse?.error.message.includes('PackingProcess already assigned to Operator with')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.AlreadyPacking`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanOtherTote`),
        });
      } else if (createPackingProcessResponse?.error.message.includes('SalesOrder Picking must be in')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.PickingNotCompleted`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanOtherTote`),
        });
      } else if (isErrorMatches(createPackingProcessResponse?.error, 'ResourceNotFound', 'PickingToteLabel')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.ContainedItemsNotFound`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanOtherTote`),
        });
      } else if (isErrorMatches(createPackingProcessResponse?.error, 'NotEmptyValidator', 'OperatorId')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.NotAuthorized`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.LoginWithOperator`),
        });
      } else {
        setIsGenericErrorModalOpen(true);
      }
    }
  }, [createPackingProcessResponse]);

  useEffect(() => {
    if (createPackingQuarantineProcessResponse?.isSuccess) {
      resetQueueState();
      const {
        packingQuarantineProcessId,
        salesOrderReferenceNumber,
        operation,
        pickingItems,
        missingItems,
        state,
        shippingFlow,
        pickingTrolleyLabel,
        quarantineTote,
        salesChannel,
        marketPlaceName,
        hovMultiplePackingItemCountThreshold,
        queuedQuarantineItemCount,
        salesOrderTotalItemCount,
      } = createPackingQuarantineProcessResponse.data;
      dispatch(
        resourceActions.resourceRequested(ResourceType.GetPickingTrolleyDetails, { trolleyLabel: pickingTrolleyLabel })
      );
      packingAction.setSalesChannel(salesChannel);
      packingAction.setMarketPlaceName(marketPlaceName);
      packingAction.setOperation(operation);
      packingAction.setOrderNumber(salesOrderReferenceNumber);
      packingAction.setProcessId(packingQuarantineProcessId);
      packingAction.setShippingFlow(shippingFlow);
      packingAction.setItemCountThreshold(hovMultiplePackingItemCountThreshold);
      packingAction.setTrolleyDetails({
        label: pickingTrolleyLabel,
        packedCount: queuedQuarantineItemCount,
        totalCount: salesOrderTotalItemCount,
      });

      const orderItems = pickingItems.map(orderItem => {
        return { ...orderItem, boxedCount: 0 };
      });
      packingAction.setOrderItems(orderItems);
      const updatedMissingItems = missingItems.map(missingItem => {
        return { ...missingItem, amountInOrder: missingItem.missingAmount, boxedCount: 0, isMissingItem: true };
      });
      packingAction.setMissingItems(updatedMissingItems);

      let boxItems: BoxItemsInterface[] = [];
      if (quarantineTote) {
        boxItems = [
          {
            key: 1,
            title: quarantineTote.quarantineToteLabel,
            selected: true,
            content: quarantineTote.boxItems.map(boxItem => ({
              productId: boxItem.productId,
              count: boxItem.amount,
              barcodes: boxItem.barcodes,
              productName: boxItem.productName,
              imageUrl: boxItem.productImageUrl,
              serialNumbers: boxItem.serialNumbers,
            })),
          },
        ];
        packingAction.setBoxItems(boxItems);
      } else {
        packingAction.setBoxItems([]);
      }

      if (state === PackingQuarantineReason.CompletedWithLostItems) {
        packingAction.setIsMissing(true);
        !quarantineTote && packingAction.toggleModalState(HovPackingModals.OrderStatus, true);
        packingAction.setIsMoreActionsOpen(false);
      }
      if (state === PackingQuarantineReason.Cancelled) {
        packingAction.setIsCancelled(true);
        !quarantineTote && packingAction.toggleModalState(HovPackingModals.OrderStatus, true);
      }
      setIsCancelledDuringPacking(false);
      boxItems.some(i => i.content.length)
        ? packingAction.callInfoMessageBox({
            state: InfoMessageBoxState.Success,
            text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessProduct`),
          })
        : boxItems.length
        ? packingAction.callInfoMessageBox({
            state: InfoMessageBoxState.Success,
            text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessQuarantineTote`),
          })
        : null;
    }
    if (createPackingQuarantineProcessResponse?.error) {
      if (
        createPackingQuarantineProcessResponse?.error.message.includes(
          'PackingProcess already assigned to Operator with'
        )
      ) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.AlreadyPacking`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanOtherTote`),
        });
      } else if (createPackingQuarantineProcessResponse?.error.message.includes('SalesOrder Picking must be in')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.PickingNotCompleted`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanOtherTote`),
        });
      } else if (isErrorMatches(createPackingQuarantineProcessResponse?.error, 'NotEmptyValidator', 'OperatorId')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.NotAuthorized`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.LoginWithOperator`),
        });
      } else {
        setIsGenericErrorModalOpen(true);
      }
    }
  }, [createPackingQuarantineProcessResponse]);

  useEffect(() => {
    packingAction.toggleModalState(HovPackingModals.CargoPackagePick, false);
    if (checkOperationCargoPackageTypeBarcodeResponse?.isSuccess) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.AddHovCargoPackage, {
          params: {
            hovPackingProcessId: packingState.processId,
            cargoPackageTypeBarcode: checkOperationCargoPackageTypeBarcodeResponse?.data?.barcode,
            packageIndex: packingState.boxItems.length + 1,
            toteLabel: packingState.orderBasket,
          },
        })
      );
    }
    if (checkOperationCargoPackageTypeBarcodeResponse?.error) {
      if (
        checkOperationCargoPackageTypeBarcodeResponse?.error.message.includes(
          'CargoPackageType not defined for this Operation'
        )
      ) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.WrongCargoPackage`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanValidCargoPackage`),
        });
      }
    }
  }, [checkOperationCargoPackageTypeBarcodeResponse]);

  useEffect(() => {
    if (addCargoPackageResponse?.isSuccess) {
      const boxItemToBeAdded = packingState.operationCargoPackageTypes
        .concat(packingState.oplogCargoPackageTypes)
        .find(
          type =>
            type.barcode?.trim().toLowerCase() ===
            checkOperationCargoPackageTypeBarcodeResponse.data.barcode.trim().toLowerCase()
        );
      if (packingState.shippingFlow === ShippingFlowTag.International && packingState.boxItems.length) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.OneToteForInternationalOrder`),
          subHeader: t(``),
        });
      } else {
        // Box Adding
        const updatedPrevBoxItems = packingState.boxItems.map(item => {
          return { ...item, selected: false };
        });
        const boxItems = [
          ...updatedPrevBoxItems,
          ...(boxItemToBeAdded
            ? [
                {
                  key: addCargoPackageResponse?.data?.cargoPackageIndex,
                  title: boxItemToBeAdded.barcode,
                  selected: true,
                  volume: boxItemToBeAdded.volumetricWeight?.toString(),
                  content: [],
                  packageId: addCargoPackageResponse?.data?.packageQueueId,
                  cargoPackageIndex: addCargoPackageResponse?.data?.cargoPackageIndex,
                  type: boxItemToBeAdded.type,
                },
              ]
            : []),
        ].sort(item1 => (item1.selected ? -1 : 1));
        packingAction.setBoxItems(boxItems as any);
        if (packingState.isEligibleForSLAMPrint) {
          dispatch(
            resourceActions.resourceRequested(ResourceType.HOVPrintSLAMDocuments, {
              params: {
                pickingToteLabel: packingState.orderBasket,
                hovPackingAddressLabel: packingState.station.label,
              },
            })
          );
          handleInfoPopup(t(`${intlKey}.HOVPackingStation.InfoPopup.Printing`), 52, 1500);
        }
      }
      packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessPackage`),
      });
    }
    if (addCargoPackageResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [addCargoPackageResponse]);

  useEffect(() => {
    if (queueItemIntoCargoPackageResponse?.isSuccess || queueItemIntoQuarantineToteResponse?.isSuccess) {
      // Add OrderItem to Box
      const orderItemToBeAdded = packingState.orderItems.find(orderItem =>
        orderItem.barcodes?.includes(packingState.barcodeData)
      );
      const updatedBoxItems = packingState.boxItems.map(item => {
        if (item.selected) {
          const placedSameLineItem = item.content.find(
            contentItem => contentItem?.productId === orderItemToBeAdded?.productId
          );
          if (placedSameLineItem) {
            placedSameLineItem.count += packingState.hovItemCount;
            placedSameLineItem.serialNumbers = packingState.productSerialNo
              ? [...placedSameLineItem.serialNumbers, packingState.productSerialNo]
              : [...placedSameLineItem.serialNumbers];
          } else {
            orderItemToBeAdded &&
              item.content.push({
                productId: orderItemToBeAdded.productId,
                count: packingState.hovItemCount,
                barcodes: orderItemToBeAdded.barcodes,
                productName: orderItemToBeAdded.productName,
                imageUrl: orderItemToBeAdded.imageUrl,
                serialNumbers: packingState.productSerialNo ? [packingState.productSerialNo] : [],
              });
          }
        }
        return item;
      });
      packingAction.setBoxItems(updatedBoxItems);
      packingAction.setTrolleyDetails({
        ...packingState.trolleyDetails,
        packedCount: packingState.trolleyDetails.packedCount + packingState.hovItemCount,
      });
      packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessProduct`, {
          value: packingState?.hovItemCount > 1 ? 'x' + packingState?.hovItemCount : '',
        }),
      });
      packingAction.setHovItemCount(1);
    }
    if (queueItemIntoCargoPackageResponse?.error || queueItemIntoQuarantineToteResponse?.error) {
      if (
        queueItemIntoCargoPackageResponse?.error.internalErrorNumber ===
          InternalErrorNumber.PackingProductsAlreadyAddedToPackageQueue ||
        queueItemIntoCargoPackageResponse?.error.internalErrorNumber ===
          InternalErrorNumber.PackingCargoPackageQueueIsNotFound
      ) {
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
      if (
        queueItemIntoCargoPackageResponse?.error.internalErrorNumber ===
        InternalErrorNumber.HovPackingDuplicateSimpleSerialNumberCantBeAdded
      ) {
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.HOVPackingStation.Error.HovPackingDuplicateSimpleSerialNumberCantBeAdded`),
        });
      }
      if (
        queueItemIntoCargoPackageResponse?.error.internalErrorNumber ===
        InternalErrorNumber.SimpleSerialNumberIsUsedForAnotherSaleOrder
      ) {
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.HOVPackingStation.Error.SerialNumberScanned`),
        });
      } else setIsGenericErrorModalOpen(true);
    }
  }, [queueItemIntoCargoPackageResponse, queueItemIntoQuarantineToteResponse]);

  useEffect(() => {
    if (
      assignQuarantineToteResponse?.isSuccess &&
      !packingState.boxItems.some(item => item.title === packingState.barcodeData)
    ) {
      // Tote Adding
      const updatedPrevBoxItems = packingState.boxItems.map(item => {
        return { ...item, selected: false };
      });
      const boxItems = [
        ...updatedPrevBoxItems,
        {
          key:
            (updatedPrevBoxItems.length
              ? updatedPrevBoxItems.reduce((prev, curr) => (prev.key > curr.key ? prev : curr)).key
              : 0) + 1,
          title: packingState.barcodeData,
          selected: true,
          content: [],
        },
      ].sort(item1 => (item1.selected ? -1 : 1));
      packingAction.setBoxItems(boxItems);
      packingAction.toggleModalState(HovPackingModals.OrderStatus, false);
      return packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessQuarantineTote`),
      });
    }
    if (assignQuarantineToteResponse?.error) {
      if (
        assignQuarantineToteResponse.error.internalErrorNumber ===
        InternalErrorNumber.ToteToteIsUsedForSingleItemPackingProcess
      ) {
        return packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.ToteToteIsUsedForSingleItemPackingProcess`),
        });
      }
      if (
        assignQuarantineToteResponse.error.internalErrorNumber ===
        InternalErrorNumber.PackingToteIsUsedForAnotherPackingQuarantineProcess
      ) {
        return packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.PackingToteIsUsedForAnotherPackingQuarantineProcess`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanQuarantineTote`),
        });
      }
      if (assignQuarantineToteResponse?.error.message.includes('cannot be used as a quarantine tote')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.PickingToteAsQuarantineTote`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanQuarantineTote`),
        });
      } else if (assignQuarantineToteResponse?.error.message.includes('is not available for quarantine operation')) {
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.AlreadyContainsItem`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.ScanQuarantineTote`),
        });
      } else {
        return packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
    }
  }, [assignQuarantineToteResponse]);

  useEffect(() => {
    if (unassignQuarantineToteResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [unassignQuarantineToteResponse]);

  useEffect(() => {
    if (removeCargoPackageResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [removeCargoPackageResponse]);

  useEffect(() => {
    if (completePackingProcessResponse?.isSuccess) {
      packingState.station.isPrintAdditionalPackageLabel &&
        packingState.boxItems.length > 1 &&
        dispatch(
          resourceActions.resourceRequested(ResourceType.HOVPrintAdditionalCargoPackageLabels, {
            params: { salesOrderId: packingState.orderId, packingAddressLabel: packingState.station.label },
          })
        );
      dispatch(
        resourceActions.resourceRequested(ResourceType.PrintHovCargoPackageLabels, {
          params: { salesOrderId: packingState.orderId },
        })
      );
      dispatch(
        resourceActions.resourceRequested(ResourceType.GetPickingTrolleyDetails, {
          trolleyLabel: createPackingProcessResponse?.data?.pickingTrolleyLabel,
        })
      );
      packingAction.setIsLeftBarExpanded(true);
      packingAction.setIsOrderCompleted(true);
      clearInterval(window.packingTimeInterval);
    }
    if (completePackingProcessResponse?.error) {
      if (completePackingProcessResponse?.error.message.includes('is Cancelled')) {
        packingAction.setIsOrderCompleted(true);
        setIsCancelledDuringPacking(true);
      } else {
        setIsGenericErrorModalOpen(true);
      }
    }
  }, [completePackingProcessResponse]);

  useEffect(() => {
    if (completePackingQuarantineProcessResponse?.isSuccess) {
      packingAction.setIsLeftBarExpanded(true);
      packingAction.setIsOrderCompleted(true);
      clearInterval(window.packingTimeInterval);

      const newMissingItems = packingState.orderItems.filter(
        orderItem => orderItem.amountInOrder !== orderItem.boxedCount
      );
      let updatedMissingItems = [...packingState.missingItems];
      newMissingItems.forEach(newMissingItem => {
        const alreadyPlacedMissingItem = updatedMissingItems.find(
          missingItem => missingItem.productId === newMissingItem.productId
        );
        if (alreadyPlacedMissingItem) {
          alreadyPlacedMissingItem.amountInOrder += newMissingItem.amountInOrder - newMissingItem.boxedCount;
        } else {
          updatedMissingItems.push({
            productId: newMissingItem.productId,
            productName: newMissingItem.productName,
            sku: newMissingItem.sku,
            barcodes: newMissingItem.barcodes,
            imageUrl: newMissingItem.imageUrl,
            amountInOrder: newMissingItem.amountInOrder - newMissingItem.boxedCount,
            boxedCount: 0,
            isMissingItem: true,
          });
        }
      });
      packingAction.setMissingItems(updatedMissingItems);
    }
    if (completePackingQuarantineProcessResponse?.error) {
      if (
        completePackingQuarantineProcessResponse?.error.message.includes(
          'Product with same barcode is already in cell with different operation'
        )
      ) {
        packingAction.setBoxItems([]);
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.SameProductDifferentOperation`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.PlaceToOtherTote`),
        });
      } else if (completePackingQuarantineProcessResponse?.error.message.includes('already assigned for')) {
        packingAction.setBoxItems([]);
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.AlreadyAssignedToAnOrder`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.PlaceToOtherTote`),
        });
      } else if (
        completePackingQuarantineProcessResponse?.error.message.includes('not available for quarantine operation')
      ) {
        packingAction.setBoxItems([]);
        packingAction.setErrorModalData({
          header: t(`${intlKey}.HOVPackingStation.Error.AlreadyHasItems`),
          subHeader: t(`${intlKey}.HOVPackingStation.Error.PlaceToOtherTote`),
        });
      } else {
        setIsGenericErrorModalOpen(true);
      }
    }
  }, [completePackingQuarantineProcessResponse]);

  useEffect(() => {
    if (printCargoPackageLabelsResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [printCargoPackageLabelsResponse]);

  useEffect(() => {
    if (printAdditionalCargoPackageLabelsResponse?.isSuccess && packingState.isOrderCompleted) {
      setTimeout(() => {
        handleInfoPopup(<Trans i18nKey={`${intlKey}.PackingStation.InfoPopup.CarefullyAdhere`} />, 26, 5000);
      }, 4000);
    }
    if (printAdditionalCargoPackageLabelsResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [printAdditionalCargoPackageLabelsResponse]);

  useEffect(() => {
    if (printSLAMDocumentsResponse?.isSuccess) {
      if (printSLAMDocumentsResponse?.data?.isSuspended) {
        packingAction.setIsSuspendedSLAM(true);
      }
      handleInfoPopup(
        t(
          `${intlKey}.HOVPackingStation.InfoPopup.${
            printSLAMDocumentsResponse?.data?.isSuspended ? 'SuspendedPrinting' : 'Printing'
          }`
        ),
        52,
        printSLAMDocumentsResponse?.data?.isSuspended ? 3000 : 1500
      );
    }
    if (printSLAMDocumentsResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [printSLAMDocumentsResponse]);

  useEffect(() => {
    if (printVASResponse?.isSuccess) {
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
    if (printVASResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [printVASResponse]);

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

  const resetQueueState = () => {
    dispatch(resourceActions.resourceInit(ResourceType.QueueHovItemIntoCargoPackage));
    dispatch(resourceActions.resourceInit(ResourceType.AddHovCargoPackage));
    dispatch(resourceActions.resourceInit(ResourceType.RemoveHovCargoPackage));
    dispatch(resourceActions.resourceInit(ResourceType.QueueHovItemIntoQuarantineTote));
    dispatch(resourceActions.resourceInit(ResourceType.AssignHovQuarantineTote));
    dispatch(resourceActions.resourceInit(ResourceType.UnassignHovQuarantineTote));
    dispatch(resourceActions.resourceInit(ResourceType.HOVPrintVAS));
    dispatch(resourceActions.resourceInit(ResourceType.PlaceHovQuarantineToteToQuarantineAddress));
  };

  const initializeResources = () => {
    dispatch(resourceActions.resourceInit(ResourceType.GetHOVSalesOrderState));
    dispatch(resourceActions.resourceInit(ResourceType.CreateHovPackingProcess));
    dispatch(resourceActions.resourceInit(ResourceType.CreateHovPackingQuarantineProcess));
    dispatch(resourceActions.resourceInit(ResourceType.CompleteHovPackingProcess));
    dispatch(resourceActions.resourceInit(ResourceType.CompleteHovPackingQuarantineProcess));
    dispatch(resourceActions.resourceInit(ResourceType.AssignHovQuarantineTote));
    dispatch(resourceActions.resourceInit(ResourceType.UnassignHovQuarantineTote));
    dispatch(resourceActions.resourceInit(ResourceType.GetOperatorsByFullName));
    dispatch(resourceActions.resourceInit(ResourceType.HOVPrintVAS));
    dispatch(resourceActions.resourceInit(ResourceType.HOVPrintSLAMDocuments));
    dispatch(resourceActions.resourceInit(ResourceType.PrintHovCargoPackageLabels));
    dispatch(resourceActions.resourceInit(ResourceType.HOVPrintAdditionalCargoPackageLabels));
    dispatch(resourceActions.resourceInit(ResourceType.GetPickingTrolleyDetails));
    dispatch(resourceActions.resourceInit(ResourceType.ListCargoPackages));
    dispatch(resourceActions.resourceInit(ResourceType.QueueHovItemIntoCargoPackage));
    dispatch(resourceActions.resourceInit(ResourceType.QueueHovItemIntoQuarantineTote));
    dispatch(resourceActions.resourceInit(ResourceType.AddHovCargoPackage));
    dispatch(resourceActions.resourceInit(ResourceType.RemoveHovCargoPackage));
    dispatch(resourceActions.resourceInit(ResourceType.CheckOperationCargoPackageTypeBarcode));
    dispatch(resourceActions.resourceInit(ResourceType.PlaceHovQuarantineToteToQuarantineAddress));
    packingAction.clearState(initialHovPackingState);
  };

  const handleBarcodeScan = (data: string) => {
    data = data.trim();
    packingAction.callInfoMessageBox({
      state: InfoMessageBoxState.Scan,
      text: t(`${intlKey}.Barcode.Scanning`),
    });
    packingAction.setErrorModalData({
      header: '',
      subHeader: '',
    });
    packingAction.toggleModalState(HovPackingModals.CargoPackagePick, false);
    packingAction.toggleModalState(HovPackingModals.HovAddProduct, false);

    if (packingState.modals.AddSimpleSerialNumber || packingState.modals.AddSerialNumber)
      return packingAction.setProductSerialNo(data);
    if (
      packingSalesOrderState?.isBusy ||
      createPackingProcessResponse?.isBusy ||
      createPackingQuarantineProcessResponse?.isBusy ||
      completePackingProcessResponse?.isBusy ||
      completePackingQuarantineProcessResponse?.isBusy ||
      assignQuarantineToteResponse?.isBusy ||
      printVASResponse?.isBusy ||
      checkOperationCargoPackageTypeBarcodeResponse?.isBusy ||
      unassignQuarantineToteResponse?.isBusy ||
      addCargoPackageResponse?.isBusy ||
      removeCargoPackageResponse?.isBusy ||
      queueItemIntoCargoPackageResponse?.isBusy ||
      queueItemIntoQuarantineToteResponse?.isBusy ||
      printSLAMDocumentsResponse?.isBusy ||
      printCargoPackageLabelsResponse?.isBusy ||
      printAdditionalCargoPackageLabelsResponse?.isBusy ||
      placeQuarantineToteToQuarantineAddressResponse?.isBusy ||
      npsMatchResponse?.isBusy
    ) {
      return;
    }
    packingAction.setBarcodeData(data);

    if (
      !packingSalesOrderState?.isSuccess ||
      createPackingProcessResponse?.data?.failedMessage ||
      createPackingProcessResponse?.error ||
      createPackingQuarantineProcessResponse?.error ||
      packingState.isOrderCompleted
    ) {
      dispatch(resourceActions.resourceRequested(ResourceType.GetHOVSalesOrderState, { toteLabel: data }));
    } else if (packingState.modals.QuarantineAreaScan) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.PlaceHovQuarantineToteToQuarantineAddress, {
          params: {
            packingQuarantineProcessId: packingState.processId,
            toteLabel: packingState.boxItems[0].title,
            quarantineAddressLabel: data,
          },
        })
      );
    } else {
      if (packingState.isCancelled || packingState.isMissing) {
        const orderItemToBeAdded = packingState.orderItems.find(orderItem => orderItem.barcodes?.includes(data));
        if (packingState.boxItems.length && orderItemToBeAdded?.isTrackSerialNumber) {
          packingAction.toggleModalState(HovPackingModals.AddSerialNumber);
        } else if (
          orderItemToBeAdded &&
          packingState.boxItems.length &&
          orderItemToBeAdded.boxedCount !== orderItemToBeAdded.amountInOrder
        ) {
          if (packingState.itemCountThreshold > orderItemToBeAdded.amountInOrder) {
            dispatch(
              resourceActions.resourceRequested(ResourceType.QueueHovItemIntoQuarantineTote, {
                params: {
                  packingQuarantineProcessId: packingState.processId,
                  productId: orderItemToBeAdded.productId,
                  quarantineToteLabel: packingState.boxItems.find(boxItem => boxItem.selected)?.title,
                  amount: 1,
                },
              })
            );
          } else {
            packingAction.toggleModalState(HovPackingModals.HovAddProduct);
          }
          packingAction.setIsProductAddedIntoPackage(true);
        } else if (!orderItemToBeAdded && packingState.boxItems.length === 0) {
          dispatch(
            resourceActions.resourceRequested(ResourceType.AssignHovQuarantineTote, {
              params: {
                packingQuarantineProcessId: packingState.processId,
                quarantinetoteLabel: data,
                hovPackingAddressLabel: packingState.station.label,
              },
            })
          );
        } else {
          packingAction.setIsProductAddedIntoPackage(false);
          packingAction.setIsVasAddedIntoPackage(false);
          return packingAction.callInfoMessageBox({
            state: InfoMessageBoxState.Error,
            text: t(`${intlKey}.Barcode.Error`),
          });
        }
      } else if (
        data === actionBarcodes.Enter &&
        !packingState.isMissing &&
        !packingState.isCancelled &&
        !isCompletePacking
      ) {
        setIsCompletePacking(true);
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
      } else if (
        packingState.operationCargoPackageTypes.some(i => i.barcode === data) ||
        packingState.oplogCargoPackageTypes.some(i => i.barcode === data)
      ) {
        dispatch(
          resourceActions.resourceRequested(ResourceType.CheckOperationCargoPackageTypeBarcode, {
            operationName: packingState.operation.name,
            barcode: data,
          })
        );
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
        const orderItemToBeAdded = packingState.orderItems.find(orderItem => orderItem.barcodes?.includes(data));
        const vasItemToBeAdded = packingState.vasItems.find(vasItem => vasItem.barcode === data);

        if (vasItemToBeAdded && vasItemToBeAdded.boxedCount !== vasItemToBeAdded.amountInOrder) {
          vasItemToBeAdded.vasType === OutputVASType.NpsVas
            ? handleInfoPopup(t(`${intlKey}.PackingStation.InfoPopup.ScanQR`), 52)
            : dispatch(
                resourceActions.resourceRequested(ResourceType.HOVPrintVAS, {
                  params: { barcode: data, hovPackingAddressLabel: packingState.station.label },
                })
              );
          packingAction.setIsVasAddedIntoPackage(true);
        } else if (
          orderItemToBeAdded &&
          packingState.boxItems.length &&
          orderItemToBeAdded.boxedCount !== orderItemToBeAdded.amountInOrder
        ) {
          if (orderItemToBeAdded.isTrackSerialNumber) {
            packingAction.toggleModalState(HovPackingModals.AddSerialNumber);
          } else if (
            orderItemToBeAdded.isTrackSimpleSerialNumber &&
            packingState.itemCountThreshold > orderItemToBeAdded.amountInOrder
          ) {
            packingAction.toggleModalState(HovPackingModals.AddSimpleSerialNumber);
          } else if (orderItemToBeAdded.isTrackSimpleSerialNumber) {
            packingAction.toggleModalState(HovPackingModals.HovAddProduct);
          } else if (packingState.itemCountThreshold > orderItemToBeAdded.amountInOrder) {
            dispatch(
              resourceActions.resourceRequested(ResourceType.QueueHovItemIntoCargoPackage, {
                params: {
                  hovPackingProcessId: packingState.processId,
                  productId: orderItemToBeAdded.productId,
                  packageIndex: packingState.boxItems.find(boxItem => boxItem.selected)?.cargoPackageIndex,
                  amount: 1,
                  toteLabel: packingState.orderBasket,
                },
              })
            );
          } else {
            packingAction.toggleModalState(HovPackingModals.HovAddProduct);
          }
          packingAction.setIsProductAddedIntoPackage(true);
        } else {
          packingAction.setIsProductAddedIntoPackage(false);
          packingAction.setIsVasAddedIntoPackage(false);
          return packingAction.callInfoMessageBox({
            state: InfoMessageBoxState.Error,
            text: t(`${intlKey}.Barcode.Error`),
          });
        }
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
    <Flex height="100vh" flexGrow={1} fontFamily="ModernEra" overflow="hidden">
      <BarcodeReader onScan={handleBarcodeScan} avgTimeByChar={100} testCode={barcodeTestInput} minLength={2} />
      <ErrorOverlay
        isOpen={
          packingState?.infoMessageBox?.state === InfoMessageBoxState.Error && packingState?.infoMessageBox?.text !== ''
        }
        width={packingState.isLeftBarExpanded ? 1 / 3 : 2 / 3}
        rotationX={ErrorOverlayRotationX.right}
      />
      <Box
        bg={
          (packingState.isMissing || packingState.isCancelled) && !packingState.isOrderCompleted
            ? 'rgba(255, 230, 230, 0.5)'
            : 'palette.softGrey'
        }
        width={packingState.isLeftBarExpanded ? 2 / 3 : 1 / 3}
        transition="width 1s"
        padding="44px 32px 32px 32px"
      >
        <Flex flexDirection="column" height="100%">
          <StationBox station={packingState.station} />
          <InfoBoxes />
          <BoxItemList bottomButtonGroupRef={bottomButtonGroupRef} />
          <Flex ref={bottomButtonGroupRef} justifyContent="space-between" mt={32}>
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
              {packingState.isMoreActionsOpen && (
                <MoreActionScreen packingState={packingState} packingAction={packingAction} />
              )}
            </Box>
            {isBarcodeDebuggingEnabled && <input onChange={handleTestBarcodeInputChange} style={{ zIndex: 5000 }} />}
            {packingState.orderNumber && !packingState.isOrderCompleted && (
              <ExpandButton packingState={packingState} packingAction={packingAction} />
            )}
          </Flex>
        </Flex>
      </Box>
      <Box
        bg="palette.slate_lighter"
        width={packingState.isLeftBarExpanded ? 1 / 3 : 2 / 3}
        transition="width 1s"
        padding="44px 32px 32px 32px"
        position="relative"
      >
        <Flex flexDirection="column" height="90%">
          <RightBar isCompletePacking={isCompletePacking} setIsCompletePacking={setIsCompletePacking} />
        </Flex>
        <InfoMessageBox message={packingState.infoMessageBox} callInfoMessageBox={packingAction.callInfoMessageBox} />
      </Box>
      {packingState.isManuelBarcodeInputOpen && (
        <ManuelBarcodeInput
          placeholder={t(`${intlKey}.HOVPackingStation.ManuelBarcodeInput.Placeholder`)}
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
      <MissingItemDialogModal />
      <CompleteQuarantineDialogModal />
      <CargoPackagePickerModal
        isOpen={packingState.modals.CargoPackagePick}
        onClose={() => packingAction.toggleModalState(HovPackingModals.CargoPackagePick)}
        handleSelectCargoPackage={barcode => handleBarcodeScan(barcode)}
        packingState={packingState}
      />
      {packingState.modals.HovAddProduct && !packingState.modals.AddSerialNumber && <HovAddProductModal />}
      {packingState.modals.AddSerialNumber && <SerialNumberAddModal />}
      {packingState.modals.AddSimpleSerialNumber && <SimpleSerialNumberAddModal />}
      {packingState.infoPopup.isOpen && (
        <InfoPopup
          isOpen={packingState.infoPopup.isOpen}
          header={packingState.infoPopup.header}
          subHeader={packingState.infoPopup.subHeader}
          icon={packingState.infoPopup.icon}
        />
      )}
      <GenericErrorModal isOpen={isGenericErrorModalOpen} />
      <ErrorModal
        isOpen={packingState.errorModalData.header !== '' || packingState.errorModalData.subHeader !== ''}
        header={packingState.errorModalData.header}
        subHeader={packingState?.errorModalData?.subHeader || ''}
      >
        <ActionButton
          onClick={() => packingAction.setErrorModalData({ header: '', subHeader: '' })}
          height={52}
          width={126}
          backgroundColor="palette.softBlue"
          color="palette.white"
          fontSize={22}
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

export default HOVPackingStation;
