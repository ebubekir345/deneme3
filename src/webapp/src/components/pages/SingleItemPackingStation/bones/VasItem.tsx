import { Box, Flex, Icon } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { FC } from 'react';
import { useBarcode } from 'react-barcodes';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ResourceType } from '../../../../models';
import { OutputVASType } from '../../../../services/swagger';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';
import { LongPressWrapper } from '../../../atoms/TouchScreen';

interface IVasItem {
  vasItem: VasItemInterface;
}

const VasItem: FC<IVasItem> = ({ vasItem }) => {
  const { t } = useTranslation();
  const [packingState, packingAction] = useSingleItemPackingStore();
  const dispatch = useDispatch();

  const { inputRef } = useBarcode({
    value: vasItem.barcode,
    options: {
      displayValue: false,
    },
  });

  const vasTypeToIconMap = () => {
    switch (vasItem.vasType) {
      case OutputVASType.InsertToPackageVas:
        return 'fal fa-file-check';
      case OutputVASType.GiftPackageWithWrappingAndWithMessage:
        return 'fal fa-gift';
      case OutputVASType.GiftPackageWithWrappingAndWithoutMessage:
        return 'fal fa-gift';
      case OutputVASType.GiftPackageWithoutWrappingAndWithMessage:
        return 'fal fa-gift-card';
      case OutputVASType.PackingNoteVas:
        return 'fas fa-file-exclamation';
      case OutputVASType.CustomActionVas:
        return 'fal fa-file-exclamation';
      case OutputVASType.NpsVas:
        return 'fal fa-qrcode';
      default:
        return 'fal fa-file-check';
    }
  };

  const onVasItemPressed = () => {
    packingAction.setBarcodeData(vasItem.barcode);
    const vasItemToBeAdded = packingState.vasItems.find(item => item.barcode === vasItem.barcode);
    if (
      vasItemToBeAdded &&
      vasItemToBeAdded.boxedCount !== vasItemToBeAdded.amountInOrder &&
      vasItem.vasType !== OutputVASType.PackingNoteVas
      && vasItem.vasType !== OutputVASType.NpsVas
    ) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.PrintSingleItemSalesOrderVAS, {
          params: { barcode: vasItem.barcode, singleItemPackingAddressLabel: packingState.station.label },
        })
      );
    }
    if (vasItem.vasType === OutputVASType.PackingNoteVas) {
      const updatedVasItems = packingState.vasItems.map(item => {
        if (item.barcode === vasItemToBeAdded?.barcode && item.boxedCount < item.amountInOrder) {
          item.boxedCount += 1;
        }
        return item;
      });
      packingAction.setVasItems(updatedVasItems);
    }
    if (vasItem.vasType === OutputVASType.NpsVas)
      packingAction.setInfoPopup({
        isOpen: true,
        header: t(`TouchScreen.PackingStation.InfoPopup.ScanQR`),
        subHeader: '',
        icon: (
          <Flex
            width={120}
            height={120}
            borderRadius="full"
            bg="palette.softBlue_lighter"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name={'fal fa-engine-warning'} fontSize={52} color="palette.softBlue_light" />
          </Flex>
        ),
      });
  };

  return (
    <LongPressWrapper onLongPress={onVasItemPressed}>
      <Box width={1} cursor={vasItem.amountInOrder === vasItem.boxedCount ? 'not-allowed' : 'pointer'}>
        <Flex
          mb={12}
          bg={
            vasItem.amountInOrder === vasItem.boxedCount
              ? 'palette.white'
              : vasItem.vasType === OutputVASType.CustomActionVas || vasItem.vasType === OutputVASType.PackingNoteVas
              ? 'palette.blue'
              : 'palette.blue_darker'
          }
          borderRadius={4}
          boxShadow="small"
          justifyContent="space-between"
          alignItems="center"
          pt={12}
        >
          <Flex
            width={120}
            height={120}
            bg={
              vasItem.amountInOrder === vasItem.boxedCount
                ? 'palette.white'
                : vasItem.vasType === OutputVASType.CustomActionVas || vasItem.vasType === OutputVASType.PackingNoteVas
                ? 'palette.blue'
                : 'palette.blue_darker'
            }
            borderRadius="sm"
            p={16}
            justifyContent="center"
            alignItems="center"
            flexShrink={0}
          >
            <Icon
              name={vasTypeToIconMap()}
              color={vasItem.amountInOrder === vasItem.boxedCount ? 'palette.slate_light' : 'palette.white'}
              fontSize={64}
            />
          </Flex>
          <Box bg="palette.white" p={8}>
            <svg ref={inputRef} />
          </Box>
          <Box flexGrow={1} px={32} py={18}>
            <Box
              fontSize={22}
              color={vasItem.amountInOrder === vasItem.boxedCount ? 'palette.slate' : 'palette.white'}
              textOverflow="ellipsis"
              display="-webkit-box"
              overflow="hidden"
              style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
            >
              {vasItem.vasType === OutputVASType.CustomActionVas ? vasItem.info : t(`Enum.${vasItem.vasType}`)}
            </Box>

            <Box
              fontSize={vasItem.vasType === OutputVASType.PackingNoteVas ? 16 : 22}
              color={vasItem.amountInOrder === vasItem.boxedCount ? 'palette.grey_light' : 'palette.white'}
              pt={8}
              pb={12}
              px={0}
              alignItems="start"
              justifyContent="start"
            >
              {vasItem.vasType === OutputVASType.PackingNoteVas ? vasItem.info : vasItem.barcode}
            </Box>
          </Box>
          {vasItem.vasType !== OutputVASType.CustomActionVas && vasItem.vasType !== OutputVASType.PackingNoteVas && (
            <Flex flexDirection="column" justifyContent="space-between" alignItems="center" mr={48} mb={8}>
              <Box
                fontSize={22}
                color={vasItem.amountInOrder === vasItem.boxedCount ? 'palette.grey_light' : 'palette.white'}
                textOverflow="ellipsis"
                display="-webkit-box"
                overflow="hidden"
                style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                mb={4}
              >
                {vasItem.vasType === OutputVASType.InsertToPackageVas
                  ? packingState.operation.packageVASPageSizeType
                  : packingState.operation.giftPackageVASPageSizeType}
              </Box>
              <Icon
                mt={4}
                name="fal fa-file-alt"
                color={vasItem.amountInOrder === vasItem.boxedCount ? 'palette.slate_light' : 'palette.white'}
                fontSize={40}
              />
            </Flex>
          )}
          <Box
            mr={36}
            fontSize={22}
            fontWeight={700}
            color={vasItem.amountInOrder === vasItem.boxedCount ? 'palette.blue_darker' : 'palette.white'}
            whiteSpace="nowrap"
          >
            {vasItem.boxedCount} / {vasItem.amountInOrder}
          </Box>
        </Flex>
      </Box>
    </LongPressWrapper>
  );
};

export default VasItem;
