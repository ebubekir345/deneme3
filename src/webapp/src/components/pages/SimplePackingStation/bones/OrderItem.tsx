import { Box, Ellipsis, Flex, Image, Input } from '@oplog/express';
import React, { FC, ReactElement, SyntheticEvent } from 'react';
import { ShippingFlowTag } from '../../../../services/swagger';
import useSimplePackingStore from '../../../../store/global/simplePackingStore';
import iff from '../../../../utils/iff';
import { ProgressBar } from '../../../atoms/TouchScreen';
import PackageInfoIcons from '../../../molecules/PackageInfoIcons/PackageInfoIcons';

interface OrderItemProps {
  product: OrderItemsInterface;
  onImageClicked: () => void;
  iconsVisible?: boolean;
}

const OrderItem: FC<OrderItemProps> = ({ product, onImageClicked, iconsVisible }): ReactElement => {
  const [packingState, packingAction] = useSimplePackingStore();

  return (
    <Box
      data-cy="order-item"
      width={1}
      opacity={!packingState.boxItems.length && product.amountInOrder === product.scannedCount ? 0.5 : 1}
    >
      <Flex
        mb={12}
        bg="palette.white"
        borderRadius="sm"
        boxShadow="small"
        justifyContent="space-between"
        alignItems="center"
        border={
          product.barcodes?.includes(packingState.barcodeData) &&
          packingState.isProductAddedIntoPackage &&
          ('sm' as any)
        }
        borderColor={
          product.barcodes?.includes(packingState.barcodeData) &&
          packingState.isProductAddedIntoPackage &&
          ('palette.softBlue' as any)
        }
      >
        <Flex
          width={120}
          height={120}
          bg="palette.snow_lighter"
          borderRadius="sm"
          p={16}
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
        >
          <Image
            onClick={() => {
              onImageClicked();
            }}
            src={product.imageUrl}
            borderRadius="md"
            width={88}
            height={88}
          />
        </Flex>
        <Box flexGrow={1} pl={32} pr={88} textAlign="left" py={16}>
          <Box
            fontSize={22}
            color="palette.slate_dark"
            textOverflow="ellipsis"
            display="-webkit-box"
            overflow="hidden"
            style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {product.productName}
          </Box>
          <Box>
            <Flex alignItems="center" justifyContent="space-between">
              {product.barcodes?.length && (
                <Flex
                  fontSize={22}
                  color="palette.slate_light"
                  py={11}
                  width={product?.productTags ? '45vmin' : '65vmin'}
                  data-cy="product-barcodes"
                >
                  <Ellipsis maxWidth={10000}>{product.barcodes.join()}</Ellipsis>
                </Flex>
              )}
              {iconsVisible && product?.productTags && <PackageInfoIcons icons={product.productTags} />}
            </Flex>
            <ProgressBar
              current={packingState.boxItems.length ? product.boxedCount : product.scannedCount || 0}
              total={product.unboxedAmount || 0}
              barColor="palette.softBlue"
              label={false}
              borderRadius="sm"
              height={6}
              containerColor="palette.snow_light"
              completeColor="palette.hardGreen"
            />
          </Box>
        </Box>
        <Box
          mr={36}
          fontSize={22}
          fontWeight={700}
          color={iff(product.boxedCount === product.amountInOrder, 'palette.green_darker', 'palette.softBlue')}
          whiteSpace="nowrap"
        >
          {!packingState.boxItems.length ? (
            `${product.scannedCount} / ${product.amountInOrder}`
          ) : (
            <>
              {packingState.shippingFlow !== ShippingFlowTag.International && (
                <Input
                  type="number"
                  min={0}
                  max={product.unboxedAmount}
                  onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                    if (e.currentTarget.value.trim() !== '0')
                      e.currentTarget.value = e.currentTarget.value.replace(/^0+/, '');
                    (parseInt(e.currentTarget.value) || 0) <= (product.unboxedAmount || 0) &&
                      packingAction.setOrderItems(
                        packingState.orderItems.map(orderItem => {
                          if (orderItem.productId === product.productId)
                            return { ...orderItem, boxedCount: parseInt(e.currentTarget.value) };
                          return orderItem;
                        })
                      );
                  }}
                  value={product.boxedCount}
                  display="inline"
                  textAlign="center"
                  borderRadius="sm"
                  fontSize={16}
                  px={4}
                  height={32}
                  width={64}
                />
              )}
              {`${packingState.shippingFlow !== ShippingFlowTag.International ? '/ ' : ""} ${product.unboxedAmount}`}
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default OrderItem;
