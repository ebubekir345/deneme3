import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import {
  CheckBarcodeTypeForWebReceivingOutputDTO,
  CreateWebReceivingProcessIfNotExistsOutputDTO,
  PlaceItemToQuarantineToteForWebReceivingOutputDTO,
  PlaceItemToReceivingToteForWebReceivingOutputDTO,
  WebReceivingBarcodeTypeEnum,
  WebReceivingInboundBoxDetailsOutputDTO,
  WebReceivingToteDetailsOutputDTO,
} from '../../../../services/swagger';
import useInboundItemStationStore, {
  BarcodeScanState,
  DroppableTote,
  initialInboundItemStationState,
} from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import { BarcodeMessageBox } from '../../../atoms/TouchScreen';
import { DiscriminatorTypes } from '../../../molecules/TouchScreen/StationBox';
import { InfoMessageBoxState } from './InfoMessageBox';

interface IStationEffectTrigger {
  handleClearResponses: Function;
}

const StationEffectTrigger: React.FC<IStationEffectTrigger> = ({ handleClearResponses }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const resources = useSelector((state: StoreState) => state.resources);
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const [isWrongBarcodeRead, setIsWrongBarcodeRead] = useState(false);

  const boxDetailsBarcodeResponse: Resource<WebReceivingInboundBoxDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInboundBoxDetails]
  );
  const createPackageInboundStationProcessIfNotExistsResponse: Resource<CreateWebReceivingProcessIfNotExistsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreatePackageInboundStationIfNotExists]
  );
  const selectReceivingToteResponse: Resource<WebReceivingToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SelectReceivingTote]
  );
  const selectReceivingQuarantineToteResponse: Resource<WebReceivingToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SelectQuarantineTote]
  );
  const checkBarcodeTypeResponse: Resource<CheckBarcodeTypeForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CheckBarcodeType]
  );
  const placeItemToQuarantineToteResponse: Resource<PlaceItemToQuarantineToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToQuarantineTote]
  );
  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );
  const dropToteResponse: Resource<any> = useSelector((state: StoreState) => state.resources[ResourceType.DropTote]);
  const completeInboundPackageResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.InboundPackageComplete]
  );
  const continueIfTotesExistsOnReceivingAddressResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ContinueIfTotesExistsOnReceivingAddress]
  );

  useEffect(() => {
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.ReceivingAddress) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.ContinueIfTotesExistsOnReceivingAddress, {
          receivingAddressLabel: stationObject.label,
        })
      );
      inboundStationAction.setStation(stationObject);
    } else {
      history.push(urls.stationLogin);
    }

    return () => {
      handleClearResponses();
      inboundStationAction.clearState(initialInboundItemStationState);
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.Package);
    };
  }, []);

  useEffect(() => {
    if (continueIfTotesExistsOnReceivingAddressResponse?.isSuccess == true) {
      if (
        continueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.inbounBoxLabel &&
        continueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.label &&
        continueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote?.label
      ) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Product);
      } else if (
        continueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.inbounBoxLabel &&
        continueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.label &&
        !continueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote?.label
      ) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.QuarantineTote);
      } else if (
        continueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.inbounBoxLabel &&
        !continueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.label &&
        continueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote?.label
      ) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Tote);
      } else if (
        continueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.inbounBoxLabel &&
        !continueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.label &&
        !continueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote?.label
      ) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Tote);
      } else if (
        !continueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.inbounBoxLabel &&
        continueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.label &&
        continueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote?.label
      ) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Package);
      } else {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Package);
      }
      inboundStationAction.setErrorData({ header: '' });
    }
  }, [continueIfTotesExistsOnReceivingAddressResponse?.data]);

  useEffect(() => {
    if (createPackageInboundStationProcessIfNotExistsResponse?.isSuccess) {
      let processId = createPackageInboundStationProcessIfNotExistsResponse?.data
        ? createPackageInboundStationProcessIfNotExistsResponse.data?.webReceivingProcessId
        : '';
      inboundStationAction.setReceivingProcessId(processId as string);
      inboundStationAction.setErrorData({ header: '' });

      if (
        createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote &&
        !createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote
      ) {
        inboundStationAction.setToteLabel(
          createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote?.label as string
        );
        inboundStationAction.setIsToteDropped(false);
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.QuarantineTote);
      } else if (
        !createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote &&
        createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote
      ) {
        inboundStationAction.setQuarantineToteLabel(
          createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote?.label as string
        );
        inboundStationAction.setIsQuarantineToteDropped(false);
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Tote);
      } else if (
        createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote &&
        createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote
      ) {
        inboundStationAction.setToteLabel(
          createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote?.label as string
        );
        inboundStationAction.setQuarantineToteLabel(
          createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote?.label as string
        );
        inboundStationAction.setIsToteDropped(false);
        inboundStationAction.setIsQuarantineToteDropped(false);
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Product);
      } else {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Tote);
      }
      dispatch(resourceActions.resourceInit(ResourceType.InboundPackageComplete));
      inboundStationAction.setIsPackageDropped(false);
      inboundStationAction.setErrorData({ header: '' });
    } else {
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.Package);
      setIsWrongBarcodeRead(true);
      setTimeout(() => {}, 2000);
    }
  }, [createPackageInboundStationProcessIfNotExistsResponse]);

  useEffect(() => {
    if (boxDetailsBarcodeResponse?.isSuccess) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.CreatePackageInboundStationIfNotExists, {
          params: {
            inboundBoxLabel: inboundStationState.packageLabel,
            receivingToteLabel:
              inboundStationState.toteLabel && !inboundStationState.isToteDropped ? inboundStationState.toteLabel : '',
            quarantineToteLabel:
              inboundStationState.quarantineToteLabel && !inboundStationState.isQuarantineToteDropped
                ? inboundStationState.quarantineToteLabel
                : '',
            receivingAddressLabel: inboundStationState.station.label,
          },
        })
      );
      if (!selectReceivingToteResponse?.data) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Tote);
      } else if (inboundStationState.isToteDropped == false && inboundStationState.isQuarantineToteDropped == true) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.QuarantineTote);
      } else if (inboundStationState.isToteDropped == false && inboundStationState.isQuarantineToteDropped == false) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Product);
      } else {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Tote);
      }
      inboundStationAction.setErrorData({ header: '' });
    } else {
      if (boxDetailsBarcodeResponse?.error?.code === 404) {
        inboundStationAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: 'ErrorScanBarcodeForPackage',
          timer: 3,
          isOpen: true,
        });
      }
    }
    dispatch(resourceActions.resourceInit(ResourceType.CreatePackageInboundStationIfNotExists));
  }, [boxDetailsBarcodeResponse]);

  useEffect(() => {
    if (selectReceivingToteResponse?.isSuccess) {
      selectReceivingToteResponse?.data?.label &&
        inboundStationAction.setToteLabel(selectReceivingToteResponse?.data?.label);
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.QuarantineTote);
      inboundStationAction.setIsToteDropped(false);
      if (inboundStationState.isQuarantineToteDropped || !inboundStationState.quarantineToteLabel) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.QuarantineTote);
      } else {
        inboundStationState.isDiffOpsSamePrdModalOpen &&
          dispatch(resourceActions.resourceInit(ResourceType.PlaceItemToReceivingTote));
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Product);
      }
      inboundStationAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: 'ToteAddedSuccess',
        timer: 2,
        isOpen: true,
      });
      inboundStationAction.setErrorData({ header: '' });
    } else {
      if (selectReceivingToteResponse?.error?.code === 404) {
        inboundStationAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: 'ErrorScanBarcodeForTote',
          timer: 4,
          isOpen: true,
        });
      }
    }
  }, [selectReceivingToteResponse]);

  useEffect(() => {
    if (selectReceivingQuarantineToteResponse?.isSuccess) {
      selectReceivingQuarantineToteResponse?.data &&
        inboundStationAction.setQuarantineToteLabel(selectReceivingQuarantineToteResponse?.data?.label as string);
      inboundStationAction.setIsQuarantineToteDropped(false);
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.Product);
      inboundStationAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: 'ToteAddedSuccess',
        timer: 2,
        isOpen: true,
      });
      inboundStationAction.setErrorData({ header: '' });
    } else {
      if (selectReceivingQuarantineToteResponse?.error?.code === 404) {
        inboundStationAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: 'ErrorScanBarcodeForQuarantineTote',
          timer: 4,
          isOpen: true,
        });
      }
    }
  }, [selectReceivingQuarantineToteResponse]);

  useEffect(() => {
    if (checkBarcodeTypeResponse?.isSuccess === true) {
      if (checkBarcodeTypeResponse?.data?.barcodeType === WebReceivingBarcodeTypeEnum.Product) {
        inboundStationAction.setErrorData({ header: '' });
        dispatch(
          resourceActions.resourceRequested(ResourceType.PlaceItemToReceivingTote, {
            params: {
              webReceivingProcessId: inboundStationState.receivingProcessId,
              productBarcode: inboundStationState.productLabel,
              receivingAddress: inboundStationState.station.label,
            },
          })
        );
      } else if (checkBarcodeTypeResponse?.data?.barcodeType == WebReceivingBarcodeTypeEnum.Undefined) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.QuarantineProductBarcodeRead);
        inboundStationAction.setErrorData({
          header: 'InboundItemStation.Error.ThisItemUnknown',
          subHeader: 'InboundItemStation.Error.BarcodeScanForQuarantineTote',
        });
        inboundStationAction.setUnknownBarcodeData(inboundStationState.barcodeData);
      }
    }
  }, [checkBarcodeTypeResponse]);

  useEffect(() => {
    if (placeItemToReceivingToteResponse?.isSuccess === true) {
      dispatch(resourceActions.resourceInit(ResourceType.PlaceItemToQuarantineTote));
      if (placeItemToReceivingToteResponse?.data?.isToteContainsDifferentOperationSameBarcodeProduct == true) {
        inboundStationAction.setWhichDropToteLabel(DroppableTote.Tote);
        inboundStationAction.setDiffOpsSamePrdModalOpen(true);
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.DropTote);
      } else {
        !placeItemToReceivingToteResponse?.data?.isExpirationDateRequiredProduct &&
          !placeItemToReceivingToteResponse?.data?.isToteContainsDifferentOperationSameExpirationDateProduct &&
          inboundStationAction.callInfoMessageBox({
            state: InfoMessageBoxState.Success,
            text: placeItemToReceivingToteResponse?.data?.productDetails?.isMasterCarton
              ? 'MasterCartonPlacedToTote'
              : 'SingleItemPlacedToTote',
            textValue: placeItemToReceivingToteResponse?.data?.productDetails?.masterCartonItemAmount
              ? placeItemToReceivingToteResponse?.data?.productDetails?.masterCartonItemAmount
              : '',
            timer: 2,
            isOpen: true,
          });
      }
      inboundStationAction.setErrorData({ header: '' });
    }
  }, [placeItemToReceivingToteResponse]);

  useEffect(() => {
    if (placeItemToQuarantineToteResponse?.isSuccess === true) {
      dispatch(resourceActions.resourceInit(ResourceType.PlaceItemToReceivingTote));
      if (placeItemToQuarantineToteResponse?.data?.isToteContainsDifferentOperationSameBarcodeProduct == true) {
        inboundStationAction.setWhichDropToteLabel(DroppableTote.QuarantineTote);
        inboundStationAction.setDiffOpsSamePrdModalOpen(true);
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.DropTote);
      } else {
        if (inboundStationState.barcodeScanState == BarcodeScanState.PlaceItemToteToQuarantine) {
          inboundStationAction.changeBarcodeScanState(BarcodeScanState.Product);
          inboundStationAction.setIsReportProblemModalOpen(false);
        } else {
          inboundStationAction.changeBarcodeScanState(BarcodeScanState.Product);
        }
        inboundStationAction.callInfoMessageBox({
          state: InfoMessageBoxState.Success,
          text: placeItemToReceivingToteResponse?.data?.productDetails?.isMasterCarton
            ? 'MasterCartonItemPlacedToQuarantine'
            : 'ItemPlacedToQuarantine',
          textValue: placeItemToReceivingToteResponse?.data?.productDetails?.masterCartonItemAmount
            ? placeItemToReceivingToteResponse?.data?.isExpirationDateRequiredProduct
              ? placeItemToReceivingToteResponse?.data?.productDetails?.masterCartonItemAmount
              : inboundStationState.masterCartonDamagedItemCount
            : '',
          timer: 2,
          isOpen: true,
        });
      }
      inboundStationAction.setErrorData({ header: '' });
    } else {
      if (placeItemToQuarantineToteResponse?.error?.code === 404) {
        inboundStationAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: 'Error',
          timer: 5,
          isOpen: true,
        });
      }
    }
  }, [placeItemToQuarantineToteResponse]);

  useEffect(() => {
    if (dropToteResponse?.isSuccess) {
      if (
        completeInboundPackageResponse?.isSuccess == true &&
        !continueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.inbounBoxLabel
      ) {
        if (inboundStationState.whichDropToteLabel == DroppableTote.Tote) {
          inboundStationAction.setIsToteDropped(true);
          handleClearToteResponses();
        }
        if (inboundStationState.whichDropToteLabel == DroppableTote.QuarantineTote) {
          inboundStationAction.setIsQuarantineToteDropped(true);
          handleClearQuarantineToteResponses();
        }
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Package);
      } else if (
        inboundStationState.whichDropToteLabel == DroppableTote.Tote &&
        inboundStationState.packageLabel !== ''
      ) {
        handleClearToteResponses();
        inboundStationAction.setIsToteDropped(true);
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Tote);
      } else if (
        inboundStationState.whichDropToteLabel == DroppableTote.QuarantineTote &&
        !inboundStationState.isToteDropped &&
        inboundStationState.packageLabel !== ''
      ) {
        handleClearQuarantineToteResponses();
        inboundStationAction.setIsQuarantineToteDropped(true);
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.QuarantineTote);
      } else if (inboundStationState.whichDropToteLabel == DroppableTote.QuarantineTote) {
        handleClearQuarantineToteResponses();
        inboundStationAction.setToteLabel('');
        inboundStationAction.setIsQuarantineToteDropped(true);
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Tote);
      }
      inboundStationAction.setWhichDropToteLabel(DroppableTote.None);
      inboundStationAction.setErrorData({ header: '' });
      dispatch(resourceActions.resourceInit(ResourceType.PlaceItemToQuarantineTote));
      dispatch(resourceActions.resourceInit(ResourceType.PlaceItemToReceivingTote));
    } else {
      if (dropToteResponse?.error?.code === 404) {
        inboundStationAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: 'ErrorScanBarcodeForDropAddress',
          timer: 4,
          isOpen: true,
        });
      }
    }
  }, [dropToteResponse]);

  const handleClearToteResponses = () => {
    dispatch(resourceActions.resourceInit(ResourceType.SelectReceivingTote));
    inboundStationAction.setToteLabel('');
  };

  const handleClearQuarantineToteResponses = () => {
    dispatch(resourceActions.resourceInit(ResourceType.SelectQuarantineTote));
    dispatch(resourceActions.resourceInit(ResourceType.PlaceQuarantineToteToQuarantineAddress));
    inboundStationAction.setQuarantineToteLabel('');
  };

  return (
    <>
      {inboundStationState.isBarcodeMessageOpen && (
        <BarcodeMessageBox
          isBarcodeMessageOpen={inboundStationState.isBarcodeMessageOpen}
          isWrongBarcodeRead={isWrongBarcodeRead}
          isProcessSuccessText={inboundStationState.barcodeMessageText}
        />
      )}
    </>
  );
};

export default StationEffectTrigger;
