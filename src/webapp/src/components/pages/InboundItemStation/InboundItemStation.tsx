import { Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { isBarcodeDebuggingEnabled } from '../../../config/config.default';
import { ResourceType } from '../../../models';
import {
  CheckBarcodeTypeForWebReceivingOutputDTO,
  InboundProblemType,
  PlaceItemToReceivingToteForWebReceivingOutputDTO,
} from '../../../services/swagger/api';
import useInboundItemStationStore, {
  BarcodeScanState,
  DroppableTote,
} from '../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../store/initState';
import ManuelBarcodeInput from '../../organisms/ManuelBarcodeInput';
import { MiddleBar, RightBar } from './bones';
import ErrorModalHandler from './bones/ErrorModalHandler';
import LeftBar from './bones/LeftBar';
import StationEffectTrigger from './bones/StationEffectTrigger';

const intlKey = 'TouchScreen';

const InboundItemStation: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const checkBarcodeTypeResponse: Resource<CheckBarcodeTypeForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CheckBarcodeType]
  );
  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );

  const handleClearResponses = () => {
    dispatch(resourceActions.resourceInit(ResourceType.GetInboundBoxDetails));
    dispatch(resourceActions.resourceInit(ResourceType.CreatePackageInboundStationIfNotExists));
    dispatch(resourceActions.resourceInit(ResourceType.SelectReceivingTote));
    dispatch(resourceActions.resourceInit(ResourceType.SelectQuarantineTote));
    dispatch(resourceActions.resourceInit(ResourceType.CheckBarcodeType));
    dispatch(resourceActions.resourceInit(ResourceType.PlaceItemToReceivingTote));
    dispatch(resourceActions.resourceInit(ResourceType.PlaceItemToQuarantineTote));
    dispatch(resourceActions.resourceInit(ResourceType.DropTote));
    dispatch(resourceActions.resourceInit(ResourceType.InboundPackageComplete));
  };

  const handleBarcodeScan = (data: string) => {
    data = data.trim();
    inboundStationAction.setBarcodeData(data);
    !inboundStationState.errorData.header.includes("ThisItemUnknown") && inboundStationAction.setErrorData({ header: '' });
    if (
      inboundStationState.barcodeScanState === BarcodeScanState.Package &&
      inboundStationState.station &&
      data?.length > 2
    ) {
      inboundStationAction.setPackageLabel(data);
      dispatch(
        resourceActions.resourceRequested(ResourceType.GetInboundBoxDetails, {
          barcode: data,
          receivingAddressLabel: inboundStationState.station.label,
        })
      );
    }
    if (inboundStationState.barcodeScanState === BarcodeScanState.Tote) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.SelectReceivingTote, {
          params: {
            webReceivingProcessId: inboundStationState.receivingProcessId,
            toteLabel: data,
            receivingAddressLabel: inboundStationState.station.label,
          },
        })
      );
    }
    if (inboundStationState.barcodeScanState === BarcodeScanState.QuarantineTote) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.SelectQuarantineTote, {
          params: {
            webReceivingProcessId: inboundStationState.receivingProcessId,
            quarantineToteLabel: data,
            receivingAddressLabel: inboundStationState.station.label,
          },
        })
      );
    }
    if (
      inboundStationState.barcodeScanState === BarcodeScanState.Product &&
      !inboundStationState.isReportProblemModalOpen &&
      !placeItemToReceivingToteResponse?.data?.isExpirationDateRequiredProduct &&
      !checkBarcodeTypeResponse?.isBusy &&
      !placeItemToReceivingToteResponse?.isBusy
    ) {
      inboundStationAction.setProductLabel(data);
      dispatch(resourceActions.resourceRequested(ResourceType.CheckBarcodeType, { params: data }));
    }
    if (inboundStationState.barcodeScanState === BarcodeScanState.QuarantineProductBarcodeRead) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.PlaceItemToQuarantineTote, {
          params: {
            webReceivingProcessId: inboundStationState.receivingProcessId,
            productBarcode: inboundStationState.unknownBarcodeData,
            quarantineToteLabel: data,
            receivingAddressLabel: inboundStationState.station.label,
            inboundProblemType: InboundProblemType.UnidentifiedProductProblem,
          },
        })
      );
    }
    if (inboundStationState.barcodeScanState === BarcodeScanState.DropTote) {
      let tempLabel;
      if (inboundStationState.whichDropToteLabel == DroppableTote.Tote) {
        tempLabel = inboundStationState.toteLabel;
      } else if (inboundStationState.whichDropToteLabel == DroppableTote.QuarantineTote) {
        tempLabel = inboundStationState.quarantineToteLabel;
      }
      dispatch(
        resourceActions.resourceRequested(ResourceType.DropTote, {
          params: {
            webReceivingProcessId: inboundStationState.receivingProcessId,
            toteLabel: tempLabel,
            dropAddressLabel: data,
          },
        })
      );
    }
    if (inboundStationState.barcodeScanState === BarcodeScanState.PlaceItemToteToQuarantine) {
      if (
        placeItemToReceivingToteResponse?.data?.productDetails?.isMasterCarton &&
        placeItemToReceivingToteResponse?.data?.isExpirationDateRequiredProduct
      ) {
        dispatch(
          resourceActions.resourceRequested(ResourceType.PlaceItemToQuarantineTote, {
            params: {
              webReceivingProcessId: inboundStationState.receivingProcessId,
              productBarcode: placeItemToReceivingToteResponse?.data?.productDetails?.masterCartonBarcode,
              quarantineToteLabel: data,
              receivingAddressLabel: inboundStationState.station.label,
              inboundProblemType: inboundStationState.reportProblemType,
              masterCartonDamagedItemAmount:
                placeItemToReceivingToteResponse?.data?.productDetails?.masterCartonItemAmount,
            },
          })
        );
      } else {
        dispatch(
          resourceActions.resourceRequested(ResourceType.PlaceItemToQuarantineTote, {
            params: {
              webReceivingProcessId: inboundStationState.receivingProcessId,
              productBarcode: placeItemToReceivingToteResponse?.data?.productDetails?.barcodes,
              quarantineToteLabel: data,
              receivingAddressLabel: inboundStationState.station.label,
              inboundProblemType: inboundStationState.reportProblemType,
              masterCartonDamagedItemAmount: inboundStationState.masterCartonDamagedItemCount,
            },
          })
        );
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

  return (
    <>
      <Flex height="100vh" flexGrow={1} fontFamily="touchScreen" overflow="hidden">
        <LeftBar
          handleClearResponses={handleClearResponses}
          isBarcodeDebuggingEnabled={isBarcodeDebuggingEnabled}
          handleTestBarcodeInputChange={handleTestBarcodeInputChange}
        />
        <MiddleBar />
        <RightBar />
      </Flex>
      <StationEffectTrigger handleClearResponses={handleClearResponses} />
      <ErrorModalHandler barcodeTestInput={barcodeTestInput} />
      <BarcodeReader onScan={handleBarcodeScan} avgTimeByChar={100} testCode={barcodeTestInput} minLength={2} />
      {inboundStationState.isManuelBarcodeInputOpen && (
        <ManuelBarcodeInput
          placeholder={t(`${intlKey}.SingleItemPackingStation.ManuelBarcodeInput.Placeholder`)}
          closeScreenKeyboard={() => inboundStationAction.setIsManuelBarcodeInputOpen(false)}
          getBarcodeDataFromScreenKeyboard={data => handleBarcodeScan(data)}
        />
      )}
    </>
  );
};

export default InboundItemStation;
