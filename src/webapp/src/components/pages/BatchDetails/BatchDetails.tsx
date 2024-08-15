import { LayoutContent, Panel, PanelTitle, Tab } from '@oplog/express';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { BatchType } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import BatchStatePipeline from './bones/BatchStatePipeline';
import OrdersGrid from './bones/OrdersGrid';
import PickListsGrid from './bones/PickListsGrid';

export enum BatchDetailsTabs {
  Orders = 'orders',
  PickLists = 'pick-lists',
}

const intlKey = 'BatchDetails';

const BatchDetails: React.FC = () => {
  const { t } = useTranslation();
  const { referenceNumber, name, batchType }: any = useParams();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const routeProps = useRouteProps();

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(BatchDetailsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  const tabs = [
    {
      id: BatchDetailsTabs.Orders,
      title: t(`${intlKey}.Titles.Orders`),
      component: <OrdersGrid batchId={referenceNumber} />,
    },
    {
      id: BatchDetailsTabs.PickLists,
      title: t(`${intlKey}.Titles.PickLists`),
      component: <PickListsGrid batchId={referenceNumber} />,
    },
  ];

  useEffect(() => {
    const index = Object.values(BatchDetailsTabs).findIndex(path => path === location.pathname.split('/')[2]);
    setActiveTab(index === -1 ? 0 : index);
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
        title={`${t(`${intlKey}.ActionBar.Breadcrumb.Title`)}: ${name}`}
      />
      <LayoutContent>
        {batchType === BatchType.ItemBase && (
          <Panel mb="22">
            <PanelTitle>{`${t(`${intlKey}.BatchState`)}`}</PanelTitle>
            <BatchStatePipeline />
          </Panel>
        )}
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

export default BatchDetails;
