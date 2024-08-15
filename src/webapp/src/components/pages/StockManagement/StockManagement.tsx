import { LayoutContent, Panel, Tab } from '@oplog/express';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import StocksNoStockGrid from '../../molecules/StocksNoStockGrid/StocksNoStockGrid';
import ActionBar from '../../organisms/ActionBar';
import Analytics from './bones/Analytics';
import StocksCurrentStatusGrid from './bones/StocksCurrentStatusGrid';
import StocksStockStatusGrid from './bones/StocksStockStatusGrid';
import StocksZoneStatusGrid from './bones/StocksZoneStatusGrid';

export enum StockManagementTabs {
  CurrentStatus = 'current-status',
  ZoneStatus = 'zone-status',
  StockStatus = 'stock-status',
  NoStock = 'no-stock',
}

const intlKey = 'StockManagement';

export const StockManagement: React.FC = () => {
  const { t } = useTranslation();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const tabs = [
    {
      id: StockManagementTabs.CurrentStatus,
      title: t(`${intlKey}.Titles.CurrentStatus`),
      component: <StocksCurrentStatusGrid />,
    },
    {
      id: StockManagementTabs.ZoneStatus,
      title: t(`${intlKey}.Titles.ZoneStatus`),
      component: <StocksZoneStatusGrid />,
    },
    {
      id: StockManagementTabs.StockStatus,
      title: t(`${intlKey}.Titles.StockStatus`),
      component: <StocksStockStatusGrid />,
    },
    {
      id: StockManagementTabs.NoStock,
      title: t(`${intlKey}.Titles.NoStock`),
      component: <StocksNoStockGrid />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(StockManagementTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(StockManagementTabs).findIndex(path => path === location.pathname.split('/')[2])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
  }, []);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Title`)}
      />
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

export default StockManagement;
