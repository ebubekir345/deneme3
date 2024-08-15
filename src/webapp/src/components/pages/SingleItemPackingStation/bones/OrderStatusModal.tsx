import { Flex, Icon, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import {
  CompleteSingleItemPackingQuarantineProcessCommand,
  SingleItemSalesOrderState,
  SingleItemSalesOrderStateOutputDTO,
} from '../../../../services/swagger';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen.SingleItemPackingStation.Order';

const OrderStatusModal: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useSingleItemPackingStore();
  const getSingleItemSalesOrderStateResponse: Resource<SingleItemSalesOrderStateOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSingleItemSalesOrderState]
  );

  const completeSingleItemPackingQuarantineProcess = (params: CompleteSingleItemPackingQuarantineProcessCommand) => {
    dispatch(resourceActions.resourceRequested(ResourceType.CompleteSingleItemPackingQuarantineProcess, { params }));
  };

  const headerMap = () => {
    switch (getSingleItemSalesOrderStateResponse?.data?.state) {
      case SingleItemSalesOrderState.ToteNotContainsThisProduct:
        return t(`${intlKey}.ToteNotContainsThisProduct`);
      case SingleItemSalesOrderState.SalesOrderStateNotSuitableForPacking:
        return t(`${intlKey}.SalesOrderStateNotSuitableForPacking`);
      case SingleItemSalesOrderState.Cancelled:
        return t(`${intlKey}.Cancelled`);
    }
    return '';
  };

  useEffect(() => {
    if (packingState.quarantineAddressLabel) {
      completeSingleItemPackingQuarantineProcess({
        salesOrderId: packingState.orderId,
        quarantineToteLabel: packingState.quarantineToteLabel,
        quarantineAddressLabel: packingState.quarantineAddressLabel,
      });
    }
  }, [packingState.quarantineAddressLabel]);

  return (
    <ModalBox
      onClose={() => null}
      isOpen={packingState.modals.OrderStatus}
      width={700}
      headerText={headerMap()}
      icon={
        <Icon
          name={
            getSingleItemSalesOrderStateResponse?.data?.state === SingleItemSalesOrderState.Cancelled
              ? 'fal fa-exclamation-circle'
              : 'fal fa-barcode-scan'
          }
          fontSize="64px"
          color={
            getSingleItemSalesOrderStateResponse?.data?.state === SingleItemSalesOrderState.Cancelled
              ? 'palette.red_darker'
              : '#5B8DEF'
          }
        />
      }
      contentBoxProps={{ padding: '44px', color: 'palette.hardBlue_darker' }}
    >
      <Flex flexDirection="column" width={1}>
        <Flex alignItems="center">
          <Flex
            justifyContent="center"
            alignItems="center"
            borderRadius="full"
            width={52}
            height={52}
            bg="#5B8DEF"
            fontSize={32}
            fontWeight={700}
            color="palette.white"
            flexShrink={0}
          >
            {packingState.quarantineToteLabel ? <Icon name="far fa-check" color="palette.white" fontSize={26} /> : 1}
          </Flex>
          <Text ml={16} fontWeight={500} fontSize={24} color="palette.black">
            {t(`${intlKey}.ScanToteToQuarantine`)}
          </Text>
        </Flex>
        <Flex alignItems="center" mt={24}>
          <Flex
            justifyContent="center"
            alignItems="center"
            borderRadius="full"
            width={52}
            height={52}
            bg={packingState.quarantineToteLabel ? '#5B8DEF' : '#C3C3C3'}
            fontSize={32}
            fontWeight={700}
            color="palette.white"
            flexShrink={0}
          >
            {packingState.quarantineAddressLabel ? <Icon name="far fa-check" color="palette.white" fontSize={26} /> : 2}
          </Flex>
          <Text
            ml={16}
            fontWeight={500}
            fontSize={24}
            color={packingState.quarantineToteLabel ? 'palette.black' : '#C3C3C3'}
          >
            {t(`${intlKey}.ScanQuarantineAddress`)}
          </Text>
        </Flex>
      </Flex>
    </ModalBox>
  );
};

export default OrderStatusModal;
