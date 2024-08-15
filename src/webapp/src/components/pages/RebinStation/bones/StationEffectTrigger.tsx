import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { config } from '../../../../config';
import { ResourceType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import {
  BatchPickingProductDetailOutputDTO,
  BatchPickingProductDetailWithToteOutputDTO,
  BatchTrolleyDetailsOutputDTO,
  CheckAndPlaceBatchPickingProductOutputDTO,
  CheckBatchPickingToteOutputDTO,
  InternalErrorNumber,
  PickingFlowTag,
  PlaceProductOutputDTO,
  RebinTrolleySide,
  StartSortingProcessOutputDTO,
  TenantConfigurationsOutputDTO,
} from '../../../../services/swagger';
import useCommonStore from '../../../../store/global/commonStore';
import useRebinStore, { initialRebinState, RebinModals } from '../../../../store/global/rebinStore';
import { StoreState } from '../../../../store/initState';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import { DiscriminatorTypes } from '../../../molecules/TouchScreen/StationBox';

interface IStationEffectTrigger {
  messageHandler: (state: InfoMessageBoxState, text: string) => void;
  setIsDropToteClicked: (status: boolean) => void;
}

const intlKey = 'TouchScreen';

const StationEffectTrigger: FC<IStationEffectTrigger> = ({ messageHandler, setIsDropToteClicked }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [rebinState, rebinAction] = useRebinStore();
  const [{ auth0UserInfo }] = useCommonStore();

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
  const tenantConfigurationsByTenantIdResponse: Resource<TenantConfigurationsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetTenantConfigurationsByTenantId]
  );
  const rebinSortingCheckAndPlaceBatchPickingProductResponse: Resource<CheckAndPlaceBatchPickingProductOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingCheckAndPlaceBatchPickingProduct]
  );

  const errorHandler = (error: any, specificMessage?: string) =>
    error &&
    messageHandler(
      InfoMessageBoxState.Error,
      specificMessage ||
        t(
          `${intlKey}.RebinStation.Error.${Object.keys(InternalErrorNumber).find(
            key => InternalErrorNumber[key] === error
          ) || 'WrongBarcodeScanned'}`
        )
    );

  const checkProductHandler = (response: any) => {
    rebinAction.toggleModalState(RebinModals.ToteDetails, false);
    if (response?.data) {
      messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.RebinStation.Success.ItemScanned`));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingPlaceProduct));
      if (response.data.rebinTrolleySide === RebinTrolleySide.Left) {
        rebinAction.setIsLeftRebinTrolleyActive(true);
        rebinAction.setIsRightRebinTrolleyActive(false);
      } else {
        rebinAction.setIsRightRebinTrolleyActive(true);
        rebinAction.setIsLeftRebinTrolleyActive(false);
      }
      rebinAction.setProduct({
        productId: response.data.productId,
        name: response.data.name,
        barcodes: response.data.barcodes,
        imageURL: response.data.imageURL,
        amount: response.data.amount,
      });
      return rebinAction.setCellLabel(response.data.toteLabel as string);
    }
    if (response?.error) {
      return errorHandler(
        response?.error?.internalErrorNumber,
        response?.error?.internalErrorNumber === InternalErrorNumber.BatchPickingNoAvailableToteFound &&
          ((<Trans i18nKey={`${intlKey}.RebinStation.Error.BatchPickingNoAvailableToteFound`} />) as any)
      );
    }
  };

  const dropToteHandler = () => {
    messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.RebinStation.Success.ToteReleased`));
    setIsDropToteClicked(false);
    !(rebinState.toteCount - 1) && rebinAction.toggleModalState(RebinModals.QuarantineAddress);
    rebinAction.setToteLabel('');
    rebinAction.setProductCount(0);
    rebinAction.setToteCount(rebinState.toteCount - 1);
    rebinAction.setCellLabel('');
    rebinAction.setProduct(initialRebinState.product);
    rebinAction.setIsRightRebinTrolleyActive(false);
    rebinAction.setIsLeftRebinTrolleyActive(false);
    return rebinAction.toggleModalState(RebinModals.DropTote);
  };

  useEffect(() => {
    window.rebinTimeInterval = setInterval(() => rebinAction.setRebinTime(true), 1000);
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.RebinAddress) {
      rebinAction.setStation(stationObject);
      dispatch(
        resourceActions.resourceRequested(ResourceType.GetTenantConfigurationsByTenantId, {
          tenantId: auth0UserInfo[config.auth.userMetadataKey]?.tenant?.id,
        })
      );
    } else history.push(urls.stationLogin);
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingCheckBatchTrolley));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingStartSortingProcess));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingAssignRebinTrolley));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingCheckBatchPickingTote));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingGetBatchPickingToteDetails));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingCheckBatchPickingProduct));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingPlaceProduct));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingDropBatchTote));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingDropBatchToteWithLostItems));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingDropRebinTrolley));
      dispatch(resourceActions.resourceInit(ResourceType.GetTenantConfigurationsByTenantId));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingGetAllRebinSortingHistory));
      dispatch(resourceActions.resourceInit(ResourceType.RebinSortingCheckAndPlaceBatchPickingProduct));
      rebinAction.clearState(initialRebinState);
    };
  }, []);

  useEffect(() => {
    tenantConfigurationsByTenantIdResponse?.data?.isRebinAddressScanRemoved && rebinAction.setIsCellScanRemoved(true);
  }, [tenantConfigurationsByTenantIdResponse]);

  useEffect(() => {
    if (rebinSortingCheckBatchTrolleyResponse?.data) {
      if (rebinSortingCheckBatchTrolleyResponse?.data.pickingFlowTag !== PickingFlowTag.MultiItem)
        errorHandler(true, t(`${intlKey}.RebinStation.Error.MustBeSortedInHOVRebin`));
      else {
        rebinAction.setBatchList(rebinSortingCheckBatchTrolleyResponse.data.batchPickingName as string);
        rebinAction.setBatchTrolleyLabel(rebinState.barcodeData);
        rebinAction.setToteCount(rebinSortingCheckBatchTrolleyResponse.data.toteCount as number);
        rebinAction.setRebinTrolleyCount(rebinSortingCheckBatchTrolleyResponse.data.rebinTrolleyCount as number);
        dispatch(
          resourceActions.resourceRequested(ResourceType.RebinSortingStartSortingProcess, {
            payload: { batchTrolleyLabel: rebinState.barcodeData, rebinAddress: rebinState.station.label },
          })
        );
      }
      return;
    }
    if (rebinSortingCheckBatchTrolleyResponse?.error) {
      return errorHandler(rebinSortingCheckBatchTrolleyResponse?.error?.internalErrorNumber);
    }
  }, [rebinSortingCheckBatchTrolleyResponse]);

  useEffect(() => {
    if (rebinSortingStartSortingProcessResponse?.data) {
      messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.RebinStation.Success.BatchTrolleyAdded`));
      rebinAction.setSortingProcessReferenceNumber(
        rebinSortingStartSortingProcessResponse.data.sortingProcessReferenceNumber as number
      );
    }
  }, [rebinSortingStartSortingProcessResponse]);

  useEffect(() => {
    if (rebinSortingAssignRebinTrolleyResponse?.isSuccess) {
      messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.RebinStation.Success.RebinTrolleyAdded`));
      if (!rebinState.rightRebinTrolleyLabel) return rebinAction.setRightRebinTrolleyLabel(rebinState.barcodeData);
      if (!rebinState.leftRebinTrolleyLabel && rebinState.rebinTrolleyCount === 2)
        return rebinAction.setLeftRebinTrolleyLabel(rebinState.barcodeData);
    }
    if (rebinSortingAssignRebinTrolleyResponse?.error) {
      return errorHandler(rebinSortingAssignRebinTrolleyResponse?.error?.internalErrorNumber);
    }
  }, [rebinSortingAssignRebinTrolleyResponse]);

  useEffect(() => {
    if (rebinSortingCheckBatchPickingToteResponse?.data) {
      messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.RebinStation.Success.ToteAdded`));
      rebinAction.setToteLabel(rebinState.barcodeData);
      return rebinAction.setProductCount(rebinSortingCheckBatchPickingToteResponse.data.productCount as number);
    }
    if (rebinSortingCheckBatchPickingToteResponse?.error) {
      return errorHandler(
        rebinSortingCheckBatchPickingToteResponse?.error?.internalErrorNumber,
        rebinSortingCheckBatchPickingToteResponse?.error?.internalErrorNumber ===
          InternalErrorNumber.BatchPickingInvalidTotelabel &&
          ((
            <Trans
              i18nKey={`${intlKey}.RebinStation.Error.ScanAToteFromCart`}
              values={{
                batchTrolleyLabel: rebinState.batchTrolleyLabel,
              }}
            />
          ) as any)
      );
    }
  }, [rebinSortingCheckBatchPickingToteResponse]);

  useEffect(() => {
    checkProductHandler(rebinSortingCheckBatchPickingProductResponse);
  }, [rebinSortingCheckBatchPickingProductResponse]);

  useEffect(() => {
    rebinAction.toggleModalState(RebinModals.TransactionHistory, false);
    checkProductHandler(rebinSortingCheckAndPlaceBatchPickingProductResponse);
    if (rebinSortingCheckAndPlaceBatchPickingProductResponse?.data) {
      rebinAction.setProductCount(rebinState.productCount - 1);
      rebinSortingCheckAndPlaceBatchPickingProductResponse.data.isToteCompleted &&
        rebinAction.toggleModalState(RebinModals.DropTote);
    }
  }, [rebinSortingCheckAndPlaceBatchPickingProductResponse]);

  useEffect(() => {
    if (rebinSortingPlaceProductResponse?.data) {
      messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.RebinStation.Success.ItemAdded`));
      rebinAction.setProductCount(rebinState.productCount - 1);
      rebinSortingPlaceProductResponse.data.isToteCompleted && rebinAction.toggleModalState(RebinModals.DropTote);
    }
    if (rebinSortingPlaceProductResponse?.error) {
      return errorHandler(rebinSortingPlaceProductResponse?.error?.internalErrorNumber);
    }
  }, [rebinSortingPlaceProductResponse]);

  useEffect(() => {
    if (rebinSortingDropBatchToteResponse?.isSuccess) dropToteHandler();
    if (rebinSortingDropBatchToteResponse?.error?.code === 404) {
      return errorHandler(
        rebinSortingDropBatchToteResponse?.error?.internalErrorNumber,
        (<Trans i18nKey={`${intlKey}.RebinStation.Error.ScanValidDropZone`} />) as any
      );
    }
  }, [rebinSortingDropBatchToteResponse]);

  useEffect(() => {
    if (rebinSortingDropBatchToteWithLostItemsResponse?.isSuccess) dropToteHandler();
    if (rebinSortingDropBatchToteWithLostItemsResponse?.error?.code === 404) {
      return errorHandler(
        rebinSortingDropBatchToteWithLostItemsResponse?.error?.internalErrorNumber,
        (<Trans i18nKey={`${intlKey}.RebinStation.Error.ScanValidDropZone`} />) as any
      );
    }
  }, [rebinSortingDropBatchToteWithLostItemsResponse]);

  useEffect(() => {
    if (rebinSortingDropRebinTrolleyResponse?.isSuccess) {
      messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.RebinStation.Success.RebinTrolleyReleased`));
      if (rebinState.rightRebinTrolleyLabel) {
        rebinAction.setRightRebinTrolleyLabel('');
        rebinAction.setIsRightRebinTrolleyActive(false);
      } else {
        rebinAction.setLeftRebinTrolleyLabel('');
        rebinAction.setIsLeftRebinTrolleyActive(false);
      }
      rebinAction.setRebinTrolleyCount(rebinState.rebinTrolleyCount - 1);
    }
    if (rebinSortingDropRebinTrolleyResponse?.error?.code === 404) {
      return errorHandler(rebinSortingDropRebinTrolleyResponse?.error?.internalErrorNumber);
    }
  }, [rebinSortingDropRebinTrolleyResponse]);

  useEffect(() => {
    if (rebinSortingDropBatchTrolleyResponse?.isSuccess) {
      messageHandler(InfoMessageBoxState.Success, t(`${intlKey}.RebinStation.Success.BatchTrolleyReleased`));
      rebinAction.clearState({
        ...initialRebinState,
        station: rebinState.station,
        isCellScanRemoved: rebinState.isCellScanRemoved,
      });
    }
    if (rebinSortingDropBatchTrolleyResponse?.error?.code === 404) {
      return errorHandler(rebinSortingDropBatchTrolleyResponse?.error?.internalErrorNumber);
    }
  }, [rebinSortingDropBatchTrolleyResponse]);
  return <></>;
};

export default StationEffectTrigger;
