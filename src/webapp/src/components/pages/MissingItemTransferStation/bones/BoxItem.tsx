import { Box, Ellipsis, Flex, Image } from '@oplog/express';
import React, { MutableRefObject, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import { Badge } from '../../../atoms/TouchScreen';
import RemoveBoxItem from './RemoveBoxItem';

interface BoxItemProps {
  boxItem: BoxItemsInterface;
  boxItemListRef?: MutableRefObject<HTMLDivElement | null>;
  bottomButtonGroupRef?: MutableRefObject<HTMLDivElement | null>;
}

const intlKey = 'TouchScreen';

const BoxItem: React.FC<BoxItemProps> = ({ boxItem, boxItemListRef, bottomButtonGroupRef }): ReactElement => {
  const { t } = useTranslation();
  const [missingItemTransferState, missingItemTransferAction] = useMissingItemTransferStore();

  const headerBgColorMap = () => {
    if (boxItem.selected && !missingItemTransferState.isOrderCompleted) {
      return 'palette.softBlue';
    }
    return 'palette.slate_lighter';
  };

  const headerBadgeColorMap = () => {
    if (missingItemTransferState.isOrderCompleted) {
      return 'palette.softBlue';
    }
    if (boxItem.selected) {
      return 'palette.white';
    }
    return 'palette.snow_darker';
  };

  return (
    <>
      {!(missingItemTransferState.isOrderCompleted && !boxItem.content.length) && (
        <Box
          width={missingItemTransferState.isLeftBarExpanded ? 'calc(50% - 16px)' : 1}
          style={{ float: 'left' }}
          mb={16}
          mx={missingItemTransferState.isLeftBarExpanded ? '8' : '0'}
          boxShadow="small"
          height="fit-content"
          zIndex={0}
          position="static"
        >
          <Flex
            height={52}
            px={16}
            bg={headerBgColorMap()}
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex alignItems="center">
              <Box
                fontSize="16"
                fontWeight={700}
                letterSpacing="negativeLarge"
                color={
                  boxItem.selected && !missingItemTransferState.isOrderCompleted
                    ? 'palette.white'
                    : 'palette.hardBlue_darker'
                }
                mr={11}
                data-cy="box-title"
              >
                {boxItem.title}
              </Box>
              <Badge
                badgeColor={headerBadgeColorMap()}
                outlined={!missingItemTransferState.isOrderCompleted}
                height={22}
                fontSize="12"
                letterSpacing="negativeLarge"
                p="4"
                backgroundColor={!missingItemTransferState.isOrderCompleted ? 'transparent' : 'palette.softBlue'}
                data-cy="box-item-count-badge"
              >
                {t(`${intlKey}.MissingItemTransferStation.Package.Count`, {
                  count: boxItem.content.reduce((accumulator, current) => accumulator + current.count, 0),
                })}
              </Badge>
            </Flex>
            {!missingItemTransferState.isOrderCompleted && (
              <RemoveBoxItem
                box={boxItem}
                boxItemListRef={boxItemListRef}
                bottomButtonGroupRef={bottomButtonGroupRef}
              />
            )}
          </Flex>
          <Box width={1} py="8" px="22" bg="palette.white" borderBottomLeftRadius="md" borderBottomRightRadius="md">
            {boxItem.content.map((item, i) => (
              <Flex
                key={item.productId}
                color="palette.hardBlue_darker"
                fontSize="16"
                alignItems="center"
                py={16}
                borderBottom={boxItem.content.length !== i + 1 ? `solid 1px rgb(157,191,249,0.25)` : 'unset'}
              >
                <Image
                  src={item.imageUrl}
                  borderRadius="full"
                  width={38}
                  height={38}
                  flexShrink={0}
                  boxShadow="small"
                />
                <Flex flexDirection="column" flexGrow={1} px={22}>
                  <Box
                    letterSpacing="negativeLarge"
                    textOverflow="ellipsis"
                    display="-webkit-box"
                    overflow="hidden"
                    style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                  >
                    {item.productName}
                  </Box>
                  {missingItemTransferState.isLeftBarExpanded && item.barcodes && (
                    <Flex
                      fontSize={12}
                      color="palette.steel_dark"
                      mt="4"
                      width="30vmin"
                      textAlign="left"
                      data-cy="product-barcodes"
                    >
                      <Ellipsis maxWidth={1000}>{item.barcodes.join()}</Ellipsis>
                    </Flex>
                  )}
                </Flex>
                <Box fontFamily="SpaceMono" letterSpacing="negativeLarge" flexShrink={0}>
                  x{item.count}
                </Box>
              </Flex>
            ))}
            {!boxItem.content.length && (
              <Flex color="palette.hardBlue_darker" fontSize="16" alignItems="center" py={16}>
                <Flex flexGrow={1} fontWeight={500} letterSpacing="negativeLarge" color="palette.blue_lighter">
                  {t(`${intlKey}.MissingItemTransferStation.Package.Empty`, {
                    type: t(`${intlKey}.PackingStation.Package.Types.Tote`),
                  })}
                </Flex>
              </Flex>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default BoxItem;
