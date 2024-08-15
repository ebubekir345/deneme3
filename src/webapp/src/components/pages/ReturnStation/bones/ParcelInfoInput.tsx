import { Box, Flex, Icon, Image, Input } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { GetCargoCarriersQueryOutputDTO, UpdateTrackingInfoCommand } from '../../../../services/swagger';
import useReturnStore, { ReturnModals } from '../../../../store/global/returnStore';
import { StoreState } from '../../../../store/initState';
import useRefState from '../../../../utils/useRefState';
import { ActionButton } from '../../../atoms/TouchScreen';
import { KeyboardWrapper } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen';

const ParcelInfoInput: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [returnState, returnAction] = useReturnStore();
  const [inputText, inputTextRef, setInputText] = useRefState({
    trackingId: '',
    cargoTrackingNumber: '',
    cargoCarrierName: '',
    fullName: '',
    phone: '',
    address: '',
    carrierId: '',
  });
  const [isCargoCarrierDropdownOpen, setIsCargoCarrierDropdownOpen] = useState(false);
  const [cargoCarrierList, setCargoCarrierList] = useState<any>();
  const [activeField, activeFieldRef, setActiveField] = useRefState('');
  const keyboard = useRef<any>(null);
  const cargoCarriers: Resource<GetCargoCarriersQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetCargoCarriers]
  );
  const updateTrackingInfoResponse = useSelector((state: StoreState) =>
    state.resources.updateTrackingInfo ? state.resources.updateTrackingInfo : null
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetCargoCarriers));
    setInputText({
      trackingId: returnState.parcelInfo.trackingId ? returnState.parcelInfo.trackingId : '',
      cargoTrackingNumber: returnState.parcelInfo.cargoTrackingNumber ? returnState.parcelInfo.cargoTrackingNumber : '',
      cargoCarrierName: returnState.parcelInfo.cargoCarrierName ? returnState.parcelInfo.cargoCarrierName : '',
      carrierId: returnState.parcelInfo.carrierId ? returnState.parcelInfo.carrierId : '',
      fullName: returnState.parcelInfo.fullName ? returnState.parcelInfo.fullName : '',
      phone: returnState.parcelInfo.phone ? returnState.parcelInfo.phone : '',
      address: returnState.parcelInfo.address ? returnState.parcelInfo.address : '',
    });
  }, []);

  useEffect(() => {
    keyboard.current.setInput(inputText[activeField]);
  }, [activeField]);

  useEffect(() => {
    if (!isCargoCarrierDropdownOpen) {
      setActiveField('');
    }
  }, [isCargoCarrierDropdownOpen]);

  useEffect(() => {
    if (updateTrackingInfoResponse?.error) {
      returnAction.toggleModalState(ReturnModals.GenericError, true);
    }
  }, [updateTrackingInfoResponse]);

  useEffect(() => {
    cargoCarriers?.data && setCargoCarrierList(cargoCarriers?.data);
  }, [cargoCarriers?.isSuccess]);

  const onUpdate = (input: UpdateTrackingInfoCommand) => {
    dispatch(resourceActions.resourceRequested(ResourceType.UpdateTrackingInfo, { input }));
    returnAction.setParcelInfo(input);
    returnAction.setSearchQueries({ ...returnState.searchQueries, recipientName: input.fullName as string });
    returnAction.setIsParcelInfoInputScreenOpen(false);
  };

  const onChangeTextInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputText({ ...inputText, [activeField]: e.currentTarget.value });
    keyboard.current.setInput(e.currentTarget.value);
  };

  const onKeyboardChange = (e: string) => {
    setInputText({ ...inputTextRef.current, [activeFieldRef.current]: e });
  };

  const buttons = [
    {
      title: t(`${intlKey}.ActionButtons.Cancel`),
      otherButtonProps: {
        onClick: () => returnAction.setIsParcelInfoInputScreenOpen(false),
        bg: 'transparent',
        color: 'palette.softBlue',
        border: 'solid 2px #5b8def',
      },
      dataCy: 'cancel-update-cargo-info',
    },
    {
      title: t(`${intlKey}.ActionButtons.Update`),
      otherButtonProps: {
        onClick: () => onUpdate(inputText),
        bg: 'palette.slate',
        color: 'palette.white',
        border: '0',
        opacity: Object.values(inputText).some((value: string) => value.trim() === '') ? 0.3 : 1,
        disabled: Object.values(inputText).some((value: string) => value.trim() === ''),
      },
      dataCy: 'update-cargo-info',
    },
  ];

  const inputFields = [
    {
      key: 'cargoCarrierName',
      placeholder: t(`${intlKey}.ReturnStation.ParcelInfo.UpdateModal.CargoCarrier`),
      dataCy: 'input-cargo-carrier',
    },
    {
      key: 'cargoTrackingNumber',
      placeholder: t(`${intlKey}.ReturnStation.ParcelInfo.UpdateModal.CargoTrackingNumber`),
      dataCy: 'input-cargo-tracking-number',
    },
    {
      key: 'fullName',
      placeholder: t(`${intlKey}.ReturnStation.ParcelInfo.UpdateModal.FullName`),
      dataCy: 'input-full-name',
    },
    {
      key: 'phone',
      placeholder: t(`${intlKey}.ReturnStation.ParcelInfo.UpdateModal.Phone`),
      dataCy: 'input-phone',
    },
    {
      key: 'address',
      placeholder: t(`${intlKey}.ReturnStation.ParcelInfo.UpdateModal.Address`),
      dataCy: 'input-address',
    },
  ];

  const commonInputProps = {
    width: 1,
    border: 'none',
    fontWeight: 500,
    fontFamily: 'base',
    letterSpacing: 'negativeLarge',
    color: 'transparent',
    textShadow: '0 0 0 #767896',
    outline: 'none',
    lineHeight: 'medium',
    padding: '0',
    fontSize: '16',
    _focus: {
      outline: 'none',
    },
  };

  const onEnterKeyboard = () => {
    const currentActiveFieldIndex = inputFields.findIndex(field => field.key === activeField);
    if (currentActiveFieldIndex !== 3) {
      setActiveField(inputFields[activeField === '' ? 1 : currentActiveFieldIndex + 1].key);
    }
  };

  return (
    <>
      <Flex
        onClick={() => returnAction.setIsParcelInfoInputScreenOpen(false)}
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
        position="absolute"
        width={0.4}
        bg="palette.softGrey"
        borderRadius="8px"
        left={0}
        right={0}
        top="5%"
        mx="auto"
        p="30px 24px 32px 24px"
        flexDirection="column"
        zIndex={3}
      >
        <Flex justifyContent="space-between" alignItems="center" width={1}>
          <Box
            fontSize="20px"
            fontWeight="bold"
            lineHeight={1.4}
            letterSpacing="-0.5px"
            color="palette.hardBlue_darker"
          >
            {t(`${intlKey}.ReturnStation.ParcelInfo.UpdateModal.Title`)}
          </Box>
          <Box>
            {buttons.map((button, i) => (
              <ActionButton
                key={i.toString()}
                height="32px"
                borderRadius="16px"
                px="12"
                lineHeight="medium"
                fontWeight={700}
                letterSpacing="medium"
                ml={8}
                data-cy={button.dataCy}
                {...button.otherButtonProps}
              >
                {button.title}
              </ActionButton>
            ))}
          </Box>
        </Flex>
        {inputFields.map((field, i) => (
          <Box key={i.toString()} position="relative">
            <Flex
              onClick={() => {
                setActiveField(field.key);
                if (field.key === 'cargoCarrierName') {
                  setIsCargoCarrierDropdownOpen(!isCargoCarrierDropdownOpen);
                }
              }}
              bg="palette.white"
              borderRadius={field.key === 'cargoCarrierName' && isCargoCarrierDropdownOpen ? '8px 8px 0 0' : '8px'}
              width={1}
              height="56px"
              mt={16}
              p="10px 20px"
              justifyContent="space-between"
              alignItems="center"
              data-cy={field.dataCy}
            >
              <Flex width={1} flexDirection="column" justifyContent="center">
                <Box
                  fontSize={
                    (activeField === field.key || inputText[field.key]) &&
                    !(field.key === 'cargoCarrierName' && inputText[field.key] === '')
                      ? '12'
                      : '16'
                  }
                  fontWeight={700}
                  lineHeight="large"
                  letterSpacing="small"
                  color="palette.snow_darker"
                  transition="all 0.25s"
                >
                  {field.placeholder}
                </Box>
                {(activeField === field.key || inputText[field.key]) &&
                  !(field.key === 'cargoCarrierName' && inputText[field.key] === '') && (
                    <Input
                      autoFocus
                      name={field.key}
                      value={inputText[field.key]}
                      onChange={e => onChangeTextInput(e)}
                      height="20px"
                      {...commonInputProps}
                    />
                  )}
              </Flex>
              {field.key === 'cargoCarrierName' && (
                <Icon name="far fa-angle-down" fontSize={24} color="palette.blue_lighter" />
              )}
            </Flex>
            {field.key === 'cargoCarrierName' && isCargoCarrierDropdownOpen && (
              <Box
                position="absolute"
                width="100%"
                zIndex={4}
                borderRadius="0 0 8px 8px"
                maxHeight="270px"
                overflow="auto"
                style={{ userSelect: 'none' }}
                borderTop="solid 1px #cbd5e0"
                data-cy="cargo-carriers-dropdown"
              >
                {cargoCarrierList &&
                  cargoCarrierList.map((cargoCarrier, k, arr) => {
                    return (
                      <Flex
                        key={k.toString()}
                        onClick={() => {
                          setInputText({
                            ...inputText,
                            cargoCarrierName: cargoCarrier.cargoCarrierName,
                            carrierId: cargoCarrier.carrierId,
                          });
                          setIsCargoCarrierDropdownOpen(false);
                        }}
                        position="relative"
                        bg="palette.white"
                        height="56px"
                        alignItems="center"
                        px={22}
                        borderRadius={arr.length - 1 === k ? '0 0 8px 8px' : '0'}
                      >
                        <Image
                          src={cargoCarrier.carrierImageUrl}
                          width="20px"
                          height="20px"
                          borderRadius="full"
                          mr={16}
                          boxShadow="small"
                        />
                        <Box fontWeight={500} color="palette.slate_dark" letterSpacing="negativeLarge">
                          {cargoCarrier.cargoCarrierName}
                        </Box>
                      </Flex>
                    );
                  })}
              </Box>
            )}
          </Box>
        ))}
      </Flex>
      <KeyboardWrapper
        keyboardRef={keyboard}
        onClose={() => {
          returnAction.setIsParcelInfoInputScreenOpen(false);
        }}
        onChange={onKeyboardChange}
        onEnter={() => onEnterKeyboard()}
      />
    </>
  );
};

export default ParcelInfoInput;
