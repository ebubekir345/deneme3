import { Flex, LayoutContent, Panel, Tab, Text } from '@oplog/express';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import Analytics from './bones/Analytics';
import PutAwayManagementActivePutAwaysGrid from './bones/PutAwayManagementActivePutAwaysGrid';
import PutAwayManagementBlockingPutAwaysGrid from './bones/PutAwayManagementBlockingPutAwaysGrid';
import PutAwayManagementCellStatusGrid from './bones/PutAwayManagementCellStatusGrid';
import PutAwayManagementParkingAreaGrid from './bones/PutAwayManagementParkingAreaGrid';
import PutAwayManagementWaitingPalletsGrid from './bones/PutAwayManagementWaitingPalletsGrid';
import PutAwayManagementWaitingProductsGrid from './bones/PutAwayManagementWaitingProductsGrid';
import PutAwayManagementWaitingTotesGrid from './bones/PutAwayManagementWaitingTotesGrid';

const intlKey = 'PutAwayManagement';

export enum PutAwayManagementTabs {
  BlockingPutAways = 'blocking-putaways',
  WaitingProducts = 'waiting-products',
  WaitingTotes = 'waiting-totes',
  WaitingPallets = 'waiting-pallets',
  ActivePutAways = 'active-putaways',
  ParkingArea = 'parking-area',
  CellStatus = 'cell-status',
}

export const PutAwayManagement: React.FC = () => {
  const { t } = useTranslation();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const tabs = [
    {
      id: PutAwayManagementTabs.BlockingPutAways,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.BlockingPutAways`)}</Text>
        </Flex>
      ),
      component: <PutAwayManagementBlockingPutAwaysGrid />,
    },
    {
      id: PutAwayManagementTabs.WaitingProducts,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.WaitingProducts`)}</Text>
        </Flex>
      ),
      component: <PutAwayManagementWaitingProductsGrid />,
    },
    {
      id: PutAwayManagementTabs.WaitingTotes,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.WaitingTotes`)}</Text>
        </Flex>
      ),
      component: <PutAwayManagementWaitingTotesGrid />,
    },
    {
      id: PutAwayManagementTabs.WaitingPallets,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.WaitingPallets`)}</Text>
        </Flex>
      ),
      component: <PutAwayManagementWaitingPalletsGrid />,
    },
    {
      id: PutAwayManagementTabs.ActivePutAways,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.ActivePutAways`)}</Text>
        </Flex>
      ),
      component: <PutAwayManagementActivePutAwaysGrid />,
    },
    {
      id: PutAwayManagementTabs.ParkingArea,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.ParkingArea`)}</Text>
        </Flex>
      ),
      component: <PutAwayManagementParkingAreaGrid />,
    },
    {
      id: PutAwayManagementTabs.CellStatus,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.CellStatus`)}</Text>
        </Flex>
      ),
      component: <PutAwayManagementCellStatusGrid />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(PutAwayManagementTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(PutAwayManagementTabs).findIndex(path => path === location.pathname.split('/')[2])
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

export default PutAwayManagement;
