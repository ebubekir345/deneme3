import { Box, Button, Flex, Icon, Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { urls } from '../../../../routers/urls';
import { DeliveryTypeTag, PickingTrolleySalesOrderState, SalesChannel } from '../../../../services/swagger';
import { DeliveryTypeColors } from '../../../pages/PickingManagement/bones/PickingManagementWaitingOrdersGrid';

const intlKey = 'Problems.PickingProblems.TrolleyModal';

export interface IToteBox {
  title: string;
  current?: number;
  total?: number;
  orderName?: string;
  orderId?: string;
  operationName?: string;
  isLinked?: boolean;
  trolleyToteStatus?: string;
  orderSalesChannel?: SalesChannel;
  orderDeliveryType?: DeliveryTypeTag;
}

export const ToteBox: React.FC<IToteBox> = ({
  title,
  current,
  total,
  orderName,
  orderId,
  operationName,
  isLinked = true,
  trolleyToteStatus,
  orderSalesChannel,
  orderDeliveryType,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const progressBarStyleMap = () => {
    if (!orderName) {
      return { bg: 'palette.snow_light', icon: null };
    }
    if (trolleyToteStatus === PickingTrolleySalesOrderState.Cancelled) {
      return {
        bg: 'palette.red',
        text: t(`${intlKey}.CancelledOrder`),
      };
    }
    if (current !== 0 && current === total) {
      return { bg: 'palette.green', icon: <Icon name="far fa-check" /> };
    }
    if (current === 0 && current !== total) {
      return { bg: 'palette.grey_lighter', icon: <Text>%0</Text> };
    }
    if (current !== 0 && current !== total && current !== undefined && total !== undefined) {
      return { bg: 'palette.blue', icon: <Text>%{((current / total) * 100).toFixed(0)}</Text> };
    }
    return { bg: 'palette.snow_light', icon: null };
  };
  return (
    <Flex flexDirection="column" width={1} bg="palette.white" borderRadius="lg" p={8} minHeight={141}>
      <Flex justifyContent="space-between" fontWeight="500" alignItems="center" px={8}>
        <Text>{title}</Text>
        <Text>{current !== undefined && total !== undefined ? `${current}/${total}` : '-'}</Text>
      </Flex>
      <Box my={8} bg="palette.snow_light" width={1} height={1} />
      <Flex flexDirection="column" width={1} height="100%" justifyContent="space-between">
        <Flex flexDirection="column">
          <Flex justifyContent="space-between">
            <Button
              kind="link"
              color={isLinked && orderId ? 'text.link' : 'text.body'}
              onClick={() => isLinked && orderId && history.push(urls.orderDetails.replace(':id', encodeURI(orderId)))}
              px={8}
              mb={8}
              outline="none !important"
              cursor={isLinked ? 'pointer' : 'auto !important'}
              alignSelf="flex-start"
            >
              {orderName || '-'}
            </Button>
            {orderSalesChannel && <Text lineHeigt="small">{t(`Enum.${orderSalesChannel}`)}</Text>}
          </Flex>
          <Flex justifyContent="space-between">
            {operationName && (
              <Text fontWeight={500} lineHeigt="small" mb={8} px={8}>
                {operationName}
              </Text>
            )}
            {orderDeliveryType && (
              <Text color={DeliveryTypeColors[orderDeliveryType]} lineHeigt="small">
                {t(`Enum.${orderDeliveryType}`)}
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex
          height={40}
          alignItems="center"
          justifyContent="space-between"
          px={8}
          bg={progressBarStyleMap().bg}
          borderRadius="md"
          color="palette.white"
          fontSize={22}
          fontFamily="heading"
        >
          {progressBarStyleMap().text && (
            <Text fontSize={14} fontWeight={800} letterSpacing="negativeLarge" color="palette.white">
              {progressBarStyleMap().text}
            </Text>
          )}
          {progressBarStyleMap().icon}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ToteBox;
