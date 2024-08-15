import { gridActions } from '@oplog/data-grid';
import { Button, Icon, LayoutContent, Panel, Tab } from '@oplog/express';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { GridType } from '../../../models';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import ProblematicOrdersGrid from './bones/ProblematicOrdersGrid';
import ZoneListCapacityGrid from './bones/ZoneListCapacityGrid';

const intlKey = 'OrderPickListProblems';

const componentMapping: Record<string, FC> = {
  ProblematicOrders: ProblematicOrdersGrid,
  ZoneListCapacity: ZoneListCapacityGrid,
};

enum OrderPickListProblemsTabs {
  ProblematicOrders = 'problematic-orders',
  ZoneListCapacity = 'zone-list-capacity',
}
interface TabType {
  id: string;
  title: string;
  component: JSX.Element;
}

const OrderPickListProblems: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const routeProps = useRouteProps();
  const [isRefreshButtonClickable, setIsRefreshButtonClickable] = useState(true);

  const tabs: TabType[] = Object.entries(OrderPickListProblemsTabs).map(([key, value]) => {
    const Component = componentMapping[key];
    return {
      id: value,
      title: t(`${intlKey}.Titles.${key}`),
      component: <Component />,
    };
  });

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(OrderPickListProblemsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(OrderPickListProblemsTabs).findIndex(path => path === location.pathname.split('/')[2]);
    setActiveTab(index === -1 ? 0 : index);
    setTabLength(tabs.length);
  }, []);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    !isRefreshButtonClickable &&
      setTimeout(() => {
        setIsRefreshButtonClickable(true);
      }, 5000);
  }, [isRefreshButtonClickable]);

  return (
    <>
      <ActionBar
        title={t(`${intlKey}.Title`)}
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        fontFamily="heading"
        pb={16}
      >
        <Button
          onClick={() => {
            setIsRefreshButtonClickable(false);
            routeProps.match.params['tab'] === OrderPickListProblemsTabs.ProblematicOrders ||
            routeProps.match.params['tab'] === ':tab'
              ? dispatch(gridActions.gridFetchRequested(GridType.QuerySalesOrdersWithPickListProblems))
              : dispatch(gridActions.gridFetchRequested(GridType.QueryStockZonePickListCapacity));
          }}
          disabled={!isRefreshButtonClickable}
          variant="alternative"
          fontWeight={700}
          px={8}
          ml="auto"
          letterSpacing="medium"
        >
          <Icon name="far fa-redo" mr={11} />
          {t(`TouchScreen.ActionButtons.Refresh`)}
        </Button>
      </ActionBar>
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

export default OrderPickListProblems;
