import React from 'react';
import { Box, Flex, PseudoBox } from '@oplog/express';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Resource } from '@oplog/resource-redux';
import { useSelector } from 'react-redux';
import iff from '../../../../utils/iff';
import { GetSalesOrderDetailsOutputDTO } from '../../../../services/swagger';
import useReturnStore, { ReturnTooltips } from '../../../../store/global/returnStore';
import { StoreState } from '../../../../store/initState';
import { ResourceType } from '../../../../models';

const listLineCommonProps = {
  content: '" "',
  position: 'absolute',
  left: '-16px',
  borderLeft: '1px solid black',
  width: '1px',
  opacity: 0.25,
  color: 'palette.blue_light',
};

const intlKey = 'TouchScreen.ReturnStation.OrderHistory';

const OrderHistoryTooltip: React.FC = (): React.ReactElement => {
  const { t } = useTranslation();
  const [returnState, returnAction] = useReturnStore();
  const salesOrderDetails: Resource<GetSalesOrderDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrderDetails]
  );

  return (
    <>
      <Box
        onClick={() => returnAction.toggleTooltipState(ReturnTooltips.OrderHistoricalInfo)}
        position="fixed"
        width="100%"
        height="100%"
        left={0}
        top={0}
        zIndex={2}
        bg="rgba(0, 0, 0, 0.5)"
        data-cy="order-history-backdrop"
      />
      <PseudoBox
        position="absolute"
        transform="translate3d(0px, 74px, 0px)"
        bg="palette.white"
        width="336px"
        height="auto"
        borderRadius="8px"
        zIndex={2}
        _after={{
          border: 'solid transparent',
          content: '" "',
          height: 0,
          width: 0,
          position: 'absolute',
          pointerEvents: 'none',
          borderColor: 'transparent',
          borderWidth: '6px',
          left: '30px',
          marginLeft: '2px',
          boxShadow: 'medium',
          bottom: '100%',
          borderBottomColor: 'palette.white',
        }}
        data-cy="order-history-screen"
      >
        <Flex p="24px 24px 24px 40px" justifyContent="center" flexDirection="column" height="100%" fontSize="16px">
          <Box>
            {salesOrderDetails.data &&
              Object.keys(salesOrderDetails.data)
                .sort(
                  (a, b) =>
                    new Date(salesOrderDetails.data && salesOrderDetails.data[b]).getTime() -
                    new Date(salesOrderDetails.data && salesOrderDetails.data[a]).getTime()
                )
                .map((key, i, arr) => {
                  if (key !== 'id') {
                    return (
                      <PseudoBox
                        key={i.toString()}
                        position="relative"
                        paddingBottom={i !== arr.length - 1 ? '24px' : '0px'}
                        display="flex"
                        justifyContent="space-between"
                        _after={{
                          content: '"\u2B24"',
                          position: 'absolute',
                          left: '-21px',
                          top: '0',
                          fontSize: '10px',
                          color: 'palette.slate_lighter',
                        }}
                        _before={
                          i === 0
                            ? {
                                height: '100%',
                                top: '6px',
                                ...listLineCommonProps,
                              }
                            : iff(
                                i === arr.length - 1,
                                {
                                  height: '6px',
                                  top: '5px',
                                  ...listLineCommonProps,
                                },
                                {
                                  height: '100%',
                                  top: '5px',
                                  ...listLineCommonProps,
                                }
                              )
                        }
                        data-cy="order-history-item"
                      >
                        <Box color="palette.hardBlue_darker">{t(`${intlKey}.${key}`)}</Box>
                        <Box color="palette.blue_light">
                          {moment
                            .utc(salesOrderDetails.data && salesOrderDetails.data[key])
                            .local()
                            .format('DD.MM.YYYY HH:mm')}
                        </Box>
                      </PseudoBox>
                    );
                  }
                  return null;
                })}
          </Box>
        </Flex>
      </PseudoBox>
    </>
  );
};

export default OrderHistoryTooltip;
