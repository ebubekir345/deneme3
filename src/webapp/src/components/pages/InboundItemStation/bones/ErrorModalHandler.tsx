import { Resource } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  DiffDateSameSkuModal,
  DifferentOpsSameProductModal,
  ReportExpirationDateProblemModal,
  ReportProblemModal,
} from '.';
import { ResourceType } from '../../../../models';
import {
  CheckBarcodeTypeForWebReceivingOutputDTO,
  CreateWebReceivingProcessIfNotExistsOutputDTO,
  PlaceItemToReceivingToteForWebReceivingOutputDTO,
  WebReceivingInboundBoxDetailsOutputDTO,
  WebReceivingToteDetailsOutputDTO,
} from '../../../../services/swagger';
import useInboundItemStationStore from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import ErrorModal from '../../../molecules/ErrorModal';
import InfoMessageBox from './InfoMessageBox';
import PlaceProductExpirationDateModal from './PlaceProductExpirationDateModal';
import ScanInfoBox from './ScanInfoBox';

const intlKey = 'TouchScreen';

interface IErrorModalHandler {
  barcodeTestInput: string;
}

const genericErrors = {
  WebReceving_QuarantineToteIsNotAvailable: {
    header: `InboundItemStation.Error.ToteIsNotAvailable`,
    subHeader: `InboundItemStation.Error.ScanOtherToteBarcode`,
  },
  WebReceving_ReceivingHasAlreadyQuarantineTote: {
    header: `InboundItemStation.Error.AlreadyHasQuarantineTote`,
    subHeader: `InboundItemStation.Error.ScanOtherToteBarcode`,
  },
  WebReceving_ReceivingAlreadyCompleted: {
    header: `InboundItemStation.Error.AlreadyHasReceivingTote`,
    subHeader: `InboundItemStation.Error.ScanOtherInbounBox`,
  },
  WebReceving_QuarantineToteIsUsedAtAnotherWebOperation: {
    header: `InboundItemStation.Error.ToteProcessingOnDifferentStation`,
    subHeader: `InboundItemStation.Error.ScanOtherToteBarcode`,
  },
  WebReceving_QuarantineToteIsUsedAtAnotherMobileOperation: {
    header: `InboundItemStation.Error.ToteProcessingOnDifferentStation`,
    subHeader: `InboundItemStation.Error.ScanOtherToteBarcode`,
  },
  WebReceving_InboundBoxHasAlreadyReceivingTote: {
    header: `InboundItemStation.Error.AlreadyHasReceivingTote`,
    subHeader: `InboundItemStation.Error.ScanOtherToteBarcode`,
  },
  WebReceving_ToteIsNotAvailable: {
    header: `InboundItemStation.Error.ToteIsNotAvailable`,
    subHeader: `InboundItemStation.Error.ScanOtherToteBarcode`,
  },
  WebReceving_ToteIsProcessedAtDifferentPutaway: {
    header: `InboundItemStation.Error.ProcessingOnPutawayOperation`,
    subHeader: `InboundItemStation.Error.ScanOtherToteBarcode`,
  },
  WebReceving_ReceivingIsProcessedAtAnotherWebOperation: {
    header: `InboundItemStation.Error.ToteProcessingOnDifferentStation`,
    subHeader: `InboundItemStation.Error.ScanOtherToteBarcode`,
  },
  WebReceving_ToteIsProcessedOnMobile: {
    header: `InboundItemStation.Error.ToteProcessingOnDifferentStation`,
    subHeader: `InboundItemStation.Error.ScanOtherToteBarcode`,
  },
  WebReceving_ToteContainsQuarantineItems: {
    header: `InboundItemStation.Error.ToteHasQuarantineItems`,
    subHeader: `InboundItemStation.Error.ScanOtherToteBarcode`,
  },
  WebReceving_InboundBoxIsProcessedAtDifferentAddress: {
    header: `InboundItemStation.Error.ProcessOnDifferentStation`,
    subHeader: `InboundItemStation.Error.ScanOtherInbounBox`,
  },
  WebReceving_InboundBoxIsProcessedOnMobile: {
    header: `InboundItemStation.Error.ProcessOnDifferentStation`,
    subHeader: `InboundItemStation.Error.ScanOtherInbounBox`,
  },
  WebReceving_ReceivingMustBeCompletedByAnotherOperator: {
    header: `InboundItemStation.Error.ProcessingByDifferentUser`,
    subHeader: `InboundItemStation.Error.ScanOtherInbounBox`,
  },
  WebReceving_ExpectedDeliveryDateNotAvailableToReceiveItems: {
    header: `InboundItemStation.Error.ExpectedDeliveryDateNotAvailable`,
    subHeader: `InboundItemStation.Error.ScanOtherInbounBox`,
  },
  WebReceving_PurchaseOrderAlreadyCompleted: {
    header: `InboundItemStation.Error.PurchaseOrderAlreadyCompleted`,
    subHeader: `InboundItemStation.Error.ScanOtherInbounBox`,
  },
  WebReceving_QuarantineToteNotFound: {
    header: `InboundItemStation.Error.QuarantineToteNotFound`,
    subHeader: `InboundItemStation.Error.ScanOtherInbounBox`,
  },
  WebReceving_ReceivingToteNotBelongsToWebReceiving: {
    header: `InboundItemStation.Error.ToteDoesNotBelongsToInboundBox`,
    subHeader: `InboundItemStation.Error.ScanOtherInbounBox`,
  },
  WebReceving_ReceivingHasNoToteToDrop: {
    header: `InboundItemStation.Error.InboundBoxHasNoTotes`,
    subHeader: `InboundItemStation.Error.ScanOtherInbounBox`,
  },
};

const ErrorModalHandler: React.FC<IErrorModalHandler> = ({ barcodeTestInput }) => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();

  const selectReceivingToteResponse: Resource<WebReceivingToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SelectReceivingTote]
  );
  const selectReceivingQuarantineToteResponse: Resource<WebReceivingToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SelectQuarantineTote]
  );
  const createPackageInboundStationProcessIfNotExistsResponse: Resource<CreateWebReceivingProcessIfNotExistsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreatePackageInboundStationIfNotExists]
  );
  const boxDetailsBarcodeResponse: Resource<WebReceivingInboundBoxDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInboundBoxDetails]
  );
  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );
  const checkBarcodeTypeResponse: Resource<CheckBarcodeTypeForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CheckBarcodeType]
  );

  useEffect(() => {
    if (inboundStationState.errorData?.delay && inboundStationState.errorData.delay > 0) {
      setTimeout(() => {
        inboundStationAction.setErrorData({
          header: '',
          subHeader: '',
          delay: 0
        });
      }, inboundStationState.errorData.delay * 1000);
    }
  }, [inboundStationState.errorData]);

  useEffect(() => {
    selectReceivingQuarantineToteResponse?.error &&
      selectReceivingQuarantineToteResponse?.error?.code !== 404 &&
      inboundStationAction.setErrorData(
        genericErrors[selectReceivingQuarantineToteResponse?.error.internalErrorNumber]
      );
    selectReceivingToteResponse?.error &&
      selectReceivingToteResponse?.error?.code !== 404 &&
      inboundStationAction.setErrorData(genericErrors[selectReceivingToteResponse?.error.internalErrorNumber]);
    createPackageInboundStationProcessIfNotExistsResponse?.error &&
      createPackageInboundStationProcessIfNotExistsResponse?.error?.code !== 404 &&
      inboundStationAction.setErrorData(
        genericErrors[createPackageInboundStationProcessIfNotExistsResponse?.error.internalErrorNumber]
      );
    boxDetailsBarcodeResponse?.error &&
      boxDetailsBarcodeResponse?.error?.code !== 404 &&
      inboundStationAction.setErrorData(genericErrors[boxDetailsBarcodeResponse?.error.internalErrorNumber]);
    placeItemToReceivingToteResponse?.error &&
      placeItemToReceivingToteResponse?.error?.code !== 404 &&
      inboundStationAction.setErrorData(genericErrors[placeItemToReceivingToteResponse?.error.internalErrorNumber]);
  }, [
    selectReceivingQuarantineToteResponse?.error,
    selectReceivingToteResponse?.error,
    createPackageInboundStationProcessIfNotExistsResponse?.error,
    boxDetailsBarcodeResponse?.error,
    placeItemToReceivingToteResponse?.error,
  ]);

  return (
    <>
      <ErrorModal
        isOpen={inboundStationState.errorData.header !== '' && inboundStationState.errorData.delay !== 0}
        header={t(`${intlKey}.` + inboundStationState.errorData?.header)}
        subHeader={
          inboundStationState.errorData?.subHeader ? t(`${intlKey}.` + inboundStationState.errorData?.subHeader) : ''
        }
      />
      <ReportProblemModal modalType={inboundStationState.reportProblemModal} />
      <DifferentOpsSameProductModal />
      <ReportExpirationDateProblemModal />
      <DiffDateSameSkuModal />
      <PlaceProductExpirationDateModal barcodeTestInput={barcodeTestInput} />
      <InfoMessageBox />
      <ScanInfoBox
        isScanOpen={
          createPackageInboundStationProcessIfNotExistsResponse?.isBusy === true ||
          selectReceivingToteResponse?.isBusy === true ||
          selectReceivingQuarantineToteResponse?.isBusy === true ||
          checkBarcodeTypeResponse?.isBusy === true
        }
      />
    </>
  );
};

export default ErrorModalHandler;
