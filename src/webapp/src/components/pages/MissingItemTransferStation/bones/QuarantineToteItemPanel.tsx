import { Box, Flex, ImageViewer } from '@oplog/express';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderItem } from '.';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import { Badge } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen.MissingItemTransferStation.RightBar';

const QuarantineToteItemPanel: React.FC = () => {
  const { t } = useTranslation();
  const [missingItemTransferState] = useMissingItemTransferStore();
  const [productActiveIndex, setProductActiveIndex] = useState(0);
  const [isProductViewerOpen, setIsProductViewerOpen] = useState(false);
  const quarantineToteItemsTotal = missingItemTransferState.quarantineToteItems.reduce(
    (a, c) => a + c.amountInOrder,
    0
  );
  return (
    <>
      <Flex justifyContent="space-between" flexWrap="wrap" mt={26}>
        <Flex flexWrap="wrap">
          <Box fontSize="22" fontWeight={700} letterSpacing="negativeLarge" color="palette.hardBlue_darker" mr={8}>
            {t(`${intlKey}.QuarantineToteItems`)}
          </Box>
          <Badge
            badgeColor="palette.snow_darker"
            outlined
            height={26}
            fontSize="16"
            letterSpacing="-1.07px"
            py="4"
            px="8"
            backgroundColor="transparent"
          >
            {quarantineToteItemsTotal}
          </Badge>
        </Flex>
      </Flex>
      <Box my={16} overflowY="auto" maxHeight={264}>
        {missingItemTransferState.quarantineToteItems.map((quarantineToteItem, i) => (
          <OrderItem
            key={quarantineToteItem.productId}
            product={quarantineToteItem}
            onImageClicked={() => {
              setProductActiveIndex(i);
              setIsProductViewerOpen(true);
            }}
          />
        ))}
      </Box>
      <ImageViewer
        images={
          missingItemTransferState.quarantineToteItems.length
            ? [{ url: missingItemTransferState.quarantineToteItems[productActiveIndex].imageUrl }]
            : []
        }
        isOpen={isProductViewerOpen}
        activeIndex={0}
        onActiveIndexChange={index => setProductActiveIndex(index)}
        onClose={() => setIsProductViewerOpen(false)}
      />
    </>
  );
};

export default QuarantineToteItemPanel;
