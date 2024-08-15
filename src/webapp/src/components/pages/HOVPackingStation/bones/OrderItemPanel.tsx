import { Box, Flex, ImageViewer } from '@oplog/express';
import memoize from 'memoize-one';
import React, { memo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeList as List } from 'react-window';
import { OrderItem } from '.';
import useHovPackingStore from '../../../../store/global/hovPackingStore';
import { Badge, ProgressBar } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen.PackingStation.RightBar';

const OrderItemPanel: React.FC = () => {
  const { t } = useTranslation();
  const [packingState, packingAction] = useHovPackingStore();

  const productProcessed = packingState.orderItems.reduce((a, c) => a + c.boxedCount, 0);
  const productTotal = packingState.orderItems.reduce((a, c) => a + c.amountInOrder, 0);

  return (
    <>
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Flex flexWrap="wrap">
          <Box fontSize="20px" fontWeight="bold" letterSpacing="-0.5px" color="palette.hardBlue_darker" mr={8}>
            {packingState.isMissing || packingState.isCancelled
              ? t(`${intlKey}.QuarantineProducts`)
              : t(`${intlKey}.OrderProducts`)}
          </Box>
          {(packingState.isMissing || packingState.isCancelled) && (
            <Badge
              badgeColor="palette.snow_darker"
              outlined
              height="24px"
              fontSize="16px"
              letterSpacing="-1.07px"
              padding="3px 8px"
              backgroundColor="transparent"
              data-cy="progress-badge"
            >
              {`${productProcessed} / ${productTotal}`}
            </Badge>
          )}
        </Flex>
        {(packingState.boxItems.length || (!packingState.isCancelled && !packingState.isMissing)) && (
          <Box>
            <ProgressBar
              current={productProcessed}
              total={productTotal}
              containerColor="palette.blue_lighter"
              barColor={packingState.isMissing || packingState.isCancelled ? 'palette.softBlue' : 'palette.hardGreen'}
              height="24px"
              borderRadius="4px"
              label
              completeColor="palette.hardGreen"
            />
          </Box>
        )}
      </Flex>
      <Box flex="1 1 auto" mt={16}>
        <OrderItemList orderItems={packingState.orderItems} />
      </Box>
    </>
  );
};

const OrderItemRow = memo(({ data, index, style }: any) => {
  const { orderItems, setProductActiveIndex, setIsProductViewerOpen } = data;
  const item = orderItems[index];

  return (
    <div style={style}>
      <OrderItem
        key={item.productId}
        product={item}
        onImageClicked={() => {
          setProductActiveIndex(index);
          setIsProductViewerOpen(true);
        }}
        iconsVisible
      />
    </div>
  );
}, areEqual);

const createItemData = memoize((orderItems, setProductActiveIndex, setIsProductViewerOpen) => ({
  orderItems,
  setProductActiveIndex,
  setIsProductViewerOpen,
}));

const OrderItemList = ({ orderItems }) => {
  const [productActiveIndex, setProductActiveIndex] = useState(0);
  const [isProductViewerOpen, setIsProductViewerOpen] = useState(false);
  const [packingState] = useHovPackingStore();

  const itemData = createItemData(orderItems, setProductActiveIndex, setIsProductViewerOpen);
  const listRef = useRef<any>();

  const product = itemData.orderItems.find(item => item.barcodes?.includes(packingState.barcodeData));
  const productIndex = itemData.orderItems.findIndex(item => item.barcodes?.includes(packingState.barcodeData));
  product &&
    packingState.isProductAddedIntoPackage &&
    !product.isMissingItem &&
    listRef.current?.scrollToItem(productIndex);

  return (
    <>
      <AutoSizer>
        {({ height = 0, width = 0 }) => (
          <List
            ref={listRef}
            height={height}
            itemCount={orderItems.length}
            itemData={itemData}
            itemSize={132}
            width={width}
          >
            {OrderItemRow}
          </List>
        )}
      </AutoSizer>
      <ImageViewer
        images={orderItems.length ? [{ url: orderItems[productActiveIndex].imageUrl }] : []}
        isOpen={isProductViewerOpen}
        activeIndex={0}
        onActiveIndexChange={index => setProductActiveIndex(index)}
        onClose={() => setIsProductViewerOpen(false)}
      />
    </>
  );
};

export default OrderItemPanel;
