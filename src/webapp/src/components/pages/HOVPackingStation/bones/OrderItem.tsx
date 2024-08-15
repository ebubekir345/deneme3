import { Box, Ellipsis, Flex, Image } from '@oplog/express';
import React, { ReactElement } from 'react';
import useHovPackingStore from '../../../../store/global/hovPackingStore';
import iff from '../../../../utils/iff';
import { ProgressBar } from '../../../atoms/TouchScreen';
import PackageInfoIcons from '../../../molecules/PackageInfoIcons/PackageInfoIcons';

interface OrderItemProps {
  product: OrderItemsInterface;
  onImageClicked: () => void;
  iconsVisible?: boolean;
  boxedSnItems?: number | null;
  amountSnItems?: number | null;
}

const OrderItem: React.FC<OrderItemProps> = ({
  product,
  onImageClicked,
  iconsVisible,
  boxedSnItems,
  amountSnItems,
}): ReactElement => {
  const [packingState] = useHovPackingStore();

  return (
    <Box
      data-cy="order-item"
      width={1}
      opacity={product.isMissingItem || product.amountInOrder === product.boxedCount ? 0.5 : 1}
    >
      <Flex
        mb={12}
        bg="palette.white"
        borderRadius={4}
        boxShadow="small"
        justifyContent="space-between"
        alignItems="center"
        border={
          product.barcodes?.includes(packingState.barcodeData) &&
          packingState.isProductAddedIntoPackage &&
          !product.isMissingItem &&
          'sm' as any
        }
        borderColor={
          product.barcodes?.includes(packingState.barcodeData) &&
          packingState.isProductAddedIntoPackage &&
          !product.isMissingItem &&
          'palette.softBlue' as any
        }
      >
        <Flex
          width={packingState.isLeftBarExpanded ? 72 : 120}
          height={packingState.isLeftBarExpanded ? 76 : 120}
          bg="palette.snow_lighter"
          borderRadius="sm"
          p={packingState.isLeftBarExpanded ? '16px 14px' : 16}
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
            width={packingState.isLeftBarExpanded ? 44 : 88}
            height={packingState.isLeftBarExpanded ? 44 : 88}
          />
        </Flex>
        <Box
          flexGrow={1}
          paddingLeft={packingState.isLeftBarExpanded ? 16 : 32}
          paddingRight={packingState.isLeftBarExpanded ? 36 : 72}
          textAlign="left"
          py={18}
        >
          <Box
            fontSize={packingState.isLeftBarExpanded ? 16 : 22}
            color="palette.slate_dark"
            textOverflow="ellipsis"
            display="-webkit-box"
            overflow="hidden"
            style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {product.productName}
          </Box>
          <Box>
            {!packingState.isLeftBarExpanded && (
              <Flex alignItems="center" justifyContent="space-between">
                {product.barcodes?.length && (
                  <Flex
                    fontSize={22}
                    color="palette.slate_light"
                    py={11}
                    width={
                      packingState.modals?.AddSerialNumber ||
                      packingState.modals?.AddSimpleSerialNumber ||
                      packingState.modals?.HovAddProduct
                        ? '35vmin'
                        : product?.productTags
                        ? '45vmin'
                        : '65vmin'
                    }
                    data-cy="product-barcodes"
                  >
                    <Ellipsis maxWidth={10000}>{product.barcodes.join()}</Ellipsis>
                  </Flex>
                )}
                {iconsVisible && product?.productTags && <PackageInfoIcons icons={product.productTags} />}
              </Flex>
            )}
            {!product.isMissingItem && (
              <ProgressBar
                current={boxedSnItems ?? product.boxedCount}
                total={amountSnItems || product.amountInOrder}
                barColor="palette.softBlue"
                label={false}
                borderRadius="sm"
                height="7px"
                containerColor="palette.snow_light"
                completeColor={
                  packingState.isMissing || packingState.isCancelled ? 'palette.softBlue' : 'palette.hardGreen'
                }
              />
            )}
          </Box>
        </Box>
        <Box
          mr={packingState.isLeftBarExpanded ? 32 : 36}
          fontSize={packingState.isLeftBarExpanded ? 16 : 22}
          fontWeight={700}
          color={
            packingState.isMissing || packingState.isCancelled
              ? 'palette.softBlue'
              : iff(product.boxedCount === product.amountInOrder, 'palette.green_darker', 'palette.softBlue')
          }
          whiteSpace="nowrap"
        >
          {`${!product.isMissingItem ? `${boxedSnItems ?? product.boxedCount} / ` : ''}${amountSnItems ||
            product.amountInOrder}`}
        </Box>
      </Flex>
    </Box>
  );
};

export default OrderItem;
