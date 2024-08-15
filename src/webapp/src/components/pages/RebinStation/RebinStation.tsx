import { Button, Flex, Icon, Input } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { isBarcodeDebuggingEnabled } from '../../../config/config.default';
import { ResourceType } from '../../../models';
import {
  BatchPickingProductDetailOutputDTO,
  BatchPickingProductDetailWithToteOutputDTO,
  BatchTrolleyDetailsOutputDTO,
  CheckAndPlaceBatchPickingProductOutputDTO,
  CheckBatchPickingToteOutputDTO,
  PlaceProductOutputDTO,
  StartSortingProcessOutputDTO,
} from '../../../services/swagger';
import useRebinStore from '../../../store/global/rebinStore';
import { StoreState } from '../../../store/initState';
import ErrorOverlay from '../../molecules/ErrorOverlay/ErrorOverlay';
import InfoMessageBox, { InfoMessageBoxState } from '../../molecules/InfoMessageBox/InfoMessageBox';
import ReturnDialogModal from '../../molecules/ReturnDialogModal/ReturnDialogModal';
import { StationBox } from '../../molecules/TouchScreen';
import ManuelBarcodeInput from '../../organisms/ManuelBarcodeInput';
import DropToteModal from './bones/DropToteModal';
import InfoBoxes from './bones/InfoBoxes';
import MiddleBar from './bones/MiddleBar';
import MoreActionScreen from './bones/MoreActionScreen';
import QuarantineAddressModal from './bones/QuarantineAddressModal';
import SideBar, { BarType } from './bones/SideBar';
import StationEffectTrigger from './bones/StationEffectTrigger';
import ToteDetailsModal from './bones/ToteDetailsModal';
import TransactionHistoryModal from './bones/TransactionHistoryModal';

const intlKey = 'TouchScreen';

declare global {
  interface Window {
    rebinTimeInterval: any;
  }
}

const RebinStation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [rebinState, rebinAction] = useRebinStore();
  const [isDropToteClicked, setIsDropToteClicked] = useState(false);

  const rebinSortingCheckBatchTrolleyResponse: Resource<BatchTrolleyDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingCheckBatchTrolley]
  );
  const rebinSortingStartSortingProcessResponse: Resource<StartSortingProcessOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingStartSortingProcess]
  );
  const rebinSortingAssignRebinTrolleyResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingAssignRebinTrolley]
  );
  const rebinSortingCheckBatchPickingToteResponse: Resource<CheckBatchPickingToteOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingCheckBatchPickingTote]
  );
  const rebinSortingGetBatchPickingToteDetailsResponse: Resource<BatchPickingProductDetailOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingGetBatchPickingToteDetails]
  );
  const rebinSortingCheckBatchPickingProductResponse: Resource<BatchPickingProductDetailWithToteOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingCheckBatchPickingProduct]
  );
  const rebinSortingPlaceProductResponse: Resource<PlaceProductOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingPlaceProduct]
  );
  const rebinSortingDropBatchToteResponse: Resource<BatchPickingProductDetailOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingDropBatchTote]
  );
  const rebinSortingDropBatchToteWithLostItemsResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingDropBatchToteWithLostItems]
  );
  const rebinSortingDropRebinTrolleyResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingDropRebinTrolley]
  );
  const rebinSortingDropBatchTrolleyResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingDropBatchTrolley]
  );
  const rebinSortingCheckAndPlaceBatchPickingProductResponse: Resource<CheckAndPlaceBatchPickingProductOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingCheckAndPlaceBatchPickingProduct]
  );

  const messageHandler = (state: InfoMessageBoxState, text: string) =>
    rebinAction.callInfoMessageBox({
      state: state,
      text: text,
    });

  const handleBarcodeScan = (data: string) => {
    data = data.trim();
    messageHandler(InfoMessageBoxState.Scan, t(`${intlKey}.Barcode.Scanning`));

    if (
      rebinSortingCheckBatchTrolleyResponse?.isBusy ||
      rebinSortingStartSortingProcessResponse?.isBusy ||
      rebinSortingAssignRebinTrolleyResponse?.isBusy ||
      rebinSortingCheckBatchPickingToteResponse?.isBusy ||
      rebinSortingGetBatchPickingToteDetailsResponse?.isBusy ||
      rebinSortingCheckBatchPickingProductResponse?.isBusy ||
      rebinSortingPlaceProductResponse?.isBusy ||
      rebinSortingDropBatchToteResponse?.isBusy ||
      rebinSortingDropBatchToteWithLostItemsResponse?.isBusy ||
      rebinSortingDropRebinTrolleyResponse?.isBusy ||
      rebinSortingDropBatchTrolleyResponse?.isBusy ||
      rebinSortingCheckAndPlaceBatchPickingProductResponse?.isBusy
    )
      return;

    rebinAction.setBarcodeData(data);
    if (rebinState.modals.DropTote)
      return dispatch(
        resourceActions.resourceRequested(
          isDropToteClicked
            ? ResourceType.RebinSortingDropBatchToteWithLostItems
            : ResourceType.RebinSortingDropBatchTote,
          {
            payload: {
              sortingProcessReferenceNumber: rebinState.sortingProcessReferenceNumber,
              batchPickingToteLabel: rebinState.toteLabel,
              dropAddressLabel: data,
            },
          }
        )
      );
    if (rebinState.modals.QuarantineAddress && !rebinState.rebinTrolleyCount)
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RebinSortingDropBatchTrolley, {
          payload: {
            sortingProcessReferenceNumber: rebinState.sortingProcessReferenceNumber,
            batchTrolleyLabel: rebinState.batchTrolleyLabel,
            parkAddressLabel: data,
          },
        })
      );
    if (rebinState.modals.QuarantineAddress)
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RebinSortingDropRebinTrolley, {
          payload: {
            sortingProcessReferenceNumber: rebinState.sortingProcessReferenceNumber,
            rebinTrolleyLabels: [
              ...(rebinState.rightRebinTrolleyLabel
                ? [rebinState.rightRebinTrolleyLabel]
                : [rebinState.leftRebinTrolleyLabel]),
            ],
            dropAddressLabel: data,
          },
        })
      );
    if (!rebinState.batchTrolleyLabel)
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RebinSortingCheckBatchTrolley, {
          payload: { batchTrolleyLabel: data },
        })
      );
    if (
      !rebinState.rightRebinTrolleyLabel ||
      (!rebinState.leftRebinTrolleyLabel && rebinState.rebinTrolleyCount === 2)
    ) {
      const dispatcher = () =>
        dispatch(
          resourceActions.resourceRequested(ResourceType.RebinSortingAssignRebinTrolley, {
            payload: {
              sortingProcessReferenceNumber: rebinState.sortingProcessReferenceNumber,
              rebinTrolleyLabel: data,
            },
          })
        );
      if (data === rebinState.rightRebinTrolleyLabel)
        return messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.RebinStation.Error.SortingProcessUnavailableRebinTrolley`));
      if (!rebinState.rightRebinTrolleyLabel) {
        return rebinSortingStartSortingProcessResponse?.data?.rightRebinTrolleyLabel
          ? rebinSortingStartSortingProcessResponse?.data?.rightRebinTrolleyLabel !== data
            ? messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.Barcode.Error`))
            : dispatcher()
          : dispatcher();
      } else {
        return rebinSortingStartSortingProcessResponse?.data?.leftRebinTrolleyLabel
          ? rebinSortingStartSortingProcessResponse?.data?.leftRebinTrolleyLabel !== data
            ? messageHandler(InfoMessageBoxState.Error, t(`${intlKey}.Barcode.Error`))
            : dispatcher()
          : dispatcher();
      }
    }
    if (!rebinState.toteLabel)
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RebinSortingCheckBatchPickingTote, {
          payload: {
            sortingProcessReferenceNumber: rebinState.sortingProcessReferenceNumber,
            batchPickingToteLabel: data,
          },
        })
      );
    if (rebinState.isCellScanRemoved)
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RebinSortingCheckAndPlaceBatchPickingProduct, {
          payload: {
            sortingProcessReferenceNumber: rebinState.sortingProcessReferenceNumber,
            batchPickingToteLabel: rebinState.toteLabel,
            productBarcode: data,
          },
        })
      );
    if (!rebinState.product.productId || rebinSortingPlaceProductResponse?.data)
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RebinSortingCheckBatchPickingProduct, {
          payload: {
            sortingProcessReferenceNumber: rebinState.sortingProcessReferenceNumber,
            batchPickingToteLabel: rebinState.toteLabel,
            productBarcode: data,
          },
        })
      );
    if (rebinState.cellLabel === data && !rebinSortingPlaceProductResponse?.data)
      return dispatch(
        resourceActions.resourceRequested(ResourceType.RebinSortingPlaceProduct, {
          payload: {
            sortingProcessReferenceNumber: rebinState.sortingProcessReferenceNumber,
            batchPickingToteLabel: rebinState.toteLabel,
            productBarcode: rebinState.product.barcodes,
            targetToteLabel: data,
          },
        })
      );

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
    <Flex height="100vh" flexGrow={1} fontFamily="Jost">
      <BarcodeReader onScan={handleBarcodeScan} avgTimeByChar={100} testCode={barcodeTestInput} minLength={2} />
      <ErrorOverlay
        isOpen={
          rebinState?.infoMessageBox?.state === InfoMessageBoxState.Error && rebinState?.infoMessageBox?.text !== ''
        }
        width={1}
      />
      <Flex
        bg="palette.softGrey"
        flexDirection="column"
        justifyContent="center"
        width={1 / 3}
        p={32}
        pt={44}
        mt={-16}
        position="relative"
      >
        {(rebinState.rebinTrolleyCount === 2 ||
          (rebinState.rebinTrolleyCount === 1 && !rebinState.rightRebinTrolleyLabel)) && (
          <SideBar
            barType={BarType.Left}
            isRebinTrolleyNotScanned={Boolean(rebinState.rightRebinTrolleyLabel && !rebinState.leftRebinTrolleyLabel)}
          />
        )}
        <Flex justifyContent="space-between" width="30vw" my={8} position="absolute" bottom={8}>
          <Button variant="light" outline="none !important" onClick={() => rebinAction.setIsMoreActionsOpen(true)}>
            <Icon name="fas fa-ellipsis-v" color="palette.softBlue" />
          </Button>
          {rebinState.isMoreActionsOpen && <MoreActionScreen />}
          {isBarcodeDebuggingEnabled && (
            <Input onChange={handleTestBarcodeInputChange} zIndex={5000} width={120} height={32} autoFocus />
          )}
        </Flex>
      </Flex>
      <Flex
        flexDirection="column"
        bg="palette.slate_lighter"
        overflowY="auto"
        id="order-item-list"
        width={1 / 3}
        px={32}
        py={16}
      >
        <StationBox station={rebinState.station} />
        <InfoBoxes />
        <MiddleBar setIsDropToteClicked={setIsDropToteClicked} />
        <InfoMessageBox message={rebinState.infoMessageBox} callInfoMessageBox={rebinAction.callInfoMessageBox} />
      </Flex>
      <Flex bg="palette.softGrey" flexDirection="column" justifyContent="center" width={1 / 3} p={32} mt={-16}>
        <SideBar
          barType={BarType.Right}
          isRebinTrolleyNotScanned={Boolean(
            rebinState.batchTrolleyLabel &&
              !rebinState.rightRebinTrolleyLabel &&
              !(rebinState.modals.QuarantineAddress && !rebinState.toteCount)
          )}
        />
      </Flex>
      {rebinState.modals.DropTote && <DropToteModal isDropToteClicked={isDropToteClicked} />}
      {rebinState.modals.QuarantineAddress && <QuarantineAddressModal />}
      {rebinState.modals.ToteDetails && (
        <ToteDetailsModal isDropToteClicked={isDropToteClicked} setIsDropToteClicked={setIsDropToteClicked} />
      )}
      {rebinState.modals.TransactionHistory && <TransactionHistoryModal />}
      {rebinState.isManuelBarcodeInputOpen && (
        <ManuelBarcodeInput
          placeholder={t(`${intlKey}.SingleItemPackingStation.ManuelBarcodeInput.Placeholder`)}
          closeScreenKeyboard={() => rebinAction.setIsManuelBarcodeInputOpen(false)}
          getBarcodeDataFromScreenKeyboard={data => handleBarcodeScan(data)}
        />
      )}
      <ReturnDialogModal
        modals={rebinState.modals}
        toggleModalState={rebinAction.toggleModalState}
        type={`${intlKey}.LogoutModal.Types.Rebin`}
      />
      <StationEffectTrigger messageHandler={messageHandler} setIsDropToteClicked={setIsDropToteClicked} />
    </Flex>
  );
};

export default RebinStation;
