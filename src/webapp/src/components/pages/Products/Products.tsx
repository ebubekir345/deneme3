import { LayoutContent, Panel, Tab } from '@oplog/express';
import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import MasterCartonsGrid from './bones/MasterCartonsGrid';
import ProductsGrid from './bones/ProductsGrid';

export enum ProductsTabs {
  ProductList = 'product-list',
  MasterCartons = 'master-cartons',
}

const intlKey = 'Products';

const Products: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const tabs = [
    {
      id: ProductsTabs.ProductList,
      title: t(`${intlKey}.Titles.Products`),
      component: <ProductsGrid />,
    },
    {
      id: ProductsTabs.MasterCartons,
      title: t(`${intlKey}.Titles.MasterCartons`),
      component: <MasterCartonsGrid />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(ProductsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(ProductsTabs).findIndex(path => path === location.pathname.split('/')[2])
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
        subtitle={t(`${intlKey}.ActionBar.Subtitle`)}
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

export default Products;
