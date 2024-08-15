import { Flex, Icon, LayoutContent, Panel, Tab } from '@oplog/express';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { PickingTrolleySelectionConfigurationPickingType } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import FlowManagementGrid from './bones/FlowManagementGrid';

export enum FlowManagementTabs {
  NormalFlows = 'normal-flows',
  MissingFlows = 'missing-flows',
}

const intlKey = 'FlowManagement';

const FlowManagement: React.FC = () => {
  const { t } = useTranslation();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const tabs = [
    {
      id: FlowManagementTabs.NormalFlows,
      title: t(`${intlKey}.Titles.NormalFlows`),
      component: (
        <>
          <Flex
            height={38}
            justifyContent="center"
            alignItems="center"
            borderRadius="sm"
            bg="palette.sky"
            color="palette.slate_darker"
            mb={16}
            fontFamily="heading"
          >
            <Icon name="fas fa-info-circle" fontSize={18} mr={11} color="palette.blue_darker" />
            <Trans i18nKey={`${intlKey}.InfoBar.Normal`} />
          </Flex>
          <FlowManagementGrid flowType={PickingTrolleySelectionConfigurationPickingType.Normal} />
        </>
      ),
    },
    {
      id: FlowManagementTabs.MissingFlows,
      title: t(`${intlKey}.Titles.MissingFlows`),
      component: (
        <>
          <Flex
            height={38}
            justifyContent="center"
            alignItems="center"
            borderRadius="sm"
            bg="palette.sky"
            color="palette.slate_darker"
            mb={16}
            fontFamily="heading"
          >
            <Icon name="fas fa-info-circle" fontSize={18}  mr={11} color="palette.softBlue_dark" />
            <Trans i18nKey={`${intlKey}.InfoBar.MissingItem`} />
          </Flex>
          <FlowManagementGrid flowType={PickingTrolleySelectionConfigurationPickingType.MissingItem} />
        </>
      ),
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(FlowManagementTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(FlowManagementTabs).findIndex(path => path === location.pathname.split('/')[2]);
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
export default FlowManagement;
