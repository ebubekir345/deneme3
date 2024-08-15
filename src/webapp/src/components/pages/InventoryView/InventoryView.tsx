import { Flex, LayoutContent, Panel, Tab, Text } from '@oplog/express';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import InventoryCellContainersGrid from './bones/InventoryCellContainersGrid';
import InventoryTotesGrid from './bones/InventoryTotesGrid';
import InventoryTrolleysGrid from './bones/InventoryTrolleysGrid';

const intlKey = 'InventoryManagement.InventoryView';

export enum InventoryViewTabs {
  Trolleys = 'trolleys',
  Totes = 'totes',
  CellContainers = 'cell-containers',
}

export const InventoryView: React.FC = () => {
  const { t } = useTranslation();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const tabs = [
    {
      id: InventoryViewTabs.Trolleys,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.Trolley`)}</Text>
        </Flex>
      ),
      component: <InventoryTrolleysGrid />,
    },
    {
      id: InventoryViewTabs.Totes,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.Totes`)}</Text>
        </Flex>
      ),
      component: <InventoryTotesGrid />,
    },
    {
      id: InventoryViewTabs.CellContainers,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.Cells`)}</Text>
        </Flex>
      ),
      component: <InventoryCellContainersGrid />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(InventoryViewTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(InventoryViewTabs).findIndex(path => path === location.pathname.split('/')[2])
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
        title={t(`${intlKey}.Title`)}
        boxShadow="none"
        fontFamily="heading"
        pb={16}
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

export default InventoryView;
