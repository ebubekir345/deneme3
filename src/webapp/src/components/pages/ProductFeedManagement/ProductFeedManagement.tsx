import { Flex, LayoutContent, Panel, Tab, Text } from '@oplog/express';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import Analytics from './bones/Analytics';
import ProductFeedManagementBlockingFeedGrid from './bones/ProductFeedManagementBlockingFeedGrid';
import ProductFeedManagementRecommendedFeedGrid from './bones/ProductFeedManagementRecommendedFeedGrid';
import ProductFeedManagementReservedProductsGrid from './bones/ProductFeedManagementReservedProductsGrid';

const intlKey = 'ProductFeedManagement';

export enum ProductFeedManagementTabs {
  BlockingFeed = 'blocking-feed',
  RezervedProducts = 'reserved-products',
  RecommendedFeed = 'recommendedFeed',
}

export const ProductFeedManagement: React.FC = () => {
  const { t } = useTranslation();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const tabs = [
    {
      id: ProductFeedManagementTabs.BlockingFeed,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.BlokingFeeds`)}</Text>
        </Flex>
      ),
      component: <ProductFeedManagementBlockingFeedGrid />,
    },
    {
      id: ProductFeedManagementTabs.RezervedProducts,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.RezervedProducts`)}</Text>
        </Flex>
      ),
      component: <ProductFeedManagementReservedProductsGrid />,
    },
    {
      id: ProductFeedManagementTabs.RecommendedFeed,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.RecommendedFeed`)}</Text>
        </Flex>
      ),
      component: <ProductFeedManagementRecommendedFeedGrid />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(ProductFeedManagementTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(ProductFeedManagementTabs).findIndex(path => path === location.pathname.split('/')[2])
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
        title={t(`${intlKey}.ActionBar.Breadcrumb.Title`)}
        boxShadow="none"
        fontFamily="heading"
        pb={16}
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

export default ProductFeedManagement;
