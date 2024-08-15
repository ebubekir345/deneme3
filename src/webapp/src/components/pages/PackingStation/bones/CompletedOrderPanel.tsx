import { Box, Button, Flex, Icon, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { PackageType, ReprintPalettePackingListCommand } from '../../../../services/swagger';
import usePackingStore from '../../../../store/global/packingStore';
import useTimerStore from '../../../../store/global/timerStore';
import { StoreState } from '../../../../store/initState';
import durationToHourMinuteSecondConverter from '../../../../utils/durationToHourMinuteSecondConverter';
import PickingTrolleyInfo from './PickingTrolleyInfo';

const intlKey = 'TouchScreen.PackingStation.RightBar';

const CompletedOrderPanel: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState] = usePackingStore();
  const [{ packingTime }] = useTimerStore();
  const [isReprintButtonDisabled, setIsReprintButtonDisabled] = useState(false);
  const [isCompletedPanelFullScreen, setIsCompletedPanelFullScreen] = useState(true);
  const reprintPalettePackingListResponse: Resource<ReprintPalettePackingListCommand> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ReprintPalettePackingList]
  );

  useEffect(() => {
    setTimeout(() => setIsCompletedPanelFullScreen(false), 4000);
  }, [packingState.isOrderCompleted]);

  return (
    <>
      <PickingTrolleyInfo />
      <Box marginTop={20} marginBottom={25} height={1} backgroundColor="palette.grey_light" />
      <Flex flexGrow={1} flexDirection="column" justifyContent="space-between">
        {!packingState.isMissing && !packingState.isCancelled && (
          <>
            <Flex
              width={1}
              height={96}
              borderRadius="md"
              bg="palette.softGrey"
              padding="20px 17px 20px 40px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box width={1} fontSize="26" color="palette.slate_dark" lineHeight="large" fontWeight={500}>
                {t(`${intlKey}.LabelPrinting`)}
              </Box>
              <Button
                onClick={() => {
                  packingState.station.isPrintAdditionalPackageLabel &&
                    packingState.boxItems.length > 1 &&
                    dispatch(
                      resourceActions.resourceRequested(ResourceType.PrintAdditionalCargoPackageLabels, {
                        params: { salesOrderId: packingState.orderId, packingAddressLabel: packingState.station.label },
                      })
                    );
                  dispatch(
                    resourceActions.resourceRequested(ResourceType.PrintCargoPackageLabels, {
                      payload: { salesOrderId: packingState.orderId },
                    })
                  );
                  setIsReprintButtonDisabled(true);
                  setTimeout(() => setIsReprintButtonDisabled(false), 5000);
                }}
                disabled={isReprintButtonDisabled}
                width={60}
                height={60}
                borderRadius="lg"
                boxShadow={
                  isReprintButtonDisabled
                    ? '0 4px 10px 0 rgba(201, 201, 201, 0.75)'
                    : '0 4px 10px 0 rgba(91, 141, 239, 0.75)'
                }
                backgroundColor="palette.softBlue"
                p="0"
                border="0"
                outline="none !important"
                _hover={{
                  backgroundColor: 'palette.softBlue',
                }}
              >
                <img src="/images/reprint.svg" height={44} alt="reprint" />
              </Button>
            </Flex>

            {packingState.boxItems.some(boxItem => boxItem.type === PackageType.Palette) && (
              <Flex
                width={1}
                height={96}
                borderRadius="md"
                bg="palette.softGrey"
                padding="20px 17px 20px 40px"
                alignItems="center"
                justifyContent="space-between"
                mt={8}
              >
                <Box width={1} fontSize="26" color="palette.slate_dark" lineHeight="large" fontWeight={500}>
                  {t(`${intlKey}.PalletPrinting`)}
                </Box>
                <Button
                  onClick={() => {
                    dispatch(
                      resourceActions.resourceRequested(ResourceType.ReprintPalettePackingList, {
                        payload: { salesOrderId: packingState.orderId },
                      })
                    );
                  }}
                  disabled={reprintPalettePackingListResponse?.isBusy}
                  width={60}
                  height={60}
                  borderRadius="lg"
                  boxShadow={
                    isReprintButtonDisabled
                      ? '0 4px 10px 0 rgba(201, 201, 201, 0.75)'
                      : '0 4px 10px 0 rgba(91, 141, 239, 0.75)'
                  }
                  backgroundColor="palette.softBlue"
                  p="0"
                  border="0"
                  outline="none !important"
                  _hover={{
                    backgroundColor: 'palette.softBlue',
                  }}
                >
                  <img src="/images/reprint.svg" height={44} alt="reprint" />
                </Button>
              </Flex>
            )}
          </>
        )}
        <Flex
          width={1}
          position={isCompletedPanelFullScreen ? 'fixed' : 'relative'}
          flexGrow={1}
          p="30"
          borderRadius="md"
          backgroundImage={
            packingState.isMissing || packingState.isCancelled || packingState.isSuspendedSLAM
              ? 'linear-gradient(to bottom, #fdac42, #fccc75)'
              : isCompletedPanelFullScreen
              ? 'linear-gradient(to bottom, green, green);'
              : 'linear-gradient(to bottom, #39d98a, #57eba1);'
          }
          justifyContent="center"
          alignItems="center"
          color="palette.white"
          flexDirection="column"
          mt={packingState.isMissing || packingState.isCancelled || isCompletedPanelFullScreen ? 0 : 16}
          top={isCompletedPanelFullScreen ? 0 : undefined}
          left={isCompletedPanelFullScreen ? 0 : undefined}
          height={isCompletedPanelFullScreen ? '100vh' : undefined}
          zIndex={isCompletedPanelFullScreen ? 2 : undefined}
        >
          <Icon name="fal fa-box-check" fontSize={isCompletedPanelFullScreen ? '120px' : '77px'} />
          <Box fontSize={isCompletedPanelFullScreen ? '96px' : '36px'} fontWeight={500} mt={38}>
            {packingState.operation.name}
          </Box>
          <Box
            fontFamily="SpaceMono"
            mt={0}
            fontSize={isCompletedPanelFullScreen ? '120px' : '44px'}
            fontWeight={isCompletedPanelFullScreen ? 700 : undefined}
            overflowWrap="anywhere"
          >
            #{packingState.orderNumber}
          </Box>
          <Box
            fontSize={isCompletedPanelFullScreen ? '40' : '22'}
            fontWeight={500}
            mt={4}
            data-cy="successfully-finished"
          >
            {packingState.isMissing || packingState.isCancelled
              ? t(`${intlKey}.SuccessfullyQuarantined`)
              : t(`${intlKey}.${packingState.isSuspendedSLAM ? 'PackagedWithSuspended' : 'SuccessfullyPackaged'}`)}
          </Box>
          <Flex
            position="absolute"
            bottom={38}
            height={isCompletedPanelFullScreen ? 80 : 44}
            px={isCompletedPanelFullScreen ? 52 : 38}
            justifyContent="center"
            alignItems="center"
            bg={
              packingState.isMissing || packingState.isCancelled || packingState.isSuspendedSLAM
                ? 'palette.orange_darker'
                : 'palette.hardGreen'
            }
            borderRadius={isCompletedPanelFullScreen ? '36px' : '24px'}
            fontSize={isCompletedPanelFullScreen ? '40' : '16'}
            letterSpacing="negativeLarge"
            color="palette.white"
          >
            <Text fontWeight={700}>{t(`${intlKey}.PackingTime`)}</Text>
            <Text> {durationToHourMinuteSecondConverter(t, packingTime)}</Text>
          </Flex>
        </Flex>
        <Flex
          width={1}
          height={96}
          borderRadius={'md'}
          bg="palette.softGrey"
          py={22}
          px={30}
          alignItems="center"
          mt={16}
        >
          <Icon name="fad fa-barcode-scan" fontSize="26px" mr={16} />
          <Box fontSize="26" fontWeight={500} color="palette.softBlue_light" lineHeight="large">
            {t(`${intlKey}.ScanNextOrder`)}
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default CompletedOrderPanel;
