import { Box, Flex, ImageViewer } from '@oplog/express';
import memoize from 'memoize-one';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeList as List } from 'react-window';
import useSimplePackingStore from '../../../../store/global/simplePackingStore';
import { ProgressBar } from '../../../atoms/TouchScreen';
import OrderItem from './OrderItem';

const intlKey = 'TouchScreen.SimplePackingStation.RightBar';

const OrderItemPanel: FC = () => {
  const [packingState] = useSimplePackingStore();
  const { t } = useTranslation();

  const productScanned = packingState.orderItems.reduce((a, c) => a + (c.scannedCount || 0), 0);
  const productBoxed =
    packingState.orderItems.reduce((a, c) => a + (c.boxedCount || 0), 0) +
    packingState.boxItems.reduce(
      (accumulator, boxItem) => accumulator + boxItem.content.reduce((acc, item) => acc + item.count, 0),
      0
    );
  const productTotal =
    packingState.orderItems.reduce((a, c) => a + (c.unboxedAmount || 0), 0) +
    packingState.boxItems.reduce(
      (accumulator, boxItem) => accumulator + boxItem.content.reduce((acc, item) => acc + item.count, 0),
      0
    );

  return (
    <>
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Flex flexWrap="wrap">
          <Box fontSize="22" fontWeight={700} letterSpacing="negativeLarge" color="palette.hardBlue_darker" mr={8}>
            {t(`${intlKey}.Products`)}
          </Box>
        </Flex>
        <Box>
          <ProgressBar
            current={packingState.boxItems.length ? productBoxed : productScanned}
            total={productTotal}
            containerColor="palette.blue_lighter"
            barColor="palette.hardGreen"
            borderRadius="sm"
            height={26}
            label
            completeColor="palette.hardGreen"
          />
        </Box>
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
  const [packingState] = useSimplePackingStore();

  const itemData = createItemData(orderItems, setProductActiveIndex, setIsProductViewerOpen);
  const listRef = useRef<any>();

  const product = itemData.orderItems.find(item => item.barcodes?.includes(packingState.barcodeData));
  const productIndex = itemData.orderItems.findIndex(item => item.barcodes?.includes(packingState.barcodeData));

  useEffect(() => {
    product && packingState.isProductAddedIntoPackage && listRef?.current?.scrollToItem(productIndex);
  }, [product]);

  return (
    <>
      <AutoSizer>
        {({ height = 0, width = 0 }) => (
          <List
            ref={listRef}
            height={height}
            itemCount={orderItems.length}
            itemData={itemData}
            itemSize={136}
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
