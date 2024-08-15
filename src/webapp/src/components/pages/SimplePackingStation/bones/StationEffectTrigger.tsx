import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  AddCargoPackageCommandOutputDTO,
  PickingItemByProductOutputDTO,
  PrintSLAMDocumentsOnPackingOutputDTO,
  SimplePackingProcessOutputDTO,
} from '../../../../services/swagger';
import useSimplePackingStore, {
  initialSimplePackingState,
  SimplePackingModals,
} from '../../../../store/global/simplePackingStore';
import { StoreState } from '../../../../store/initState';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';

const intlKey = 'TouchScreen';

interface IStationEffectTrigger {
  messageHandler: (state: InfoMessageBoxState, text: string) => void;
  handleOrderDetails: (data) => void;
  setIsGenericErrorModalOpen: (state: boolean) => void;
}

const StationEffectTrigger: FC<IStationEffectTrigger> = ({
  messageHandler,
  handleOrderDetails,
  setIsGenericErrorModalOpen,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useSimplePackingStore();

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
    if (checkPackingProcessExistsResponse?.data) {
      handleOrderDetails(checkPackingProcessExistsResponse.data);
      const {
        pickingItems,
        cargoPackages,
        operationCargoPackageTypes,
        oplogCargoPackageTypes,
      } = checkPackingProcessExistsResponse.data as any;
      packingAction.setOperationCargoPackageTypes(operationCargoPackageTypes);
      packingAction.setOplogCargoPackageTypes(oplogCargoPackageTypes);

      const orderItems = pickingItems
        .map((orderItem: PickingItemByProductOutputDTO) => {
          const unboxedAmount =
            (orderItem.amountInOrder as any) -
            cargoPackages.reduce(
              (accumulator, cargoPackage) =>
                accumulator +
                cargoPackage.boxItems.reduce(
                  (acc, boxItem) => (boxItem.productId === orderItem.productId ? acc + boxItem.amount : acc),
                  0
                ),
              0
            );

          return unboxedAmount
            ? { ...orderItem, boxedCount: 0, scannedCount: 0, unboxedAmount: unboxedAmount }
            : orderItem;
        })
        .filter(orderItem => orderItem.unboxedAmount);
      packingAction.setOrderItems(orderItems);

      const boxItems = cargoPackages.map((cargoPackage, index) => ({
        key: cargoPackage.packageIndex,
        title: cargoPackage.cargoPackageTypeBarcode,
        selected: index === 0,
        volume: operationCargoPackageTypes
          .concat(oplogCargoPackageTypes)
          .find(type => type.barcode === cargoPackage.cargoPackageTypeBarcode)?.volumetricWeight,
        content: cargoPackage.boxItems.map(boxItem => ({
          productId: boxItem.productId,
          count: boxItem.amount,
          barcodes: boxItem.barcodes,
          productName: boxItem.productName,
          imageUrl: boxItem.productImageUrl,
        })),
        cargoPackageIndex: cargoPackage.packageIndex,
        packageId: cargoPackage.packageId,
        type: operationCargoPackageTypes
          .concat(oplogCargoPackageTypes)
          .find(type => type.barcode === cargoPackage.cargoPackageTypeBarcode)?.type,
      }));
      return packingAction.setBoxItems(boxItems);
    }
    if (checkPackingProcessExistsResponse?.error) return setIsGenericErrorModalOpen(true);
  }, [checkPackingProcessExistsResponse]);

  useEffect(() => {
    if (createPackingProcessExistsResponse?.isSuccess) {
      if (packingState.isOrderCompleted) {
        packingAction.clearState({
          ...initialSimplePackingState,
          station: packingState.station,
        });
        window.simplePackingTimeInterval = setInterval(() => packingAction.setSimplePackingTime(true), 1000);
      }
      if (createPackingProcessExistsResponse?.data?.failedMessage) {
        if (
          createPackingProcessExistsResponse?.data?.failedMessage ===
          'No suitable sales order found in SimplePackingAddress'
        )
          return messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.SimplePackingStation.Error.ProductNotFound`));
        if (createPackingProcessExistsResponse?.data?.failedMessage === 'No sales orders found in SimplePackingAddress')
          return messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.SimplePackingStation.Error.NoProduct`));
        return messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.Barcode.Error`));
      } else {
        handleOrderDetails(createPackingProcessExistsResponse.data);
        const orderItems = createPackingProcessExistsResponse.data?.pickingItems?.map(
          (orderItem: PickingItemByProductOutputDTO) => {
            if (orderItem.barcodes?.includes(packingState.barcodeData))
              return { ...orderItem, boxedCount: 0, scannedCount: 1, unboxedAmount: orderItem.amountInOrder };
            return { ...orderItem, boxedCount: 0, scannedCount: 0, unboxedAmount: orderItem.amountInOrder };
          }
        );
        packingAction.setOrderItems(orderItems as any);
        packingAction.setIsProductAddedIntoPackage(true);
        return createPackingProcessExistsResponse.data?.pickingItems?.reduce(
          (a, c) => a + (c.amountInOrder || 0),
          0
        ) === 1
          ? packingAction.toggleModalState(SimplePackingModals.CargoPackagePick)
          : messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.SimplePackingStation.Success.ItemScanned`));
      }
    }
    if (createPackingProcessExistsResponse?.error)
      return messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.Barcode.Error`));
  }, [createPackingProcessExistsResponse]);

  useEffect(() => {
    if (addCargoPackageResponse?.data) {
      packingAction.toggleModalState(SimplePackingModals.CargoPackagePick);
      const boxItemToBeAdded = packingState.operationCargoPackageTypes
        .concat(packingState.oplogCargoPackageTypes)
        .find(type => type.barcode === packingState.barcodeData);

      const updatedBoxItems = packingState.boxItems.map(item => {
        return { ...item, selected: false };
      });
      const boxItems = [
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
        ...updatedBoxItems,
      ];
      packingAction.setBoxItems(boxItems as []);
      return packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessPackage`),
      });
    }
    if (addCargoPackageResponse?.error) return messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.Barcode.Error`));
  }, [addCargoPackageResponse]);

  useEffect(() => {
    if (queueItemsIntoCargoPackageResponse?.isSuccess) {
      const orderItemsToBeAdded = packingState.orderItems.filter(orderItem =>
        packingState.isAllItemsAdded ? orderItem.unboxedAmount : orderItem.boxedCount
      );
      const updatedBoxItems = packingState.boxItems.map(boxItem => {
        if (boxItem.selected) {
          orderItemsToBeAdded.map(orderItemToBeAdded => {
            boxItem.content.push({
              productId: orderItemToBeAdded.productId,
              ...(packingState.isAllItemsAdded
                ? { count: orderItemToBeAdded.unboxedAmount }
                : { count: orderItemToBeAdded.boxedCount }),
              barcodes: orderItemToBeAdded.barcodes,
              productName: orderItemToBeAdded.productName,
              imageUrl: orderItemToBeAdded.imageUrl,
            });
          });
        }
        return boxItem;
      });
      packingAction.setBoxItems(updatedBoxItems);
      packingAction.setOrderItems(
        packingState.orderItems
          .map(orderItem => ({
            ...orderItem,
            boxedCount: 0,
            unboxedAmount: (orderItem.unboxedAmount || 0) - orderItem.boxedCount,
          }))
          .filter(orderItem => orderItem.unboxedAmount)
      );
      !packingState.isAllItemsAdded &&
        packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Success,
          text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessProduct`),
        });

      if (packingState.isAllItemsAdded) {
        const cargoPackages = packingState.boxItems.reduce((accumulator, boxItem) => {
          if (boxItem.content.length) {
            return [
              ...accumulator,
              {
                cargoPackageTypeBarcode: boxItem.title,
                cargoPackageIndex: boxItem.cargoPackageIndex,
                packingItems: boxItem.content.reduce(
                  (packingAccumulator, packingItem) => [
                    ...packingAccumulator,
                    { amount: packingItem.count, productId: packingItem.productId, serialNumbers: [] },
                  ],
                  []
                ),
              },
            ];
          }
          return [...accumulator];
        }, []);

        dispatch(
          resourceActions.resourceRequested(ResourceType.SimplePackingProcessCompletePackingProcess, {
            params: {
              packages: cargoPackages,
              packingAddressLabel: packingState.station.label,
              insertToPackageVAS: [],
            },
          })
        );
        return packingAction.setBarcodeData('');
      }
      return packingAction.toggleModalState(SimplePackingModals.CargoPackagePick);
    }
    if (queueItemsIntoCargoPackageResponse?.error)
      return messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.Barcode.Error`));
  }, [queueItemsIntoCargoPackageResponse]);

  useEffect(() => {
    if (completePackingProcessResponse?.isSuccess) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.SimplePackingProcessPrintCargoPackageLabels, {
          params: { salesOrderId: packingState.orderId },
        })
      );
      packingState.isEligibleForSLAMPrint &&
        dispatch(
          resourceActions.resourceRequested(ResourceType.SimplePackingProcessPrintSLAMDocuments, {
            params: {
              simplePackingAddressLabel: packingState.station.label,
              salesOrderId: packingState.orderId,
            },
          })
        );
      packingAction.setIsOrderCompleted(true);
      packingAction.setIsAllItemsAdded(false);
      return clearInterval(window.simplePackingTimeInterval);
    }
    if (completePackingProcessResponse?.error) return setIsGenericErrorModalOpen(true);
  }, [completePackingProcessResponse]);

  useEffect(() => {
    if (printCargoPackageLabelsResponse?.error) return setIsGenericErrorModalOpen(true);
  }, [printCargoPackageLabelsResponse]);

  useEffect(() => {
    if (printSLAMDocumentsResponse?.data?.isSuspended) return packingAction.setIsSuspendedSLAM(true);
    if (printSLAMDocumentsResponse?.error) return setIsGenericErrorModalOpen(true);
  }, [printSLAMDocumentsResponse]);

  return <></>;
};

export default StationEffectTrigger;
