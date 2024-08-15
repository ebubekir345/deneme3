import { LayoutContent, Panel, Tab } from '@oplog/express';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import AddressesGrid from './bones/AddressesGrid';
import CellContainersGrid from './bones/CellContainersGrid';
import PrintersGrid from './bones/PrintersGrid';
import TotesGrid from './bones/TotesGrid';
import TrolleysGrid from './bones/TrolleysGrid';

export enum WarehouseManagementTabs {
  Addresses = 'addresses',
  CellContainers = 'cell-containers',
  Totes = 'totes',
  Printers = 'printers',
  Trolleys = 'trolleys',
}

const intlKey = 'WarehouseManagement';

const WarehouseManagement: React.FC = () => {
  const { t } = useTranslation();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const tabs = [
    {
      id: WarehouseManagementTabs.Addresses,
      title: t(`${intlKey}.Titles.Addresses`),
      component: <AddressesGrid />,
    },
    {
      id: WarehouseManagementTabs.CellContainers,
      title: t(`${intlKey}.Titles.CellContainers`),
      component: <CellContainersGrid />,
    },
    {
      id: WarehouseManagementTabs.Totes,
      title: t(`${intlKey}.Titles.Totes`),
      component: <TotesGrid />,
    },
    {
      id: WarehouseManagementTabs.Printers,
      title: t(`${intlKey}.Titles.Printers`),
      component: <PrintersGrid />,
    },
    {
      id: WarehouseManagementTabs.Trolleys,
      title: t(`${intlKey}.Titles.Trolleys`),
      component: <TrolleysGrid />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(WarehouseManagementTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(WarehouseManagementTabs).findIndex(path => path === location.pathname.split('/')[2])
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
        breadcrumb={[
          {
            title: t(`${intlKey}.ActionBar.Breadcrumb.Title`),
          },
          {
            title: t(
              `${intlKey}.Titles.${Object.keys(WarehouseManagementTabs)[
                Object.values(WarehouseManagementTabs).findIndex(tab => location.pathname.includes(tab))
              ] || Object.keys(WarehouseManagementTabs)[0]}`
            ),
          },
        ]}
        title={t(`${intlKey}.Title`)}
        subtitle={t(`${intlKey}.ActionBar.Breadcrumb.Subtitle`)}
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

export default WarehouseManagement;
