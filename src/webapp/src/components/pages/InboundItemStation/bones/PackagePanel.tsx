import { Flex, Icon, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models/resource';
import {
  CreateWebReceivingProcessIfNotExistsOutputDTO,
  WebReceivingInboundBoxDetailsOutputDTO,
} from '../../../../services/swagger/api';
import useInboundItemStationStore from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import DropPackageModal from './DropPackageModal';

const intlKey = 'TouchScreen';

interface IPackageData {
  operation: {
    id?: string;
    imageUrl?: string;
    name?: string;
  };
  purchaseOrderReferenceNumber: string;
  waybillReferenceNumber: string;
}

const PackagePanel: React.FC = () => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const [dropPackageModal, setDropPackageModal] = useState(false);
  const [packageData, setPackageData] = useState<IPackageData>();

  const boxDetailsBarcodeResponse: Resource<WebReceivingInboundBoxDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInboundBoxDetails]
  );
  const createPackageInboundStationProcessIfNotExistsResponse: Resource<CreateWebReceivingProcessIfNotExistsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreatePackageInboundStationIfNotExists]
  );
  const ContinueIfTotesExistsOnReceivingAddressResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ContinueIfTotesExistsOnReceivingAddress]
  );

  useEffect(() => {
    if (
      ContinueIfTotesExistsOnReceivingAddressResponse?.isSuccess == true &&
      ContinueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.inbounBoxLabel
    ) {
      inboundStationAction.setPackageLabel(
        ContinueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.inbounBoxLabel
      );
      inboundStationAction.setReceivingProcessId(
        ContinueIfTotesExistsOnReceivingAddressResponse?.data?.webReceivingProcessId
      );
      setPackageData({
        operation: ContinueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.operation,
        purchaseOrderReferenceNumber:
          ContinueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.purchaseOrderReferenceNumber,
        waybillReferenceNumber:
          ContinueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.waybillReferenceNumber,
      });
    }
  }, [ContinueIfTotesExistsOnReceivingAddressResponse?.data]);

  useEffect(() => {
    if (boxDetailsBarcodeResponse?.isSuccess == true) {
      boxDetailsBarcodeResponse?.data?.inbounBoxLabel &&
        inboundStationAction.setPackageLabel(boxDetailsBarcodeResponse?.data?.inbounBoxLabel);
      setPackageData({
        operation: {
          id: boxDetailsBarcodeResponse?.data?.operation?.id,
          imageUrl: boxDetailsBarcodeResponse?.data?.operation?.imageUrl,
          name: boxDetailsBarcodeResponse?.data?.operation?.name,
        },
        purchaseOrderReferenceNumber: boxDetailsBarcodeResponse?.data?.purchaseOrderReferenceNumber
          ? boxDetailsBarcodeResponse?.data?.purchaseOrderReferenceNumber
          : '',
        waybillReferenceNumber: boxDetailsBarcodeResponse?.data?.waybillReferenceNumber
          ? boxDetailsBarcodeResponse?.data?.waybillReferenceNumber
          : '',
      });
    }
  }, [boxDetailsBarcodeResponse?.data]);

  if (
    (boxDetailsBarcodeResponse?.isSuccess == true &&
      boxDetailsBarcodeResponse?.data?.inbounBoxLabel &&
      !createPackageInboundStationProcessIfNotExistsResponse?.error &&
      createPackageInboundStationProcessIfNotExistsResponse?.isSuccess === true) ||
    (inboundStationState.packageLabel !== '' &&
      !boxDetailsBarcodeResponse?.error &&
      !boxDetailsBarcodeResponse?.isBusy &&
      !createPackageInboundStationProcessIfNotExistsResponse?.error &&
      !createPackageInboundStationProcessIfNotExistsResponse?.isBusy &&
      createPackageInboundStationProcessIfNotExistsResponse?.isSuccess === true) ||
    (ContinueIfTotesExistsOnReceivingAddressResponse?.isSuccess == true &&
      ContinueIfTotesExistsOnReceivingAddressResponse?.data?.inboundBox?.inbounBoxLabel &&
      !inboundStationState.isPackageDropped &&
      !ContinueIfTotesExistsOnReceivingAddressResponse?.error)
  ) {
    return (
      <>
        <Flex
          flexDirection="column"
          borderRadius={8}
          height="100%"
          width="100%"
          bg="palette.softGrey"
          mt={12}
          justifyContent="space-between"
          alignItems="center"
          color="palette.slate"
          px={12}
          py={18}
        >
          <Flex flexDirection="column" width={1}>
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize={14} lineHeight="22px">
                {t(`${intlKey}.InboundItemStation.PackagePanel.PackageInformation`)}
              </Text>
              <Text fontSize={30} fontWeight={500} mt={4}>
                {inboundStationState.packageLabel}
              </Text>
            </Flex>
            <Flex
              flexDirection="column"
              justifyContent="center"
              color={'palette.steel_darker'}
              bg={'palette.white'}
              borderRadius={8}
              border="none"
              px={24}
              mt={16}
              height={62}
              boxShadow="0px 4px 10px rgba(91, 141, 239, 0.1)"
            >
              <Text fontSize={12} fontWeight={400}>
                {t(`${intlKey}.InboundItemStation.PackagePanel.OperationName`)}
              </Text>
              <Text fontSize={20} fontWeight={500}>
                {packageData?.operation.name}
              </Text>
            </Flex>
            <Flex
              flexDirection="column"
              justifyContent="center"
              color={'palette.steel_darker'}
              bg={'palette.white'}
              borderRadius={8}
              border="none"
              px={24}
              mt={14}
              height={62}
              boxShadow="0px 4px 10px rgba(91, 141, 239, 0.1)"
            >
              <Text fontSize={12} fontWeight={400}>
                {t(`${intlKey}.InboundItemStation.PackagePanel.OrderNumber`)}
              </Text>
              <Text fontSize={20} fontWeight={500}>
                {packageData?.purchaseOrderReferenceNumber}
              </Text>
            </Flex>
            <Flex
              flexDirection="column"
              justifyContent="center"
              color={'palette.steel_darker'}
              bg={'palette.white'}
              borderRadius={8}
              border="none"
              px={24}
              mt={14}
              height={62}
              boxShadow="0px 4px 10px rgba(91, 141, 239, 0.1)"
            >
              <Text fontSize={12} fontWeight={400}>
                {t(`${intlKey}.InboundItemStation.PackagePanel.Waybill`)}
              </Text>
              <Text fontSize={20} fontWeight={500}>
                {packageData?.waybillReferenceNumber}
              </Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" width={1}>
            <ActionButton
              onClick={() => setDropPackageModal(true)}
              color={'palette.grey_dark'}
              bg={'palette.white'}
              fontSize={18}
              px={30}
              mb={24}
              borderRadius={8}
              border="none"
              height={56}
              width={1}
              flexShrink="0"
              boxShadow="0px 4px 10px rgba(91, 141, 239, 0.1)"
              cursor={'pointer'}
              fontWeight={400}
            >
              {t(`${intlKey}.InboundItemStation.PackagePanel.DropPackage`)}
            </ActionButton>
          </Flex>
        </Flex>
        <DropPackageModal
          isOpen={dropPackageModal}
          setModal={setDropPackageModal}
          header={t(`${intlKey}.InboundItemStation.PackagePanel.DropPackageModalHeader`)}
          subHeader={t(`${intlKey}.InboundItemStation.PackagePanel.DropPackageModalSubHeader`)}
        />
      </>
    );
  } else {
    return (
      <Flex
        flexDirection="column"
        borderRadius={8}
        height="100%"
        width="100%"
        bg="palette.blue_darker"
        mt={24}
        justifyContent="center"
        alignItems="center"
        color="palette.white"
        padding={42}
      >
        <Icon name="fal fa-barcode-scan" fontSize={32} />
        <Text mt={32} fontSize={38} fontWeight={500} lineHeight="52px" textAlign="center">
          {t(`${intlKey}.InboundItemStation.PackagePanel.ReadBoxBarcode`)}
        </Text>
      </Flex>
    );
  }
};

export default PackagePanel;
