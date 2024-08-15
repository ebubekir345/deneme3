import { Box, Flex, Icon } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useBarcode } from 'react-barcodes';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ResourceType } from '../../../../models';
import { OutputVASType } from '../../../../services/swagger';
import usePackingStore from '../../../../store/global/packingStore';
import { LongPressWrapper, ProgressBar } from '../../../atoms/TouchScreen';

interface IVasItem {
  vasItem: VasItemInterface;
}

const VasItem: FC<IVasItem> = ({ vasItem }) => {
  const { t } = useTranslation();
  const [packingState, packingAction] = usePackingStore();
  const dispatch = useDispatch();

  useEffect(() => {
    const el = document.getElementById(vasItem.barcode);
    vasItem.barcode === packingState.barcodeData && packingState.isVasAddedIntoPackage && el?.scrollIntoView();
  }, [packingState.barcodeData]);

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
        resourceActions.resourceRequested(ResourceType.PrintVAS, {
          params: { barcode: vasItem.barcode, packingAddressLabel: packingState.station.label },
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
              : vasItem.vasType === OutputVASType.CustomActionVas
              ? 'palette.blue'
              : 'palette.blue_darker'
          }
          borderRadius={4}
          boxShadow="small"
          justifyContent="space-between"
          alignItems="center"
          border={vasItem.barcode === packingState.barcodeData && packingState.isVasAddedIntoPackage && ('sm' as any)}
          borderColor={
            vasItem.barcode === packingState.barcodeData &&
            packingState.isVasAddedIntoPackage &&
            ('palette.softBlue' as any)
          }
        >
          <Flex
            width={packingState.isLeftBarExpanded ? 72 : 120}
            height={packingState.isLeftBarExpanded ? 76 : 120}
            bg={
              vasItem.amountInOrder === vasItem.boxedCount
                ? 'palette.white'
                : vasItem.vasType === OutputVASType.CustomActionVas
                ? 'palette.blue'
                : 'palette.blue_darker'
            }
            borderRadius="sm"
            p={packingState.isLeftBarExpanded ? '16px 14px' : 16}
            justifyContent="center"
            alignItems="center"
            flexShrink={0}
          >
            <Icon
              name={vasTypeToIconMap()}
              color={vasItem.amountInOrder === vasItem.boxedCount ? 'palette.slate_light' : 'palette.white'}
              fontSize={packingState.isLeftBarExpanded ? 48 : 64}
            />
          </Flex>
          <Box ml={24}>
            <svg ref={inputRef} />
          </Box>
          <Box
            flexGrow={1}
            paddingLeft={packingState.isLeftBarExpanded ? 16 : 32}
            paddingRight={packingState.isLeftBarExpanded ? 36 : 87}
            py={18}
          >
            <Box
              fontSize={packingState.isLeftBarExpanded ? 16 : 22}
              color={vasItem.amountInOrder === vasItem.boxedCount ? 'palette.slate' : 'palette.white'}
              textOverflow="ellipsis"
              display="-webkit-box"
              overflow="hidden"
              style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
            >
              {vasItem.vasType === OutputVASType.CustomActionVas
                ? vasItem.info
                : vasItem.vasType !== OutputVASType.PackingNoteVas && t(`Enum.${vasItem.vasType}`)}
            </Box>
            {!packingState.isLeftBarExpanded && (
              <>
                <Box
                  fontSize={vasItem.vasType === OutputVASType.PackingNoteVas ? 16 : 22}
                  color={vasItem.amountInOrder === vasItem.boxedCount ? 'palette.grey_light' : 'palette.white'}
                  pt={8}
                  pb={12}
                >
                  {vasItem.vasType === OutputVASType.PackingNoteVas ? vasItem.info : vasItem.barcode}
                </Box>
                <Box>
                  <ProgressBar
                    current={vasItem.boxedCount}
                    total={vasItem.amountInOrder}
                    barColor="palette.softBlue"
                    label={false}
                    borderRadius="sm"
                    height="7px"
                    containerColor="palette.snow_lighter"
                    completeColor="palette.green_darker"
                  />
                </Box>
              </>
            )}
          </Box>
          {vasItem.vasType !== OutputVASType.CustomActionVas && vasItem.vasType !== OutputVASType.PackingNoteVas && (
            <Flex flexDirection="column" justifyContent="space-between" alignItems="center" mr={48}>
              <Box
                fontSize={packingState.isLeftBarExpanded ? 16 : 22}
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
                fontSize={packingState.isLeftBarExpanded ? 28 : 40}
              />
            </Flex>
          )}
          <Box
            mr={packingState.isLeftBarExpanded ? 32 : 36}
            fontSize={packingState.isLeftBarExpanded ? 16 : 22}
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
