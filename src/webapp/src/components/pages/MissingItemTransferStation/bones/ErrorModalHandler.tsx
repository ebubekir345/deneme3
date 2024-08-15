import { Button } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  CreateMissingItemTransferProcessOutputDTO,
  InternalErrorNumber,
  SalesOrderWithMissingItemStateOutputDTO,
  ToteDetailsOutputDTO,
} from '../../../../services/swagger';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import { StoreState } from '../../../../store/initState';
import ErrorModal from '../../../molecules/ErrorModal';

const intlKey = 'TouchScreen';

const genericErrors = {
  MissingItemTransfer_PickingToteSalesOrderNotFound: {
    header: `MissingItemTransferStation.Error.SalesOrderNotFound`,
    subHeader: `MissingItemTransferStation.Error.ScanAnotherTote`,
  },
  MissingItemTransfer_PickedItemsMustBePlacedToQuarantineToteOnProblemSolverAddresss: {
    header: `MissingItemTransferStation.Error.MustBeOnTransferTrolley`,
    subHeader: `MissingItemTransferStation.Error.ScanAnotherTote`,
  },
  MissingItemTransfer_PickedItemsMustBePlacedToQuarantineToteOnPackingAddress: {
    header: `MissingItemTransferStation.Error.MustBePlacedToQuarantineTote`,
    subHeader: `MissingItemTransferStation.Error.ScanAnotherTote`,
  },
  MissingItemTransfer_SalesOrderStateNotSuitable: {
    header: `MissingItemTransferStation.Error.NotSuitable`,
    subHeader: `MissingItemTransferStation.Error.ScanAnotherTote`,
  },
  MissingItemTransfer_QuarantineToteContainsSalesOrderNotFound: {
    header: `MissingItemTransferStation.Error.QuarantineToteNotFound`,
    subHeader: `MissingItemTransferStation.Error.ScanAnotherTote`,
  },
  MissingItemTransfer_PickedItemAmountCannotBeGreaterThanSalesOrderItemAmount: {
    header: `MissingItemTransferStation.Error.GreaterThanSalesOrder`,
    subHeader: `MissingItemTransferStation.Error.ScanAnotherTote`,
  },
  MissingItemTransfer_QuarantineToteAlreadyAssignedToAnotherSalesOrder: {
    header: `MissingItemTransferStation.Error.QuarantineToteAlreadyAssigned`,
    subHeader: `MissingItemTransferStation.Error.ScanAnotherTote`,
  },
  MissingItemTransfer_ToteIsNotAvailableForPutIntoCancelledOrder: {
    header: `MissingItemTransferStation.Error.QurantineToteNotAvailable`,
    subHeader: `MissingItemTransferStation.Error.ScanAnotherTote`,
  },
  MissingItemTransfer_ToteHasSameProductWithDifferentOperation: {
    header: `MissingItemTransferStation.Error.SameItemWithDifferentOperation`,
    subHeader: `MissingItemTransferStation.Error.ScanAnotherTote`,
  },
};

const ErrorModalHandler: React.FC = () => {
  const { t } = useTranslation();
  const [missingItemTransferState, missingItemTransferAction] = useMissingItemTransferStore();

  const salesOrderState: Resource<SalesOrderWithMissingItemStateOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetMissingItemSalesOrderState]
  );
  const createMissingItemTransferProcessResponse: Resource<CreateMissingItemTransferProcessOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateMissingItemTransferProcess]
  );
  const checkQuarantineToteMissingItemTransferResponse: Resource<ToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CheckQuarantineToteMissingItemTransfer]
  );

  useEffect(() => {
    salesOrderState?.error &&
      salesOrderState.error?.internalErrorNumber !== InternalErrorNumber.MissingItemTransferPickingToteNotFound &&
      missingItemTransferAction.setErrorData(genericErrors[salesOrderState.error.internalErrorNumber]);
  }, [salesOrderState?.error]);

  useEffect(() => {
    createMissingItemTransferProcessResponse?.error &&
      missingItemTransferAction.setErrorData(
        genericErrors[createMissingItemTransferProcessResponse.error.internalErrorNumber]
      );
  }, [createMissingItemTransferProcessResponse?.error]);

  useEffect(() => {
    checkQuarantineToteMissingItemTransferResponse?.error &&
      checkQuarantineToteMissingItemTransferResponse.error?.internalErrorNumber !==
        InternalErrorNumber.MissingItemTransferQuarantineToteNotFound &&
      missingItemTransferAction.setErrorData(
        genericErrors[checkQuarantineToteMissingItemTransferResponse.error.internalErrorNumber]
      );
  }, [checkQuarantineToteMissingItemTransferResponse?.error]);

  return (
    <ErrorModal
      isOpen={missingItemTransferState.errorData?.header !== ''}
      header={t(`${intlKey}.` + missingItemTransferState.errorData?.header)}
      subHeader={
        missingItemTransferState.errorData?.subHeader
          ? t(`${intlKey}.` + missingItemTransferState.errorData?.subHeader)
          : ''
      }
    >
      <Button onClick={() => missingItemTransferAction.setErrorData({ header: '' })} variant="alternative">
        {t(`Modal.Success.Okay`)}
      </Button>
    </ErrorModal>
  );
};

export default ErrorModalHandler;
