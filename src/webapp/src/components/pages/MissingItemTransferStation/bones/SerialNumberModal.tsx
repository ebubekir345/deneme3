import { Box, Button, Ellipsis, Flex, Icon, Image, Input } from '@oplog/express';
import React, { KeyboardEvent, SyntheticEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import { actionBarcodes, MissingItemTransferModals } from '../../../../typings/globalStore/enums';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';

const intlKey = 'TouchScreen';

const SerialNumberModal: React.FC = () => {
  const { t } = useTranslation();
  const [missingItemTransferState, missingItemTransferAction] = useMissingItemTransferStore();
  const [serialNumber, setSerialNumber] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const orderItemToBeAdded = missingItemTransferState.orderItems.filter(orderItem =>
    orderItem.barcodes?.includes(missingItemTransferState.barcodeData)
  )[0];

  const handleComplete = () => {
    if (
      missingItemTransferState.boxItems.some(boxItem =>
        boxItem.content.some(
          contentItem =>
            contentItem?.sku === orderItemToBeAdded.sku && contentItem.serialNumbers?.includes(serialNumber)
        )
      )
    ) {
      missingItemTransferAction.callInfoMessageBox({
        state: InfoMessageBoxState.Error,
        text: t(`${intlKey}.ReturnStation.Error.ScannedSerialNumber`),
        timer: 6,
      });
      disabler();
    } else if (
      missingItemTransferState.pickingToteContainedItemSerialNumbers[orderItemToBeAdded.productId].includes(
        serialNumber
      )
    ) {
      const updatedBoxItems = missingItemTransferState.boxItems.map(item => {
        if (item.selected) {
          const placedSameLineItem = item.content.find(
            contentItem => contentItem.productId === orderItemToBeAdded.productId
          );
          if (placedSameLineItem) {
            placedSameLineItem.count += 1;
            placedSameLineItem.serialNumbers = [...placedSameLineItem.serialNumbers, serialNumber];
          } else {
            item.content.push({
              productId: orderItemToBeAdded.productId,
              count: 1,
              barcodes: orderItemToBeAdded.barcodes,
              productName: orderItemToBeAdded.productName,
              imageUrl: orderItemToBeAdded.imageUrl,
              isTrackSerialNumber: orderItemToBeAdded.isTrackSerialNumber,
              serialNumbers: [serialNumber],
              sku: orderItemToBeAdded.sku,
            });
          }
        }
        return item;
      });

      missingItemTransferAction.setBoxItems(updatedBoxItems);
      handleClear();
      missingItemTransferAction.callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: t(`${intlKey}.SingleItemPackingStation.MiddleBar.SuccessProduct`),
      });
    } else {
      missingItemTransferState.isCancelled
        ? missingItemTransferAction.callInfoMessageBox({
            state: InfoMessageBoxState.Error,
            text: t(`${intlKey}.MissingItemTransferStation.Error.QuarantineWrongSerialNumber`),
            timer: 6,
          })
        : missingItemTransferAction.callInfoMessageBox({
            state: InfoMessageBoxState.Error,
            text: t(`${intlKey}.MissingItemTransferStation.Error.WrongSerialNumber`),
            timer: 6,
          });
      disabler();
    }
  };

  const handleClear = () => {
    missingItemTransferAction.toggleModalState(MissingItemTransferModals.SerialNumber, false);
    setSerialNumber('');
  };

  const disabler = () => {
    setIsDisabled(true);
    setTimeout(() => {
      setSerialNumber('');
      setIsDisabled(false);
      inputRef.current?.focus();
    }, 1000);
  };

  return (
    <ModalBox
      onClose={() => handleClear()}
      isOpen={missingItemTransferState.modals.SerialNumber}
      width={1 / 3}
      contentBoxProps={{
        py: '60',
        px: '30',
      }}
      icon={
        <Flex
          width={64}
          height={64}
          borderRadius="full"
          bg="palette.softBlue_lighter"
          alignItems="center"
          justifyContent="center"
        >
          <Icon name="fas fa-key" fontSize={32} color="palette.blue" />
        </Flex>
      }
    >
      <Flex width={1} flexDirection="column" px={22}>
        <Box width={1}>
          <Flex
            mb={11}
            bg="palette.white"
            borderRadius="sm"
            boxShadow="xlarge"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex
              width={120}
              height={120}
              bg="palette.snow_lighter"
              borderRadius="md"
              p={16}
              justifyContent="center"
              alignItems="center"
              flexShrink={0}
            >
              <Image src={orderItemToBeAdded?.imageUrl} borderRadius="md" width={88} height={88} />
            </Flex>
            <Box flexGrow={1} pl={32} pr={87} py={22}>
              <Box
                fontSize={26}
                color="palette.hardBlue_darker"
                textOverflow="ellipsis"
                display="-webkit-box"
                overflow="hidden"
                style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                textAlign="left"
                mb={11}
              >
                {orderItemToBeAdded?.productName}
              </Box>
              {orderItemToBeAdded?.barcodes && (
                <Flex
                  fontSize={22}
                  color="palette.slate_light"
                  py={11}
                  width="30vmin"
                  textAlign="left"
                  data-cy="product-barcodes"
                >
                  <Ellipsis hasTooltip={false}>{orderItemToBeAdded?.barcodes.join()}</Ellipsis>
                </Flex>
              )}
            </Box>
          </Flex>
        </Box>
        <Flex fontSize={26} my={26} textAlign="center" flexDirection="column">
          {t(`${intlKey}.HOVPackingStation.HovAddProductModal.SerialNumber`)}
        </Flex>
        <Flex>
          <Input
            fontWeight={700}
            fontSize={26}
            pl={22}
            onChange={(e: SyntheticEvent<HTMLInputElement>) => setSerialNumber(e.currentTarget.value)}
            value={serialNumber}
            disabled={isDisabled}
            height={60}
            maxLength={50}
            data-testid="input-box"
            autoFocus
            ref={inputRef}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === actionBarcodes.Enter || e.code === 'Enter') {
                serialNumber.trim() && handleComplete();
              }
            }}
          />
          <Button
            onClick={() => handleComplete()}
            disabled={!serialNumber.trim()}
            fontSize={22}
            height={60}
            ml={6}
            bg="palette.white"
            color="palette.blue_darker"
            _hover={{
              backgroundColor: 'palette.blue_darker',
              color: 'palette.white',
            }}
          >
            {t(`${intlKey}.HOVPackingStation.HovAddProductModal.OkayButton`)}
          </Button>
        </Flex>
      </Flex>
    </ModalBox>
  );
};

export default SerialNumberModal;
