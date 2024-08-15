import { Box, Button, Flex, Icon, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { ShippingFlowTag } from '../../../../services/swagger';
import useSimplePackingStore from '../../../../store/global/simplePackingStore';
import { StoreState } from '../../../../store/initState';
import durationToHourMinuteSecondConverter from '../../../../utils/durationToHourMinuteSecondConverter';
import OrderItemPanel from './OrderItemPanel';

const intlKey = 'TouchScreen.SimplePackingStation.RightBar';

const RightBar: FC = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useSimplePackingStore();
  const [isReprintButtonDisabled, setIsReprintButtonDisabled] = useState(false);
  const [isCompletedPanelFullScreen, setIsCompletedPanelFullScreen] = useState(false);

  const queueItemsIntoCargoPackageResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SimplePackingProcessQueueItemsIntoCargoPackage]
  );

  useEffect(() => {
    packingState.isOrderCompleted && setIsCompletedPanelFullScreen(true);
    setTimeout(() => setIsCompletedPanelFullScreen(false), 4000);
  }, [packingState.isOrderCompleted]);

  if (packingState.isOrderCompleted) {
    return (
      <Flex flexGrow={1} flexDirection="column" justifyContent="space-between">
        <Flex
          width={1}
          height={96}
          borderRadius="md"
          bg="palette.softGrey"
          py={22}
          pr={16}
          pl={38}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box width={1} fontSize="26" color="palette.slate_dark" lineHeight="large" fontWeight={500}>
            {t(`TouchScreen.PackingStation.RightBar.LabelPrinting`)}
          </Box>
          <Button
            onClick={() => {
              dispatch(
                resourceActions.resourceRequested(ResourceType.SimplePackingProcessPrintCargoPackageLabels, {
                  payload: { salesOrderId: packingState.orderId },
                })
              );
              setIsReprintButtonDisabled(true);
              setTimeout(() => setIsReprintButtonDisabled(false), 5000);
            }}
            disabled={isReprintButtonDisabled}
            width={64}
            height={64}
            borderRadius="lg"
            boxShadow={
              isReprintButtonDisabled
                ? '0 4px 10px 0 rgba(201, 201, 201, 0.75)'
                : '0 4px 10px 0 rgba(91, 141, 239, 0.75)'
            }
            bg="palette.softBlue"
            p="0"
            border="0"
            outline="none !important"
            _hover={{
              bg: 'palette.softBlue',
            }}
          >
            <img src="/images/reprint.svg" height={44} alt="reprint" />
          </Button>
        </Flex>
        <Flex
          width={1}
          position={isCompletedPanelFullScreen ? 'fixed' : 'relative'}
          flexGrow={1}
          p={30}
          borderRadius="md"
          backgroundImage={
            isCompletedPanelFullScreen
              ? 'linear-gradient(to bottom, green, green);'
              : 'linear-gradient(to bottom, #39d98a, #57eba1);'
          }
          justifyContent="center"
          alignItems="center"
          color="palette.white"
          flexDirection="column"
          mt={isCompletedPanelFullScreen ? 0 : 16}
          top={isCompletedPanelFullScreen ? 0 : undefined}
          left={isCompletedPanelFullScreen ? 0 : undefined}
          height={isCompletedPanelFullScreen ? '100vh' : undefined}
          zIndex={isCompletedPanelFullScreen ? 2 : undefined}
        >
          <Icon name="fal fa-box-check" fontSize={isCompletedPanelFullScreen ? 120 : 76} />
          <Box fontSize={isCompletedPanelFullScreen ? 96 : 38} fontWeight={500} mt={38}>
            {packingState.operation.name}
          </Box>
          <Box
            fontFamily="SpaceMono"
            mt={0}
            fontSize={isCompletedPanelFullScreen ? 120 : 44}
            fontWeight={isCompletedPanelFullScreen ? 700 : undefined}
            overflowWrap="anywhere"
          >
            #{packingState.orderNumber}
          </Box>
          <Box fontSize={isCompletedPanelFullScreen ? 40 : 22} fontWeight={500} mt={4} data-cy="successfully-finished">
            {t(
              `TouchScreen.PackingStation.RightBar.${
                packingState.isSuspendedSLAM ? 'PackagedWithSuspended' : 'SuccessfullyPackaged'
              }`
            )}
          </Box>
          <Flex
            position="absolute"
            bottom={38}
            height={isCompletedPanelFullScreen ? 80 : 44}
            px={isCompletedPanelFullScreen ? 52 : 38}
            justifyContent="center"
            alignItems="center"
            bg={packingState.isSuspendedSLAM ? 'palette.orange_darker' : 'palette.hardGreen'}
            borderRadius={isCompletedPanelFullScreen ? 38 : 26}
            fontSize={isCompletedPanelFullScreen ? 40 : 16}
            letterSpacing="negativeLarge"
            color="palette.white"
          >
            <Text fontWeight={700}>{t(`TouchScreen.PackingStation.RightBar.PackingTime`)}</Text>
            <Text> {durationToHourMinuteSecondConverter(t, packingState.simplePackingTime)}</Text>
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
          <Icon name="fad fa-barcode-scan" fontSize="26" mr={16} />
          <Box fontSize="26" fontWeight={500} color="palette.softBlue_light" lineHeight="large">
            {t(`TouchScreen.SimplePackingStation.RightBar.ScanAnItem`)}
          </Box>
        </Flex>
      </Flex>
    );
  }
  if (packingState.orderNumber && !packingState.isOrderCompleted) {
    return (
      <>
        <OrderItemPanel />
        {packingState.boxItems.length ? (
          <Flex justifyContent="space-evenly">
            <Button
              onClick={() => {
                dispatch(
                  resourceActions.resourceRequested(ResourceType.SimplePackingProcessQueueItemsIntoCargoPackage, {
                    params: {
                      packingProcessId: packingState.processId,
                      items: packingState.orderItems.map(orderItem => ({
                        productId: orderItem.productId,
                        amount: orderItem.unboxedAmount,
                        serialNumbers: [],
                        simpleSerialNumbers: [],
                      })),
                      packageIndex: packingState.boxItems.find(boxItem => boxItem.selected)?.cargoPackageIndex,
                    },
                  })
                );
                packingAction.setIsAllItemsAdded(true);
              }}
              isLoading={queueItemsIntoCargoPackageResponse?.isBusy}
              variant="alternative"
              fontWeight={700}
              m={64}
              px={16}
            >
              {t(`${intlKey}.SelectAll`)}
            </Button>
            {packingState.shippingFlow !== ShippingFlowTag.International && (
              <Button
                onClick={() => {
                  dispatch(
                    resourceActions.resourceRequested(ResourceType.SimplePackingProcessQueueItemsIntoCargoPackage, {
                      params: {
                        packingProcessId: packingState.processId,
                        items: packingState.orderItems
                          .filter(orderItem => orderItem.boxedCount)
                          .map(orderItem => ({
                            productId: orderItem.productId,
                            amount: orderItem.boxedCount,
                            serialNumbers: [],
                            simpleSerialNumbers: [],
                          })),
                        packageIndex: packingState.boxItems.find(boxItem => boxItem.selected)?.cargoPackageIndex,
                      },
                    })
                  );
                  !packingState.orderItems.some(orderItem => (orderItem.unboxedAmount || 0) - orderItem.boxedCount) &&
                    packingAction.setIsAllItemsAdded(true);
                }}
                disabled={
                  !packingState.orderItems.some(orderItem => orderItem.boxedCount) ||
                  packingState.isAllItemsAdded
                }
                variant="dark"
                fontWeight={700}
                m={64}
                px={16}
              >
                {t(`${intlKey}.ContinueWithTheSelectedItems`)}
              </Button>
            )}
          </Flex>
        ) : null}
      </>
    );
  }
  return (
    <Box>
      <Flex
        width={1}
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
          {t(`${intlKey}.ScanAnItem`)}
        </Text>
      </Flex>
    </Box>
  );
};

export default RightBar;
