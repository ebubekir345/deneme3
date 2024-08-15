import { Flex, Icon, Text } from '@oplog/express';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSingleItemPackingStore, { SingleItemPackingModals } from '../../../../store/global/singleItemPackingStore';
import { ActionButton } from '../../../atoms/TouchScreen';
import SingleItemPackingToteModal from '../../../organisms/SingleItemPackingToteModal/SingleItemPackingToteModal';

const intlKey = 'TouchScreen.SingleItemPackingStation.LeftBar';

export interface ITotePanel {
  isErrorModalOpen?: boolean;
}

const TotePanel: React.FC<ITotePanel> = ({ isErrorModalOpen }) => {
  const [packingState, packingAction] = useSingleItemPackingStore();
  const [isToteDetailModal, setIsToteDetailModalOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (packingState.modals.CargoPackagePick) setIsToteDetailModalOpen(false);
  }, [packingState.modals.CargoPackagePick]);

  useEffect(() => {
    packingState.modals.SerialNumber && setIsToteDetailModalOpen(false);
  }, [packingState.modals.SerialNumber]);

  useEffect(() => {
    packingState.modals.OrderStatus && setIsToteDetailModalOpen(false);
  }, [packingState.modals.OrderStatus]);

  useEffect(() => {
    packingState.infoMessageBox.text === t(`TouchScreen.SingleItemPackingStation.MiddleBar.SuccessProduct`) &&
      setIsToteDetailModalOpen(false);
  }, [packingState.infoMessageBox]);

  if (packingState.processId) {
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
          padding="27px 12px 52px 12px"
        >
          <Flex flexDirection="column" alignItems="center">
            <Text fontSize={15} lineHeight="22px">
              {t(`${intlKey}.ToteInfo`)}
            </Text>
            <Text fontSize="30px" fontWeight={500} lineHeight="43px" mt={4}>
              {packingState.toteLabel}
            </Text>
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Text fontSize={24} lineHeight="35px" textAlign="center">
              {t(`${intlKey}.PackingWaitingCount`)}
            </Text>
            <Text fontSize="106px" fontWeight={500} lineHeight="154px" mt={4}>
              {packingState.toteContainedItemCount}
            </Text>
          </Flex>
          <Flex flexDirection="column" width={1}>
            <ActionButton
              onClick={() => {
                if (!packingState.toteContainedItemCount)
                  packingAction.toggleModalState(SingleItemPackingModals.ParkAreaScan);
                else if (!packingState.orderId || packingState.isOrderCompleted)
                  packingAction.toggleModalState(SingleItemPackingModals.DropTote);
              }}
              color={!packingState.orderId || packingState.isOrderCompleted ? '#868F9D' : 'rgba(134, 143, 157, 0.5)'}
              bg={!packingState.orderId || packingState.isOrderCompleted ? 'palette.white' : 'rgba(255, 255, 255, 0.5)'}
              fontSize={19}
              px={30}
              borderRadius="8px"
              border="none"
              height="56px"
              width={1}
              flexShrink="0"
              boxShadow="0px 4px 10px rgba(91, 141, 239, 0.1)"
              cursor={!packingState.orderId || packingState.isOrderCompleted ? 'pointer' : 'not-allowed'}
            >
              {t(`${intlKey}.DropTote`)}
            </ActionButton>
            <ActionButton
              onClick={() => setIsToteDetailModalOpen(true)}
              color="#868F9D"
              bg="palette.white"
              fontSize={19}
              px={30}
              borderRadius="8px"
              border="none"
              height="56px"
              width={1}
              flexShrink="0"
              boxShadow="0px 4px 10px rgba(91, 141, 239, 0.1)"
              mt={20}
            >
              {t(`${intlKey}.ToteDetails`)}
            </ActionButton>
          </Flex>
        </Flex>
        {!isErrorModalOpen && (
          <SingleItemPackingToteModal
            toteLabel={packingState.toteLabel}
            processId={packingState.processId}
            isOpen={isToteDetailModal}
            onClose={() => setIsToteDetailModalOpen(false)}
          />
        )}
      </>
    );
  }
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
        {t(`${intlKey}.ScanTote`)}
      </Text>
    </Flex>
  );
};

export default TotePanel;
