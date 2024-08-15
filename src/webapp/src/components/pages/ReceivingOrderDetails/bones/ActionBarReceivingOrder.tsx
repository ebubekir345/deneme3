import { ActionBar, Badge, Box, Button, Dialog, DialogTypes, Flex, Icon, Popover, PseudoBox } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import { PurchaseOrderDetailsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';

const intlKey = 'ReceivingOrderDetails';

const ActionBarReceivingOrder = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isCompleteOrderDialogOpen, setIsCompleteOrderDialogOpen] = useState(false);
  const { tab, operationId, operationName, id, referenceNumber, source }: any = useParams();

  const completeOrderResponse: Resource<PurchaseOrderDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CompleteOrder]
  );
  const purchaseOrderDetails: Resource<PurchaseOrderDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPurchaseOrderDetails]
  );

  const onCompleteOrder = () => {
    setIsCompleteOrderDialogOpen(false);
    const payload = { purchaseOrderId: decodeURI(id) };
    dispatch(resourceActions.resourceRequested(ResourceType.CompleteOrder, { payload }));
  };

  return (
    <ActionBar
      alignItems="end"
      breadcrumb={[
        {
          title: t(`${intlKey}.ActionBar.Breadcrumb.Receiving`),
          url: urls.receivingOperations,
        },
        {
          title: decodeURI(operationName),
          url: urls.receivingPurchaseOrders
            .replace(':operationId', operationId)
            .replace(':operationName', operationName),
        },
        {
          title: decodeURI(referenceNumber),
        },
      ]}
      title={decodeURI(referenceNumber)}
      subtitle={t(`${intlKey}.ActionBar.Subtitle`)}
      integration={{
        icon: `/images/integrations/${
          decodeURI(source)
            ? decodeURI(source)
                .toString()
                .toLowerCase()
            : ''
        }.png`,
        name: decodeURI(source) || t('Integration.NoIntegration'),
      }}
    >
      <Flex alignItems="center" mb={4}>
        <PseudoBox
          onClick={() =>
            window.open(
              `https://search.oplog.app/?q=${id}&size=n_60_n&sort-field=createdat&sort-direction=desc`,
              '_blank'
            )
          }
          color="text.link"
          _hover={{ cursor: 'pointer' }}
          pr={16}
          borderRight="xs"
          borderLeft="xs"
          borderColor="palette.grey_lighter"
          pl={16}
        >
          <PseudoBox _hover={{ textDecoration: 'underline' }} display="inline" pr={6}>
            {t('SideBar.ActionHistory')}
          </PseudoBox>
          <Icon name="far fa-external-link"></Icon>
        </PseudoBox>
        {purchaseOrderDetails?.data?.isLate && (
          <Box color="palette.grey" pl={16} pr={16} borderLeft="xs" borderColor="palette.grey">
            <Badge
              badgeColor="palette.white"
              outlined={false}
              fontFamily="heading"
              fontWeight={500}
              height={18}
              fontSize={10}
              py={2}
              px={6}
              textTransform="none"
              variant="danger"
            >
              {t(`${intlKey}.ActionBar.Delayed`)}
            </Badge>
          </Box>
        )}

        <Box color="palette.grey" pl={16} pr={16} borderLeft="xs" borderColor="palette.grey">
          <Icon name="fas fa-calendar-check" fontSize={16} color={'palette.grey_dark'} mr={8} />
          {purchaseOrderDetails?.data?.expectedDeliveryDate?.from ? (
            moment(purchaseOrderDetails?.data?.expectedDeliveryDate.from).format('DD.MM.YYYY HH:mm')
          ) : (
            <Skeleton width={128} height={16} />
          )}
        </Box>
      </Flex>
      {!completeOrderResponse?.data?.completingState && (
        <Flex marginLeft="auto">
          <Popover
            content={
              <PseudoBox>
                {t(`${intlKey}.Popover.WaybillNotCompleted`).slice(0, 38)}
                <Box color="palette.green_darker" fontWeight="bold" display="inline">
                  {t(`${intlKey}.Popover.Completed`)}
                </Box>
                {t(`${intlKey}.Popover.WaybillNotCompleted`).slice(37)}
              </PseudoBox>
            }
            isDark
            contentProps={{ width: '195px', paddingX: '11px', paddingY: '6px', fontSize: '10px', lineHeight: 1.6 }}
            placement="bottom-start"
            withArrow
            action={['hover']}
          >
            <Button
              size="large"
              isLoading={completeOrderResponse?.isBusy}
              disabled={!purchaseOrderDetails?.data?.completingState || completeOrderResponse?.isSuccess}
              variant="primary"
              onClick={() => setIsCompleteOrderDialogOpen(true)}
              data-cy="complete-purchase-order-button"
            >
              {t(`${intlKey}.CompleteOrder`)}
            </Button>
          </Popover>
        </Flex>
      )}
      <Dialog
        message={t(`${intlKey}.Dialog.Message`)}
        isOpen={isCompleteOrderDialogOpen}
        onApprove={() => onCompleteOrder()}
        onCancel={() => setIsCompleteOrderDialogOpen(false)}
        type={DialogTypes.Warning}
        text={{
          approve: t(`${intlKey}.Dialog.Approve`),
          cancel: t(`${intlKey}.Dialog.Cancel`),
        }}
        data-cy="complete-order-dialog"
      />
    </ActionBar>
  );
};

export default ActionBarReceivingOrder;
