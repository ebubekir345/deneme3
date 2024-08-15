import { Flex, Icon, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DropToteBarcodeModal, DropToteModal } from '.';
import { ResourceType } from '../../../../models/resource';
import {
  CreateWebReceivingProcessIfNotExistsOutputDTO,
  PlaceItemToQuarantineToteForWebReceivingOutputDTO,
  PlaceItemToReceivingToteForWebReceivingOutputDTO,
  WebReceivingToteDetailsOutputDTO,
} from '../../../../services/swagger/api';
import useInboundItemStationStore, {
  BarcodeScanState,
  DroppableTote,
} from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import InboundStationQuaranitineToteDetailsModal from '../../../organisms/InboundStationQuaranitineToteDetailsModal';

const intlKey = 'TouchScreen';
interface IQuarantineToteData {
  label: string;
  totalItem: number;
  totalProduct: number;
}

const QuarantineTotePanel: React.FC = () => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const [dropToteModal, setDropToteModal] = useState(false);
  const [dropToteBarcodeModal, setDropToteBarcodeModal] = useState(false);
  const [isToteDetailModal, setIsToteDetailModalOpen] = useState(false);
  const [toteData, setToteData] = useState<IQuarantineToteData>();
  const [isItemAddedSuccess, setIsItemAddedSuccess] = useState(false);

  const selectReceivingQuarantineToteResponse: Resource<WebReceivingToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SelectQuarantineTote]
  );
  const placeItemToQuarantineToteResponse: Resource<PlaceItemToQuarantineToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToQuarantineTote]
  );
  const createPackageInboundStationProcessIfNotExistsResponse: Resource<CreateWebReceivingProcessIfNotExistsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreatePackageInboundStationIfNotExists]
  );
  const ContinueIfTotesExistsOnReceivingAddressResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ContinueIfTotesExistsOnReceivingAddress]
  );
  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );

  useEffect(() => {
    if (
      createPackageInboundStationProcessIfNotExistsResponse?.isSuccess &&
      createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote
    ) {
      setToteData({
        label: createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote?.label as string,
        totalItem: createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote?.totalItemAmount as number,
        totalProduct: createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote.totalProductAmount as number,
      });
    }
  }, [createPackageInboundStationProcessIfNotExistsResponse?.data]);

  useEffect(() => {
    if (selectReceivingQuarantineToteResponse?.isSuccess && selectReceivingQuarantineToteResponse?.data) {
      setToteData({
        label: selectReceivingQuarantineToteResponse?.data?.label as string,
        totalItem: selectReceivingQuarantineToteResponse?.data?.totalItemAmount as number,
        totalProduct: selectReceivingQuarantineToteResponse?.data?.totalProductAmount as number,
      });
    }
  }, [selectReceivingQuarantineToteResponse?.data]);

  useEffect(() => {
    if (placeItemToQuarantineToteResponse?.isSuccess && placeItemToQuarantineToteResponse?.data?.quarantineTote) {
      setToteData({
        label: inboundStationState.quarantineToteLabel,
        totalItem: placeItemToQuarantineToteResponse?.data?.quarantineTote?.totalItemAmount as number,
        totalProduct: placeItemToQuarantineToteResponse?.data?.quarantineTote?.totalProductAmount as number,
      });
      successfullyAddedItem();
    }
  }, [placeItemToQuarantineToteResponse?.data]);

  useEffect(() => {
    if (
      ContinueIfTotesExistsOnReceivingAddressResponse?.isSuccess == true &&
      ContinueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote?.label
    ) {
      inboundStationAction.setQuarantineToteLabel(
        ContinueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote?.label
      );
      setToteData({
        label: ContinueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote?.label,
        totalItem: ContinueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote?.totalItemAmount,
        totalProduct: ContinueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote?.totalProductAmount,
      });
    }
  }, [ContinueIfTotesExistsOnReceivingAddressResponse?.data]);

  const successfullyAddedItem = () => {
    setIsItemAddedSuccess(true);
    setTimeout(() => {
      setIsItemAddedSuccess(false);
    }, 2000);
  };
  const handleDropTote = () => {
    setDropToteModal(true);
    inboundStationAction.setWhichDropToteLabel(DroppableTote.QuarantineTote);
  };

  if (
    ((selectReceivingQuarantineToteResponse?.data ||
      createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote) &&
      !inboundStationState.isQuarantineToteDropped) ||
    (ContinueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote?.label &&
      !inboundStationState.isQuarantineToteDropped)
  ) {
    return (
      <Flex
        flexDirection="column"
        px={8}
        py={8}
        bg={
          selectReceivingQuarantineToteResponse?.data ||
          createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote ||
          ContinueIfTotesExistsOnReceivingAddressResponse?.data?.quarantineTote
            ? 'palette.snow_light'
            : 'palette.blue_darker'
        }
        borderRadius={8}
        mb={16}
        height="50%"
        border="4px solid"
        borderColor={isItemAddedSuccess ? 'palette.red_darker' : 'palette.snow_light'}
      >
        <Flex
          flexDirection="column"
          borderRadius={8}
          height="100%"
          width="100%"
          bg="palette.snow_light"
          justifyContent="space-around"
          alignItems="center"
          color="palette.slate"
        >
          <Flex flexDirection="column" alignItems="center">
            <Text fontSize={14} fontWeight={700}>
              {t(`${intlKey}.InboundItemStation.QuarantineTotePanel.QuarantineTote`)}
            </Text>
            <Text fontSize={30} fontWeight={500} mt={8} textAlign="center">
              {toteData ? toteData?.label : '-'}
            </Text>
          </Flex>
          <Flex
            width={1}
            height={62}
            borderRadius={8}
            mb={16}
            justifyContent="space-around"
            alignItems="center"
            px={18}
          >
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize={16} fontWeight={400} mb={6}>
                {t(`${intlKey}.InboundItemStation.QuarantineTotePanel.ItemAmount`)}
              </Text>
              <Text fontSize={16} fontWeight={400}>
                {toteData ? toteData.totalItem : '-'}
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize={16} fontWeight={400} mb={6}>
                {t(`${intlKey}.InboundItemStation.QuarantineTotePanel.ProductAmount`)}
              </Text>
              <Text fontSize={16} fontWeight={400}>
                {toteData ? toteData.totalProduct : '-'}
              </Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" width={1}>
            <ActionButton
              onClick={() => handleDropTote()}
              color="palette.grey_dark"
              bg="palette.white"
              fontSize={18}
              px={30}
              borderRadius={8}
              border="none"
              height={56}
              boxShadow="0px 4px 10px rgba(91, 141, 239, 0.1)"
              cursor="pointer"
              fontWeight={400}
              mb={16}
            >
              {t(`${intlKey}.InboundItemStation.QuarantineTotePanel.DropTote`)}
            </ActionButton>
            <ActionButton
              onClick={() => setIsToteDetailModalOpen(true)}
              color="palette.grey_dark"
              bg="palette.white"
              fontSize={18}
              px={30}
              borderRadius={8}
              border="none"
              height={56}
              boxShadow="0px 4px 10px rgba(91, 141, 239, 0.1)"
              cursor="pointer"
              fontWeight={400}
            >
              {t(`${intlKey}.InboundItemStation.QuarantineTotePanel.ToteDetails`)}
            </ActionButton>
          </Flex>
        </Flex>
        {isToteDetailModal && (
          <InboundStationQuaranitineToteDetailsModal
            toteLabel={inboundStationState.quarantineToteLabel}
            isOpen={isToteDetailModal}
            onClose={() => setIsToteDetailModalOpen(false)}
          />
        )}
        <DropToteModal
          isOpen={dropToteModal}
          setModal={setDropToteModal}
          dropToteContent={{ header: t(`${intlKey}.InboundItemStation.QuarantineTotePanel.DropToteModalHeader`) }}
          setDropToteBarcodeScan={setDropToteBarcodeModal}
        />
        <DropToteBarcodeModal
          isOpen={inboundStationState.barcodeScanState === BarcodeScanState.DropTote && dropToteBarcodeModal && !inboundStationState.isDiffOpsSamePrdModalOpen}
          setModal={setDropToteBarcodeModal}
          header={t(`${intlKey}.InboundItemStation.QuarantineTotePanel.DropToteBarcodeModalHeader`)}
        />
      </Flex>
    );
  }
  if (
    inboundStationState.barcodeScanState == BarcodeScanState.QuarantineTote ||
    inboundStationState.barcodeScanState == BarcodeScanState.DropTote
  ) {
    return (
      <Flex
        flexDirection="column"
        borderRadius={8}
        height="50%"
        width="100%"
        bg="palette.blue_darker"
        justifyContent="center"
        alignItems="center"
        color="palette.white"
        padding={42}
      >
        <Icon name="fal fa-barcode-scan" fontSize={32} />
        <Text mt={32} fontSize={40} fontWeight={500} lineHeight="52px" textAlign="center">
          {t(`${intlKey}.InboundItemStation.QuarantineTotePanel.ScanBarcodeForTote`)}
        </Text>
      </Flex>
    );
  }
  return <></>;
};

export default QuarantineTotePanel;
