import { resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  InternalErrorNumber,
  MissingItemTransferSalesOrderPickingState,
  SalesOrderWithMissingItemState,
} from '../../../../services/swagger';
import useMissingItemTransferStore, {
  initialMissingItemTransferState,
} from '../../../../store/global/missingItemTransferStore';
import { StoreState } from '../../../../store/initState';
import { MissingItemTransferModals } from '../../../../typings/globalStore/enums';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';

const intlKey = 'TouchScreen';

interface IStationEffectTrigger {
  setIsGenericErrorModalOpen: Function;
}

export const StationEffectTrigger: FC<IStationEffectTrigger> = ({ setIsGenericErrorModalOpen }) => {
  const [missingItemTransferState, missingItemTransferAction] = useMissingItemTransferStore();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const resources = useSelector((state: StoreState) => state.resources);
  const salesOrderState = resources[ResourceType.GetMissingItemSalesOrderState];
  const createMissingItemTransferProcessResponse = resources[ResourceType.CreateMissingItemTransferProcess];
  const checkQuarantineToteMissingItemTransferResponse = resources[ResourceType.CheckQuarantineToteMissingItemTransfer];
  const completeMissingItemTransferResponse = resources[ResourceType.CompleteMissingItemTransfer];
  const completeWithLostItemMissingItemTransferResponse =
    resources[ResourceType.CompleteWithLostItemMissingItemTransfer];
  const completeCancelledMissingItemTransferResponse = resources[ResourceType.CompleteCancelledMissingItemTransfer];

  useEffect(() => {
    if (salesOrderState?.isSuccess) {
      if (missingItemTransferState.isOrderCompleted) {
        missingItemTransferAction.clearState({
          ...initialMissingItemTransferState,
          orderBasket: missingItemTransferState.orderBasket,
          station: missingItemTransferState.station,
        });
      }
      missingItemTransferAction.setOrderBasket(missingItemTransferState.barcodeData);

      dispatch(
        resourceActions.resourceRequested(ResourceType.CreateMissingItemTransferProcess, {
          params: {
            pickingToteLabel: missingItemTransferState.barcodeData,
            missingItemTransferAddress: missingItemTransferState.station.label,
          },
        })
      );
      if (salesOrderState?.data?.state === SalesOrderWithMissingItemState.Cancelled) {
        missingItemTransferAction.setIsCancelled(true);
      }
    }
    if (salesOrderState?.error) {
      if (salesOrderState.error.internalErrorNumber === InternalErrorNumber.MissingItemTransferPickingToteNotFound) {
        missingItemTransferAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
    }
  }, [salesOrderState]);

  useEffect(() => {
    if (createMissingItemTransferProcessResponse?.isSuccess) {
      missingItemTransferAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessTote`),
      });
      const {
        missingItemTransferProcessId,
        salesOrderReferenceNumber,
        salesOrderId,
        operation,
        pickedMissingItems,
        quarantineToteLabel,
        unPickedMissingItems,
        pickedItemsInQuarantineTote,
        missingItemTransferSalesOrderPickingState,
        isCancelledSalesOrderToteOnTheQuarantineAddress,
        pickingToteContainedItemSerialNumbers,
      } = createMissingItemTransferProcessResponse.data;
      missingItemTransferAction.setProcessId(missingItemTransferProcessId);
      missingItemTransferAction.setOrderId(salesOrderId);
      missingItemTransferAction.setOrderNumber(salesOrderReferenceNumber);
      missingItemTransferAction.setQuarantineToteLabel(quarantineToteLabel);
      missingItemTransferAction.setOperation(operation);
      missingItemTransferAction.setPickingToteContainedItemSerialNumbers(pickingToteContainedItemSerialNumbers);

      if (
        !missingItemTransferState.isCancelled &&
        missingItemTransferSalesOrderPickingState === MissingItemTransferSalesOrderPickingState.AllItemsNotPicked
      ) {
        missingItemTransferAction.setIsMissing(true);
        missingItemTransferAction.setIsMoreActionsOpen(false);
      }

      const pickedItems = pickedMissingItems.map(orderItem => {
        return { ...orderItem, amountInOrder: orderItem.amount, boxedCount: 0 };
      });
      const pickedInToteItems = pickedItemsInQuarantineTote?.map(quarantineToteItem => {
        return { ...quarantineToteItem, amountInOrder: quarantineToteItem.amount, boxedCount: 0 };
      });

      if (missingItemTransferState.isCancelled) {
        isCancelledSalesOrderToteOnTheQuarantineAddress &&
          missingItemTransferAction.setIsQuarantineToteInQurantineArea(true);
        missingItemTransferAction.toggleModalState(MissingItemTransferModals.OrderStatus, true);
        let updatedOrderItems = [...pickedItems];
        pickedInToteItems?.forEach(pickedInToteItem => {
          const alreadyPlacedItem = updatedOrderItems.find(
            orderItem => orderItem.productId === pickedInToteItem.productId
          );
          if (alreadyPlacedItem) {
            alreadyPlacedItem.amountInOrder += pickedInToteItem.amountInOrder;
          } else {
            updatedOrderItems.push({
              productId: pickedInToteItem.productId,
              productName: pickedInToteItem.productName,
              sku: pickedInToteItem.sku,
              barcodes: pickedInToteItem.barcodes,
              imageUrl: pickedInToteItem.imageUrl,
              amountInOrder: pickedInToteItem.amountInOrder,
              boxedCount: 0,
              isTrackSerialNumber: pickedInToteItem.isTrackSerialNumber,
            });
          }
        });
        missingItemTransferAction.setOrderItems(updatedOrderItems);
      } else {
        missingItemTransferAction.setOrderItems(pickedItems);
      }

      const updatedMissingItems = unPickedMissingItems?.map(missingItem => {
        return { ...missingItem, amountInOrder: missingItem.amount, boxedCount: 0, isMissingItem: true };
      });
      updatedMissingItems && missingItemTransferAction.setMissingItems(updatedMissingItems);

      if (!missingItemTransferState.isCancelled) {
        const updatedQuarantineToteItems = pickedItemsInQuarantineTote.map(quarantineToteItem => {
          return {
            ...quarantineToteItem,
            amountInOrder: quarantineToteItem.amount,
            boxedCount: quarantineToteItem.amount,
            isMissingItem: true,
          };
        });
        missingItemTransferAction.setQuarantineToteItems(updatedQuarantineToteItems);
      }
    }
  }, [createMissingItemTransferProcessResponse]);

  useEffect(() => {
    if (
      checkQuarantineToteMissingItemTransferResponse?.isSuccess &&
      !missingItemTransferState.boxItems.some(item => item.title === missingItemTransferState.barcodeData)
    ) {
      // Tote Adding
      const updatedPrevBoxItems = missingItemTransferState.boxItems.map(item => {
        return { ...item, selected: false };
      });
      const boxItems = [
        ...updatedPrevBoxItems,
        {
          key:
            (updatedPrevBoxItems.length
              ? updatedPrevBoxItems.reduce((prev, curr) => (prev.key > curr.key ? prev : curr)).key
              : 0) + 1,
          title: missingItemTransferState.barcodeData,
          selected: true,
          content: [],
        },
      ].sort(item1 => (item1.selected ? -1 : 1));
      missingItemTransferAction.setBoxItems(boxItems);
      missingItemTransferAction.toggleModalState(MissingItemTransferModals.OrderStatus, false);
      missingItemTransferAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessQuarantineTote`),
      });
    }
    if (checkQuarantineToteMissingItemTransferResponse?.error) {
      if (
        checkQuarantineToteMissingItemTransferResponse.error.internalErrorNumber ===
        InternalErrorNumber.MissingItemTransferQuarantineToteNotFound
      ) {
        missingItemTransferAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
    }
  }, [checkQuarantineToteMissingItemTransferResponse]);

  useEffect(() => {
    if (completeMissingItemTransferResponse?.isSuccess) {
      missingItemTransferAction.setIsLeftBarExpanded(true);
      missingItemTransferAction.setIsOrderCompleted(true);
      clearInterval(window.missingItemTransferTimeInterval);
    }
    if (completeMissingItemTransferResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [completeMissingItemTransferResponse]);

  useEffect(() => {
    if (completeWithLostItemMissingItemTransferResponse?.isSuccess) {
      missingItemTransferAction.setIsLeftBarExpanded(true);
      missingItemTransferAction.setIsOrderCompleted(true);
      clearInterval(window.missingItemTransferTimeInterval);
    }
    if (completeWithLostItemMissingItemTransferResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [completeWithLostItemMissingItemTransferResponse]);

  useEffect(() => {
    if (completeCancelledMissingItemTransferResponse?.isSuccess) {
      missingItemTransferAction.setIsLeftBarExpanded(true);
      missingItemTransferAction.setIsOrderCompleted(true);
      clearInterval(window.missingItemTransferTimeInterval);
    }
    if (completeCancelledMissingItemTransferResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [completeCancelledMissingItemTransferResponse]);

  return <></>;
};
