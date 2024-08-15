import { Button, Chip, Flex, Icon, Input } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { InternalErrorNumber } from '../../../../services/swagger';
import useHovPackingStore from '../../../../store/global/hovPackingStore';
import { StoreState } from '../../../../store/initState';
import { actionBarcodes } from '../../../../typings/globalStore/enums';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';
import OrderItem from './OrderItem';

export enum HovPackingModals {
  Logout = 'Logout',
  OrderStatus = 'OrderStatus',
  CompleteQuarantine = 'CompleteQuarantine',
  MissingItem = 'MissingItem',
  CargoPackagePick = 'CargoPackagePick',
  QuarantineAreaScan = 'QuarantineAreaScan',
  HovAddProduct = 'HovAddProduct',
  AddSerialNumber = 'AddSerialNumber',
  AddSimpleSerialNumber = 'AddSimpleSerialNumber',
}

const intlKey = 'TouchScreen';

const SimpleSerialNumberAddModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useHovPackingStore();
  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
  const [filteredSerialNumbers, setFilteredSerialNumbers] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null)
  const checkHOVSimpleSerialNumberResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CheckHOVSimpleSerialNumber]
  );
  const orderItemToBeAdded = packingState.orderItems.filter(orderItem =>
    orderItem.barcodes?.includes(packingState.barcodeData)
  )[0];
  const isMultipleSNReadActive = packingState.itemCountThreshold <= orderItemToBeAdded.amountInOrder ? true : false;

  useEffect(() => {
    packingAction.setProductSerialNo('');
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.CheckHOVSimpleSerialNumber));
    };
  }, []);

  useEffect(() => {
    if (checkHOVSimpleSerialNumberResponse?.isSuccess) {
      isMultipleSNReadActive
        ? setSerialNumbers([...serialNumbers, packingState.productSerialNo.trim()])
        : handleComplete();
      return packingAction.setProductSerialNo('');
    }
    if (checkHOVSimpleSerialNumberResponse?.error) {
      if (
        checkHOVSimpleSerialNumberResponse?.error.internalErrorNumber ===
          InternalErrorNumber.SimpleSerialNumberToteLabelCannotBeSimpleSerialNumber ||
        checkHOVSimpleSerialNumberResponse?.error.internalErrorNumber ===
          InternalErrorNumber.SimpleSerialNumberBarcodeCannotBeSimpleSerialNumber ||
        checkHOVSimpleSerialNumberResponse?.error.internalErrorNumber ===
          InternalErrorNumber.SimpleSerialNumberCargoPackageCannotBeSimpleSerialNumber
      ) {
        packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.HOVPackingStation.Error.NotASerialNumber`),
        });
      }
      if (
        checkHOVSimpleSerialNumberResponse?.error.internalErrorNumber ===
        InternalErrorNumber.SimpleSerialNumberIsUsedForAnotherSaleOrder
      ) {
        packingAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.HOVPackingStation.Error.SerialNumberScanned`),
        });
      }
      setIsDisabled(true)
      setTimeout(() => {
        packingAction.setProductSerialNo('');
        setIsDisabled(false)
        inputRef.current?.focus()
      }, 1000);
    }
  }, [checkHOVSimpleSerialNumberResponse]);

  useEffect(() => {
    searchText.trim()
      ? setFilteredSerialNumbers(
          serialNumbers.filter(serialNumber => serialNumber.toLowerCase().includes(searchText.toLowerCase().trim()))
        )
      : setFilteredSerialNumbers(serialNumbers);
  }, [searchText, serialNumbers]);

  useEffect(() => {
    packingState.barcodeData === actionBarcodes.Enter &&
      serialNumbers.length === packingState.hovItemCount &&
      handleComplete();
  }, [packingState.barcodeData]);

  const handleComplete = () => {
    packingAction.setHovItemCount(isMultipleSNReadActive ? serialNumbers.length : 1);
    dispatch(
      resourceActions.resourceRequested(ResourceType.QueueHovItemIntoCargoPackage, {
        params: {
          hovPackingProcessId: packingState.processId,
          productId: orderItemToBeAdded?.productId,
          packageIndex: packingState.boxItems.find(boxItem => boxItem.selected)?.cargoPackageIndex,
          amount: isMultipleSNReadActive ? serialNumbers.length : 1,
          simpleSerialNumbers: isMultipleSNReadActive ? serialNumbers : [packingState.productSerialNo.trim()],
          toteLabel: packingState.orderBasket,
        },
      })
    );
    packingAction.toggleModalState(HovPackingModals.AddSimpleSerialNumber, false);
  };

  const handleAddSerialNumber = () => {
    if (serialNumbers.includes(packingState.productSerialNo.trim()))
      return packingAction.callInfoMessageBox({
        state: InfoMessageBoxState.Error,
        text: t(`${intlKey}.HOVPackingStation.Error.AlreadyScannedSN`),
      });
    dispatch(
      resourceActions.resourceRequested(ResourceType.CheckHOVSimpleSerialNumber, {
        payload: {
          simpleSerialNumber: packingState.productSerialNo.trim(),
          sku: orderItemToBeAdded.sku,
          operationId: packingState.operation.id,
        },
      })
    );
  };

  return (
    <ModalBox
      onClose={() => {
        !isMultipleSNReadActive && packingAction.toggleModalState(HovPackingModals.AddSimpleSerialNumber, false);
      }}
      isOpen={packingState.modals.AddSimpleSerialNumber}
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
        <OrderItem
          key={orderItemToBeAdded.productId}
          product={orderItemToBeAdded}
          boxedSnItems={isMultipleSNReadActive ? serialNumbers.length : null}
          amountSnItems={isMultipleSNReadActive ? packingState.hovItemCount : null}
          onImageClicked={() => {}}
        />
        <Flex>
          <Input
            placeholder={t(`${intlKey}.HOVPackingStation.AddSerialNumberModal.SerialNumberInputLabel`)}
            type="string"
            fontWeight={700}
            fontSize={22}
            onChange={(e: SyntheticEvent<HTMLInputElement>) => packingAction.setProductSerialNo(e.currentTarget.value)}
            value={packingState.productSerialNo}
            disabled={serialNumbers.length === packingState.hovItemCount || isDisabled}
            height={52}
            maxLength={50}
            data-testid="input-box"
            autoFocus
            ref={inputRef}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === actionBarcodes.Enter || e.code === 'Enter') {
                packingState.productSerialNo.trim() && handleAddSerialNumber();
              }
            }}
          />
          <Button
            onClick={handleAddSerialNumber}
            disabled={!packingState.productSerialNo.trim() || serialNumbers.length === packingState.hovItemCount}
            height={52}
            ml={6}
            kind="solid"
            variant="alternative"
          >
            {t(`${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton`)}
          </Button>
        </Flex>
        {isMultipleSNReadActive && (
          <>
            <Flex width={1} flexDirection="column" my={22}>
              <Input
                placeholder={t(`${intlKey}.HOVPackingStation.AddSerialNumberModal.SimpleSearchText`)}
                type="string"
                fontSize={18}
                onChange={(e: SyntheticEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value)}
                value={searchText}
                height={44}
                data-testid="search-input"
              />
              <Flex
                alignItems="start"
                flexDirection="column"
                bg="palette.slate_lighter"
                height="15vh"
                p={6}
                overflow="auto"
              >
                {filteredSerialNumbers?.map((serialNo, index) => (
                  <Chip
                    key={index}
                    mb={4}
                    _first={{ ml: 6 }}
                    onRemove={() => {
                      setSearchText('');
                      setSerialNumbers(serialNumbers.filter(serialNumber => serialNumber !== serialNo));
                    }}
                    data-testid="search-result"
                  >
                    {serialNo}
                  </Chip>
                ))}
              </Flex>
            </Flex>
            <Button
              onClick={handleComplete}
              disabled={serialNumbers.length !== packingState.hovItemCount}
              height={52}
              kind="solid"
              variant="alternative"
              mt={22}
            >
              {t(`${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton`)}
            </Button>
          </>
        )}
      </Flex>
    </ModalBox>
  );
};

export default SimpleSerialNumberAddModal;
