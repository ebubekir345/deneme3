import { Box, BoxProps, Flex, Icon, Image } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  CreateUndefinedReturnPackageCommand,
  OperationOutputDTO,
  ProductDetailsWithOperationOutputDTO,
} from '../../../../services/swagger';
import useReturnStore, { initialReturnState, ReturnModals } from '../../../../store/global/returnStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import { KeyboardWrapper } from '../../../molecules/TouchScreen';

interface ProductInfoInputInterface {
  productBarcodes: string[];
  operations: OperationOutputDTO[];
}

enum FieldKey {
  CargoCarrier = 'cargoCarrierName',
  TrackingId = 'trackingId',
  CargoTrackingNumber = 'cargoTrackingNumber',
  FullName = 'fullName',
  Phone = 'phone',
  Address = 'address',
  ProductBarcodes = 'productBarcodes',
  Operations = 'operations',
}

const intlKey = 'TouchScreen';

const UndefinedReturnInputScreen: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [returnState, returnAction] = useReturnStore();
  const [productInfoInput, setProductInfoInput] = useState<ProductInfoInputInterface>({
    productBarcodes: [],
    operations: [],
  });
  const [keyboardText, setKeyboardText] = useState('');
  const [isOperationsDropdownOpen, setIsOperationsDropdownOpen] = useState(false);
  const [filteredOperationListByProductBarcodes, setFilteredOperationListByProductBarcodes] = useState<any>([]);
  const keyboard = useRef<any>(null);

  const createUndefinedReturnPackageResponse = useSelector((state: StoreState) =>
    state.resources.createUndefinedReturnPackage ? state.resources.createUndefinedReturnPackage : null
  );
  const operationsListByProductBarcodes: Resource<ProductDetailsWithOperationOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ListOperationsByProductBarcodes]
  );

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.CreateUndefinedReturnPackage));
    };
  }, []);

  useEffect(() => {
    setProductInfoInput({
      productBarcodes: returnState.undefinedReturnValidProductBarcodes,
      operations:
        (returnState.undefinedReturnValidProductBarcodes.length && filteredOperationListByProductBarcodes) || [],
    });
  }, [filteredOperationListByProductBarcodes, returnState.undefinedReturnValidProductBarcodes]);

  useEffect(() => {
    if (createUndefinedReturnPackageResponse?.isSuccess) {
      returnAction.clearState(initialReturnState);
    }
    if (createUndefinedReturnPackageResponse?.error) {
      returnAction.setIsUndefinedReturnInputScreenOpen(false);
      returnAction.toggleModalState(ReturnModals.GenericError, true);
    }
  }, [createUndefinedReturnPackageResponse]);

  useEffect(() => {
    if (returnState.undefinedReturnProductBarcodes.length) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.ListOperationsByProductBarcodes, {
          barcodes: returnState.undefinedReturnProductBarcodes.join(),
        })
      );
    } else {
      returnAction.setUndefinedReturnValidProductBarcodes([]);
    }
  }, [returnState.undefinedReturnProductBarcodes]);

  useEffect(() => {
    if (operationsListByProductBarcodes?.isSuccess) {
      const flattedOperationsListByProductBarcodes = operationsListByProductBarcodes.data
        ? operationsListByProductBarcodes.data
            .filter((arr, index, self) => index === self.findIndex(t => t.operation?.id === arr.operation?.id))
            .flatMap(product => (product.operation ? product.operation : []))
        : [];
      setFilteredOperationListByProductBarcodes(flattedOperationsListByProductBarcodes);
      const barcodesWithOperation = Array.from(
        new Set(
          operationsListByProductBarcodes.data
            ?.map(product => (product.barcodes ? product.barcodes : []))
            .flat(Infinity)
        )
      );
      if (returnState.undefinedReturnProductBarcodes.every(barcode => barcodesWithOperation.includes(barcode))) {
        returnAction.setUndefinedReturnValidProductBarcodes(returnState.undefinedReturnProductBarcodes);
      } else {
        returnAction.setUndefinedReturnValidProductBarcodes(
          returnState.undefinedReturnProductBarcodes.filter(barcode => barcodesWithOperation.includes(barcode))
        );

        returnAction.callInfoMessageBox({
          state: InfoMessageBoxState.Error,
          text: t(`${intlKey}.Barcode.Error`),
        });
      }
    }
    if (operationsListByProductBarcodes?.error) {
      returnAction.setIsUndefinedReturnInputScreenOpen(false);
      returnAction.toggleModalState(ReturnModals.GenericError, true);
    }
  }, [operationsListByProductBarcodes]);

  const onKeyboardTextChange = (e: string) => {
    setKeyboardText(e);
  };

  const onClose = () => {
    returnAction.setIsUndefinedReturnInputScreenOpen(false);
    returnAction.setUndefinedReturnProductBarcodes([]);
  };

  const onSave = (input: CreateUndefinedReturnPackageCommand) => {
    const payload = {
      ...input,
      productIds: operationsListByProductBarcodes.data?.map(product => product.id),
    };
    dispatch(resourceActions.resourceRequested(ResourceType.CreateUndefinedReturnPackage, { payload }));
  };

  const onUpdateProductBarcodeList = (barcodes: string[]) => {
    returnAction.setUndefinedReturnProductBarcodes(barcodes);
  };

  const buttons = [
    {
      title: t(`${intlKey}.ActionButtons.Cancel`),
      otherButtonProps: {
        onClick: () => onClose(),
        bg: 'transparent',
        color: 'palette.softBlue',
        border: 'solid 1px #5b8def',
      },
      dataCy: 'cancel-update-cargo-info',
    },
    {
      title: t(`${intlKey}.ActionButtons.Save`),
      otherButtonProps: {
        onClick: () =>
          onSave({
            trackingId: returnState.parcelInfo.trackingId,
            operationIds: productInfoInput.operations.map(operation => operation.id) as string[],
          }),
        bg: 'palette.slate',
        color: 'palette.white',
        border: '0',
        opacity: Object.keys(productInfoInput).filter(key => productInfoInput[key].length === 0).length ? 0.3 : 1,
        disabled: Object.keys(productInfoInput).filter(key => productInfoInput[key].length === 0).length,
      },
    },
  ];

  const cargoInfo = [
    {
      key: FieldKey.CargoCarrier,
      placeholder: t(`${intlKey}.ReturnStation.UndefinedReturn.CargoCarrier`),
    },
    {
      key: FieldKey.TrackingId,
      placeholder: t(`${intlKey}.ReturnStation.UndefinedReturn.TrackingId`),
    },
    {
      key: FieldKey.CargoTrackingNumber,
      placeholder: t(`${intlKey}.ReturnStation.UndefinedReturn.CargoTrackingNumber`),
    },
  ];

  const senderInfo = [
    {
      key: FieldKey.FullName,
    },
    {
      key: FieldKey.Phone,
    },
    {
      key: FieldKey.Address,
    },
  ];

  const productInfo = [
    {
      key: FieldKey.ProductBarcodes,
      placeholder: t(`${intlKey}.ReturnStation.UndefinedReturn.Products`),
    },
    {
      key: FieldKey.Operations,
      placeholder: t(`${intlKey}.ReturnStation.UndefinedReturn.Operations`),
    },
  ];

  const onKeyboardEnter = () => {
    if (keyboardText.length) {
      onUpdateProductBarcodeList([...returnState.undefinedReturnValidProductBarcodes, keyboardText]);
      setKeyboardText('');
      keyboard.current.setInput('');
    }
  };

  const InfoRow = (field, containerProps: BoxProps) => {
    return (
      <Box position="relative" key={field.key}>
        <Flex
          bg="palette.white"
          borderRadius="md"
          width={1}
          height="56px"
          p="10px 20px"
          justifyContent="space-between"
          alignItems="center"
          {...containerProps}
        >
          <Flex width={1} flexDirection="column" justifyContent="center">
            <Box
              fontSize="12"
              fontWeight={700}
              lineHeight="large"
              letterSpacing="small"
              color="palette.snow_darker"
              transition="all 0.25s"
            >
              {field.placeholder}
            </Box>

            <Box
              width={1}
              border="none"
              fontWeight={500}
              fontFamily="base"
              letterSpacing="negativeLarge"
              color="palette.slate"
              textShadow="0 0 0 palette.purple_darker"
              outline="none"
              lineHeight="medium"
              p="0"
              fontSize="16"
            >
              {returnState.parcelInfo[field.key]}
            </Box>
          </Flex>
        </Flex>
      </Box>
    );
  };

  const ProductInfoInputRow = field => {
    return (
      <Box position="relative" key={field.key}>
        <Flex
          onClick={e => {
            e.stopPropagation();
            if (field.key === FieldKey.Operations) {
              setIsOperationsDropdownOpen(!isOperationsDropdownOpen);
            }
          }}
          bg="palette.white"
          borderRadius={field.key === FieldKey.Operations && isOperationsDropdownOpen ? '8px 8px 0 0' : 'md'}
          width={1}
          height="56px"
          mt={16}
          p="10px 20px"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex justifyContent="space-between" alignItems="center" width="100%">
            {field.key === FieldKey.ProductBarcodes ? (
              <Box
                fontSize="16"
                letterSpacing="small"
                color={
                  (productInfoInput[field.key]?.length || keyboardText.length,
                  'palette.purple_darker',
                  'palette.softGrey_darker')
                }
              >
                <Box
                  fontSize={productInfoInput[field.key]?.length || keyboardText.length ? '12' : '16'}
                  color={
                    productInfoInput[field.key]?.length || keyboardText.length
                      ? 'palette.purple_darker'
                      : 'palette.snow_darker'
                  }
                  fontWeight={productInfoInput[field.key]?.length || keyboardText.length ? 700 : 500}
                  lineHeight={productInfoInput[field.key]?.length || keyboardText.length ? 'large' : 'medium'}
                  transition="all 0.25s"
                  letterSpacing={(productInfoInput[field.key]?.length || keyboardText.length) && 'large'}
                >
                  {field.placeholder}
                </Box>
                <Flex flexWrap="wrap">
                  {productInfoInput.productBarcodes.map((barcode, j) => (
                    <Flex
                      key={j.toString()}
                      fontFamily="SpaceMono"
                      height="20px"
                      borderRadius="sm"
                      bg="palette.softGrey"
                      color="palette.hardBlue_darker"
                      ml={j !== 0 ? 4 : 0}
                      mb={4}
                      px={4}
                      alignItems="center"
                    >
                      {barcode}
                    </Flex>
                  ))}
                  {keyboardText && (
                    <Box
                      height="20px"
                      border="none"
                      fontWeight={500}
                      fontFamily="base"
                      letterSpacing="negativeLarge"
                      color="transparent"
                      textShadow="0 0 0 palette.purple_darker"
                      outline="none"
                      lineHeight="medium"
                      p="0"
                      fontSize="16"
                      ml={productInfoInput.productBarcodes.length ? 4 : 0}
                    >
                      {keyboardText}
                    </Box>
                  )}
                </Flex>
              </Box>
            ) : (
              <Box
                fontSize="16"
                letterSpacing="small"
                color={(productInfoInput[field.key]?.length, 'palette.purple_darker', 'palette.softGrey_darker')}
              >
                <Box
                  fontSize={productInfoInput[field.key]?.length ? '12' : '16'}
                  color={productInfoInput[field.key]?.length ? 'palette.purple_darker' : 'palette.snow_darker'}
                  fontWeight={productInfoInput[field.key]?.length ? 700 : 500}
                  lineHeight={productInfoInput[field.key]?.length ? 'large' : 'medium'}
                  transition="all 0.25s"
                  letterSpacing={productInfoInput[field.key]?.length && 'large'}
                >
                  {field.placeholder}
                </Box>
                {productInfoInput[field.key]?.length ? (
                  <Box
                    height="20px"
                    width={1}
                    border="none"
                    fontWeight={500}
                    fontFamily="base"
                    letterSpacing="negativeLarge"
                    color="transparent"
                    textShadow="0 0 0 palette.purple_darker"
                    outline="none"
                    lineHeight="small"
                    p="0"
                    fontSize="16"
                  >
                    {productInfoInput[field.key].map(operation => operation.name).join()}
                  </Box>
                ) : null}
              </Box>
            )}
          </Flex>
          {field.key === FieldKey.Operations && (
            <Icon name="far fa-angle-down" fontSize={24} color="palette.blue_lighter" />
          )}
          <Flex alignItems="center">
            {productInfoInput[field.key]?.length ? (
              <ActionButton
                onClick={() => {
                  field.key === FieldKey.ProductBarcodes && onUpdateProductBarcodeList([]);
                  setProductInfoInput({ ...productInfoInput, operations: [] });
                  setIsOperationsDropdownOpen(false);
                }}
                height="24px"
                width="24px"
                border="none"
                borderRadius="full"
                bg="palette.softGrey"
                flexShrink={0}
                ml={11}
              >
                <Icon name="fas fa-times" fontSize="16" color="palette.blue_lighter" />
              </ActionButton>
            ) : null}
          </Flex>
        </Flex>

        {field.key === FieldKey.Operations && isOperationsDropdownOpen && (
          <Box
            position="absolute"
            width="100%"
            zIndex={4}
            borderRadius="0 0 8px 8px"
            maxHeight="270px"
            overflow="auto"
            style={{ userSelect: 'none' }}
            borderTop="solid 1px #cbd5e0"
          >
            {returnState.undefinedReturnValidProductBarcodes.length !== 0 &&
              filteredOperationListByProductBarcodes.map((operation, k, arr) => {
                const isChecked =
                  productInfoInput.operations.filter(checkedOperation => checkedOperation.id === operation?.id)
                    .length !== 0;
                return (
                  <Flex
                    key={k.toString()}
                    onClick={e => {
                      e.stopPropagation();
                      if (isChecked) {
                        setProductInfoInput({
                          ...productInfoInput,
                          operations: productInfoInput.operations.filter(
                            checkedOperation => checkedOperation.id !== operation?.id
                          ),
                        });
                      } else {
                        operation &&
                          setProductInfoInput({
                            ...productInfoInput,
                            operations: [...productInfoInput.operations, operation],
                          });
                      }
                    }}
                    position="relative"
                    bg={isChecked ? 'palette.softGrey' : 'palette.white'}
                    height="56px"
                    alignItems="center"
                    px={22}
                    justifyContent="space-between"
                    borderRadius={arr.length - 1 === k ? '0 0 8px 8px' : '0'}
                  >
                    <Flex alignItems="center">
                      <Image
                        src={operation.imageUrl}
                        width="20px"
                        height="20px"
                        borderRadius="full"
                        mr={16}
                        boxShadow="small"
                      />
                      <Box fontWeight={500} color="palette.slate_dark" letterSpacing="negativeLarge">
                        {operation.name}
                      </Box>
                    </Flex>
                  </Flex>
                );
              })}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Flex
        onClick={() => onClose()}
        bg="palette.black"
        position="absolute"
        top={0}
        left={0}
        width={1}
        height="100%"
        opacity={0.6}
        zIndex={2}
      />
      <Flex
        onClick={e => {
          e.stopPropagation();
          setIsOperationsDropdownOpen(false);
        }}
        position="absolute"
        width={0.6}
        bg="palette.softGrey"
        borderRadius="md"
        left={0}
        right={0}
        top="5%"
        mx="auto"
        p="30px 20px 24px 24px"
        flexDirection="column"
        zIndex={4}
      >
        <Flex justifyContent="space-between" alignItems="center" width={1}>
          <Box
            fontSize={22}
            fontWeight={700}
            lineHeight="xLarge"
            letterSpacing="negativeLarge"
            color="palette.hardBlue_darker"
          >
            {t(`${intlKey}.ReturnStation.UndefinedReturn.Title`)}
          </Box>
          <Box>
            {buttons.map((button, i) => (
              <ActionButton
                key={i.toString()}
                height="32px"
                borderRadius="16px"
                px="11"
                lineHeight="medium"
                fontWeight={700}
                letterSpacing="medium"
                ml={8}
                {...button.otherButtonProps}
              >
                {button.title}
              </ActionButton>
            ))}
          </Box>
        </Flex>
        <Flex flexWrap="wrap" mt={16}>
          <Box width={0.5} borderRight="xs" borderColor="palette.grey_light" pr={30}>
            {cargoInfo.map((field, i) => InfoRow(field, { mt: i === 0 ? 0 : 16 }))}
            {productInfo.map(field => ProductInfoInputRow(field))}
          </Box>
          <Box width={0.5} pl={30}>
            <Box
              fontSize={16}
              fontWeight={700}
              letterSpacing="negativeLarge"
              color="palette.hardBlue_darker"
              mt={16}
              mb={32}
            >
              {t(`${intlKey}.ReturnStation.UndefinedReturn.SenderInfo`)}
            </Box>
            {senderInfo.map((field, i) =>
              InfoRow(field, { mt: i === 0 ? 0 : 11, height: i + 1 === senderInfo.length ? '100px' : '41px' })
            )}
          </Box>
        </Flex>
      </Flex>
      <KeyboardWrapper
        keyboardRef={keyboard}
        onClose={() => {
          onClose();
        }}
        onChange={onKeyboardTextChange}
        onEnter={() => onKeyboardEnter()}
      />
    </>
  );
};

export default UndefinedReturnInputScreen;
