import { Flex, Icon, LayoutContent, Panel, Tab, Text } from '@oplog/express';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { urls } from '../../../routers/urls';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import ActiveCountingsGrid from './bones/ActiveCountingsGrid';
import Analytics from './bones/Analytics';
import CountingFlowManagementGrid from './bones/CountingFlowManagementGrid';
import CountingListsGrid from './bones/CountingListsGrid';
import CountingPlansGrid from './bones/CountingPlansGrid';
import ManualCountingsGrid from './bones/ManualCountingsGrid';
import QualityCountingsGrid from './bones/QualityCountingsGrid';
import SystemCountingsGrid from './bones/SystemCountingsGrid';

const intlKey = 'OtherCountings';

export enum OtherCountingsTabs {
  FlowManagement = 'flow-management',
  CountingPlans = 'counting-plans',
  CountingLists = 'counting-lists',
  ActiveCountings = 'active-countings',
  SystemCountings = 'system-countings',
  ManualCountings = 'manual-countings',
  QualityCountings = 'quality-countings',
}

export const OtherCountings: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const tabs = [
    {
      id: OtherCountingsTabs.FlowManagement,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.FlowManagement`)}</Text>
        </Flex>
      ),
      component: <CountingFlowManagementGrid />,
    },
    {
      id: OtherCountingsTabs.CountingPlans,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.CountingPlans`)}</Text>
        </Flex>
      ),
      component: <CountingPlansGrid />,
    },
    {
      id: OtherCountingsTabs.CountingLists,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.CountingLists`)}</Text>
        </Flex>
      ),
      component: <CountingListsGrid />,
    },
    {
      id: OtherCountingsTabs.ActiveCountings,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.ActiveCountings`)}</Text>
        </Flex>
      ),
      component: <ActiveCountingsGrid />,
    },
    {
      id: OtherCountingsTabs.SystemCountings,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.SystemCountings`)}</Text>
        </Flex>
      ),
      component: <SystemCountingsGrid />,
    },
    {
      id: OtherCountingsTabs.ManualCountings,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.ManualCountings`)}</Text>
        </Flex>
      ),
      component: <ManualCountingsGrid />,
    },
    {
      id: OtherCountingsTabs.QualityCountings,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.QualityCountings`)}</Text>
        </Flex>
      ),
      component: <QualityCountingsGrid />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(OtherCountingsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(OtherCountingsTabs).findIndex(path => path === location.pathname.split('/')[2])
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
      >
        <Flex marginLeft="auto">
          <Flex
            size="large"
            variant="info"
            onClick={() => history.push(urls.createCountingPlan)}
            bg="#4a90e2"
            color="palette.white"
            width={227}
            height={45}
            justifyContent="center"
            alignItems="center"
            cursor="pointer"
            borderRadius="3px"
            transition="0.3s linear all"
          >
            <Icon name="fas fa-plus" fontSize={16} />
            <Text ml={10} fontSize={16} fontWeight="bold">
              {t(`${intlKey}.ActionBar.Breadcrumb.Button`)}
            </Text>
          </Flex>
        </Flex>
      </ActionBar>
      {!(location.pathname.includes(OtherCountingsTabs.FlowManagement) || location.pathname.includes(':tab')) ? (
        <Analytics />
      ) : null}
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

export default OtherCountings;
