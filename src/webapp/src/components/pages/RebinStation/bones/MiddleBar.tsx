import { Box, Button, Flex, Icon, Text, Image } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { PlaceProductOutputDTO, StartSortingProcessOutputDTO } from '../../../../services/swagger';
import useRebinStore, { RebinModals } from '../../../../store/global/rebinStore';
import { StoreState } from '../../../../store/initState';

const intlKey = 'TouchScreen.RebinStation.MiddleBar';

interface IMiddleBar {
  setIsDropToteClicked: Function;
}

const MiddleBar: FC<IMiddleBar> = ({ setIsDropToteClicked }) => {
  const { t } = useTranslation();
  const [rebinState, rebinAction] = useRebinStore();
  const element = document.getElementById('order-item-list');

  const rebinSortingPlaceProductResponse: Resource<PlaceProductOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingPlaceProduct]
  );
  const rebinSortingStartSortingProcessResponse: Resource<StartSortingProcessOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingStartSortingProcess]
  );

  useEffect(() => {
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [rebinState.productCount]);

  const handleIsCellScanRemoved = (): JSX.Element => {
    const isScanAnItemFromTheToteVisible =
      ((rebinState.toteLabel && !rebinState.product.productId) ||
        (rebinState.toteLabel && rebinSortingPlaceProductResponse?.data)) &&
      rebinState.productCount > 0;

    return (
      <>
        {rebinState.isCellScanRemoved ? (
          <>
            {rebinState.toteLabel && (
              <Flex flexDirection="column" alignItems="center">
                <Button
                  onClick={() => rebinAction.toggleModalState(RebinModals.TransactionHistory, true)}
                  variant="light"
                  fontWeight={600}
                  fontFamily="Jost"
                  width={250}
                  mt={30}
                  mb={11}
                  outline="none !important"
                >
                  {t(`${intlKey}.TransactionHistory`)}
                </Button>
              </Flex>
            )}
            {isScanAnItemFromTheToteVisible && !rebinState.product.productId
              ? scanBarcode('ScanAnItemFromTheTote')
              : rebinState.toteLabel && (
                  <>
                    <Box fontSize="22" textAlign="center" color="palette.slate" my={6}>
                      {t(`${intlKey}.LastTransaction`)}
                    </Box>
                    <Box width={1}>
                      <Box py={8} px={26} bg="palette.white" borderRadius="md">
                        <Flex
                          key={rebinState.product.productId}
                          color="palette.hardBlue_darker"
                          fontSize="16"
                          alignItems="center"
                          py={11}
                        >
                          <Image
                            src={rebinState.product.imageURL}
                            borderRadius="full"
                            width={26}
                            height={26}
                            flexShrink={0}
                            boxShadow="small"
                          />
                          <Flex flexDirection="column" flexGrow={1} px={16}>
                            <Box
                              letterSpacing="negativeLarge"
                              textOverflow="ellipsis"
                              display="-webkit-box"
                              overflow="hidden"
                              style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                            >
                              {rebinState.product.name}
                            </Box>
                          </Flex>
                          <Box color="palette.blue_darker" fontWeight={700}>{rebinState.cellLabel}</Box>
                        </Flex>
                      </Box>
                    </Box>
                  </>
                )}
          </>
        ) : (
          isScanAnItemFromTheToteVisible && scanBarcode('ScanAnItemFromTheTote') // as-is process
        )}
      </>
    );
  };

  const scanBarcode = (content: string) => (
    <Flex
      flexDirection="column"
      borderRadius="md"
      height="40vh"
      bg="palette.blue_darker"
      justifyContent="center"
      alignItems="center"
      color="palette.white"
      my={16}
      p={38}
    >
      <Icon name="fal fa-barcode-scan" fontSize={32} />
      <Text mt={22} fontSize={32} fontWeight={500} textAlign="center">
        {t(`${intlKey}.${content}`)}
      </Text>
    </Flex>
  );

  if (rebinState.batchTrolleyLabel) {
    return (
      <>
        <Flex
          flexDirection="column"
          borderRadius="md"
          height="30vh"
          bg="palette.softGrey"
          justifyContent="space-between"
          alignItems="center"
          color="palette.slate"
          px={11}
          py={16}
        >
          <Flex flexDirection="column" alignItems="center" fontWeight={900}>
            <Box fontSize="16">{t(`${intlKey}.Trolley`)}</Box>
            <Box fontSize="32">{rebinState.batchTrolleyLabel}</Box>
          </Flex>
          <Flex flexDirection="column" alignItems="center" fontWeight={900}>
            <Box fontSize="16">{t(`${intlKey}.ToteCount`)}</Box>
            <Box fontSize="40">{rebinState.toteCount}</Box>
          </Flex>
        </Flex>

        {((rebinState.rebinTrolleyCount === 1 ? rebinState.rightRebinTrolleyLabel : rebinState.leftRebinTrolleyLabel) ||
          (!rebinState.rebinTrolleyCount &&
            rebinSortingStartSortingProcessResponse?.data?.rightRebinTrolleyLabel &&
            rebinState.rightRebinTrolleyLabel)) &&
        rebinState.toteCount ? (
          !rebinState.toteLabel ? (
            scanBarcode('ScanAToteFromTheCart')
          ) : (
            <Flex
              flexDirection="column"
              borderRadius="md"
              height="50%"
              bg="palette.softGrey"
              justifyContent="space-between"
              alignItems="center"
              color="palette.slate"
              px={11}
              py={16}
              mt={16}
            >
              <Flex flexDirection="column" alignItems="center" fontWeight={900}>
                <Box fontSize="16">{t(`${intlKey}.ToteInfo`)}</Box>
                <Box fontSize="32">{rebinState.toteLabel}</Box>
              </Flex>
              <Flex flexDirection="column" alignItems="center" fontWeight={900}>
                <Box fontSize="16">{t(`${intlKey}.WaitingItemForSorting`)}</Box>
                <Box fontSize="40">{rebinState.productCount}</Box>
              </Flex>
              <Flex flexDirection="column" alignItems="center">
                <Button
                  onClick={() => {
                    setIsDropToteClicked(true);
                    rebinAction.toggleModalState(RebinModals.ToteDetails, true);
                  }}
                  variant="light"
                  fontWeight={600}
                  fontFamily="Jost"
                  width={250}
                  outline="none !important"
                >
                  {t(`${intlKey}.ReleaseTote`)}
                </Button>
                <Button
                  onClick={() => rebinAction.toggleModalState(RebinModals.ToteDetails, true)}
                  variant="light"
                  fontWeight={600}
                  fontFamily="Jost"
                  width={250}
                  mt={11}
                  outline="none !important"
                >
                  {t(`${intlKey}.ToteDetails`)}
                </Button>
              </Flex>
            </Flex>
          )
        ) : null}
        {handleIsCellScanRemoved()}
      </>
    );
  }
  return scanBarcode('ScanBatchTrolley');
};

export default MiddleBar;
