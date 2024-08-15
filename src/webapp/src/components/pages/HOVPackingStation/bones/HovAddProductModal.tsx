import { Button, Flex, Icon, Input } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ResourceType } from '../../../../models';
import useHovPackingStore, { HovPackingModals } from '../../../../store/global/hovPackingStore';
import { actionBarcodes } from '../../../../typings/globalStore/enums';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';
import OrderItem from './OrderItem';

const intlKey = 'TouchScreen';

const HovAddProductModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useHovPackingStore();
  const orderItemToBeAdded = packingState.orderItems.filter(orderItem =>
    orderItem.barcodes?.includes(packingState.barcodeData)
  )[0];

  const handleDisable = () => {
    return packingState.hovItemCount > orderItemToBeAdded?.amountInOrder - orderItemToBeAdded?.boxedCount ||
      !packingState.hovItemCount
      ? true
      : false;
  };

  const handleComplete = () => {
    if (orderItemToBeAdded?.isTrackSimpleSerialNumber && !packingState.isMissing && !packingState.isCancelled) {
      packingAction.toggleModalState(HovPackingModals.AddSimpleSerialNumber);
      return packingAction.toggleModalState(HovPackingModals.HovAddProduct, false);
    }

    if (packingState.isMissing || packingState.isCancelled) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.QueueHovItemIntoQuarantineTote, {
          params: {
            packingQuarantineProcessId: packingState.processId,
            productId: orderItemToBeAdded?.productId,
            quarantineToteLabel: packingState.boxItems.find(boxItem => boxItem.selected)?.title,
            amount: packingState.hovItemCount,
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
            amount: packingState.hovItemCount,
            toteLabel: packingState.orderBasket,
          },
        })
      );
    }
    packingAction.setIsProductAddedIntoPackage(true);
    packingAction.toggleModalState(HovPackingModals.HovAddProduct, false);
  };

  return (
    <ModalBox
      onClose={() => packingAction.toggleModalState(HovPackingModals.HovAddProduct, false)}
      isOpen={packingState.modals.HovAddProduct && !packingState.modals.AddSerialNumber}
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
          <Icon name="fas fa-calculator-alt" fontSize={32} color="palette.blue" />
        </Flex>
      }
    >
      <Flex width={1} flexDirection="column" px={22}>
        <OrderItem product={orderItemToBeAdded} onImageClicked={() => {}} />
        <Flex fontSize={22} my={26} textAlign="left" flexDirection="column">
          {t(
            `${intlKey}.HOVPackingStation.HovAddProductModal.${
              packingState.isMissing || packingState.isCancelled ? 'SelectProductQuarantineCount' : 'SelectProductCount'
            }`,
            {
              value: packingState.boxItems.filter(item => item.selected)[0].title,
            }
          )}
        </Flex>
        <Flex>
          <Input
            type="number"
            fontWeight={700}
            fontSize="22"
            onChange={(e: SyntheticEvent<HTMLInputElement>) =>
              packingAction.setHovItemCount(parseInt(e.currentTarget.value))
            }
            value={packingState.hovItemCount}
            height={52}
            min={1}
            autoFocus
            onKeyDown={e => {
              if (e.key === actionBarcodes.Enter || e.keyCode === 13) {
                !handleDisable() && handleComplete();
              }
            }}
          />
          <Button
            onClick={() => handleComplete()}
            disabled={handleDisable()}
            height={52}
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

export default HovAddProductModal;
