import { Box, Flex, Icon } from '@oplog/express';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import useMissingItemTransferStore from '../../../store/global/missingItemTransferStore';
import useReturnStore from '../../../store/global/returnStore';
import useSingleItemPackingStore from '../../../store/global/singleItemPackingStore';

interface IBarcodeMessageBox {
  isBarcodeMessageOpen: boolean;
  isWrongBarcodeRead: boolean;
  isProcessSuccessText?: string;
}

const intlKey = 'TouchScreen';

const BarcodeMessageBox: React.FC<IBarcodeMessageBox> = ({
  isBarcodeMessageOpen,
  isWrongBarcodeRead,
  isProcessSuccessText,
}): ReactElement => {
  const { t } = useTranslation();
  const [packingState] = useSingleItemPackingStore();
  const [missingItemTransferState] = useMissingItemTransferStore();
  const [returnState] = useReturnStore();

  return (
    <Flex
      position="absolute"
      bottom={isBarcodeMessageOpen ? '3%' : '1%'}
      mx="auto"
      px="48px"
      left={0}
      right={0}
      height={
        isBarcodeMessageOpen
          ? packingState.modals.SerialNumber
            ? 130
            : (missingItemTransferState.modals.SerialNumber || returnState.modals.SerialNumber)
            ? 100
            : 72
          : 0
      }
      opacity={isBarcodeMessageOpen ? 1 : 0}
      width="fit-content"
      bg="palette.white"
      borderRadius="18px"
      alignItems="center"
      boxShadow="small"
      transition="all 0.25s"
      overflow="hidden"
      zIndex={5010}
    >
      <Icon
        name={
          isWrongBarcodeRead
            ? 'fas fa-times-circle'
            : isProcessSuccessText !== ''
            ? 'fas fa-check-circle'
            : 'far fa-spinner fa-spin'
        }
        fontSize="48"
        color={
          isWrongBarcodeRead
            ? 'palette.red_darker'
            : isProcessSuccessText !== ''
            ? 'palette.lime_dark'
            : 'palette.softBlue'
        }
        mr={18}
      />
      <Box fontFamily="Jost" fontSize="32" color="palette.slate">
        {isWrongBarcodeRead
          ? isProcessSuccessText || t(`${intlKey}.Barcode.Error`)
          : isProcessSuccessText !== ''
          ? isProcessSuccessText
          : t(`${intlKey}.Barcode.Scanning`)}
      </Box>
    </Flex>
  );
};

export default BarcodeMessageBox;
