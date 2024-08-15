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
import InboundStationToteDetailsModal from '../../../organisms/InboundStationToteDetailsModal';

const intlKey = 'TouchScreen';
interface IToteData {
  label: string;
  totalItem: number;
  totalProduct: number;
}

const TotePanel: React.FC = () => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const [isToteDetailModal, setIsToteDetailModalOpen] = useState(false);
  const [dropToteModal, setDropToteModal] = useState(false);
  const [dropToteBarcodeModal, setDropToteBarcodeModal] = useState(false);
  const [toteData, setToteData] = useState<IToteData>();
  const [isItemAddedSuccess, setIsItemAddedSuccess] = useState(false);
  const selectReceivingToteResponse: Resource<WebReceivingToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SelectReceivingTote]
  );
  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );
  const createPackageInboundStationProcessIfNotExistsResponse: Resource<CreateWebReceivingProcessIfNotExistsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreatePackageInboundStationIfNotExists]
  );
  const placeItemToQuarantineToteResponse: Resource<PlaceItemToQuarantineToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToQuarantineTote]
  );
  const ContinueIfTotesExistsOnReceivingAddressResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ContinueIfTotesExistsOnReceivingAddress]
  );

  useEffect(() => {
    if (
      createPackageInboundStationProcessIfNotExistsResponse?.isSuccess &&
      createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote
    ) {
      setToteData({
        label: createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote?.label as string,
        totalItem: createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote?.totalItemAmount as number,
        totalProduct: createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote?.totalProductAmount as number,
      });
    }
  }, [createPackageInboundStationProcessIfNotExistsResponse?.data]);

  useEffect(() => {
    if (selectReceivingToteResponse?.isSuccess && selectReceivingToteResponse?.data) {
      setToteData({
        label: selectReceivingToteResponse?.data?.label as string,
        totalItem: selectReceivingToteResponse?.data?.totalItemAmount as number,
        totalProduct: selectReceivingToteResponse?.data?.totalProductAmount as number,
      });
    }
  }, [selectReceivingToteResponse?.data]);

  useEffect(() => {
    if (
      placeItemToReceivingToteResponse?.isSuccess &&
      placeItemToReceivingToteResponse?.data &&
      !placeItemToReceivingToteResponse?.data?.isExpirationDateRequiredProduct
    ) {
      setToteData({
        label: inboundStationState.toteLabel,
        totalItem: placeItemToReceivingToteResponse?.data?.totalItemAmount as number,
        totalProduct: placeItemToReceivingToteResponse?.data?.totalProductAmount as number,
      });
      successfullyAddedItem();
    }
  }, [placeItemToReceivingToteResponse?.data]);

  useEffect(() => {
    if (placeItemToQuarantineToteResponse?.isSuccess && placeItemToQuarantineToteResponse?.data?.receivingTote) {
      setToteData({
        label: placeItemToQuarantineToteResponse?.data.receivingTote?.label as string,
        totalItem: placeItemToQuarantineToteResponse?.data?.receivingTote?.totalItemAmount as number,
        totalProduct: placeItemToQuarantineToteResponse?.data?.receivingTote?.totalProductAmount as number,
      });
    }
  }, [placeItemToQuarantineToteResponse?.data]);

  useEffect(() => {
    if (
      ContinueIfTotesExistsOnReceivingAddressResponse?.isSuccess == true &&
      ContinueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.label
    ) {
      inboundStationAction.setToteLabel(ContinueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.label);
      setToteData({
        label: ContinueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.label,
        totalItem: ContinueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.totalItemAmount,
        totalProduct: ContinueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.totalProductAmount,
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
    inboundStationAction.setWhichDropToteLabel(DroppableTote.Tote);
  };

  if (
    ((selectReceivingToteResponse?.data ||
      ContinueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.label) &&
      !inboundStationState.isToteDropped) ||
    (createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote &&
      !inboundStationState.isToteDropped) ||
    (ContinueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote?.label && !inboundStationState.isToteDropped)
  ) {
    return (
      <Flex
        flexDirection="column"
        px={8}
        py={8}
        bg={
          selectReceivingToteResponse?.data ||
          createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote ||
          ContinueIfTotesExistsOnReceivingAddressResponse?.data?.receivingTote
            ? 'palette.snow_light'
            : 'palette.blue_darker'
        }
        borderRadius={8}
        mb={16}
        height="50%"
        border="4px solid"
        borderColor={isItemAddedSuccess ? 'palette.blue_darker' : 'palette.snow_light'}
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
              {t(`${intlKey}.InboundItemStation.TotePanel.ProductTote`)}
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
                {t(`${intlKey}.InboundItemStation.TotePanel.ItemAmount`)}
              </Text>
              <Text fontSize={16} fontWeight={400}>
                {toteData ? toteData.totalItem : '-'}
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize={16} fontWeight={400} mb={6}>
                {t(`${intlKey}.InboundItemStation.TotePanel.ProductAmount`)}
              </Text>
              <Text fontSize={16} fontWeight={400}>
                {toteData ? toteData.totalProduct : '-'}
              </Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" width={1}>
            <ActionButton
              onClick={() => handleDropTote()}
              fontSize={18}
              px={30}
              borderRadius={8}
              border="none"
              height={56}
              boxShadow="0px 4px 10px rgba(91, 141, 239, 0.1)"
              fontWeight={400}
              mb={16}
              color="palette.grey_dark"
              bg="palette.white"
              cursor="pointer"
            >
              {t(`${intlKey}.InboundItemStation.TotePanel.DropTote`)}
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
              {t(`${intlKey}.InboundItemStation.TotePanel.ToteDetails`)}
            </ActionButton>
          </Flex>
        </Flex>
        {isToteDetailModal && (
          <InboundStationToteDetailsModal
            toteLabel={inboundStationState.toteLabel}
            isOpen={isToteDetailModal}
            onClose={() => setIsToteDetailModalOpen(false)}
          />
        )}
        <DropToteModal
          isOpen={dropToteModal}
          setModal={setDropToteModal}
          dropToteContent={{ header: t(`${intlKey}.InboundItemStation.TotePanel.DropToteModalHeader`) }}
          setDropToteBarcodeScan={setDropToteBarcodeModal}
        />
        <DropToteBarcodeModal
          isOpen={
            inboundStationState.barcodeScanState === BarcodeScanState.DropTote &&
            dropToteBarcodeModal &&
            !inboundStationState.isDiffOpsSamePrdModalOpen
          }
          setModal={setDropToteBarcodeModal}
          header={t(`${intlKey}.InboundItemStation.TotePanel.DropToteBarcodeModalHeader`)}
        />
      </Flex>
    );
  }
  if (
    inboundStationState.barcodeScanState == BarcodeScanState.Tote ||
    inboundStationState.barcodeScanState == BarcodeScanState.DropTote ||
    inboundStationState.quarantineToteLabel
  ) {
    return (
      <>
        <Flex
          flexDirection="column"
          borderRadius={8}
          width="100%"
          bg="palette.blue_darker"
          justifyContent="center"
          alignItems="center"
          color="palette.white"
          padding={42}
          height="50%"
        >
          <Icon name="fal fa-barcode-scan" fontSize={32} />
          <Text mt={32} fontSize={40} fontWeight={500} lineHeight="52px" textAlign="center">
            {t(`${intlKey}.InboundItemStation.TotePanel.ScanBarcodeForTote`)}
          </Text>
        </Flex>
      </>
    );
  }
  return <></>;
};

export default TotePanel;
