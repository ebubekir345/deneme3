import { Flex, LayoutContent, Panel, Tab, Text } from '@oplog/express';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import Analytics from './bones/Analytics';
import SNPackagedProductGrid from './bones/SNPackagedProductsGrid';
import SNStockGrid from './bones/SNStockGrid';

const intlKey = 'SerialNumberTrack';

export enum SerialNumberTrackTabs {
  Stock = 'stock',
  PackagedProducts = 'packaged-products',
}

export const SerialNumberTrack: React.FC = () => {
  const { t } = useTranslation();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const tabs = [
    {
      id: SerialNumberTrackTabs.Stock,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.Stock`)}</Text>
        </Flex>
      ),
      component: <SNStockGrid />,
    },
    {
      id: SerialNumberTrackTabs.PackagedProducts,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.PackagedProducts`)}</Text>
        </Flex>
      ),
      component: <SNPackagedProductGrid />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(SerialNumberTrackTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(SerialNumberTrackTabs).findIndex(path => path === location.pathname.split('/')[2]);
    setActiveTab(index === -1 ? 0 : index);
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
        title={t(`${intlKey}.ActionBar.Breadcrumb.Title`)}
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

export default SerialNumberTrack;
