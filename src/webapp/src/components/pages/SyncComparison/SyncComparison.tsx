import { LayoutContent, Panel, Tab } from '@oplog/express';
import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '../../../config';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';

export enum SyncComparisonTabs {
  Order = 'order',
  Inbound = 'inbound',
  InboundItems = 'items',
  Return = 'return',
  Product = 'product',
  Stock = 'stock'
}

const intlKey = 'SyncComparison';

type TabType = {
  id: string;
  title: string;
  component: React.ReactElement;
};

const SyncComparison: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const tabs: TabType[] = [];

  const tabUrls: Record<SyncComparisonTabs, string> = {
    [SyncComparisonTabs.Order]: `https://oplog.retool.com/embedded/public/cb5320e7-14c6-4254-a596-c375b958c49d#env=${config.env}`,
    [SyncComparisonTabs.Inbound]: `https://oplog.retool.com/embedded/public/cda03372-02c5-492c-94bd-d26b09f9f761#env=${config.env}`,
    [SyncComparisonTabs.InboundItems]: `https://oplog.retool.com/embedded/public/7c25478b-d077-43cb-9e18-734780162678#env=${config.env}`,
    [SyncComparisonTabs.Return]: `https://oplog.retool.com/embedded/public/31a410cf-1ee4-40fd-8bfe-449dd04af5fe#env=${config.env}`,
    [SyncComparisonTabs.Product]: `https://oplog.retool.com/embedded/public/c876ee83-031f-4fdd-aef8-b87625178a75#env=${config.env}`,
    [SyncComparisonTabs.Stock]: `https://oplog.retool.com/embedded/public/28a7a8c3-cd6d-4d62-b486-6c0ea873b232#env=${config.env}`,
  };

  for (const [key, value] of Object.entries(SyncComparisonTabs)) {
    tabs.push({
      id: value,
      title: t(`${intlKey}.Titles.${key}`),
      component: (
        <iframe
          key={key}
          src={tabUrls[value as SyncComparisonTabs]}
          width="100%"
          height="100%"
          style={{ border: 'none', height: 'calc(100vh - 200px)' }}
        ></iframe>
      )
    });
  }

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(SyncComparisonTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(SyncComparisonTabs).findIndex(path => path === routeProps.match.params['tab'])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
  }, []);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Title`)}
      />
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

export default SyncComparison;
