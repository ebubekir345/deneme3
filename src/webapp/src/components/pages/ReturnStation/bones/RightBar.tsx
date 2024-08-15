import React, { useRef, useEffect, useState } from 'react';
import { Box, Flex, Icon, Image, ImageViewer, Text } from '@oplog/express';
import { useTranslation } from 'react-i18next';
import lottie from 'lottie-web/build/player/lottie_light';
import { ActionButton } from '../../../atoms/TouchScreen';
import OrderItem from './OrderItem';
import { ReturnLineItemState, ReturnItemType } from '../../../../services/swagger';
import durationToHourMinuteSecondConverter from '../../../../utils/durationToHourMinuteSecondConverter';
import useReturnStore, { ReturnModals } from '../../../../store/global/returnStore';

const intlKey = 'TouchScreen';

const RightBar: React.FC = () => {
  const { t } = useTranslation();
  const [returnState, returnAction] = useReturnStore();
  const lottieContainer = useRef<any>(null);
  const [productWTBPBActiveIndex, setProductWTBPBActiveIndex] = useState(0);
  const [isProductWTBPBViewerOpen, setIsProductWTBPBViewerOpen] = useState(false);
  const [productWTBPQActiveIndex, setProductWTBPQActiveIndex] = useState(0);
  const [isProductWTBPQViewerOpen, setIsProductWTBPQViewerOpen] = useState(false);
  const [productWTBPCActiveIndex, setProductWTBPCActiveIndex] = useState(0);
  const [isProductWTBPCViewerOpen, setIsProductWTBPCViewerOpen] = useState(false);
  const [productWTBPActiveIndex, setProductWTBPActiveIndex] = useState(0);
  const [isProductWTBPViewerOpen, setIsProductWTBPViewerOpen] = useState(false);
  const [productReturnedActiveIndex, setProductReturnedActiveIndex] = useState(0);
  const [isProductReturnedViewerOpen, setIsProductReturnedViewerOpen] = useState(false);

  useEffect(() => {
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      // eslint-disable-next-line global-require
      animationData: require('../../../../lotties/scanBarcodeLottieAnimation.json'),
    });
  }, []);

  const productProcessed = returnState.orderItems.reduce((a, c) => a + c.boxedCount, 0);
  if (returnState.orderNumber && !returnState.isReturnCompleted) {
    return (
      <>
        <Flex flexWrap="wrap">
          <Box fontSize="22" fontWeight={700} letterSpacing="negativeLarge" color="palette.hardBlue_darker" mr={8}>
            {t(`${intlKey}.ReturnStation.RightBar.OrderProducts`)}
          </Box>
        </Flex>
        <Box flex="1 1 auto" overflowY="auto" height="0px" mt={16}>
          {returnState.orderItems
            .filter(
              orderItem =>
                orderItem.returnState === ReturnLineItemState.WaitingToBeProcessed &&
                orderItem.boxedCount - (orderItem.damagedBoxedCount || 0) - (orderItem.controlBoxedCount || 0)
            )
            .map((orderItem, i) => (
              <OrderItem
                key={orderItem.productId}
                product={orderItem}
                isBoxed
                status={ReturnItemType.Received}
                onImageClicked={() => {
                  setProductWTBPBActiveIndex(i);
                  setIsProductWTBPBViewerOpen(true);
                }}
              />
            ))}
          {returnState.orderItems
            .filter(
              orderItem =>
                orderItem.returnState === ReturnLineItemState.WaitingToBeProcessed && orderItem.damagedBoxedCount
            )
            .map((orderItem, i) => (
              <OrderItem
                key={orderItem.productId}
                product={orderItem}
                isBoxed
                status={ReturnItemType.Damaged}
                onImageClicked={() => {
                  setProductWTBPQActiveIndex(i);
                  setIsProductWTBPQViewerOpen(true);
                }}
              />
            ))}
          {returnState.orderItems
            .filter(
              orderItem =>
                orderItem.returnState === ReturnLineItemState.WaitingToBeProcessed && orderItem.controlBoxedCount
            )
            .map((orderItem, i) => (
              <OrderItem
                key={orderItem.productId}
                product={orderItem}
                isBoxed
                status={ReturnItemType.Outbound}
                onImageClicked={() => {
                  setProductWTBPQActiveIndex(i);
                  setIsProductWTBPQViewerOpen(true);
                }}
              />
            ))}
          {returnState.orderItems
            .filter(
              orderItem =>
                orderItem.returnState === ReturnLineItemState.WaitingToBeProcessed &&
                orderItem.boxedCount !== orderItem.amountInOrder
            )
            .map((orderItem, i) => {
              return (
                <Box key={orderItem.productId}>
                  {i === 0 && returnState.orderItems.filter(item => item.boxedCount).length ? (
                    <Box height="1px" opacity={0.5} backgroundColor="palette.white" my={16} />
                  ) : null}
                  <OrderItem
                    product={orderItem}
                    isBoxed={false}
                    status={ReturnItemType.Received}
                    onImageClicked={() => {
                      setProductWTBPActiveIndex(i);
                      setIsProductWTBPViewerOpen(true);
                    }}
                  />
                </Box>
              );
            })}
          {returnState.orderItems
            .filter(
              orderItem =>
                orderItem.returnState === ReturnLineItemState.Damaged ||
                orderItem.returnState === ReturnLineItemState.Undamaged
            )
            .map((orderItem, i) => {
              return (
                <Box key={orderItem.productId}>
                  {i === 0 &&
                    returnState.orderItems.filter(item => item.returnState === ReturnLineItemState.WaitingToBeProcessed)
                      .length !== 0 && <Box height="1px" opacity={0.5} backgroundColor="palette.white" my={16} />}
                  <OrderItem
                    product={orderItem}
                    isBoxed={false}
                    status={ReturnItemType.Received}
                    onImageClicked={() => {
                      setProductReturnedActiveIndex(i);
                      setIsProductReturnedViewerOpen(true);
                    }}
                  />
                </Box>
              );
            })}
          <Box
            textAlign="center"
            fontFamily="Jost"
            fontSize="16"
            fontWeight={900}
            letterSpacing="medium"
            color="palette.slate"
            mt={16}
          >
            {t(`${intlKey}.ReturnStation.RightBar.OrderProductCount`, {
              productVariety: returnState.orderItems.length,
              productCount: returnState.orderItems.reduce(
                (accumulator, current) => accumulator + current.amountInOrder,
                0
              ),
            })}
          </Box>
        </Box>
        {returnState.boxItems.length ? (
          <Flex mt={32}>
            <ActionButton
              onClick={() => returnAction.toggleModalState(ReturnModals.CompleteReturn)}
              height="36px"
              borderRadius="md"
              width={1}
              boxShadow="small"
              backgroundColor="palette.softBlue"
              fontSize="16"
              fontWeight={700}
              letterSpacing="small"
              color="palette.white"
              border="none"
              opacity={productProcessed > 0 ? 1 : 0.5}
              disabled={!(productProcessed > 0)}
              data-cy="complete-return-button"
            >
              {t(`${intlKey}.ActionButtons.CompleteReturn`)}
              <Icon name="fal fa-arrow-right" fontSize="18" fontWeight={700} color="palette.white" ml={14} />
            </ActionButton>
          </Flex>
        ) : null}
        <ImageViewer
          images={returnState.orderItems
            .filter(
              orderItem =>
                orderItem.returnState === ReturnLineItemState.WaitingToBeProcessed &&
                orderItem.boxedCount - (orderItem.damagedBoxedCount || 0) - (orderItem.controlBoxedCount || 0)
            )
            .map(orderItem => ({ url: orderItem.imageUrl }))}
          isOpen={isProductWTBPBViewerOpen}
          activeIndex={productWTBPBActiveIndex}
          onActiveIndexChange={index => setProductWTBPBActiveIndex(index)}
          onClose={() => setIsProductWTBPBViewerOpen(false)}
        />
        <ImageViewer
          images={returnState.orderItems
            .filter(
              orderItem =>
                orderItem.returnState === ReturnLineItemState.WaitingToBeProcessed && orderItem.damagedBoxedCount
            )
            .map(orderItem => ({ url: orderItem.imageUrl }))}
          isOpen={isProductWTBPQViewerOpen}
          activeIndex={productWTBPQActiveIndex}
          onActiveIndexChange={index => setProductWTBPQActiveIndex(index)}
          onClose={() => setIsProductWTBPQViewerOpen(false)}
        />
        <ImageViewer
          images={returnState.orderItems
            .filter(
              orderItem =>
                orderItem.returnState === ReturnLineItemState.WaitingToBeProcessed && orderItem.controlBoxedCount
            )
            .map(orderItem => ({ url: orderItem.imageUrl }))}
          isOpen={isProductWTBPCViewerOpen}
          activeIndex={productWTBPCActiveIndex}
          onActiveIndexChange={index => setProductWTBPCActiveIndex(index)}
          onClose={() => setIsProductWTBPCViewerOpen(false)}
        />
        <ImageViewer
          images={returnState.orderItems
            .filter(
              orderItem =>
                orderItem.returnState === ReturnLineItemState.WaitingToBeProcessed &&
                orderItem.boxedCount !== orderItem.amountInOrder
            )
            .map(orderItem => ({ url: orderItem.imageUrl }))}
          isOpen={isProductWTBPViewerOpen}
          activeIndex={productWTBPActiveIndex}
          onActiveIndexChange={index => setProductWTBPActiveIndex(index)}
          onClose={() => setIsProductWTBPViewerOpen(false)}
        />
        <ImageViewer
          images={returnState.orderItems
            .filter(
              orderItem =>
                orderItem.returnState === ReturnLineItemState.Damaged ||
                orderItem.returnState === ReturnLineItemState.Undamaged
            )
            .map(orderItem => ({ url: orderItem.imageUrl }))}
          isOpen={isProductReturnedViewerOpen}
          activeIndex={productReturnedActiveIndex}
          onActiveIndexChange={index => setProductReturnedActiveIndex(index)}
          onClose={() => setIsProductReturnedViewerOpen(false)}
        />
      </>
    );
  }
  if (returnState.isReturnCompleted) {
    return (
      <Flex flexGrow={1} flexDirection="column" justifyContent="space-between">
        <Flex
          width={1}
          position="relative"
          flexGrow={1}
          p="30"
          borderRadius="md"
          backgroundImage="linear-gradient(to bottom, #39d98a, #57eba1)"
          justifyContent="center"
          alignItems="center"
          color="palette.white"
          flexDirection="column"
        >
          <Icon name="fal fa-undo" fontSize="94px" />
          <Box fontFamily="SpaceMono" mt={22} fontSize="48" overflowWrap="anywhere">
            #{returnState.orderNumber}
          </Box>
          <Box fontSize="22" fontWeight={500} mt={4} data-cy="successfully-finished">
            {t(`${intlKey}.ReturnStation.RightBar.SuccessfullyReturned`)}
          </Box>
          <Flex
            position="absolute"
            bottom={36}
            height={43}
            px={38}
            justifyContent="center"
            alignItems="center"
            bg="palette.hardGreen"
            borderRadius="24px"
            fontSize="16"
            letterSpacing="negativeLarge"
            color="palette.white"
          >
            <Text fontWeight={700}>{t(`${intlKey}.ReturnStation.RightBar.ReturnTime`)}</Text>
            <Text>{durationToHourMinuteSecondConverter(t, returnState.returnTime)}</Text>
          </Flex>
        </Flex>
        <Flex width={1} height={96} borderRadius={"md"} bg="palette.softGrey" padding="22px 28px" alignItems="center" mt={16}>
          <Icon name="fad fa-barcode-scan" fontSize="26" mr={16} />
          <Box fontSize="26" fontWeight={500} color="palette.softBlue_light" lineHeight="large">
            {t(`${intlKey}.PackingStation.RightBar.ScanNextOrder`)}
          </Box>
        </Flex>
      </Flex>
    );
  }
  return (
    <Flex flexGrow={1} justifyContent="center" alignItems="center" flexDirection="column" color="palette.snow_darker">
      <Flex
        width={482}
        height={482}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        position="relative"
      >
        <Box width={1200} height={1200} ref={lottieContainer} position="absolute" opacity={0.15} />
        <Box mb={22} zIndex={1}>
          <Image src="/images/cargo-package.svg" alt="cargo-package" />
        </Box>
        <Box fontSize="26" fontWeight={500} letterSpacing="negativeLarge" zIndex={1} data-cy="scan-cargo-barcode">
          {t(`${intlKey}.ReturnStation.RightBar.ScanCargoBarcode`)}
        </Box>
      </Flex>
      <Box mt={72} textAlign="center" width={281} fontSize={16} fontWeight={500} letterSpacing="small" zIndex={1}>
        {t(`${intlKey}.ReturnStation.RightBar.Or`)}
      </Box>
      <ActionButton
        onClick={() => returnAction.setIsParcelSearchScreenOpen(true)}
        width={281}
        mt={16}
        borderRadius="md"
        boxShadow="small"
        backgroundColor="palette.softBlue"
        border="none"
        height="48px"
        color="palette.white"
        lineHeight={"large"}
        fontSize={22}
        letterSpacing="negativeLarge"
        fontWeight={500}
        zIndex={1}
        data-cy="search-an-order-button"
      >
        <Icon name="far fa-search" fontSize="26" mr={8} />
        {t(`${intlKey}.ReturnStation.RightBar.SearchAnOrder`)}
      </ActionButton>
    </Flex>
  );
};

export default RightBar;
