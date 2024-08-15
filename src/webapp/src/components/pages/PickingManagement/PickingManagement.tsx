import { gridActions } from '@oplog/data-grid';
import { Flex, Icon, LayoutContent, Panel, Tab, Text } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { GridType, ResourceType } from '../../../models';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import Analytics from './bones/Analytics';
import PickingActivePickingsGrid from './bones/PickingActivePickingsGrid';
import PickingListsGrid from './bones/PickingListsGrid';
import PickingManagementDropAreaGrid from './bones/PickingManagementDropAreaGrid';
import PickingManagementPackingAreaGrid from './bones/PickingManagementPackingAreaGrid';
import PickingManagementParkingAreaGrid from './bones/PickingManagementParkingAreaGrid';
import PickingManagementPrioritizedOrdersGrid from './bones/PickingManagementPrioritizedOrdersGrid';
import PickingManagementWaitingOrdersGrid from './bones/PickingManagementWaitingOrdersGrid';

const intlKey = 'PickingManagement';

export enum PickingManagementTabs {
  WaitingOrders = 'waiting-orders',
  PrioritizedOrders = 'prioritized-orders',
  PickingLists = 'picking-lists',
  ActivePickings = 'active-pickings',
  DropArea = 'drop-area',
  PackingArea = 'packing-area',
  ParkingArea = 'parking-area',
}

export const PickingManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const [isRefreshButtonClickable, setIsRefreshButtonClickable] = useState(true);
  const routeProps = useRouteProps();

  const tabs = [
    {
      id: PickingManagementTabs.WaitingOrders,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.PendingOrders`)}</Text>
        </Flex>
      ),
      component: <PickingManagementWaitingOrdersGrid />,
    },
    {
      id: PickingManagementTabs.PrioritizedOrders,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.PrioritizedOrders`)}</Text>
        </Flex>
      ),
      component: <PickingManagementPrioritizedOrdersGrid />,
    },
    {
      id: PickingManagementTabs.PickingLists,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.PickingLists`)}</Text>
        </Flex>
      ),
      component: <PickingListsGrid />,
    },
    {
      id: PickingManagementTabs.ActivePickings,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.ActivePickings`)}</Text>
        </Flex>
      ),
      component: <PickingActivePickingsGrid />,
    },
    {
      id: PickingManagementTabs.DropArea,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.DropArea`)}</Text>
        </Flex>
      ),
      component: <PickingManagementDropAreaGrid />,
    },
    {
      id: PickingManagementTabs.PackingArea,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.PackingArea`)}</Text>
        </Flex>
      ),
      component: <PickingManagementPackingAreaGrid />,
    },
    {
      id: PickingManagementTabs.ParkingArea,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.ParkingArea`)}</Text>
        </Flex>
      ),
      component: <PickingManagementParkingAreaGrid />,
    },
  ];


  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(PickingManagementTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(PickingManagementTabs).findIndex(path => path === location.pathname.split('/')[2])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
  }, []);
  
  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!isRefreshButtonClickable) {
      setTimeout(() => {
        setIsRefreshButtonClickable(true);
      }, 5000);
    }
  }, [isRefreshButtonClickable]);

  const forceFetchCurrentGrid = (gridTab: string) => {
    if (gridTab === PickingManagementTabs.WaitingOrders || gridTab === ':tab') {
      dispatch(gridActions.gridFetchRequested(GridType.PickingManagementWaitingOrdersGrid));
    }
    if (gridTab === PickingManagementTabs.PrioritizedOrders) {
      dispatch(gridActions.gridFetchRequested(GridType.PrioritizedSalesOrders));
    }
    if (gridTab === PickingManagementTabs.ActivePickings) {
      dispatch(gridActions.gridFetchRequested(GridType.PickingManagementActivePickings));
    }
    if (gridTab === PickingManagementTabs.DropArea) {
      dispatch(gridActions.gridFetchRequested(GridType.PickingManagementDropArea));
    }
    if (gridTab === PickingManagementTabs.PackingArea) {
      dispatch(gridActions.gridFetchRequested(GridType.PickingManagementPackingArea));
    }
    if (gridTab === PickingManagementTabs.ParkingArea) {
      dispatch(gridActions.gridFetchRequested(GridType.PickingManagementParkingArea));
    }
    setIsRefreshButtonClickable(false);
    dispatch(resourceActions.resourceRequested(ResourceType.GetPickingManagementAnalytics));
  };

  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Breadcrumb.Title`)}
        boxShadow="none"
        fontFamily="heading"
        pb={16}
      >
        <Flex marginLeft="auto">
          <Flex
            size="large"
            variant="info"
            onClick={() => isRefreshButtonClickable && forceFetchCurrentGrid(routeProps.match.params['tab'])}
            bg={isRefreshButtonClickable ? '#4a90e2' : 'palette.grey'}
            color="palette.white"
            width={115}
            height={45}
            justifyContent="center"
            alignItems="center"
            cursor={isRefreshButtonClickable ? 'pointer' : 'unset'}
            borderRadius="sm"
            transition="0.3s linear all"
            data-testid="refreshButton"
          >
            <Icon name="far fa-redo" fontSize={16} />
            <Text ml={10} fontSize={16} fontWeight="bold">
              {t(`${intlKey}.ActionBar.Breadcrumb.Button`)}
            </Text>
          </Flex>
        </Flex>
      </ActionBar>
      <Analytics />
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

export default PickingManagement;
