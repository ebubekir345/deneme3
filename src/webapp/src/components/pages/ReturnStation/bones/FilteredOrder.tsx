import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Image, Icon, Button, Text, Ellipsis } from '@oplog/express';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { resourceActions } from '@oplog/resource-redux';
import { SalesOrdersSearchOutputDTO, ReturnSource } from '../../../../services/swagger';
import useReturnStore from '../../../../store/global/returnStore';
import { StoreState } from '../../../../store/initState';
import { ResourceType } from '../../../../models';

interface IReturnFilteredOrder {
  order: SalesOrdersSearchOutputDTO;
}

const intlKey = 'TouchScreen.ReturnStation.FilteredOrder';

const ReturnFilteredOrder: React.FC<IReturnFilteredOrder> = ({ order }): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    id,
    referenceNumber,
    returnSource,
    orderCreatedAt,
    operation,
    lineItems,
    recipient,
    customer,
    contactInfo,
    details,
  } = order;
  const [returnState, returnAction] = useReturnStore();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const selectSalesOrderForReturnResponse = useSelector((state: StoreState) =>
    state.resources.selectSalesOrderForReturn ? state.resources.selectSalesOrderForReturn : null
  );

  const onSelectOrder = () => {
    returnAction.setSelectedOrder(order);
    const payload = {
      salesOrderId: id,
      returnProcessId: returnState.returnProcessId ? returnState.returnProcessId : undefined,
    };
    dispatch(resourceActions.resourceRequested(ResourceType.SelectSalesOrderForReturn, { payload }));
  };
  return (
    <Box
      mb={11}
      boxShadow="small"
      fontSize="16"
      letterSpacing="negativeLarge"
      style={{ userSelect: 'none' }}
    >
      <Flex
        onClick={() => {
          setIsDetailsOpen(!isDetailsOpen);
        }}
        gutter={20}
        height="96px"
        width={1}
        bg="palette.white"
        px={32}
        borderRadius={isDetailsOpen ? '4px 4px 0 0' : '4px'}
        justifyContent="space-between"
        alignItems="center"
        data-cy="filtered-order"
      >
        <Flex width={0.2} alignItems="center">
          <Image src={operation?.imageUrl} width="32px" height="32px" borderRadius="md" />
          <Flex ml={16} justifyContent="center" flexDirection="column">
            <Box fontWeight={700} color="palette.hardBlue_darker">
              {moment
                .utc(orderCreatedAt)
                .local()
                .format('DD.MM.YYYY')}
            </Box>
            <Box color="palette.slate" mt={4}>
              {operation?.name}
            </Box>
            <Box color="palette.slate" mt={4}>
              {referenceNumber}
            </Box>
          </Flex>
        </Flex>
        <Box width={0.25}>
          {lineItems &&
            lineItems?.map((item, i, arr) =>
              i < 4 ? (
                <Image
                  key={i.toString()}
                  src={item.imageUrl}
                  borderRadius="full"
                  width="48px"
                  height="48px"
                  marginLeft={i === 0 ? '0px' : '-8px'}
                  boxShadow="0 6px 15px 0 rgba(91, 141, 239, 0.25)"
                />
              ) : (
                i === 4 && (
                  <Flex
                    key={i.toString()}
                    width="48px"
                    height="48px"
                    borderRadius="full"
                    bg="palette.softGrey"
                    justifyContent="center"
                    alignItems="center"
                    display="inline-flex"
                  >
                    <Box fontWeight={700} color="palette.snow_darker">
                      +{arr.length - 4}
                    </Box>
                  </Flex>
                )
              )
            )}
        </Box>
        <Box width={0.25}>
          <Flex ml={16} justifyContent="center" flexDirection="column">
            <Box fontWeight={700} color="palette.purple_darker">
              {customer?.fullName}
            </Box>
            <Box color="palette.slate" mt={4}>
              {customer?.phone}
            </Box>
          </Flex>
        </Box>
        <Box
          width={0.25}
          color="palette.slate"
          textOverflow="ellipsis"
          display="-webkit-box"
          overflow="hidden"
          style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          lineHeight="19px"
        >
          {`${recipient?.fullName}, ${details?.firstLine} ${details?.secondLine ? details?.secondLine : ''}, ${recipient?.phone}`}
        </Box>
        <Box flexShrink={0}>
          {returnSource === ReturnSource.Omnitro ? (
            <Image src="/images/integrations/omnitro.png" width={24} height={24} borderRadius="sm" mr={4} />
          ) : (
            <Box width={24} height={24} mr={4} />
          )}
        </Box>
      </Flex>
      {isDetailsOpen && (
        <Box width={1} bg="palette.softGrey" padding="20px 32px 24px 36px" borderRadius="0 0 4px 4px">
          <Flex color="palette.purple_darker" marginBottom="16" gutter={20} fontWeight={500}>
            <Text width={0.5} paddingLeft={36}>
              {t(`${intlKey}.Item`)}
            </Text>
            <Text width={0.45} ml={-64}>{t(`${intlKey}.BarcodeSKU`)}</Text>
            <Flex width={0.05} justifyContent="flex-end">
              {t(`${intlKey}.Count`)}
            </Flex>
          </Flex>
          {lineItems &&
            lineItems?.map((item, i) => (
              <Flex
                key={i.toString()}
                alignItems="center"
                color="palette.purple_darker"
                marginBottom="11"
                gutter={20}
                data-cy="filtered-order-line-item"
              >
                <Flex alignItems="center" width={0.5}>
                  <Icon name="fal fa-level-up-alt" color="palette.blue_lighter" fontSize="26" transform="rotate(-270deg)" />
                  <Image
                    src={item.imageUrl}
                    width="48px"
                    height="48px"
                    borderRadius="full"
                    boxShadow="0 6px 15px 0 rgba(91, 141, 239, 0.25)"
                    marginLeft="22"
                  />
                  <Box marginLeft="16">{item.productName}</Box>
                </Flex>
                <Text width={0.45} ml={-64}>
                  <Ellipsis maxWidth={1000}>{item.barcodes?.join()}/{item.sku}</Ellipsis>
                </Text>
                <Flex width={0.05} fontFamily="SpaceMono" justifyContent="flex-end">
                  x{item.amountInOrder}
                </Flex>
              </Flex>
            ))}
          <Flex width={1} justifyContent="flex-end" mt={8}>
            <Button
              onClick={() => {
                !selectSalesOrderForReturnResponse?.isBusy && onSelectOrder();
              }}
              isLoading={selectSalesOrderForReturnResponse?.isBusy}
              minWidth={200}
              fontFamily="ModernEra"
              fontWeight={500}
              letterSpacing="negativeLarge"
              height="36px"
              border="0"
              borderRadius="md"
              boxShadow="small"
              bg="palette.softBlue"
              color="palette.white"
              padding="0 23px 0 16px"
              data-cy="select-sales-order"
              contentProps={{
                paddingLeft: 0,
                paddingRight: 0,
              }}
              _hover={{
                backgroundColor: 'palette.softBlue',
              }}
              _focus={{ outline: 'none' }}
            >
              {t(`TouchScreen.ActionButtons.ContinueWithThisOrder`)}
              <Icon name="far fa-arrow-right" fontSize="16" color="palette.white" ml={11} />
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default ReturnFilteredOrder;
