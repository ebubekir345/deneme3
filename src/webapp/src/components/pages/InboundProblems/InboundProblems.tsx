import { Flex, Icon, LayoutContent, Panel, Text } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { roles } from '../../../auth/roles';
import { ResourceType } from '../../../models';
import useCommonStore from '../../../store/global/commonStore';
import InboundProblemsGrid from './bones/InboundProblemsGrid';
import ActionBar from '../../organisms/ActionBar';
import InboundProblemsAnalytics from './bones/InboundProblemsAnalytics';

const intlKey = 'InboundProblems';

export const InboundProblems: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ auth0UserInfo }, { userHasMinRole }] = useCommonStore();

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetInboundProblemsAnalytics));
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetInboundProblemsAnalytics));
    };
  }, []);

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
              onClick={() => window.open('/inbound-problem-solver', '_blank')}
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
      <InboundProblemsAnalytics />
      <LayoutContent>
        <Panel>
          <InboundProblemsGrid />
        </Panel>
      </LayoutContent>
    </>
  );
};

export default InboundProblems;
