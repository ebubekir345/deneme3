import { Box, Flex, Icon, Modal, ModalContent } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import lottie from 'lottie-web';
import React, { createRef, FC, RefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { WallToWallStockCountingSummaryReportOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';

interface ISummaryModal {
  isOpen: boolean;
  setIsOpen: Function;
  stockCountingPlanId: string;
}

const intlKey = 'W2WPlanReports.SummaryModal';

const SummaryModal: FC<ISummaryModal> = ({ isOpen, setIsOpen, stockCountingPlanId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [summaryData, setSummaryData] = useState<number[]>([]);
  const [lottieContainers, setLottieContainers] = useState<RefObject<HTMLDivElement>[]>([]);
  const getWallToWallStockCountingSummaryReportResponse: Resource<WallToWallStockCountingSummaryReportOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.QueryWallToWallStockCountingSummaryReport]
  );

  useEffect(() => {
    if (getWallToWallStockCountingSummaryReportResponse?.data) {
      setSummaryData(Object.values(getWallToWallStockCountingSummaryReportResponse.data).map(value => value));
      setLottieContainers(Object.values(getWallToWallStockCountingSummaryReportResponse.data).map(() => createRef()));
    }
  }, [getWallToWallStockCountingSummaryReportResponse]);

  useEffect(() => {
    isOpen &&
      dispatch(
        resourceActions.resourceRequested(ResourceType.QueryWallToWallStockCountingSummaryReport, {
          stockCountingPlanId,
        })
      );
  }, [isOpen]);

  useEffect(() => {
    lottieContainers.length &&
    lottieContainers.map((_, index) => {
      return lottie
        .loadAnimation({
          container: lottieContainers[index].current as HTMLDivElement,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData: require('../../../../lotties/circularProgressBar.json'),
        })
        .playSegments([0, summaryData[index] + 1], true);
    });
  }, [lottieContainers]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="5xl"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      contentBoxProps={{
        overflow: 'hidden',
        textAlign: 'left',
        px: '0',
      }}
      showCloseButton
      closeButton={<Icon color="palette.steel_darker" fontSize="22" name="fas fa-times" />}
    >
      <ModalContent flexDirection="column" fontSize={22} px={0} overflow="auto" width="fit-content" mt={44}>
        <Flex justifyContent="space-around" alignItems="center" flexWrap="wrap">
          {getWallToWallStockCountingSummaryReportResponse?.isBusy
            ? Array.from({ length: 6 }).map((_, i) => {
                return <Skeleton width={300} height={95} style={{ margin: '16px 8px' }} key={i.toString()} />;
              })
            : Array.from({ length: 6 }).map((_, i) => {
                return (
                  <Flex mb={32} flexDirection="column" alignItems="center">
                    <Box
                      color="palette.grey_darker"
                      fontSize="22"
                      py={8}
                      px={16}
                      mb={16}
                      border="3px solid #bbb"
                      borderRadius="sm"
                    >
                      {t(`${intlKey}.Summary${i + 1}.Header`)}
                    </Box>
                    <Box fontSize="14">{t(`${intlKey}.Summary${i + 1}.SubHeader`)}</Box>
                    <Box
                      ref={lottieContainers[i]}
                      id="anim"
                      width={140}
                      height={140}
                      mt={16}
                      bg="palette.slate_lighter"
                      borderRadius="sm"
                      p={16}
                    />
                  </Flex>
                );
              })}
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default SummaryModal;
