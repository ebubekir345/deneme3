import { Box, Button, Flex, Icon, Text } from '@oplog/express';
import { useHistory } from 'react-router-dom';
import React from 'react';
import { urls } from '../../../../routers/urls';
import { TransferTrolleyToteStatus } from '../../../../services/swagger';
import { useTranslation } from 'react-i18next';

const intlKey = 'Problems.PickingProblems.TransferTrolleyModal';

export interface IToteBox {
  title: string;
  current?: number;
  total?: number;
  orderName?: string;
  orderId?: string;
  isLinked?: boolean;
  transferTrolleyToteStatus?: TransferTrolleyToteStatus;
  operationName?: string;
}

export const ToteBox: React.FC<IToteBox> = ({
  title,
  current,
  total,
  orderName,
  orderId,
  isLinked = true,
  transferTrolleyToteStatus,
  operationName,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const progressBarStyleMap = () => {
    if (!orderName) {
      return { bg: 'palette.snow_light'};
    }
    if (transferTrolleyToteStatus === TransferTrolleyToteStatus.Packable) {
      return { bg: 'palette.green', icon: <Icon name="far fa-check" />, text: t(`${intlKey}.Packable`) };
    }
    if (transferTrolleyToteStatus === TransferTrolleyToteStatus.WaitingForPicking) {
      return {
        bg: 'palette.blue',
        icon: (
          <Text>
            %{isNaN(((current || 0) / (total || 0)) * 100) ? 0 : (((current || 0) / (total || 0)) * 100).toFixed(0)}
          </Text>
        ),
        text: t(`${intlKey}.WaitingForPicking`),
      };
    }
    if (transferTrolleyToteStatus === TransferTrolleyToteStatus.AwaitingCustomerServicesReview) {
      return {
        bg: 'palette.orange',
        icon: (
          <Text>
            %{isNaN(((current || 0) / (total || 0)) * 100) ? 0 : (((current || 0) / (total || 0)) * 100).toFixed(0)}
          </Text>
        ),
        text: t(`${intlKey}.AwaitingCustomerServicesReview`),
      };
    }
    if (transferTrolleyToteStatus === TransferTrolleyToteStatus.WaitingStockCount) {
      return {
        bg: 'palette.purple',
        icon: (
          <Text>
            %{isNaN(((current || 0) / (total || 0)) * 100) ? 0 : (((current || 0) / (total || 0)) * 100).toFixed(0)}
          </Text>
        ),
        text: t(`${intlKey}.WaitingStockCount`),
      };
    }
    if (transferTrolleyToteStatus === TransferTrolleyToteStatus.Cancelled) {
      return {
        bg: 'palette.red',
        text: t(`${intlKey}.CancelledOrder`),
      };
    }
    return { bg: 'palette.snow_light', icon: null, text: null };
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
          {operationName && (
            <Text fontWeight={500} lineHeigt="small" mb={8} px={8}>
              {operationName}
            </Text>
          )}
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
