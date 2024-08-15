import { Box, Flex, ImageViewer } from '@oplog/express';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderItem } from '.';
import useHovPackingStore from '../../../../store/global/hovPackingStore';
import { Badge } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen.PackingStation.RightBar';

const MissingItemPanel: React.FC = () => {
  const { t } = useTranslation();
  const [packingState, packingAction] = useHovPackingStore();
  const [productActiveIndex, setProductActiveIndex] = useState(0);
  const [isProductViewerOpen, setIsProductViewerOpen] = useState(false);
  const missingItemsTotal = packingState.missingItems.reduce((a, c) => a + c.amountInOrder, 0);
  return (
    <>
      <Flex justifyContent="space-between" flexWrap="wrap" marginTop={25}>
        <Flex flexWrap="wrap">
          <Box fontSize="20px" fontWeight="bold" letterSpacing="-0.5px" color="palette.hardBlue_darker" mr={8}>
            {t(`${intlKey}.MissingItems`)}
          </Box>
          <Badge
            badgeColor="palette.snow_darker"
            outlined
            height="24px"
            fontSize="16px"
            letterSpacing="-1.07px"
            padding="3px 8px"
            backgroundColor="transparent"
          >
            {missingItemsTotal}
          </Badge>
        </Flex>
      </Flex>
      <Box my={16} overflowY="auto" maxHeight={264}>
        {packingState.missingItems.map((missingItem, i) => (
          <OrderItem
            key={missingItem.productId}
            product={missingItem}
            onImageClicked={() => {
              setProductActiveIndex(i);
              setIsProductViewerOpen(true);
            }}
            iconsVisible={true}
          />
        ))}
      </Box>
      <ImageViewer
        images={
          packingState.missingItems.length ? [{ url: packingState.missingItems[productActiveIndex].imageUrl }] : []
        }
        isOpen={isProductViewerOpen}
        activeIndex={0}
        onActiveIndexChange={index => setProductActiveIndex(index)}
        onClose={() => setIsProductViewerOpen(false)}
      />
    </>
  );
};

export default MissingItemPanel;
