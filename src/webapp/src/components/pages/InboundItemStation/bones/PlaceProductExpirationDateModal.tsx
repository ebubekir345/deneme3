import { Button, Flex, Icon, InputFormat, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { OrderItem } from '.';
import { ResourceType } from '../../../../models';
import {
  PlaceItemToQuarantineToteForWebReceivingOutputDTO,
  PlaceItemToReceivingToteForWebReceivingOutputDTO,
} from '../../../../services/swagger/api';
import useInboundItemStationStore from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import { ProblemReportButton } from '../../../atoms/ProblemReportButton';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';

const intlKey = 'TouchScreen';

const format = [
  { char: /[0-3]/, repeat: 1 },
  { char: /[0-9]/, repeat: 1 },
  { exactly: '-' },
  { char: /[0-1]/, repeat: 1 },
  { char: /[0-9]/, repeat: 1 },
  { exactly: '-' },
  { char: /[2]/, repeat: 1 },
  { char: /[0]/, repeat: 1 },
  { char: /[2-9]/, repeat: 1 },
  { char: /[0-9]/, repeat: 1 },
];

interface IPlaceProductExpirationDateModal {
  barcodeTestInput: string;
}

const PlaceProductExpirationDateModal: React.FC<IPlaceProductExpirationDateModal> = ({ barcodeTestInput }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const [dateInput, setDateInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDateValidate, setIsDateValidate] = useState(false);
  const [skuDateList, setSkuDateList] = useState([
    {
      sku: '',
      date: '',
    },
  ]);
  let today = moment(new Date(), 'DD-MM-YYYY');
  let input = moment(dateInput, 'DD-MM-YYYY');

  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );
  const placeItemToQuarantineToteResponse: Resource<PlaceItemToQuarantineToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToQuarantineTote]
  );

  useEffect(() => {
    handleDateCheck();
  }, [dateInput]);

  useEffect(() => {
    if (placeItemToReceivingToteResponse?.data?.isExpirationDateRequiredProduct && isModalOpen) {
      if (inboundStationState.barcodeData !== 'OKAY') {
        inboundStationState.barcodeData !== placeItemToReceivingToteResponse?.data?.productDetails?.barcodes
          ? setDateInput(inboundStationState.barcodeData)
          : '';
      }
      if (inboundStationState.barcodeData == 'OKAY' && isDateValidate) {
        completeProductExpirationDate();
      }
    }
  }, [isModalOpen, inboundStationState.barcodeData]);

  useEffect(() => {
    if (placeItemToReceivingToteResponse?.isSuccess == true && placeItemToReceivingToteResponse?.data) {
      if (placeItemToReceivingToteResponse?.data?.isExpirationDateRequiredProduct) {
        setIsModalOpen(true);
        skuDateList.map(product => {
          if (product.sku === placeItemToReceivingToteResponse?.data?.productDetails?.sku) {
            setDateInput(product.date);
          }
        });
      } else {
        setIsModalOpen(false);
      }
    }
  }, [placeItemToReceivingToteResponse]);

  const completeProductExpirationDate = () => {
    let tempDate = dateInput;
    let dateArray = tempDate.split('-');
    tempDate = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2];
    let tempSkuDateList = skuDateList;
    if (
      skuDateList.filter(product => product.sku == placeItemToReceivingToteResponse?.data?.productDetails?.sku).length <
      1
    ) {
      placeItemToReceivingToteResponse?.data?.productDetails?.sku &&
        tempSkuDateList.push({
          sku: placeItemToReceivingToteResponse?.data?.productDetails?.sku,
          date: dateInput,
        });
    } else {
      tempSkuDateList = skuDateList.filter(
        product => product.sku !== placeItemToReceivingToteResponse?.data?.productDetails?.sku
      );
      placeItemToReceivingToteResponse?.data?.productDetails?.sku &&
        tempSkuDateList.push({
          sku: placeItemToReceivingToteResponse?.data?.productDetails?.sku,
          date: dateInput,
        });
    }
    setSkuDateList(tempSkuDateList);
    dispatch(
      resourceActions.resourceRequested(ResourceType.PlaceItemToReceivingTote, {
        params: {
          webReceivingProcessId: inboundStationState.receivingProcessId,
          productBarcode: inboundStationState.productLabel,
          receivingAddress: inboundStationState.station.label,
          expirationDate: tempDate,
        },
      })
    );
    setDateInput('');
  };

  const handleDateCheck = () => {
    let tempDate = dateInput.split('-').map(item => {
      return parseInt(item);
    });
    if (
      dateInput !== '' &&
      dateInput.length === 10 &&
      tempDate[0] <= 31 &&
      tempDate[1] <= 12 &&
      tempDate[2] >= 2022 &&
      moment(input).isAfter(moment(today))
    ) {
      setIsDateValidate(true);
    } else {
      setIsDateValidate(false);
    }
  };

  const InputWarning = () => {
    let errorField = '';
    let tempDate = dateInput.split('-').map(item => {
      return parseInt(item);
    });
    if (moment(input).isBefore(moment(today)) && dateInput.length == 10) {
      return t(`${intlKey}.InboundItemStation.PlaceProductExpirationDateModal.ErrorOldeExpirationDate`);
    } else if (tempDate[0] > 31) {
      errorField = t(`${intlKey}.InboundItemStation.PlaceProductExpirationDateModal.ErrorDayLabel`);
    } else if (tempDate[1] > 12) {
      errorField = t(`${intlKey}.InboundItemStation.PlaceProductExpirationDateModal.ErrorMonthLabel`);
    } else if (tempDate[2] < 2022 && dateInput.length == 10) {
      errorField = t(`${intlKey}.InboundItemStation.PlaceProductExpirationDateModal.ErrorYearLabel`);
    } else {
      errorField = '';
    }
    if (errorField !== '') {
      return t(`${intlKey}.InboundItemStation.PlaceProductExpirationDateModal.DateInputErrorText`, {
        value: errorField,
      });
    } else return '';
  };

  const handleCancel = () => {
    dispatch(resourceActions.resourceInit(ResourceType.PlaceItemToReceivingTote));
    setIsModalOpen(false);
    setDateInput('');
    setIsDateValidate(false);
    inboundStationAction.setBarcodeData('');
  };

  return (
    <>
      <ModalBox
        onClose={() => {}}
        isOpen={
          isModalOpen && placeItemToReceivingToteResponse?.data && !placeItemToQuarantineToteResponse?.data
            ? true
            : false
        }
        width={640}
        contentBoxProps={{
          padding: '52px 36px 36px 36px',
          color: '#767896',
        }}
        icon={
          <Flex width={64} height={64} borderRadius="50%" bg="#E5F0FF" alignItems="center" justifyContent="center">
            <Icon name="far fa-calendar-exclamation" fontSize={32} color="#9DBFF9" />
          </Flex>
        }
        autoFocus
      >
        <Flex width={1} flexDirection="column" px={40} pb={32}>
          {placeItemToReceivingToteResponse?.isBusy ? (
            <Icon name={'far fa-spinner fa-spin'} fontSize="48" color={'palette.softBlue'} />
          ) : (
            <>
              <OrderItem />
              <Flex mb={32} mt={22} fontSize={24} justifyContent="left" flexDirection="column">
                {t(`${intlKey}.InboundItemStation.PlaceProductExpirationDateModal.SelectProductExpirationDateText`)}
              </Flex>
              <Flex flexDirection="row" justifyContent="center" alignItems="center" px={22}>
                <Icon name="far fa-calendar-alt" fontSize={32} mr={8} />
                <InputFormat
                  textAlign="center"
                  format={format}
                  placeholder={t(`${intlKey}.InboundItemStation.PlaceProductExpirationDateModal.DateInputPlaceHolder`)}
                  value={dateInput}
                  onChange={e => {
                    setDateInput(e);
                  }}
                  fontSize={22}
                />
                <Flex justifyContent="flex-end" alignSelf="start" mt={-12} ml={12}>
                  <ProblemReportButton
                    isDisabled={false}
                    handleClick={() => {
                      inboundStationAction.setReportExpirationDateModalOpen(true);
                    }}
                  />
                </Flex>
              </Flex>
              <Text width={1} mt={12}>
                {InputWarning()}
              </Text>
              <Flex flexDirection="row" justifyContent="center" mt={32}>
                <Button kind="outline" variant="alternative" mr={8} onClick={() => handleCancel()}>
                  {t(`${intlKey}.InboundItemStation.PlaceProductExpirationDateModal.CancelButton`)}
                </Button>
                <Button
                  disabled={!isDateValidate}
                  variant="alternative"
                  onClick={() => completeProductExpirationDate()}
                >
                  {t(`${intlKey}.InboundItemStation.PlaceProductExpirationDateModal.OkayButton`)}
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </ModalBox>
    </>
  );
};

export default PlaceProductExpirationDateModal;
