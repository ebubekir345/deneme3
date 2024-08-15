import { Box, Flex, ImageViewer } from '@oplog/express';
import memoize from 'memoize-one';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeList as List } from 'react-window';
import { OrderItem } from '.';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import { ProgressBar } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen.MissingItemTransferStation.RightBar';

const OrderItemPanel: React.FC = () => {
  const [missingItemTransferState] = useMissingItemTransferStore();
  const { t } = useTranslation();

  const productProcessed = missingItemTransferState.orderItems.reduce((a, c) => a + c.boxedCount, 0);
  const productTotal = missingItemTransferState.orderItems.reduce((a, c) => a + c.amountInOrder, 0);

  return (
    <>
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Flex flexWrap="wrap">
          <Box fontSize="22" fontWeight={700} letterSpacing="negativeLarge" color="palette.hardBlue_darker" mr={8}>
            {missingItemTransferState.isCancelled
              ? missingItemTransferState.isQuarantineToteInQurantineArea
                ? t(`${intlKey}.OrderProducts2`)
                : t(`${intlKey}.OrderProductsWithProductsInTote`)
              : t(`${intlKey}.OrderProducts`)}
          </Box>
        </Flex>
        {missingItemTransferState.boxItems.length !== 0 && (
          <Box>
            <ProgressBar
              current={productProcessed}
              total={productTotal}
              containerColor="palette.blue_lighter"
              barColor="palette.softBlue"
              height="26px"
              borderRadius="sm"
              label
              completeColor="palette.hardGreen"
            />
          </Box>
        )}
      </Flex>
      <Box flex="1 1 auto" mt={16}>
        <OrderItemList orderItems={missingItemTransferState.orderItems} />
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

  const itemData = createItemData(orderItems, setProductActiveIndex, setIsProductViewerOpen);

  return (
    <>
      <AutoSizer>
        {({ height = 0, width = 0 }) => (
          <List height={height} itemCount={orderItems.length} itemData={itemData} itemSize={132} width={width}>
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
