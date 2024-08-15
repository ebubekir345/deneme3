import { Box, Button, Flex, Icon, ModalContent, Text } from '@oplog/express';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import { SalesOrderState, UnassignableOrders } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import Grid from '../../../atoms/Grid';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'ManualPicklists';

export interface IAssignmentFailedOrdersModal {
  isAssignmentFailedOrdersModalOpen: boolean;
  setIsAssignmentFailedOrdersModalOpen: Function;
  orders: UnassignableOrders[];
  setIsPreviewModalOpen: Function;
  handleAddOrdersToBatch: Function;
}

const AssignmentFailedOrdersModal: FC<IAssignmentFailedOrdersModal> = ({
  isAssignmentFailedOrdersModalOpen,
  setIsAssignmentFailedOrdersModalOpen,
  orders,
  setIsPreviewModalOpen,
  handleAddOrdersToBatch,
}) => {
  const { t } = useTranslation();
  const previewManualPicklistResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.PreviewManualPicklist]
  );

  return (
    <ModalBox
      disableEscapeButtonClose
      disableOutsideMouseEvents
      isOpen={isAssignmentFailedOrdersModalOpen}
      onClose={() => setIsAssignmentFailedOrdersModalOpen(false)}
      maxWidth="90vw"
      maxHeight="95vh"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      icon={<Icon name="far fa-engine-warning" fontSize="48" color="palette.softBlue_light" my={16} />}
      subHeaderText={
        <Text fontSize="22" fontWeight={700}>
          {t(`${intlKey}.ModalHeader`)}
        </Text>
      }
      contentBoxProps={{
        overflow: 'hidden',
        textAlign: 'left',
        px: '0',
      }}
    >
      <ModalContent
        display="flex"
        flexDirection="column"
        alignItems="center"
        fontSize={22}
        px={0}
        overflow="auto"
        maxWidth="75vw"
        maxHeight="75vh"
      >
        {orders.map((order: UnassignableOrders, index: number) => (
          <Grid
            key={order.salesOrderId}
            alignItems="center"
            justifyContent="space-between"
            gridTemplateColumns="64px 3fr 1fr 2fr"
            width={1}
            boxShadow="small"
            px={16}
            py={4}
            bg={index % 2 ? 'palette.snow_lighter' : 'palette.white'}
            borderRadius="md"
          >
            <Box fontWeight={700} mr="8">
              {index + 1}
              {' . '}
            </Box>
            <Box whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              <Link to={`/order-details/${order.salesOrderId}/:tab?`} target="_blank">
                {order.referenceNumber}
              </Link>
            </Box>
            <Box>
              <Flex width={64} p={6}>
                <Box
                  width="auto"
                  backgroundColor="palette.white"
                  textAlign="center"
                  boxShadow="large"
                  borderRadius="lg"
                  mr="8"
                >
                  <Flex width="auto" flexDirection="row" alignItems="center" px="11">
                    <Box
                      minWidth={22}
                      minHeight={22}
                      maxHeight={22}
                      maxWidth={22}
                      backgroundImage={`url('${order.operationImageUrl}');`}
                      backgroundSize="cover"
                      backgroundPosition="center"
                      borderRadius="full"
                      boxShadow="large"
                      my="4"
                      mr="4"
                    />
                    <Text color="palette.grey_dark" py="4" fontSize="11" fontWeight={600} lineHeight="normal">
                      {order.operationName?.toUpperCase()}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Box>
            <Box>
              {order.state === SalesOrderState.Created
                ? t(`OrderManagement.Created.${order.createdState}`)
                : t(`Enum.${order.state}`)}
            </Box>
          </Grid>
        ))}
        <Button
          onClick={() => {
            setIsAssignmentFailedOrdersModalOpen(false);
            previewManualPicklistResponse?.data ? setIsPreviewModalOpen(true) : handleAddOrdersToBatch();
          }}
          mt={32}
          variant="alternative"
          fontWeight={700}
          width={1 / 6}
        >
          {t(`Modal.Success.Okay`)}
        </Button>
      </ModalContent>
    </ModalBox>
  );
};

export default AssignmentFailedOrdersModal;
