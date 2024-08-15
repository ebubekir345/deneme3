import { Box, Ellipsis, Flex, Image, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { config } from '../../../../config';
import { ResourceType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import {
  AddressTypeOutputDTO,
  CargoPackageSLAMState,
  InternalErrorNumber,
  ListCarriersOutputDTO,
  PrintCargoPackageCarrierLabelOutputDTO,
} from '../../../../services/swagger';
import useSlamStationStore from '../../../../store/global/slamStationStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import { StationBox } from '../../../molecules/TouchScreen';
import { DiscriminatorTypes } from '../../../molecules/TouchScreen/StationBox';
import { StatusEnum } from './BarcodeIcon';
import MoreActionScreen from './MoreActionScreen';
import NotReprintableModal from './NotReprintableModal';
import ReprintModal from './ReprintModal';
import ReturnDialogModal from '../../../molecules/ReturnDialogModal/ReturnDialogModal';
import ScanNextPackageBox from './ScanNextPackageBox';
import ScanStatusBox from './ScanStatusBox';
import StatusModal from './StatusModal';
import { isBarcodeDebuggingEnabled } from '../../../../config/config.default';

const intlKey = 'TouchScreen.SlamStation.ScanBox';
const modalIntlKey = 'TouchScreen.SlamStation.Modals';

export const ScanStatusColumn: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [station, setStation] = useState<AddressTypeOutputDTO>({ id: 0, label: '', discriminator: '' });
  const [status, setStatus] = useState<StatusEnum>(StatusEnum.Initial);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isReprintModalOpen, setIsReprintModalOpen] = useState(false);
  const [isNotReprintableModalOpen, setIsNotReprintableModalOpen] = useState(false);
  const [statusModalMessage, setStatusModalMessage] = useState('');
  const [barcodeValue, setBarcodeValue] = useState<string>();
  const [{ modals }, { toggleModalState }] = useSlamStationStore();

  const printCargoPackageCarrierLabelResponse: Resource<PrintCargoPackageCarrierLabelOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PrintCargoPackageCarrierLabel]
  );
  const listCarriersResponse: Resource<ListCarriersOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ListCarriers]
  );
  const history = useHistory();

  useEffect(() => {
    barcodeValue !== undefined ? handleBarcodeScan(barcodeValue) : '';
  }, [barcodeValue]);

  useEffect(() => {
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.SLAMAddress) {
      setStation(stationObject);
    } else {
      history.push(urls.stationLogin);
    }
    dispatch(resourceActions.resourceRequested(ResourceType.ListCarriers));
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.PrintCargoPackageCarrierLabel));
    };
  }, []);

  useEffect(() => {
    if (printCargoPackageCarrierLabelResponse?.isSuccess) {
      if (printCargoPackageCarrierLabelResponse?.data?.state === CargoPackageSLAMState.ReadyToShip) {
        setStatus(StatusEnum.Success);
      }
      if (printCargoPackageCarrierLabelResponse?.data?.state === CargoPackageSLAMState.ShipmentFailure) {
        setStatus(StatusEnum.ShipmentFailure);
      }
      if (printCargoPackageCarrierLabelResponse?.data?.state === CargoPackageSLAMState.Cancelled) {
        setStatus(StatusEnum.Cancelled);
      }
    }
    if (printCargoPackageCarrierLabelResponse?.error) {
      if (
        printCargoPackageCarrierLabelResponse?.error.internalErrorNumber ===
        InternalErrorNumber.SlamCargoPackageReadyToShipError
      ) {
        setStatus(StatusEnum.Initial);
        setIsReprintModalOpen(true);
        setIsNotReprintableModalOpen(false);
        setIsStatusModalOpen(false);
      } else if (
        printCargoPackageCarrierLabelResponse?.error.internalErrorNumber ===
        InternalErrorNumber.SlamCargoPackageDispatchedError
      ) {
        setStatus(StatusEnum.Initial);
        setStatusModalMessage(t(`${modalIntlKey}.DispatchCompleted`));
        setIsStatusModalOpen(true);
        setIsReprintModalOpen(false);
        setIsNotReprintableModalOpen(false);
      } else if (
        printCargoPackageCarrierLabelResponse?.error.internalErrorNumber ===
        InternalErrorNumber.SlamCargoPackageShippingDomesticError
      ) {
        setStatus(StatusEnum.Initial);
        setIsNotReprintableModalOpen(true);
        setIsReprintModalOpen(false);
        setIsStatusModalOpen(false);
      } else {
        setStatus(StatusEnum.WrongBarcode);
      }
    }
    if (printCargoPackageCarrierLabelResponse?.isBusy) {
      setStatus(StatusEnum.Loading);
    }
  }, [printCargoPackageCarrierLabelResponse]);

  const handleBarcodeScan = (data: string) => {
    data = data.trim();

    setIsStatusModalOpen(false);
    if (!printCargoPackageCarrierLabelResponse?.isBusy) {
      const payload = {
        addressLabel: station.label,
        cargoPackageBarcode: !isReprintModalOpen ? data : barcodeValue,
        isForcePrint: isReprintModalOpen,
      };
      dispatch(resourceActions.resourceRequested(ResourceType.PrintCargoPackageCarrierLabel, { payload }));
    }
  };

  const getCargoCarrierLogoWithName = (name: string) => {
    return listCarriersResponse.data?.carriers?.filter(carrier => carrier.name === name)[0]?.enabledLogoUrl || '';
  };

  const renderScanBox = () => {
    switch (status) {
      case StatusEnum.Initial:
        return (
          <Text mt={64} fontSize={24} color="palette.slate_dark" fontWeight={500} lineHeight="large">
            {t(`${intlKey}.ScanPackage`)}
          </Text>
        );
      case StatusEnum.Success:
        return (
          <>
            <Text mt={16} fontSize={18} color="palette.hardGreen" fontWeight={500} lineHeight={1.78}>
              {t(`${intlKey}.ScanSuccess`)}
            </Text>
            <Text mt={22} fontSize={16} color="palette.slate_dark" fontWeight={500}>
              {t(`${intlKey}.OrderNumber`)}
            </Text>

            <Flex
              fontSize={30}
              fontWeight={500}
              color="palette.slate_dark"
              mt={8}
              width={1}
              lineHeight="xLarge"
              textAlign="center"
            >
              <Ellipsis maxWidth={1000}>
                {printCargoPackageCarrierLabelResponse?.data?.salesOrderReferenceNumber}
              </Ellipsis>
            </Flex>
            <Box
              my={60}
              backgroundImage="linear-gradient(to right, #edf2f7 50%, #718096 0%)"
              backgroundPosition="bottom"
              backgroundSize="20px 1px"
              backgroundRepeat="repeat-x"
              height={1}
              width={1}
            />
            <Text fontSize={16} color="palette.slate_dark" fontWeight={500}>
              {t(`${intlKey}.PackageNumber`)}
            </Text>
            <Text mt={8} fontSize={30} color="palette.slate_dark" fontWeight={500} lineHeight="small">
              {printCargoPackageCarrierLabelResponse?.data?.cargoPackageLabel}
            </Text>
            <Flex
              height={60}
              bg="palette.snow_lighter"
              justifyContent="center"
              alignItems="center"
              borderRadius="lg"
              mt={38}
            >
              <Image
                src={getCargoCarrierLogoWithName(printCargoPackageCarrierLabelResponse?.data?.cargoCarrier || '')}
                height={44}
                width={44}
                my={8}
                mx={16}
                borderRadius="lg"
              />
              <Text fontSize={16} color="palette.hardBlue_darker" fontWeight={600} mr={16}>
                {printCargoPackageCarrierLabelResponse?.data?.cargoCarrier}
              </Text>
            </Flex>
          </>
        );
      case StatusEnum.WrongBarcode:
        return (
          <>
            <Text mt={64} fontSize={26} color="palette.red_darker" fontWeight={500} lineHeight="large">
              {t(`${intlKey}.WrongBarcode`)}
            </Text>
            <Text mt={16} fontSize={16} color="palette.slate_dark" lineHeight="xxLarge">
              {t(`${intlKey}.WrongBarcodeSubtext`)}
            </Text>
          </>
        );
      case StatusEnum.Cancelled:
        return (
          <>
            <Text mt={64} fontSize={26} color="palette.hardRed" fontWeight={500} lineHeight="large">
              {t(`${intlKey}.OrderCancelled`)}
            </Text>
            <Text mt={16} fontSize={16} color="palette.slate_dark" textAlign="center" px={44} lineHeight="medium">
              {t(`${intlKey}.OrderCancelledSubtext`)}
            </Text>
          </>
        );
      case StatusEnum.ShipmentFailure:
        return (
          <>
            <Text mt={64} fontSize={26} color="palette.hardOrange" fontWeight={500} lineHeight="large">
              {t(`${intlKey}.OrderProblematic`)}
            </Text>
            <Text mt={16} fontSize={16} color="palette.slate_dark" textAlign="center" px={44} lineHeight="medium">
              {t(`${intlKey}.OrderProblematicSubtext`)}
            </Text>
          </>
        );
      case StatusEnum.Loading:
        return (
          <Text
            mt={64}
            fontSize={26}
            color="palette.slate_dark"
            fontWeight={500}
            lineHeight="large"
            data-testid="loading"
          >
            {t(`${intlKey}.Loading`)}
          </Text>
        );
      default:
        return null;
    }
  };

  // Debugging Purpose
  const [barcodeTestInput, setBarcodeTestInput] = useState('');
  useEffect(() => {
    setBarcodeTestInput('');
  });
  const handleTestBarcodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcodeTestInput(e.target.value.trim());
  };
  // END Debugging Purpose

  return (
    <>
      <BarcodeReader onScan={setBarcodeValue} avgTimeByChar={100} testCode={barcodeTestInput} minLength={2} />
      <Flex flexDirection="column" justifyContent="space-between" minHeight="100vh" bg="palette.slate_lighter" p={32}>
        <Box>
          <StationBox station={station} />
          <ScanStatusBox status={status}>{renderScanBox()}</ScanStatusBox>
          <ScanNextPackageBox getBarcodeDataFromScreenKeyboard={handleBarcodeScan} />
        </Box>
        <Flex justifyContent="space-between">
          <MoreActionScreenButton />
          <MoreActionScreen />
          {isBarcodeDebuggingEnabled && (
            <input
              onChange={handleTestBarcodeInputChange}
              placeholder={t(`${intlKey}.BarcodeScanDebuggerPlaceHolder`)}
              style={{
                zIndex: 5000,
                width: '200',
                height: '32',
                textAlign: 'center',
              }}
            />
          )}
        </Flex>
      </Flex>
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        message={statusModalMessage}
      />
      <ReturnDialogModal modals={modals} toggleModalState={toggleModalState} type={`TouchScreen.LogoutModal.Types.CargoLabeling`} />
      <ReprintModal
        isOpen={isReprintModalOpen}
        onClose={() => setIsReprintModalOpen(false)}
        handleBarcodeScan={handleBarcodeScan}
      />
      <NotReprintableModal isOpen={isNotReprintableModalOpen} onClose={() => setIsNotReprintableModalOpen(false)} />
    </>
  );
};

export default ScanStatusColumn;

const MoreActionScreenButton: React.FC = () => {
  const [_, { setIsMoreActionsOpen }] = useSlamStationStore();
  return (
    <ActionButton
      onClick={() => setIsMoreActionsOpen(true)}
      icon="fas fa-ellipsis-v"
      iconColor="palette.hardBlue_dark"
      py={8}
      px={16}
      backgroundColor="palette.slate_light"
      border="0"
      data-testid="moreActionButton"
    />
  );
};
