import { Box, Button, Ellipsis, Flex, Icon, Image, Input } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { ContainedItemsType } from '../../../../services/swagger';
import useReturnStore from '../../../../store/global/returnStore';
import { StoreState } from '../../../../store/initState';
import { actionBarcodes } from '../../../../typings/globalStore/enums';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';

export enum ReturnModals {
  Logout = 'Logout',
  CompleteReturn = 'CompleteReturn',
  GenericError = 'GenericError',
  Error = 'Error',
  SerialNumber = 'SerialNumber',
}

const intlKey = 'TouchScreen';

const SerialNumberModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [returnState, returnAction] = useReturnStore();
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const product = returnState.orderItems.filter(orderItem => orderItem.barcodes?.includes(returnState.barcodeData))[0];

  const checkReturnItemSerialNumberResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CheckReturnItemSerialNumber]
  );

  useEffect(() => {
    if (checkReturnItemSerialNumberResponse?.isSuccess) {
      const {
        isExistInCurrentSalesOrder,
        isExistOnOtherItems,
        isExistInSalesOrderSimpleSerialNumberItems,
      } = checkReturnItemSerialNumberResponse?.data;
      const isSelectedToteOutbound = returnState.boxItems.find(
        item => item?.selected && item?.containedItemsType === ContainedItemsType.Outbound
      );
      const isExistSN = returnState.boxItems.some(boxItem =>
        boxItem.content.some(
          (contentItem: any) =>
            contentItem?.sku === product.sku &&
            (contentItem.serialNumbers?.includes(serialNumber) ||
              contentItem.simpleSerialNumbers?.includes(serialNumber))
        )
      );

      if (isExistSN) {
        returnAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.ReturnStation.Error.ScannedSerialNumber`),
        });
        return disabler();
      }
      if (product.isTrackSimpleSerialNumber && !isExistInSalesOrderSimpleSerialNumberItems) {
        if (isSelectedToteOutbound) return handleSuccessState();
        else {
          returnAction.callInfoMessageBox({
            state: InfoMessageBoxState.Error,
            text: t(`${intlKey}.ReturnStation.Error.SelectControlTote`),
          });
          return disabler();
        }
      }
      if (product.isTrackSimpleSerialNumber && isExistInSalesOrderSimpleSerialNumberItems) return handleSuccessState();
      if (!isExistInCurrentSalesOrder) {
        if (isSelectedToteOutbound) return handleSuccessState();
        else {
          returnAction.callInfoMessageBox({
            state: InfoMessageBoxState.Error,
            text: t(`${intlKey}.ReturnStation.Error.SelectControlTote`),
          });
          return disabler();
        }
      }
      if (isExistInCurrentSalesOrder && !isExistOnOtherItems) return handleSuccessState();
      if (isExistOnOtherItems) {
        returnAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.ReturnStation.Error.DuplicateSerialNumber`),
        });
        return disabler();
      }
    }
  }, [checkReturnItemSerialNumberResponse]);

  const handleSuccessState = () => {
    returnAction.setPreviousBoxItems(returnState.boxItems);
    const updatedBoxItems = returnState.boxItems.map(item => {
      const updatedItemContent = JSON.parse(JSON.stringify(item.content));
      if (item.selected) {
        const placedSameLineItem = updatedItemContent.filter(
          contentItem => contentItem.productId === product.productId
        )[0];

        if (placedSameLineItem && product.isTrackSimpleSerialNumber) {
          placedSameLineItem.count += 1;
          placedSameLineItem.simpleSerialNumbers = [...placedSameLineItem.simpleSerialNumbers, serialNumber];
        } else if (product.isTrackSimpleSerialNumber) {
          updatedItemContent.push({
            productId: product.productId,
            count: 1,
            barcodes: product.barcodes,
            productName: product.productName,
            imageUrl: product.imageUrl,
            simpleSerialNumbers: [serialNumber],
            sku: product.sku,
          });
        } else if (placedSameLineItem) {
          placedSameLineItem.count += 1;
          placedSameLineItem.serialNumbers = [...placedSameLineItem.serialNumbers, serialNumber];
        } else {
          updatedItemContent.push({
            productId: product.productId,
            count: 1,
            barcodes: product.barcodes,
            productName: product.productName,
            imageUrl: product.imageUrl,
            serialNumbers: [serialNumber],
            sku: product.sku,
          });
        }
      }
      return { ...item, content: updatedItemContent };
    });
    returnAction.setBoxItems(updatedBoxItems);
    handleClear();
  };

  const handleComplete = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.CheckReturnItemSerialNumber, {
        SalesOrderId: returnState.salesOrderId,
        ProductId: product.productId,
        SerialNumber: serialNumber,
      })
    );
  };

  const handleClear = () => {
    returnAction.toggleModalState(ReturnModals.SerialNumber, false);
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
      isOpen={returnState.modals.SerialNumber}
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
            mb={12}
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
              <Image src={product?.imageUrl} borderRadius="md" width={88} height={88} />
            </Flex>
            <Box flexGrow={1} pl={32} pr={88} py={22}>
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
                {product?.productName}
              </Box>
              {product?.barcodes && (
                <Flex
                  fontSize={22}
                  color="palette.slate_light"
                  py={11}
                  width="30vmin"
                  textAlign="left"
                  data-cy="product-barcodes"
                >
                  <Ellipsis hasTooltip={false}>{product.barcodes.join()}</Ellipsis>
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
            height={64}
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
            height={64}
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
