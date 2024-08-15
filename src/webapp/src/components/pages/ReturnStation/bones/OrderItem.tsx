import { Box, Flex, Image } from '@oplog/express';
import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReturnItemType, ReturnLineItemState } from '../../../../services/swagger';
import useReturnStore, { ReturnModals } from '../../../../store/global/returnStore';
import iff from '../../../../utils/iff';
import { ActionButton, Badge, LongPressWrapper } from '../../../atoms/TouchScreen';

interface ReturnOrderItemProps {
  product: OrderItemsInterface;
  isBoxed: boolean;
  status: ReturnItemType;
  onImageClicked: () => void;
}

const intlKey = 'TouchScreen';

const ReturnOrderItem: React.FC<ReturnOrderItemProps> = ({
  product,
  isBoxed,
  status,
  onImageClicked,
}): ReactElement => {
  const { t } = useTranslation();
  const [returnState, returnAction] = useReturnStore();
  const [isHighlighted, setIsHighlighted] = useState(false);

  const addOneToTote = () => {
    product.barcodes && returnAction.setBarcodeData(product.barcodes[0]);
    (product.isTrackSerialNumber || product.isTrackSimpleSerialNumber) && returnAction.toggleModalState(ReturnModals.SerialNumber);
    // Store previous state
    returnAction.setPreviousBoxItems(returnState.boxItems);

    const updatedBoxItems = returnState.boxItems.map(item => {
      const updatedItemContent = JSON.parse(JSON.stringify(item.content)); // TODO: search for a better json array deep clone implementation
      if (item.selected) {
        const placedSameLineItem = updatedItemContent.filter(
          contentItem => contentItem.productId === product.productId
        )[0];
        if (placedSameLineItem) {
          placedSameLineItem.count += 1;
        } else {
          updatedItemContent.push({
            productId: product.productId,
            count: 1,
            barcodes: product.barcodes,
            productName: product.productName,
            imageUrl: product.imageUrl,
          });
        }
      }
      return { ...item, content: updatedItemContent };
    });
    !product.isTrackSerialNumber && !product.isTrackSimpleSerialNumber && returnAction.setBoxItems(updatedBoxItems);
  };

  const isAlreadyReturned =
    product.returnState === ReturnLineItemState.Damaged || product.returnState === ReturnLineItemState.Undamaged;

  const badges = [
    {
      title: t(`${intlKey}.ReturnStation.Badges.Quarantine`),
      condition: status === ReturnItemType.Damaged,
      otherBadgeProps: {
        badgeColor: 'palette.red_darker',
        backgroundColor: 'palette.red_lighter',
        mr: 8,
      },
    },
    {
      title: t(`${intlKey}.ReturnStation.Badges.Control`),
      condition: status === ReturnItemType.Outbound,
      otherBadgeProps: {
        badgeColor: 'palette.darkPurple',
        backgroundColor: 'palette.pink_lighter',
        mr: 8,
      },
    },
    {
      title: t(`${intlKey}.ReturnStation.Badges.ReturnInProgress`),
      condition: isBoxed,
      otherBadgeProps: {
        badgeColor: 'palette.orange_darker',
        backgroundColor: 'palette.orange_lighter',
        mr: 22,
      },
    },
    {
      title: t(`${intlKey}.ReturnStation.Badges.Quarantine`),
      condition: product.returnState === ReturnLineItemState.Damaged,
      otherBadgeProps: {
        badgeColor: 'palette.red_darker',
        backgroundColor: 'palette.red_lighter',
        mr: 8,
      },
    },
    {
      title: t(`${intlKey}.ReturnStation.Badges.Returned`),
      condition: isAlreadyReturned,
      otherBadgeProps: {
        badgeColor: 'palette.softBlue',
        backgroundColor: 'palette.softBlue_lighter',
        mr: 22,
      },
    },
  ];

  return (
    <>
      {isHighlighted && (
        <Box
          onClick={() => setIsHighlighted(false)}
          position="fixed"
          width="100%"
          height="100%"
          left={0}
          top={0}
          zIndex={2}
          opacity={0.5}
          bg="palette.black"
        />
      )}
      <LongPressWrapper
        onLongPress={() => {
          if (!isAlreadyReturned && !isBoxed && !!returnState.boxItems.length) {
            setIsHighlighted(true);
          }
        }}
      >
        <Box
          data-cy="order-item"
          width={1}
          opacity={isAlreadyReturned ? 0.5 : 1}
          position="relative"
          zIndex={isHighlighted ? 2 : 0}
        >
          <Flex
            mb={12}
            bg="palette.white"
            borderRadius="sm"
            boxShadow="small"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex
              width="72px"
              height="76px"
              bg="palette.softGrey"
              borderRadius="4px 0 0 4px"
              p="16px 14px"
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
                width="44px"
                height="44px"
              />
            </Flex>
            <Box flexGrow={1} paddingLeft={16} paddingRight={38} py="14">
              <Box
                fontSize="16"
                color="palette.hardBlue_darker"
                textOverflow="ellipsis"
                display="-webkit-box"
                overflow="hidden"
                style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
              >
                {product.productName} - {product.sku}
              </Box>
              <Box fontFamily="SpaceMono" fontSize="16" letterSpacing="negativeLarge" mt={4}>
                {`x${
                  status === ReturnItemType.Damaged || status === ReturnItemType.Outbound
                    ? iff(status === ReturnItemType.Damaged, product.damagedBoxedCount, product.controlBoxedCount)
                    : iff(
                        isBoxed,
                        product.boxedCount - (product.damagedBoxedCount || 0) - (product.controlBoxedCount || 0),
                        product.amountInOrder - product.boxedCount
                      )
                }`}{' '}
                - {product.barcodes?.join()}
              </Box>
            </Box>
            {badges.map(
              (badge, i) =>
                badge.condition && (
                  <Badge
                    key={i.toString()}
                    outlined
                    fontSize="14"
                    fontWeight={700}
                    letterSpacing="medium"
                    py={6}
                    px={11}
                    {...badge.otherBadgeProps}
                  >
                    {badge.title}
                  </Badge>
                )
            )}
            {isHighlighted && (
              <ActionButton
                onClick={() => {
                  addOneToTote();
                  setIsHighlighted(false);
                }}
                color="palette.white"
                bg="palette.softBlue"
                fontSize="16"
                fontWeight={500}
                letterSpacing="negativeLarge"
                px={11}
                borderRadius="sm"
                border="none"
                height="36px"
                mr={22}
                data-cy="add-one-to-tote-button"
              >
                {t(`${intlKey}.ActionButtons.AddOneToToteFromLineItem`)}
              </ActionButton>
            )}
          </Flex>
        </Box>
      </LongPressWrapper>
    </>
  );
};

export default ReturnOrderItem;
