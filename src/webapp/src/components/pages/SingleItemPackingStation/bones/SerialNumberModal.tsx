import { Box, Button, Ellipsis, Flex, Icon, Image, Input } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { InternalErrorNumber } from '../../../../services/swagger';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';
import { StoreState } from '../../../../store/initState';
import { actionBarcodes } from '../../../../typings/globalStore/enums';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';

export enum SingleItemPackingModals {
  Logout = 'Logout',
  OrderStatus = 'OrderStatus',
  DropTote = 'DropTote',
  CargoPackagePick = 'CargoPackagePick',
  ParkAreaScan = 'ParkAreaScan',
  SerialNumber = 'SerialNumber',
}

const intlKey = 'TouchScreen';

const SerialNumberModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useSingleItemPackingStore();
  const [serialNumber, setSerialNumber] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const product = packingState.product[0];
  const checkSimpleSerialNumberForSinglePackingResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CheckSimpleSerialNumberForSinglePacking]
  );

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.CheckSimpleSerialNumberForSinglePacking));
    };
  }, []);

  useEffect(() => {
    if (checkSimpleSerialNumberForSinglePackingResponse?.isSuccess) {
      packingAction.setSimpleSerialNumber(serialNumber);
      dispatch(
        resourceActions.resourceRequested(ResourceType.GetSingleItemSalesOrderState, {
          toteLabel: packingState.toteLabel,
          productBarcode: packingState.barcodeData,
        })
      );
      return handleClear();
    }
    if (checkSimpleSerialNumberForSinglePackingResponse?.error) {
      if (
        checkSimpleSerialNumberForSinglePackingResponse?.error.internalErrorNumber ===
          InternalErrorNumber.SimpleSerialNumberToteLabelCannotBeSimpleSerialNumber ||
        checkSimpleSerialNumberForSinglePackingResponse?.error.internalErrorNumber ===
          InternalErrorNumber.SimpleSerialNumberBarcodeCannotBeSimpleSerialNumber ||
        checkSimpleSerialNumberForSinglePackingResponse?.error.internalErrorNumber ===
          InternalErrorNumber.SimpleSerialNumberCargoPackageCannotBeSimpleSerialNumber
      ) {
        packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.HOVPackingStation.Error.NotASerialNumber`),
        });
      }
      if (
        checkSimpleSerialNumberForSinglePackingResponse?.error.internalErrorNumber ===
        InternalErrorNumber.SimpleSerialNumberIsUsedForAnotherSaleOrder
      ) {
        packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.HOVPackingStation.Error.SerialNumberScanned`),
        });
      }
      disabler();
    }
  }, [checkSimpleSerialNumberForSinglePackingResponse]);

  const handleComplete = () => {
    if (product.isSimpleSerialNumberTrackRequiredProduct) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.CheckSimpleSerialNumberForSinglePacking, {
          payload: { simpleSerialNumber: serialNumber, sku: product.sku, operationId: product.operationId },
        })
      );
    } else if (product.totePickingItemsSerialNumbers?.includes(serialNumber)) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.GetSingleItemSalesOrderState, {
          toteLabel: packingState.toteLabel,
          productBarcode: packingState.barcodeData,
          serialNumber: serialNumber,
        })
      );
      handleClear();
    } else {
      packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Error,
        text: t(`${intlKey}.HOVPackingStation.HovAddProductModal.WrongSerialNumber`),
        timer: 6,
      });
      disabler();
    }
  };

  const handleClear = () => {
    packingAction.toggleModalState(SingleItemPackingModals.SerialNumber, false);
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
      isOpen={packingState.modals.SerialNumber}
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
              <Image src={product?.productImageURL} borderRadius="md" width={88} height={88} />
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
                  <Ellipsis hasTooltip={false}>{product?.barcodes}</Ellipsis>
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
