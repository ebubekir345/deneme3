import { Box, Flex, Image } from '@oplog/express';
import React, { ReactElement } from 'react';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import iff from '../../../../utils/iff';
import { ProgressBar } from '../../../atoms/TouchScreen';

interface OrderItemProps {
  product: OrderItemsInterface;
  onImageClicked: () => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ product, onImageClicked }): ReactElement => {
  const [missingItemTransferState] = useMissingItemTransferStore();
  return (
    <Box
      data-cy="order-item"
      width={1}
      opacity={product.isMissingItem || product.amountInOrder === product.boxedCount ? 0.5 : 1}
    >
      <Flex
        mb={11}
        bg="palette.white"
        borderRadius="sm"
        boxShadow="small"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex
          width={missingItemTransferState.isLeftBarExpanded ? '72px' : '120px'}
          height={missingItemTransferState.isLeftBarExpanded ? '76px' : '120px'}
          bg="palette.softGrey"
          borderRadius="4px 0 0 4px"
          p={missingItemTransferState.isLeftBarExpanded ? '16px 14px' : 16}
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
        >
          <Image
            onClick={() => {
              onImageClicked();
            }}
            src={product.imageUrl}
            borderRadius="8px"
            width={missingItemTransferState.isLeftBarExpanded ? '44px' : '88px'}
            height={missingItemTransferState.isLeftBarExpanded ? '44px' : '88px'}
          />
        </Flex>
        <Box
          flexGrow={1}
          pl={missingItemTransferState.isLeftBarExpanded ? 16 : 32}
          pr={missingItemTransferState.isLeftBarExpanded ? 38 : 87}
          py="22"
        >
          <Box
            fontSize={missingItemTransferState.isLeftBarExpanded ? '16' : '26'}
            color="palette.hardBlue_darker"
            textOverflow="ellipsis"
            display="-webkit-box"
            overflow="hidden"
            style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {product.productName}
          </Box>
          {!missingItemTransferState.isLeftBarExpanded && (
            <>
              {product.barcodes?.length && (
                <Box fontSize="22" color="palette.blue_light" pt={8} pb={11} data-cy="product-barcodes">
                  {product.barcodes.join()}
                </Box>
              )}
              <Box>
                {!product.isMissingItem && (
                  <ProgressBar
                    current={product.boxedCount}
                    total={product.amountInOrder}
                    barColor="palette.softBlue"
                    label={false}
                    borderRadius="sm"
                    height="8px"
                    containerColor="palette.softBlue_lighter"
                    completeColor={
                      missingItemTransferState.isMissing || missingItemTransferState.isCancelled
                        ? 'palette.softBlue'
                        : 'palette.hardGreen'
                    }
                  />
                )}
              </Box>
            </>
          )}
        </Box>
        <Box
          mr={missingItemTransferState.isLeftBarExpanded ? 32 : 38}
          fontSize={missingItemTransferState.isLeftBarExpanded ? '16' : '26'}
          fontWeight={700}
          color={
            missingItemTransferState.isMissing || missingItemTransferState.isCancelled
              ? 'palette.softBlue'
              : iff(product.boxedCount === product.amountInOrder, 'palette.green_darker', 'palette.softBlue')
          }
          whiteSpace="nowrap"
        >
          {`${product.boxedCount} / ${product.amountInOrder}`}
        </Box>
      </Flex>
    </Box>
  );
};

export default OrderItem;
