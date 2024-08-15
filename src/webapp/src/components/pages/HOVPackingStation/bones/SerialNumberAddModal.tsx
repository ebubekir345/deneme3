import { Button, Flex, Icon, Input } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ResourceType } from '../../../../models';
import useHovPackingStore, { HovPackingModals } from '../../../../store/global/hovPackingStore';
import { actionBarcodes } from '../../../../typings/globalStore/enums';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';
import OrderItem from './OrderItem';

const intlKey = 'TouchScreen';

const SerialNumberAddModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useHovPackingStore();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const orderItemToBeAdded = packingState.orderItems.filter(orderItem =>
    orderItem.barcodes?.includes(packingState.barcodeData)
  )[0];

  useEffect(() => {
    packingAction.setProductSerialNo('');
    packingState.orderItems.forEach(
      orderItem =>
        (orderItem.serialNumbers = orderItem.serialNumbers?.filter(serialNo =>
          packingState.boxItems.every(boxItem =>
            boxItem.content.every((item: any) => !item?.serialNumbers.includes(serialNo))
          )
        ))
    );
  }, []);

  const handleComplete = () => {
    if (orderItemToBeAdded?.serialNumbers?.includes(packingState.productSerialNo.trim())) {
      if (packingState.isMissing || packingState.isCancelled) {
        dispatch(
          resourceActions.resourceRequested(ResourceType.QueueHovItemIntoQuarantineTote, {
            params: {
              packingQuarantineProcessId: packingState.processId,
              productId: orderItemToBeAdded?.productId,
              quarantineToteLabel: packingState.boxItems.find(boxItem => boxItem.selected)?.title,
              amount: 1,
              serialNumber: packingState.productSerialNo.trim(),
            },
          })
        );
      } else {
        dispatch(
          resourceActions.resourceRequested(ResourceType.QueueHovItemIntoCargoPackage, {
            params: {
              hovPackingProcessId: packingState.processId,
              productId: orderItemToBeAdded?.productId,
              packageIndex: packingState.boxItems.find(boxItem => boxItem.selected)?.cargoPackageIndex,
              amount: 1,
              serialNumber: packingState.productSerialNo.trim(),
              toteLabel: packingState.orderBasket,
            },
          })
        );
      }
      return packingAction.toggleModalState(HovPackingModals.AddSerialNumber, false);
    }
    orderItemToBeAdded?.isCreatedWithSerialNumber
      ? packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.HOVPackingStation.Error.SerialNoTrackFlowErr`),
        })
      : packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.HOVPackingStation.Error.TargetSerialNoErr`),
        });
    setIsDisabled(true);
    setTimeout(() => {
      packingAction.setProductSerialNo('');
      setIsDisabled(false);
      inputRef.current?.focus();
    }, 1000);
  };

  return (
    <ModalBox
      onClose={() => packingAction.toggleModalState(HovPackingModals.AddSerialNumber, false)}
      isOpen={packingState.modals.AddSerialNumber}
      width={1 / 2}
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
        <OrderItem product={orderItemToBeAdded} onImageClicked={() => {}} />
        <Flex>
          <Input
            type="string"
            fontWeight={700}
            fontSize="22"
            onChange={(e: SyntheticEvent<HTMLInputElement>) => packingAction.setProductSerialNo(e.currentTarget.value)}
            value={packingState.productSerialNo}
            disabled={isDisabled}
            placeholder={t(`${intlKey}.HOVPackingStation.AddSerialNumberModal.SerialNumberInputLabel`)}
            height={52}
            maxLength={50}
            autoFocus
            ref={inputRef}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === actionBarcodes.Enter || e.code === 'Enter') {
                packingState.productSerialNo.trim() && handleComplete();
              }
            }}
          />
          <Button
            onClick={() => handleComplete()}
            disabled={!packingState.productSerialNo.trim()}
            height={52}
            ml={6}
            bg="palette.white"
            color="palette.blue_darker"
            _hover={{
              backgroundColor: 'palette.blue_darker',
              color: 'palette.white',
            }}
          >
            {t(`${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton`)}
          </Button>
        </Flex>
      </Flex>
    </ModalBox>
  );
};

export default SerialNumberAddModal;
