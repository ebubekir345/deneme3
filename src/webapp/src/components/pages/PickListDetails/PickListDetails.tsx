import { Flex, formatUtcToLocal, LayoutContent, Panel, Tab, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { PickListDetailsOutputDTO } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import InfoPanel from './bones/InfoPanel';
import PickListDetailsPickingHistoryGrid from './bones/PickListDetailsPickingHistoryGrid';
import PickListDetailsPickingPlanGrid from './bones/PickListDetailsPickingPlanGrid';
import PickListDetailsSalesOrdersGrid from './bones/PickListDetailsSalesOrdersGrid';

const intlKey = 'PickListDetails';

export enum PickListDetailsTabs {
  SalesOrders = 'sales-orders',
  PickingPlan = 'picking-plan',
  PickingHistory = 'picking-history',
}

const PickListDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const pickListDetails: Resource<PickListDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPickListDetails]
  );
  let { pickListId }: { pickListId: any } = useParams();
  pickListId = decodeURI(pickListId);

  const tabs = [
    {
      id: PickListDetailsTabs.SalesOrders,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.SalesOrders`)}</Text>
        </Flex>
      ),
      component: <PickListDetailsSalesOrdersGrid pickListId={pickListId} />,
    },
    {
      id: PickListDetailsTabs.PickingPlan,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.PickingPlan`)}</Text>
        </Flex>
      ),
      component: <PickListDetailsPickingPlanGrid pickListId={pickListId} />,
    },
    {
      id: PickListDetailsTabs.PickingHistory,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.PickingHistory`)}</Text>
        </Flex>
      ),
      component: <PickListDetailsPickingHistoryGrid pickListId={pickListId} />,
    },
  ];
  
  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(PickListDetailsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(PickListDetailsTabs).findIndex(path => path === location.pathname.split('/')[2])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
    dispatch(resourceActions.resourceRequested(ResourceType.GetPickListDetails, { pickListId }));
  }, []);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  const breadcrumb = [
    { title: `${t(`${intlKey}.ActionBar.Breadcrumb.Title`)}`, url: urls.pickingManagement },
    { title: t(`${intlKey}.ActionBar.Subtitle`) },
  ];

  const infoRows = [
    [
      { key: t(`${intlKey}.InfoPanel.PickListName`), value: pickListDetails?.data?.pickListName },
      { key: t(`${intlKey}.InfoPanel.PickingFlowTag`), value: t(`Enum.${pickListDetails?.data?.pickingFlowTag}`) },
      { key: t(`${intlKey}.InfoPanel.PickingMethod`), value: t(`Enum.${pickListDetails?.data?.pickingMethod}`) },
      { key: t(`${intlKey}.InfoPanel.PickingType`), value: t(`Enum.${pickListDetails?.data?.pickingType}`) },
    ],
    [
      {
        key: t(`${intlKey}.InfoPanel.Capacity`),
        value: pickListDetails?.data?.capacity
          ? `${pickListDetails?.data?.capacity} ${t(
              `${intlKey}.CapacityTypes.${pickListDetails?.data?.pickingCapacityUnit}`
            )}`
          : 'N/A',
      },
      {
        key: t(`${intlKey}.InfoPanel.PickingTrolley`),
        value: pickListDetails?.data?.pickingTrolleyLabel ? pickListDetails?.data?.pickingTrolleyLabel : 'N/A',
      },
      {
        key: t(`${intlKey}.InfoPanel.PickingToteLabels`),
        value: pickListDetails?.data?.pickingToteLabels ? pickListDetails?.data?.pickingToteLabels.join() : 'N/A',
      },
    ],
    [
      {
        key: t(`${intlKey}.InfoPanel.CreatedAt`),
        value: pickListDetails?.data?.createdAt ? formatUtcToLocal(pickListDetails?.data?.createdAt as any) : 'N/A',
      },
      {
        key: t(`${intlKey}.InfoPanel.PickingStartedAt`),
        value: pickListDetails?.data?.pickingStartedAt
          ? formatUtcToLocal(pickListDetails?.data?.pickingStartedAt as any)
          : 'N/A',
      },
      {
        key: t(`${intlKey}.InfoPanel.PickingCompletedAt`),
        value: pickListDetails?.data?.pickingCompletedAt
          ? formatUtcToLocal(pickListDetails?.data?.pickingCompletedAt as any)
          : 'N/A',
      },
    ],
  ];

  return (
    <>
      <ActionBar
        title={pickListDetails?.data?.pickListName || ''}
        isLoading={pickListDetails?.isBusy}
        breadcrumb={breadcrumb}
      ></ActionBar>
      <InfoPanel rows={infoRows} isBusy={pickListDetails?.isBusy} />
      <LayoutContent>
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

export default PickListDetails;
