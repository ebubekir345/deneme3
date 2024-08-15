import { Box, Flex, Icon, Image } from '@oplog/express';
import { resourceActions, resourceSelectors } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { VasPanel } from '.';
import { ResourceType } from '../../../../models';
import usePackingStore, { PackingModals } from '../../../../store/global/packingStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import WarningModal from '../../../molecules/WarningModal/WarningModal';
import MissingItemPanel from './MissingItemPanel';
import OrderItemPanel from './OrderItemPanel';
import PickingTrolleyInfo from './PickingTrolleyInfo';

interface IInProgressOrderPanel {
  isCompletePacking: Boolean;
  setIsCompletePacking: Function;
}

const InProgressOrderPanel: React.FC<IInProgressOrderPanel> = ({ isCompletePacking, setIsCompletePacking }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = usePackingStore();
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [isAnyBoxEmpty, setIsAnyBoxEmpty] = useState(true);
  const [emptyBoxErrorModal, setEmptyBoxErrorModal] = useState(false);

  const isCompletePackingBusy = useSelector((state: StoreState) =>
    resourceSelectors.isBusy(state.resources, ResourceType.CompletePackingProcess)
  );
  const isCompleteQuarantineBusy = useSelector((state: StoreState) =>
    resourceSelectors.isBusy(state.resources, ResourceType.CompletePackingQuarantineProcess)
  );

  useEffect(() => {
    const isOrderCompletedCheck =
      packingState.orderItems.reduce((accumulator, orderItem) => accumulator + orderItem.boxedCount, 0) ===
        packingState.orderItems.reduce((accumulator, orderItem) => accumulator + orderItem.amountInOrder, 0) &&
      packingState.orderItems.reduce((accumulator, orderItem) => accumulator + orderItem.amountInOrder, 0) !== 0;

    const isVasCompletedCheck =
      packingState.vasItems.reduce((accumulator, vasItem) => accumulator + vasItem.boxedCount, 0) ===
      packingState.vasItems.reduce((accumulator, vasItem) => accumulator + vasItem.amountInOrder, 0);

    setIsOrderCompleted(isOrderCompletedCheck && isVasCompletedCheck);
  }, [packingState.orderItems, packingState.vasItems]);

  useEffect(() => {
    boxesEmptyControl();
  }, [packingState.boxItems]);

  useEffect(() => {
    if (isCompletePacking && isOrderCompleted) {
      if (!isAnyBoxEmpty) {
        if (!packingState.isMissing && !packingState.isCancelled) {
          onCompletePacking();
        }
      } else {
        setEmptyBoxErrorModal(true);
      }
    } else if (isCompletePacking) {
      packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Error,
        text: t(`TouchScreen.Barcode.Error`),
      });
    }
    setIsCompletePacking(false);
  }, [isCompletePacking]);

  const onCompletePacking = () => {
    const cargoPackages = packingState.boxItems.reduce((accumulator, boxItem) => {
      if (boxItem.content.length) {
        return [
          ...accumulator,
          {
            cargoPackageTypeBarcode: boxItem.title,
            cargoPackageIndex: boxItem.cargoPackageIndex,
            packingItems: boxItem.content.reduce((packingAccumulator, packingItem) => {
              const amount = packingItem.count;
              const { productId } = packingItem;
              const serialNumbers = packingItem.serialNumbers;
              if (packingItem.serialNumbers) {
                return [...packingAccumulator, { amount, productId, serialNumbers }];
              } else {
                return [...packingAccumulator, { amount, productId }];
              }
            }, []),
          },
        ];
      }
      return [...accumulator];
    }, []);
    const vasItems = packingState.vasItems.map(vasItem => ({ barcode: vasItem.barcode }));

    dispatch(
      resourceActions.resourceRequested(ResourceType.CompletePackingProcess, {
        params: {
          pickingToteLabel: packingState.orderBasket,
          packages: cargoPackages,
          insertToPackageVAS: vasItems,
          packingAddressLabel: packingState.station.label,
        },
      })
    );
    dispatch(
      resourceActions.resourceRequested(ResourceType.PrintUnprintedPalettePackingList, {
        payload: { salesOrderId: packingState.orderId },
      })
    );
    packingAction.setBarcodeData('');
  };

  const boxesEmptyControl = () => {
    let isEmpty = new Array<boolean>();
    packingState.boxItems.map(boxItem => {
      boxItem.content.length === 0 ? isEmpty.push(true) : isEmpty.push(false);
    });
    isEmpty.includes(true) ? setIsAnyBoxEmpty(true) : setIsAnyBoxEmpty(false);
  };

  const productProcessed = packingState.orderItems.reduce((a, c) => a + (c.boxedCount ? c.boxedCount : 0), 0);
  return (
    <>
      <PickingTrolleyInfo />
      <Box my={22} height={1} backgroundColor="palette.grey_light" />
      {!packingState.isMissing && !packingState.isCancelled && packingState.vasItems.length !== 0 && <VasPanel />}
      <OrderItemPanel />
      {packingState.missingItems.length !== 0 && <MissingItemPanel />}
      <WarningModal
        isOpen={emptyBoxErrorModal}
        setModal={setEmptyBoxErrorModal}
        header={t(`TouchScreen.EmptyBoxErrorModal.ErrorModalHeader`)}
        subHeader={t(`TouchScreen.EmptyBoxErrorModal.ErrorModalSubHeader`)}
      />
      <Flex mt={32} height={38}>
        {!packingState.isMissing && !packingState.isCancelled && (
          <Flex width={1} p={60} justifyContent="center" alignItems="center" borderRadius={'md'} bg="palette.blue_dark">
            <Flex
              height={96}
              width={180}
              mr={86}
              backgroundColor={isCompletePackingBusy ? 'palette.grey' : 'palette.white'}
              borderRadius={'md'}
              border="none"
              alignItems="center"
              justifyContent="center"
              opacity={isOrderCompleted ? 1 : 0.2}
              disabled={!isOrderCompleted || isCompletePackingBusy}
            >
              <Image width={150} src="/images/enter-barcode.png" alt="enter-barcode" />
            </Flex>
            <ActionButton
              onClick={() => (isAnyBoxEmpty ? setEmptyBoxErrorModal(true) : onCompletePacking())}
              height={72}
              width={280}
              backgroundColor={isCompletePackingBusy ? 'palette.grey' : 'palette.white'}
              color={isCompletePackingBusy ? 'palette.steel_light' : 'palette.slate'}
              fontSize={32}
              borderRadius={'md'}
              fontWeight="500"
              bs="small"
              border="none"
              cursor={isCompletePackingBusy ? 'not-allowed' : 'pointer'}
              opacity={isOrderCompleted ? 1 : 0.2}
              disabled={!isOrderCompleted || isCompletePackingBusy}
            >
              {t(`TouchScreen.ActionButtons.CompletePacking`)}
            </ActionButton>
          </Flex>
        )}
        {(packingState.isMissing || packingState.isCancelled) && (
          <ActionButton
            onClick={() => packingAction.toggleModalState(PackingModals.CompleteQuarantine)}
            height={38}
            borderRadius="md"
            width={1}
            boxShadow="small"
            backgroundColor="palette.softBlue"
            fontSize="16"
            letterSpacing="negativeLarge"
            color="palette.white"
            border="none"
            opacity={(packingState.isMissing && packingState.boxItems.length) || productProcessed > 0 ? 1 : 0.2}
            disabled={
              !(
                (packingState.isMissing && packingState.boxItems.length) ||
                productProcessed > 0 ||
                isCompleteQuarantineBusy
              )
            }
            data-cy="complete-quarantine-button"
          >
            {t(`TouchScreen.ActionButtons.CompleteQuarantine`)}
            <Icon name="fal fa-arrow-right" fontSize="18" color="palette.white" ml={14} />
          </ActionButton>
        )}
      </Flex>
    </>
  );
};

export default InProgressOrderPanel;
