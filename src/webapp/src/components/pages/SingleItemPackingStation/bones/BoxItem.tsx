import { Box, Flex, Image } from '@oplog/express';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';
import { Badge } from '../../../atoms/TouchScreen';
import RemoveBoxItem from './RemoveBoxItem';

interface BoxItemProps {
  boxItem: BoxItemsInterface;
}

const intlKey = 'TouchScreen';

const BoxItem: React.FC<BoxItemProps> = ({ boxItem }): ReactElement => {
  const { t } = useTranslation();
  const [packingState] = useSingleItemPackingStore();

  return (
    <>
      {!(packingState.isOrderCompleted && !boxItem.content.length) && (
        <Box
          width={1}
          style={{ float: 'left' }}
          mb={16}
          mx="0"
          boxShadow="small"
          height="fit-content"
          zIndex={0}
          position="static"
        >
          <Flex
            height={packingState.isOrderCompleted ? 38 : 52}
            px={packingState.isOrderCompleted ? 11 : 16}
            bg="palette.slate_lighter"
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
                color="palette.hardBlue_darker"
                mr={11}
                data-cy="box-title"
              >
                {
                  [
                    ...packingState.operationCargoPackageTypes,
                    ...packingState.oplogCargoPackageTypes,
                    ...packingState.ownContainerCargoPackageTypes,
                  ].find(type => type.barcode === boxItem.title)?.name
                }
              </Box>
              <Badge
                badgeColor="palette.snow_darker"
                outlined
                height={22}
                fontSize="12"
                letterSpacing="negativeLarge"
                p="4"
                backgroundColor="transparent"
              >
                {t(`${intlKey}.SingleItemPackingStation.Package.Count`, {
                  count: boxItem.content.reduce((accumulator, current) => accumulator + current.count, 0),
                })}
              </Badge>

              <Badge
                badgeColor="palette.snow_darker"
                outlined
                height={22}
                fontSize="12"
                letterSpacing="negativeLarge"
                p="4"
                backgroundColor="transparent"
              >
                {t(`${intlKey}.SingleItemPackingStation.Package.Volume`, {
                  volume: boxItem.volume,
                })}
              </Badge>
            </Flex>
            {!packingState.isOrderCompleted && !packingState.isSioc && <RemoveBoxItem box={boxItem} />}
          </Flex>
          <Box width={1} py={8} px={26} bg="palette.white" borderBottomLeftRadius="md" borderBottomRightRadius="md">
            {boxItem.content.map((item, i) => (
              <Flex
                key={item.productId}
                color="palette.hardBlue_darker"
                fontSize="16"
                alignItems="center"
                py={packingState.isOrderCompleted ? 11 : 16}
                borderBottom={boxItem.content.length !== i + 1 ? `solid 1px rgb(157,191,249,0.25)` : 'unset'}
              >
                <Image
                  src={item.imageUrl}
                  borderRadius="full"
                  width={packingState.isOrderCompleted ? 26 : 38}
                  height={packingState.isOrderCompleted ? 26 : 38}
                  flexShrink={0}
                  boxShadow="small"
                />
                <Flex flexDirection="column" flexGrow={1} px={packingState.isOrderCompleted ? 16 : 26}>
                  <Box
                    letterSpacing="negativeLarge"
                    textOverflow="ellipsis"
                    display="-webkit-box"
                    overflow="hidden"
                    style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                  >
                    {item.productName}
                  </Box>
                </Flex>
                <Box fontFamily="SpaceMono" letterSpacing="negativeLarge" flexShrink={0}>
                  x{item.count}
                </Box>
              </Flex>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default BoxItem;
