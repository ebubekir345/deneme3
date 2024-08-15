import { Box, Flex, Icon, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { OrderItem, ProductInfoPanel } from '.';
import { ResourceType } from '../../../../models';
import { PlaceItemToReceivingToteForWebReceivingOutputDTO } from '../../../../services/swagger/api';
import useInboundItemStationStore, { BarcodeScanState } from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import { ProblemReportButton } from '../../../atoms/ProblemReportButton';
import { ProblemReportModalType } from './ReportProblemModal';

const intlKey = 'TouchScreen';

const InProgressOrderPanel: React.FC = () => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );

  const handleProblemReportClick = () => {
    inboundStationAction.setIsReportProblemModalOpen(true);
    inboundStationAction.setReportProblemModal(ProblemReportModalType.ProductScanFailedReportModal);
  };

  if (placeItemToReceivingToteResponse?.data) {
    return (
      <>
        <Text color="#292427" fontSize={24} mb={24}>
          {t(`${intlKey}.InboundItemStation.ProductInfo`)}
        </Text>
        <Flex flexDirection="column" width={1}>
          <OrderItem />
          <ProductInfoPanel />
        </Flex>
      </>
    );
  }

  if (
    (inboundStationState.barcodeScanState == BarcodeScanState.Product || inboundStationState.reportProblemModal) &&
    inboundStationState.toteLabel &&
    inboundStationState.quarantineToteLabel 
  ) {
    return (
      <>
        <Text color="#292427" fontSize={24} mb={24}>
          {t(`${intlKey}.InboundItemStation.ProductInfo`)}
        </Text>
        <Box height={284} bg="palette.blue_darker" borderRadius={8} color="palette.white">
          {!inboundStationState.isReportProblemModalOpen && (
            <Flex justifyContent="flex-end" mr="-4px" mt="-4px">
              <ProblemReportButton
                handleClick={handleProblemReportClick}
                isDisabled={!inboundStationState.quarantineToteLabel ? true : false}
              />
            </Flex>
          )}
          <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100%">
            <Icon name="fal fa-barcode-scan" fontSize={32} />
            <Text fontWeight={500} fontSize={38} mt={32}>
              {t(`${intlKey}.InboundItemStation.InProgressPackagePanel.ScanItemFromPackage`)}
            </Text>
          </Flex>
        </Box>
      </>
    );
  }

  return (
    <>
      <Text color="#292427" fontSize={24}>
        {t(`${intlKey}.InboundItemStation.ProductInfo`)}
      </Text>
    </>
  );
};

export default InProgressOrderPanel;
