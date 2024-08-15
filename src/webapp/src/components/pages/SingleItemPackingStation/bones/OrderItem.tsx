import { Box, Ellipsis, Flex, Icon, Image, ImageViewer } from '@oplog/express';
import React, { ReactElement, useState } from 'react';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';
import PackageInfoIcons from '../../../molecules/PackageInfoIcons/PackageInfoIcons';

const OrderItem: React.FC = (): ReactElement => {
  const [packingState, _] = useSingleItemPackingStore();
  const [isProductViewerOpen, setIsProductViewerOpen] = useState(false);
  const product = packingState.orderItems[0];
  return (
    <>
      <Box width={1}>
        <Flex
          mb={12}
          bg="palette.white"
          borderRadius="sm"
          boxShadow="xlarge"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex
            width={120}
            height={120}
            bg="palette.snow_lighter"
            borderRadius="md"
            p={16}
            justifyContent="center"
            alignItems="center"
            flexShrink={0}
          >
            <Image
              onClick={() => {
                setIsProductViewerOpen(true);
              }}
              src={product?.imageUrl}
              borderRadius="md"
              width={88}
              height={88}
            />
          </Flex>
          <Box flexGrow={1} paddingLeft={32} py={22}>
            <Box
              fontSize={26}
              color="palette.hardBlue_darker"
              textOverflow="ellipsis"
              display="-webkit-box"
              overflow="hidden"
              style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
              textAlign="left"
              mb={6}
            >
              {product?.productName}
            </Box>
            {product?.barcodes && (
              <Flex fontSize={22} color="palette.slate_light" mb={4} width="60vmin">
                <Ellipsis maxWidth={10000}>{product?.barcodes}</Ellipsis>
                {Object.entries(product?.productTags).find(([key, value]) => value === true) && ' /'}
                {product?.productTags && <PackageInfoIcons icons={product?.productTags} />}
              </Flex>
            )}
            <Flex flexDirection="column">
              {(packingState.serialNumber || packingState.simpleSerialNumber) && (
                <Flex alignItems="center">
                  <Flex
                    px={8}
                    py={4}
                    borderRadius="full"
                    bg="palette.softBlue_lighter"
                    alignItems="center"
                    justifyContent="center"
                    display="inline"
                  >
                    <Icon name="fas fa-key" fontSize={16} color="palette.blue" />
                  </Flex>
                  <Box fontSize={22} ml={4}>
                    {packingState.serialNumber || packingState.simpleSerialNumber}
                  </Box>
                </Flex>
              )}
            </Flex>
          </Box>
          <Box mr={38} fontSize={26} fontWeight="bold" color="palette.softBlue" whiteSpace="nowrap">
            {`${product?.boxedCount} / ${product?.amountInOrder}`}
          </Box>
        </Flex>
      </Box>
      <ImageViewer
        images={[{ url: product?.imageUrl || "" }]}
        isOpen={isProductViewerOpen}
        activeIndex={0}
        onActiveIndexChange={index => null}
        onClose={() => setIsProductViewerOpen(false)}
      />
    </>
  );
};

export default OrderItem;
