import { Box, Flex, formatUtcToLocal, Heading, Icon, Image, Popover, PseudoBox, Text } from '@oplog/express';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { urls } from '../../../routers/urls';
import {
  OutputDispatchState,
  SalesOrderCancelledState,
  SalesOrderOutputCreatedStateEnum,
  SalesOrderPickingPriority,
  SalesOrderPickingState,
  SalesOrderSLAMState,
  SalesOrderState,
} from '../../../services/swagger';
import { priorityColor } from '../../../utils/formatters';
import Badge from '../../atoms/Badge';

interface SalesOrderItemProps {
  order: any;
}

const intlKey = 'OrderManagement';

const SalesOrderItem: React.FC<SalesOrderItemProps> = ({ order }): ReactElement => {
  const { t } = useTranslation();
  let borderColor = 'palette.green';
  if (
    order[`salesOrder${order.state}State`] === SalesOrderCancelledState.Cancelled ||
    order[`salesOrder${order.state}State`] === SalesOrderPickingState.CompletedWithLostItems ||
    order[`salesOrder${order.state}State`] === SalesOrderOutputCreatedStateEnum.OutOfStock
  ) {
    borderColor = 'palette.red';
  }
  if (
    order[`salesOrder${order.state}State`] === SalesOrderPickingState.Started ||
    order[`salesOrder${order.state}State`] === SalesOrderSLAMState.Started ||
    order[`salesOrder${order.state}State`] === OutputDispatchState.ManualDeliverySalesOrderStarted
  ) {
    borderColor = 'palette.blue';
  }
  if (
    (order.isSuspended && order.state !== SalesOrderState.Cancelled) ||
    order[`salesOrder${order.state}State`] === SalesOrderOutputCreatedStateEnum.WaitingForPutAway
  ) {
    borderColor = 'palette.orange';
  }

  const changeBoxDisplay = salesOrder => {
    if (
      salesOrder.state === SalesOrderState.Dispatch ||
      salesOrder.state === SalesOrderState.Slam ||
      salesOrder.isSuspended
    ) {
      return (
        <Flex alignItems="flex-end" mt="11">
          <Flex flex={1} justifyContent="flex-start">
            {salesOrder.carrierImageUrl?.url ? (
              <Image
                width={24}
                height={24}
                src={salesOrder.carrierImageUrl?.url}
                opacity={
                  salesOrder.state === SalesOrderState.Slam &&
                  salesOrder[`salesOrder${salesOrder.state}State`] === SalesOrderSLAMState.Started
                    ? 0.4
                    : 1
                }
                style={{
                  filter:
                    salesOrder.state === SalesOrderState.Slam &&
                    salesOrder[`salesOrder${order.state}State`] === SalesOrderSLAMState.Started
                      ? 'grayscale(100%)'
                      : 'none',
                }}
              />
            ) : (
              <Icon name="fal fa-question-circle" color="#707070" fontSize={16} />
            )}
          </Flex>
          <Flex flex={1} justifyContent="center">
            {(salesOrder.isLate || salesOrder.isCutOff) && (
              <Badge
                bg={salesOrder.isLate ? 'palette.red' : 'palette.purple'}
                label={salesOrder.isLate ? t(`${intlKey}.CutOffStatus.Late`) : t(`${intlKey}.CutOffStatus.CutOff`)}
              />
            )}
          </Flex>
          <Flex flex={1} justifyContent="flex-end">
            {salesOrder.priority && salesOrder.priority !== SalesOrderPickingPriority.None && (
              <Text
                mt="11"
                fontFamily="heading"
                fontSize="12"
                fontWeight={500}
                color={priorityColor[salesOrder.priority]}
                display="block"
              >
                {t(`Enum.${salesOrder.priority}`)}
              </Text>
            )}
          </Flex>
        </Flex>
      );
    }
    return (
      <Flex alignItems="flex-end" mt="11">
        <Flex flex={1} justifyContent="flex-start"></Flex>
        <Flex flex={1} justifyContent="center">
          {(salesOrder.isLate || salesOrder.isCutOff) && (
            <Badge
              bg={salesOrder.isLate ? 'palette.red' : 'palette.purple'}
              label={salesOrder.isLate ? t(`${intlKey}.CutOffStatus.Late`) : t(`${intlKey}.CutOffStatus.CutOff`)}
            />
          )}
        </Flex>
        <Flex flex={1} justifyContent="flex-end">
          {salesOrder.priority && salesOrder.priority !== SalesOrderPickingPriority.None && (
            <Text
              fontFamily="heading"
              fontSize="12"
              fontWeight={500}
              color={priorityColor[salesOrder.priority]}
              display="block"
            >
              {t(`Enum.${salesOrder.priority}`)}
            </Text>
          )}
        </Flex>
      </Flex>
    );
  };

  return (
    <PseudoBox as={Link} target="_blank" to={urls.orderDetails.replace(':id', order.id)} _hover={{ textDecoration: 'none' }}>
      <Popover
        action={['hover', 'focus']}
        content={
          order.isCargoCodeUpdated ? (
            <PseudoBox>{t(`${intlKey}.${order.state}.CargoCodeUpdated`)}</PseudoBox>
          ) : order.isSuspended &&
            order.state !== SalesOrderState.Cancelled &&
            order[`salesOrder${order.state}State`] !== SalesOrderOutputCreatedStateEnum.WaitingForPutAway ? (
            <PseudoBox>{t(`${intlKey}.${order.state}.Suspended`)}</PseudoBox>
          ) : (
            <PseudoBox>{t(`${intlKey}.${order.state}.${order[`salesOrder${order.state}State`]}`)}</PseudoBox>
          )
        }
        contentProps={{
          bg: borderColor,
          color: 'palette.white',
          borderRadius: 'sm',
          padding: '8px 11px',
          boxShadow: 'medium',
          fontSize: '10',
          lineHeight: 'xxLarge',
        }}
        withArrow
        placement="bottom-end"
      >
        <PseudoBox
          boxShadow="0 8px 14px 0 rgba(216, 221, 230, 0.5)"
          borderRadius="sm"
          border="xs"
          borderColor="palette.snow_light"
          borderLeft="4px solid"
          borderLeftColor={borderColor}
          minHeight="81px"
          mb="16px"
          p="11"
          _hover={{ boxShadow: '0 20px 34px 0 rgba(0, 0, 0, 0.2);' }}
          transition="0.2s ease all"
          cursor="pointer"
        >
          <Flex justifyContent="space-between">
            <Box>
              <Heading
                color="palette.grey"
                fontFamily="heading"
                fontSize="12"
                lineHeight="large"
                letterSpacing="negativeSmall"
                fontWeight={600}
              >
                {order.referenceNumber}
              </Heading>
              <Text fontFamily="heading" fontSize="12" color="palette.grey_lighter">
                {formatUtcToLocal(order.orderCreatedAt)}
              </Text>
            </Box>
            <Box width="32px" height="32px" bg="transparent">
              <Image src={order.operation.imageUrl} />
            </Box>
          </Flex>
          {changeBoxDisplay(order)}
        </PseudoBox>
      </Popover>
    </PseudoBox>
  );
};

export default SalesOrderItem;
