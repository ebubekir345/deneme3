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
import useMissingItemTransferStore, {
  initialMissingItemTransferState,
} from '../../../store/global/missingItemTransferStore';
import { StoreState } from '../../../store/initState';
import { MissingItemTransferModals } from '../../../typings/globalStore/enums';
import { ActionButton } from '../../atoms/TouchScreen';
import GenericErrorModal from '../../molecules/GenericErrorModal';
import InfoMessageBox, { InfoMessageBoxState } from '../../molecules/InfoMessageBox/InfoMessageBox';
import { StationBox } from '../../molecules/TouchScreen';
import { DiscriminatorTypes } from '../../molecules/TouchScreen/StationBox';
import ManuelBarcodeInput from '../../organisms/ManuelBarcodeInput';
import {
  BoxItemList,
  CompleteMissingItemTransferDialogModal,
  ExpandButton,
  InfoBoxes,
  MissingItemDialogModal,
  MoreActionScreen,
  OrderStatusModal,
  ReturnDialogModal,
  RightBar,
} from './bones';
import ErrorModalHandler from './bones/ErrorModalHandler';
import SerialNumberModal from './bones/SerialNumberModal';
import { StationEffectTrigger } from './bones/StationEffectTrigger';

declare global {
  interface Window {
    missingItemTransferTimeInterval: any;
  }
}

const intlKey = 'TouchScreen';

const MissingItemTransferStation: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [missingItemTransferState, missingItemTransferAction] = useMissingItemTransferStore();
  const [isGenericErrorModalOpen, setIsGenericErrorModalOpen] = useState(false);
  const bottomButtonGroupRef = useRef<null | HTMLDivElement>(null);
  const history = useHistory();

  const resources = useSelector((state: StoreState) => state.resources);
  const salesOrderState = resources[ResourceType.GetMissingItemSalesOrderState];
  const createMissingItemTransferProcessResponse = resources[ResourceType.CreateMissingItemTransferProcess];
  const checkQuarantineToteMissingItemTransferResponse = resources[ResourceType.CheckQuarantineToteMissingItemTransfer];
  const completeMissingItemTransferResponse = resources[ResourceType.CompleteMissingItemTransfer];
  const completeWithLostItemMissingItemTransferResponse =
    resources[ResourceType.CompleteWithLostItemMissingItemTransfer];
  const completeCancelledMissingItemTransferResponse = resources[ResourceType.CompleteCancelledMissingItemTransfer];

  useEffect(() => {
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.MissingItemTransferAddress) {
      missingItemTransferAction.setStation(stationObject);
    } else {
      history.push(urls.stationLogin);
    }
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetMissingItemSalesOrderState));
      dispatch(resourceActions.resourceInit(ResourceType.CreateMissingItemTransferProcess));
      dispatch(resourceActions.resourceInit(ResourceType.GetQuarantineToteDetails));
      dispatch(resourceActions.resourceInit(ResourceType.CompleteMissingItemTransfer));
      dispatch(resourceActions.resourceInit(ResourceType.CompleteWithLostItemMissingItemTransfer));
      dispatch(resourceActions.resourceInit(ResourceType.CompleteCancelledMissingItemTransfer));
      dispatch(resourceActions.resourceInit(ResourceType.CheckQuarantineToteMissingItemTransfer));
      missingItemTransferAction.clearState(initialMissingItemTransferState);
    };
  }, []);

  const handleBarcodeScan = (data: string) => {
    data = data.trim();

    missingItemTransferAction.toggleModalState(MissingItemTransferModals.SerialNumber, false);
    missingItemTransferAction.setBarcodeData(data);
    missingItemTransferAction.callInfoMessageBox({
      state: InfoMessageBoxState.Scan,
      text: t(`${intlKey}.Barcode.Scanning`),
    });

    if (
      salesOrderState?.isBusy ||
      createMissingItemTransferProcessResponse?.isBusy ||
      completeMissingItemTransferResponse?.isBusy ||
      completeWithLostItemMissingItemTransferResponse?.isBusy ||
      completeCancelledMissingItemTransferResponse?.isBusy ||
      checkQuarantineToteMissingItemTransferResponse?.isBusy
    ) {
      return;
    }

    if (
      !salesOrderState?.isSuccess ||
      createMissingItemTransferProcessResponse?.error ||
      missingItemTransferState.isOrderCompleted
    ) {
      dispatch(resourceActions.resourceRequested(ResourceType.GetMissingItemSalesOrderState, { toteLabel: data }));
    } else {
      const boxItemToBeAdded =
        createMissingItemTransferProcessResponse?.data?.quarantineToteLabel === data &&
        createMissingItemTransferProcessResponse?.data?.quarantineToteLabel;
      const orderItemToBeAdded = missingItemTransferState.orderItems.find(orderItem =>
        orderItem.barcodes?.includes(data)
      );

      if (missingItemTransferState.boxItems.length === 0 && missingItemTransferState.isCancelled) {
        dispatch(
          resourceActions.resourceRequested(ResourceType.CheckQuarantineToteMissingItemTransfer, {
            salesOrderId: missingItemTransferState.orderId,
            quarantineToteLabel: data,
          })
        );
      } else if (
        boxItemToBeAdded &&
        missingItemTransferState.boxItems.length === 0 &&
        !missingItemTransferState.isCancelled
      ) {
        // Box Adding
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
            title: boxItemToBeAdded,
            selected: true,
            content: [],
          },
        ];
        missingItemTransferAction.setBoxItems(boxItems);
        missingItemTransferAction.callInfoMessageBox({
          state: InfoMessageBoxState.Success,
          text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessQuarantineTote`),
        });
      } else if (
        orderItemToBeAdded &&
        missingItemTransferState.boxItems.length &&
        orderItemToBeAdded.boxedCount !== orderItemToBeAdded.amountInOrder
      ) {
        if (!orderItemToBeAdded.isTrackSerialNumber) {
          // Add OrderItem to Box
          const updatedBoxItems = missingItemTransferState.boxItems.map(item => {
            if (item.selected) {
              const placedSameLineItem = item.content.find(
                contentItem => contentItem.productId === orderItemToBeAdded.productId
              );
              if (placedSameLineItem) {
                placedSameLineItem.count += 1;
              } else {
                item.content.push({
                  productId: orderItemToBeAdded.productId,
                  count: 1,
                  barcodes: orderItemToBeAdded.barcodes,
                  productName: orderItemToBeAdded.productName,
                  imageUrl: orderItemToBeAdded.imageUrl,
                });
              }
            }
            return item;
          });
          missingItemTransferAction.setBoxItems(updatedBoxItems);
          missingItemTransferAction.callInfoMessageBox({
            state: InfoMessageBoxState.Success,
            text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessProduct`),
          });
        } else {
          missingItemTransferAction.toggleModalState(MissingItemTransferModals.SerialNumber);
        }
      } else {
        missingItemTransferAction.callInfoMessageBox({
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
    <Flex height="100vh" flexGrow={1} fontFamily="ModernEra" overflow="hidden">
      <BarcodeReader onScan={handleBarcodeScan} avgTimeByChar={100} testCode={barcodeTestInput} minLength={2} />
      <Box
        bg="palette.softGrey"
        width={missingItemTransferState.isLeftBarExpanded ? 2 / 3 : 1 / 3}
        transition="width 1s"
        padding="44px 32px 32px 32px"
      >
        <Flex flexDirection="column" height="100%">
          <StationBox station={missingItemTransferState.station} />
          <InfoBoxes />
          <BoxItemList bottomButtonGroupRef={bottomButtonGroupRef} />
          <Flex ref={bottomButtonGroupRef} justifyContent="space-between" mt={32}>
            <Box>
              <ActionButton
                onClick={() => missingItemTransferAction.setIsMoreActionsOpen(true)}
                icon="fas fa-ellipsis-v"
                iconColor="palette.softBlue"
                height={38}
                px={16}
                backgroundColor="palette.blue_lighter"
                br="4px"
                border="0"
                data-cy="more-actions-button"
              />
              {missingItemTransferState.isMoreActionsOpen && (
                <MoreActionScreen packingState={missingItemTransferState} packingAction={missingItemTransferAction} />
              )}
            </Box>
            {isBarcodeDebuggingEnabled && <input onChange={handleTestBarcodeInputChange} style={{ zIndex: 5000 }} />}
            {missingItemTransferState.orderNumber && !missingItemTransferState.isOrderCompleted && (
              <ExpandButton packingState={missingItemTransferState} packingAction={missingItemTransferAction} />
            )}
          </Flex>
        </Flex>
      </Box>
      <Box
        bg="palette.slate_lighter"
        width={missingItemTransferState.isLeftBarExpanded ? 1 / 3 : 2 / 3}
        transition="width 1s"
        padding="44px 32px 32px 32px"
        position="relative"
      >
        <Flex flexDirection="column" height="100%">
          <RightBar />
        </Flex>
        <InfoMessageBox
          message={missingItemTransferState.infoMessageBox}
          callInfoMessageBox={missingItemTransferAction.callInfoMessageBox}
        />
      </Box>
      {missingItemTransferState.isManuelBarcodeInputOpen && (
        <ManuelBarcodeInput
          placeholder={t(`${intlKey}.MissingItemTransferStation.ManuelBarcodeInput.Placeholder`)}
          closeScreenKeyboard={() => missingItemTransferAction.setIsManuelBarcodeInputOpen(false)}
          getBarcodeDataFromScreenKeyboard={data => handleBarcodeScan(data)}
        />
      )}
      <OrderStatusModal />
      <MissingItemDialogModal />
      <ReturnDialogModal
        modals={missingItemTransferState.modals}
        toggleModalState={missingItemTransferAction.toggleModalState}
        type={`${intlKey}.LogoutModal.Types.Missing`}
      />
      <CompleteMissingItemTransferDialogModal />
      <SerialNumberModal />
      <GenericErrorModal isOpen={isGenericErrorModalOpen} />
      <ErrorModalHandler />
      <StationEffectTrigger setIsGenericErrorModalOpen={setIsGenericErrorModalOpen} />
    </Flex>
  );
};

export default MissingItemTransferStation;
