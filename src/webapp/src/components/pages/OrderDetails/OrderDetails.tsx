import { Badge, LayoutContent, Panel, PanelTitle, PseudoBox, Tab } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import {
  RecipientAddressDetailsOutputDTO,
  SalesOrderNotesQueryOutputDTO,
  SalesOrdersStateDetailsOutputDTO,
} from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import ActionBarContent from './bones/ActionBarContent';
import CargoPackages from './bones/CargoPackages';
import SalesOrderGrid from './bones/grids/SalesOrderGrid';
import SalesOrderOperationalStateDetailsGrid from './bones/grids/SalesOrderOperationalStateDetailsGrid';
import SalesOrderPickingDetailsGrid from './bones/grids/SalesOrderPickingDetailsGrid';
import SalesOrderProblemsGrid from './bones/grids/SalesOrderProblemsGrid';
import SalesOrderValueAddedServicesGrid from './bones/grids/SalesOrderValueAddedServicesGrid';
import InfoPanels from './bones/InfoPanels';
import OrderDetailsNotes from './bones/OrderDetailsNotes';
import ReturnPackages from './bones/ReturnPackages';
import StatePipeline from './bones/StatePipeline';

export enum OrderDetailsTabs {
  SalesOrder = 'sales-order',
  Packages = 'packages',
  Returns = 'returns',
  Problems = 'problems',
  OperationalDetails = 'oparational-details',
  PickingDetails = 'picking-details',
  ValueAddedServices = 'value-added-services',
  OrderDetailNotes = 'order-notes',
}

const intlKey = 'OrderDetails';

const OrderDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id }: { id: any } = useParams();
  const [noteCount, setNoteCount] = useState(0);
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const pipelineResource: Resource<SalesOrdersStateDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrderStateDetail]
  );
  const recipientAddress: Resource<RecipientAddressDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RecipientAddressDetails]
  );
  const getNotesResponse: Resource<SalesOrderNotesQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.QuerySalesOrderNotes]
  );

  const routeProps = useRouteProps();
  const dispatch = useDispatch();
  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(OrderDetailsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  const refNumber = recipientAddress?.data?.salesOrderReferenceNumber
    ? recipientAddress.data.salesOrderReferenceNumber
    : '';

  const tabs = [
    {
      id: OrderDetailsTabs.SalesOrder,
      title: t(`${intlKey}.Titles.SalesOrder`),
      component: <SalesOrderGrid orderId={id} />,
    },
    {
      id: OrderDetailsTabs.Packages,
      title: t(`${intlKey}.Titles.Packages`),
      component: <CargoPackages />,
    },
    {
      id: OrderDetailsTabs.Returns,
      title: t(`${intlKey}.Titles.Returns`),
      component: <ReturnPackages />,
    },
    {
      id: OrderDetailsTabs.Problems,
      title: t(`${intlKey}.Titles.Problems`),
      component: <SalesOrderProblemsGrid orderId={id} />,
    },
    {
      id: OrderDetailsTabs.OperationalDetails,
      title: t(`${intlKey}.Titles.OperationalDetails`),
      component: <SalesOrderOperationalStateDetailsGrid orderId={id} />,
    },
    {
      id: OrderDetailsTabs.PickingDetails,
      title: t(`${intlKey}.Titles.PickingDetails`),
      component: <SalesOrderPickingDetailsGrid orderId={id} />,
    },
    {
      id: OrderDetailsTabs.ValueAddedServices,
      title: t(`${intlKey}.Titles.ValueAddedServices`),
      component: <SalesOrderValueAddedServicesGrid orderId={id} />,
    },
    {
      id: OrderDetailsTabs.OrderDetailNotes,
      title: (
        <PseudoBox>
          {t(`${intlKey}.Titles.OrderDetailsNotes`)}{' '}
          {noteCount > 0 && (
            <Badge bg="palette.red" variant="danger">
              {noteCount}
            </Badge>
          )}
        </PseudoBox>
      ),
      component: <OrderDetailsNotes />,
    },
  ];

  useEffect(() => {
    const index = Object.values(OrderDetailsTabs).findIndex(path => path === location.pathname.split('/')[2])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
    dispatch(
      resourceActions.resourceRequested(ResourceType.QuerySalesOrderNotes, {
        salesOrderId: id,
      })
    );
  }, []);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (getNotesResponse?.data && getNotesResponse?.isSuccess == true) {
      let count = Object.keys(getNotesResponse?.data).length;
      setNoteCount(count);
    }
  }, [getNotesResponse]);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  const breadcrumb = [
    { title: `${t(`${intlKey}.ActionBar.Breadcrumb.Title`)}`, url: urls.orderManagement },
    { title: `${refNumber}` },
  ];

  return (
    <>
      <ActionBar
        title={refNumber}
        isLoading={recipientAddress?.isBusy || pipelineResource?.isBusy}
        breadcrumb={breadcrumb}
        integration={{
          icon: pipelineResource?.data?.operation?.imageUrl || '',
          name: pipelineResource?.data?.operation?.name || t('Integration.NoIntegration'),
        }}
      >
        <ActionBarContent />
      </ActionBar>
      <LayoutContent>
        <Panel mb="22">
          <PanelTitle>{`${t(`${intlKey}.OrderInfo`)}`}</PanelTitle>
          <StatePipeline />
        </Panel>
        <Panel mb="30">
          <PanelTitle>{`${t(`${intlKey}.CustomerInfo`)}`}</PanelTitle>
          <InfoPanels />
        </Panel>
        <Panel>
          <Tab
            onTabChange={data => {
              updateRouteOnTabChange(data);
            }}
            tabs={tabs}
          />
        </Panel>
      </LayoutContent>
    </>
  );
};

export default OrderDetails;
