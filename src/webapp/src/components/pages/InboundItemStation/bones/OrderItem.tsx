import { Box, Flex, Image, ImageViewer } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models/resource';
import { PlaceItemToReceivingToteForWebReceivingOutputDTO } from '../../../../services/swagger/api';
import useInboundItemStationStore from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import { ProblemReportButton } from '../../../atoms/ProblemReportButton';
import { ProgressBar } from '../../../atoms/TouchScreen';
import { ProblemReportModalType } from './ReportProblemModal';

const OrderItem: React.FC = (): ReactElement => {
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const [isProductViewerOpen, setIsProductViewerOpen] = useState(false);

  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );

  const handleProblemReportClick = () => {
    if (inboundStationState.quarantineToteLabel) {
      inboundStationAction.setIsReportProblemModalOpen(true);
      placeItemToReceivingToteResponse?.data?.productDetails?.isMasterCarton
        ? inboundStationAction.setReportProblemModal(ProblemReportModalType.MasterBarcodeProblemReportModal)
        : inboundStationAction.setReportProblemModal(ProblemReportModalType.ProductScannedReportModal);
    }
  };

  return (
    <>
      <Box width={1}>
        {!inboundStationState.isReportProblemModalOpen &&
          !placeItemToReceivingToteResponse?.data?.isExpirationDateRequiredProduct && (
            <Flex justifyContent="flex-end" mr="-4px" mt="-4px">
              <ProblemReportButton
                handleClick={handleProblemReportClick}
                isDisabled={!inboundStationState.quarantineToteLabel ? true : false}
              />
            </Flex>
          )}
        <Flex
          mb={12}
          bg="palette.snow_lighter"
          borderRadius="4px"
          boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.1)"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex
            width={92}
            height={120}
            borderRadius="4px 0 0 4px"
            px={8}
            py={24}
            justifyContent="center"
            alignItems="center"
            flexShrink={0}
          >
            <Image
              onClick={() => {
                setIsProductViewerOpen(true);
              }}
              src={placeItemToReceivingToteResponse?.data?.productDetails?.productImageURL}
              borderRadius={8}
              width={72}
              height={72}
            />
          </Flex>
          <Box flexGrow={1} paddingLeft={24} py="20px">
            <Box
              fontSize={22}
              color="palette.hardBlue_darker"
              textOverflow="ellipsis"
              display="-webkit-box"
              overflow="hidden"
              fontWeight={400}
            >
              {placeItemToReceivingToteResponse?.data?.productDetails?.productName}
            </Box>
            <Box fontSize={20} color="palette.blue_light" pt={2} pb={4} textAlign="left">
              {placeItemToReceivingToteResponse?.data?.productDetails?.barcodes}
            </Box>
            {!inboundStationState.isReportProblemModalOpen && (
              <Box>
                <ProgressBar
                  current={
                    placeItemToReceivingToteResponse?.data ? placeItemToReceivingToteResponse?.data?.totalItemAmount as number : 1
                  }
                  total={
                    placeItemToReceivingToteResponse?.data ? placeItemToReceivingToteResponse?.data?.totalItemAmount as number : 1
                  }
                  barColor="palette.softBlue"
                  label={false}
                  borderRadius="4px"
                  height="8px"
                  containerColor="palette.softBlue_lighter"
                  completeColor="palette.softBlue"
                />
              </Box>
            )}
          </Box>

          {(!inboundStationState.isReportProblemModalOpen ||
            placeItemToReceivingToteResponse?.data?.productDetails?.isMasterCarton) && (
            <Box mr={32} fontSize={24} fontWeight={700} color="palette.softBlue" whiteSpace="nowrap">
              x
              {placeItemToReceivingToteResponse?.data?.productDetails?.masterCartonItemAmount
                ? placeItemToReceivingToteResponse?.data?.productDetails?.masterCartonItemAmount
                : '1'}
            </Box>
          )}
        </Flex>
      </Box>
      <ImageViewer
        images={[
          placeItemToReceivingToteResponse?.data?.productDetails?.productImageURL !== undefined
            ? { url: placeItemToReceivingToteResponse?.data?.productDetails?.productImageURL }
            : { url: '' },
        ]}
        isOpen={isProductViewerOpen}
        activeIndex={0}
        onActiveIndexChange={index => null}
        onClose={() => setIsProductViewerOpen(false)}
      />
    </>
  );
};

export default OrderItem;
