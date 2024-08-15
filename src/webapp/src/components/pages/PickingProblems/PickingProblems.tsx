import { Flex, Icon, LayoutContent, Panel, Tab, Text } from '@oplog/express';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { roles } from '../../../auth/roles';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import PickingManagementQuarantineTotesGrid from './bones/PickingManagementQuarantineTotesGrid';
import PickingProblemsGrid from './bones/PickingProblemsGrid';
import ProblemsAnalytics from './bones/ProblemsAnalytics';
import TransferTrolleysGrid from './bones/TransferTrolleysGrid';

const intlKey = 'Problems.PickingProblems';

export enum PickingProblemsTabs {
  ProblemList = 'problem-list',
  TransferTrolleys = 'transfer-trolleys',
  QuarantineTotes = 'quarantine-totes',
}

export const PickingProblems: React.FC = () => {
  const { t } = useTranslation();
  const [{ activeTab }, { userHasMinRole, setActiveTab, setTabLength }] = useCommonStore();
  const routeProps = useRouteProps();

  const tabs = [
    {
      id: PickingProblemsTabs.ProblemList,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.ProblemList`)}</Text>
        </Flex>
      ),
      component: <PickingProblemsGrid />,
    },
    {
      id: PickingProblemsTabs.TransferTrolleys,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.Trolley`)}</Text>
        </Flex>
      ),
      component: <TransferTrolleysGrid />,
    },
    {
      id: PickingProblemsTabs.QuarantineTotes,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.QuarantineTotes`)}</Text>
        </Flex>
      ),
      component: <PickingManagementQuarantineTotesGrid />,
    },
  ];

  useEffect(() => {
    const index = Object.values(PickingProblemsTabs).findIndex(path => path === location.pathname.split('/')[2])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
  }, []);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(PickingProblemsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Breadcrumb.Title`)}
        boxShadow="none"
        fontFamily="heading"
        pb={16}
      >
        {userHasMinRole(roles.ProblemSolver) && (
          <Flex marginLeft="auto">
            <Flex
              size="large"
              color="palette.white"
              justifyContent="center"
              alignItems="center"
              borderRadius="3px"
              bg="#4a90e2"
              px={22}
              py={11}
              onClick={() => window.open('/problem-solver', '_blank')}
              cursor="pointer"
            >
              <Icon name="far fa-key" fontSize={16} />
              <Text ml={10} fontSize={16} fontWeight="bold">
                {t(`${intlKey}.ActionBar.Breadcrumb.Button`)}
              </Text>
            </Flex>
          </Flex>
        )}
      </ActionBar>
      <ProblemsAnalytics />
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

export default PickingProblems;
