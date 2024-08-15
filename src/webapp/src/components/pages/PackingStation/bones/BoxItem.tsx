import { Box, Button, Ellipsis, Flex, Image, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { MutableRefObject, ReactElement, SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { PackageType, PrintPalettePackingListCommand } from '../../../../services/swagger';
import usePackingStore from '../../../../store/global/packingStore';
import { StoreState } from '../../../../store/initState';
import iff from '../../../../utils/iff';
import { Badge } from '../../../atoms/TouchScreen';
import PrintPalletModal from '../../../organisms/PrintPalletModal/PrintPalletModal';
import RemoveBoxItem from './RemoveBoxItem';

interface BoxItemProps {
  boxItem: BoxItemsInterface;
  boxItemListRef?: MutableRefObject<HTMLDivElement | null>;
  bottomButtonGroupRef?: MutableRefObject<HTMLDivElement | null>;
}

const intlKey = 'TouchScreen';

const BoxItem: React.FC<BoxItemProps> = ({ boxItem, boxItemListRef, bottomButtonGroupRef }): ReactElement => {
  const { t } = useTranslation();
  const [packingState, packingAction] = usePackingStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pallet, setPallet] = useState<BoxItemsInterface | undefined>();
  const dispatch = useDispatch();
  const printPalettePackingListResponse: Resource<PrintPalettePackingListCommand> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PrintPalettePackingList]
  );

  const onPrintPalette = (boxItem: BoxItemsInterface) => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.PrintPalettePackingList, {
        params: {
          packingAddressLabel: packingState.station.label,
          packingQueueId: boxItem.packageId,
        },
      })
    );
  };

  const onSelectBoxItem = (key: number) => {
    const prevBoxItems = packingState.boxItems;
    packingAction.setBoxItems(
      prevBoxItems
        .map(item => {
          return { ...item, selected: item.key === key };
        })
        .sort(item1 => (item1.selected ? -1 : 1))
    );
  };

  const headerBgColorMap = () => {
    if (boxItem.selected && !packingState.isOrderCompleted) {
      if (packingState.isMissing || packingState.isCancelled) {
        return 'palette.red_darker';
      }
      return 'palette.softBlue';
    }
    return 'palette.slate_lighter';
  };

  const headerBadgeColorMap = () => {
    if (packingState.isOrderCompleted) {
      if (packingState.isMissing || packingState.isCancelled) {
        return 'palette.red_darker';
      }
      return 'palette.softBlue';
    }
    if (boxItem.selected) {
      return 'palette.white';
    }
    return 'palette.snow_darker';
  };

  const contentBgColorMap = () => {
    if (
      (packingState.isMissing && packingState.isOrderCompleted) ||
      (packingState.isCancelled && packingState.isOrderCompleted)
    ) {
      return 'palette.red_lighter';
    }
    return 'palette.white';
  };

  return (
    <>
      {!(packingState.isOrderCompleted && !boxItem.content.length) && (
        <Box
          onClick={() => !packingState.isOrderCompleted && onSelectBoxItem(boxItem.key)}
          width={packingState.isLeftBarExpanded ? 'calc(50% - 16px)' : 1}
          style={{ float: 'left' }}
          mb={16}
          mx={packingState.isLeftBarExpanded ? '8' : '0'}
          boxShadow="small"
          height="fit-content"
          zIndex={0}
          position="static"
        >
          <Flex
            height={52}
            px={16}
            bg={headerBgColorMap()}
            borderTopRightRadius="md"
            borderTopLeftRadius="md"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex alignItems="center">
              <Box
                fontSize="16"
                fontWeight={700}
                letterSpacing="negativeLarge"
                color={boxItem.selected && !packingState.isOrderCompleted ? 'palette.white' : 'palette.hardBlue'}
                mr={11}
                data-cy="box-title"
              >
                {packingState.isMissing || packingState.isCancelled
                  ? boxItem.title
                  : [...packingState.operationCargoPackageTypes, ...packingState.oplogCargoPackageTypes].find(
                      type => type.barcode === boxItem.title
                    )?.name}
              </Box>
              <Badge
                badgeColor={headerBadgeColorMap()}
                outlined={!packingState.isOrderCompleted}
                fontSize="12"
                letterSpacing="negativeLarge"
                p="4"
                bg={!packingState.isOrderCompleted ? 'transparent' : 'palette.softBlue'}
                data-cy="box-item-count-badge"
              >
                {t(`${intlKey}.PackingStation.Package.Count`, {
                  count: boxItem.content.reduce((accumulator, current) => accumulator + current.count, 0),
                })}
              </Badge>
              {!packingState.isMissing && !packingState.isCancelled && (
                <Badge
                  badgeColor={
                    packingState.isOrderCompleted
                      ? 'palette.snow_darker'
                      : iff(boxItem.selected, 'palette.white', 'palette.snow_darker')
                  }
                  outlined
                  fontSize="12"
                  letterSpacing="negativeLarge"
                  p="4"
                  bg="transparent"
                >
                  {t(`${intlKey}.PackingStation.Package.Volume`, {
                    volume: boxItem.volume,
                  })}
                </Badge>
              )}
            </Flex>

            <Flex>
              {!packingState.isMissing && !packingState.isCancelled && (
                <Badge
                  badgeColor={
                    packingState.isOrderCompleted
                      ? 'palette.hardBlue'
                      : iff(boxItem.selected, 'palette.white', 'palette.hardBlue')
                  }
                  outlined
                  height={32}
                  p="8"
                  bg="transparent"
                >
                  <Flex justifyContent="center" alignItems="center">
                    <Image
                      src={
                        packingState.isOrderCompleted
                          ? '/images/shipment-box-grey.png'
                          : iff(boxItem.selected, '/images/shipment-box-white.png', '/images/shipment-box-grey.png')
                      }
                    />
                    <Text
                      ml={8}
                      fontFamily="Jost"
                      fontWeight={700}
                      fontSize={12}
                      letterSpacing="negativeLarge"
                      color={
                        packingState.isOrderCompleted
                          ? 'palette.hardBlue'
                          : iff(boxItem.selected, 'palette.white', 'palette.hardBlue')
                      }
                    >
                      {boxItem?.cargoPackageIndex}/{packingState.boxItems.length}
                    </Text>
                  </Flex>
                </Badge>
              )}
              {!packingState.isOrderCompleted && (
                <RemoveBoxItem
                  box={boxItem}
                  boxItemListRef={boxItemListRef}
                  bottomButtonGroupRef={bottomButtonGroupRef}
                />
              )}
            </Flex>
          </Flex>

          <Box
            width={1}
            px={26}
            py={8}
            bg={contentBgColorMap()}
            borderBottomRightRadius="md"
            borderBottomLeftRadius="md"
          >
            {boxItem.content.map((item, i) => (
              <Flex
                key={item.productId}
                color="palette.hardBlue"
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
                  {packingState.isLeftBarExpanded && item.barcodes && (
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
              <Flex color="palette.hardBlue" fontSize="16" alignItems="center" py={16}>
                <Flex flexGrow={1} fontWeight={500} letterSpacing="negativeLarge" color="palette.grey_lighter">
                  {t(`${intlKey}.PackingStation.Package.Empty`, {
                    type:
                      packingState.isMissing || packingState.isCancelled
                        ? t(`${intlKey}.PackingStation.Package.Types.Tote`)
                        : t(`${intlKey}.PackingStation.Package.Types.Box`),
                  })}
                </Flex>
              </Flex>
            )}
          </Box>

          {boxItem.type === PackageType.Palette && (
            <Button
              onClick={(e: SyntheticEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setPallet(boxItem);
                packingState.isOrderCompleted ? onPrintPalette(boxItem) : setIsModalOpen(true);
              }}
              width={1}
              bg="palette.white"
              color={packingState.isOrderCompleted ? 'palette.blue_darker' : 'palette.hardGreen_light'}
              border={boxItem.content.length && 'medium'}
              borderStyle="solid"
              borderColor={
                !printPalettePackingListResponse?.isBusy &&
                (packingState.isOrderCompleted ? 'palette.blue_darker' : 'palette.hardGreen_light') as any
              }
              fontWeight={700}
              fontSize={22}
              fontFamily="base"
              letterSpacing="large"
              borderRadius="lg"
              disabled={!boxItem.content.length || printPalettePackingListResponse?.isBusy}
              _focus={{
                outline: 'none',
              }}
              _hover={{
                bg: packingState.isOrderCompleted ? 'palette.blue_darker' : 'palette.hardGreen_light',
                color: 'palette.white',
              }}
              contentProps={{
                py: '6',
              }}
            >
              {t(`${intlKey}.PackingStation.Package.PrintPalette`)}
            </Button>
          )}
        </Box>
      )}
      <PrintPalletModal
        pallet={pallet}
        onPrintPalette={onPrintPalette}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        packingState={packingState}
      />
    </>
  );
};

export default BoxItem;
