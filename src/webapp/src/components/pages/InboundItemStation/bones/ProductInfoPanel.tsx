import { Box, Flex, Icon, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models/resource';
import { PlaceItemToReceivingToteForWebReceivingOutputDTO } from '../../../../services/swagger/api';
import useInboundItemStationStore, { BarcodeScanState } from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import { ProblemReportButton } from '../../../atoms/ProblemReportButton';
import { ProblemReportModalType } from './ReportProblemModal';

const intlKey = 'TouchScreen';

const ProductInfoPanel: React.FC = () => {
  const { t } = useTranslation();

  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();

  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );

  const handleProblemReportClick = () => {
    inboundStationAction.setIsReportProblemModalOpen(true);
    inboundStationAction.setReportProblemModal(ProblemReportModalType.ProductScanFailedReportModal);
  };

  return (
    <>
      {placeItemToReceivingToteResponse?.data && (
        <Flex
          bg="palette.snow_lighter"
          borderRadius="4px"
          width={1}
          flexDirection="column"
          p={12}
          mb={18}
          boxShadow="0 6px 10px 0 rgba(199, 200, 204, 0.15)"
        >
          <Flex mb={18} width="100%">
            <Flex flexDirection="column" width={1 / 3}>
              <Text fontSize={12} fontFamily="Lato" fontWeight={700} color="#b8b9c1">
                {t(`${intlKey}.InboundItemStation.ProductInfoPanel.Width`)}(
                {placeItemToReceivingToteResponse?.data?.productDetails?.width?.type?.toLowerCase()})
              </Text>
              <Text fontSize={16} fontFamily="Montserrat" fontWeight={800} color="#707070">
                {placeItemToReceivingToteResponse?.data?.productDetails?.width?.value}
              </Text>
            </Flex>
            <Flex flexDirection="column" width={1 / 3}>
              <Text fontSize={12} fontFamily="Lato" fontWeight={700} color="#b8b9c1">
                {t(`${intlKey}.InboundItemStation.ProductInfoPanel.Length`)} (
                {placeItemToReceivingToteResponse?.data?.productDetails?.length?.type?.toLowerCase()})
              </Text>
              <Text fontSize={16} fontFamily="Montserrat" fontWeight={800} color="#707070">
                {placeItemToReceivingToteResponse?.data?.productDetails?.length?.value}
              </Text>
            </Flex>
            <Flex flexDirection="column" width={1 / 3}>
              <Text fontSize={12} fontFamily="Lato" fontWeight={700} color="#b8b9c1">
                {t(`${intlKey}.InboundItemStation.ProductInfoPanel.Height`)} (
                {placeItemToReceivingToteResponse?.data?.productDetails?.height?.type?.toLowerCase()})
              </Text>
              <Text fontSize={16} fontFamily="Montserrat" fontWeight={800} color="#707070">
                {placeItemToReceivingToteResponse?.data?.productDetails?.height?.value}
              </Text>
            </Flex>
          </Flex>
          <Flex width="100%">
            <Flex flexDirection="column" width={1 / 3}>
              <Text fontSize={12} fontFamily="Lato" fontWeight={700} color="#b8b9c1">
                {t(`${intlKey}.InboundItemStation.ProductInfoPanel.Weight`)} (
                {placeItemToReceivingToteResponse?.data?.productDetails?.weight?.type?.toLowerCase()})
              </Text>
              <Text fontSize={16} fontFamily="Montserrat" fontWeight={800} color="#707070">
                {placeItemToReceivingToteResponse?.data?.productDetails?.weight?.value}
              </Text>
            </Flex>
            <Flex flexDirection="column" width={1 / 3}>
              <Text fontSize={12} fontFamily="Lato" fontWeight={700} color="#b8b9c1">
                {t(`${intlKey}.InboundItemStation.ProductInfoPanel.Property`)}
              </Text>
              <Text fontSize={16} fontFamily="Montserrat" fontWeight={800} color="#707070">
                {placeItemToReceivingToteResponse?.data?.productDetails?.isHeavy
                  ? t(`${intlKey}.InboundItemStation.ProductInfoPanel.Heavy`)
                  : ''}
                {placeItemToReceivingToteResponse?.data?.productDetails?.isHeavy &&
                placeItemToReceivingToteResponse?.data?.productDetails?.isOversized
                  ? ', '
                  : ''}
                {placeItemToReceivingToteResponse?.data?.productDetails?.isOversized
                  ? t(`${intlKey}.InboundItemStation.ProductInfoPanel.Oversized`)
                  : ''}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
      {inboundStationState.barcodeScanState == BarcodeScanState.Product && (
        <Box height={284} bg="palette.blue_darker" borderRadius={8} color="palette.white">
          {!inboundStationState.isReportProblemModalOpen && (
            <Flex justifyContent="flex-end" mr="-4px" mt="-4px">
              <ProblemReportButton
                handleClick={handleProblemReportClick}
                isDisabled={!inboundStationState.quarantineToteLabel ? true : false}
              />
            </Flex>
          )}
          <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100%" px={100}>
            <Icon name="fal fa-barcode-scan" fontSize={32} />
            <Text fontWeight={500} fontSize={38} mt={32} textAlign="center">
              {t(`${intlKey}.InboundItemStation.ProductInfoPanel.DropProductToToteAndScanProductFromPackage`)}
            </Text>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default ProductInfoPanel;
