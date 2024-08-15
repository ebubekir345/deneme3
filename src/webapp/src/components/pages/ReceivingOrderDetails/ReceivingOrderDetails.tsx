import { Box, Dialog, DialogTypes, Flex, LayoutContent, Panel, Tab } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { PurchaseOrderDetailsOutputDTO, PurchaseOrderLineItemCountsOutputDTO } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBarReceivingOrder from './bones/ActionBarReceivingOrder';
import InboundItemProductDetailWidget from './bones/InboundItemProductDetailWidget';
import InboundItemQuarantineDetailWidget from './bones/InboundItemQuarantineDetailWidget';
import OperationImageWidget from './bones/OperationImageWidget';
import PurchaseOrderInfoWidget from './bones/PurchaseOrderInfoWidget';
import ReceivingOrdersPackagesGrid from './bones/ReceivingOrdersPackagesGrid';
import ReceivingProductsGrid from './bones/ReceivingProductsGrid';
import ReceivingWaybillsGrid from './bones/ReceivingWaybillsGrid';
import SalesOrderInboundProblemsGrid from './bones/SalesOrderInboundProblemsGrid';

export enum ReceivingOrderDetailsTabs {
  Waybills = 'waybills',
  Packages = 'packages',
  Products = 'products',
  Problems = 'problems',
}

const intlKey = 'ReceivingOrderDetails';

const ReceivingOrderDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { operationId, operationName, id, referenceNumber, source }: any = useParams();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const [isCompleteOrderDialogOpen, setIsCompleteOrderDialogOpen] = useState(false);
  const [, setIsOrderCompleteBusy] = useState(false);
  const [, setCompletingState] = useState(false);
  const [, setIsOrderCompleted] = useState(false);
  const routeProps = useRouteProps();

  const completeOrderResponse: any = useSelector((state: StoreState) =>
    state.resources.completeOrder ? state.resources.completeOrder : null
  );
  const lineItemCountsByPurchaseOrder: Resource<PurchaseOrderLineItemCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetLineItemCountsByPurchaseOrder]
  );
  const purchaseOrderDetails: Resource<PurchaseOrderDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPurchaseOrderDetails]
  );

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(ReceivingOrderDetailsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const index = Object.values(ReceivingOrderDetailsTabs).findIndex(path => path === location.pathname.split('/')[2])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetPurchaseOrderDetails, {
        purchaseOrderId: decodeURI(id),
      })
    );
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetLineItemCountsByPurchaseOrder, {
        purchaseOrderId: decodeURI(id),
      })
    );
  }, []);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (purchaseOrderDetails?.isSuccess && purchaseOrderDetails?.data) {
      setCompletingState(purchaseOrderDetails?.data?.completingState as boolean);
    } else {
      setCompletingState(false);
    }
  }, [purchaseOrderDetails]);

  useEffect(() => {
    if (completeOrderResponse?.isSuccess) {
      setIsOrderCompleteBusy(false);
      setIsOrderCompleted(true);
    }
    if (completeOrderResponse?.isBusy) {
      setIsOrderCompleteBusy(true);
    }
    if (completeOrderResponse?.error) {
      setIsOrderCompleteBusy(false);
    }
  }, [completeOrderResponse]);

  const ReceivingStatusBar = () => (
    <Flex height="54px" px={24} mb={16} bg="palette.white" alignItems="center">
      {lineItemCountsByPurchaseOrder?.isBusy ? (
        <Skeleton width={115} height={36} />
      ) : (
        <Flex flexDirection="column" mr="24px">
          <Box fontSize={12} lineHeight={1.17} letterSpacing="-0.2px" color="#bdbdbd">
            {t(`${intlKey}.ActionBar.ReceivingStatus`)}
          </Box>
          <Box fontFamily="Montserrat" fontSize={20} fontWeight="bold" lineHeight={1.1} color="palette.slate_dark">
            {lineItemCountsByPurchaseOrder?.data?.acceptedAmount}/{lineItemCountsByPurchaseOrder?.data?.expectedAmount}{' '}
            {t(`${intlKey}.ActionBar.Product`)}
          </Box>
        </Flex>
      )}
    </Flex>
  );

  const tabs = [
    {
      id: ReceivingOrderDetailsTabs.Waybills,
      title: t(`${intlKey}.Titles.Waybills`),
      component: (
        <>
          <ReceivingStatusBar />
          <ReceivingWaybillsGrid
            purchaseOrderId={decodeURI(id)}
            operationId={decodeURI(operationId)}
            operationName={decodeURI(operationName)}
            orderId={decodeURI(id)}
            referenceNumber={decodeURI(referenceNumber)}
            source={decodeURI(source)}
          />
        </>
      ),
    },
    {
      id: ReceivingOrderDetailsTabs.Packages,
      title: t(`${intlKey}.Titles.Packages`),
      component: (
        <>
          <ReceivingStatusBar />
          <ReceivingOrdersPackagesGrid
            purchaseOrderId={decodeURI(id)}
            operationId={decodeURI(operationId)}
            operationName={decodeURI(operationName)}
            orderId={decodeURI(id)}
            referenceNumber={decodeURI(referenceNumber)}
            source={decodeURI(source)}
          />
        </>
      ),
    },
    {
      id: ReceivingOrderDetailsTabs.Products,
      title: t(`${intlKey}.Titles.Products`),
      component: (
        <>
          <ReceivingStatusBar />
          <ReceivingProductsGrid purchaseOrderId={decodeURI(id)} />
        </>
      ),
    },
    {
      id: ReceivingOrderDetailsTabs.Problems,
      title: t(`${intlKey}.Titles.InboundProblems`),
      component: (
        <>
          <ReceivingStatusBar />
          <SalesOrderInboundProblemsGrid
            purchaseOrderId={decodeURI(id)}
            operationId={decodeURI(operationId)}
            operationName={decodeURI(operationName)}
            orderId={decodeURI(id)}
            referenceNumber={decodeURI(referenceNumber)}
            source={decodeURI(source)}
          />
        </>
      ),
    },
  ];

  const onCompleteOrder = () => {
    setIsCompleteOrderDialogOpen(false);
    const payload = { purchaseOrderId: decodeURI(id) };
    dispatch(resourceActions.resourceRequested(ResourceType.CompleteOrder, { payload }));
  };

  return (
    <>
      <ActionBarReceivingOrder />
      <LayoutContent>
        <Panel>
          <Flex gutter={22} mb={22}>
            <Box width={1 / 4}>
              <OperationImageWidget />
            </Box>
            <Box width={1 / 4}>
              <PurchaseOrderInfoWidget />
            </Box>
            <Box width={1 / 4}>
              <InboundItemProductDetailWidget />
            </Box>
            <Box width={1 / 4}>
              <InboundItemQuarantineDetailWidget />
            </Box>
          </Flex>
          <Tab
            onTabChange={data => {
              updateRouteOnTabChange(data);
            }}
            tabProps={{ mb: '0' }}
            tabs={tabs}
          />
        </Panel>
      </LayoutContent>
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
    </>
  );
};
export default ReceivingOrderDetails;
