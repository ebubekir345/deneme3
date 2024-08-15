import { Flex, Icon, LayoutContent, Panel, Text } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { roles } from '../../../auth/roles';
import { ResourceType } from '../../../models';
import useCommonStore from '../../../store/global/commonStore';
import DispatchProblemsGrid from './bones/DispatchProblemsGrid';
import ActionBar from '../../organisms/ActionBar';
import ProblemsAnalytics from './bones/ProblemsAnalytics';

const intlKey = 'Problems.DispatchProblems';

export const DispatchProblems: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ auth0UserInfo }, { userHasMinRole }] = useCommonStore();
  const { tab } = useParams<{ tab: any }>();

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetDispatchProblemsAnalytics));
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetDispatchProblemsAnalytics));
    };
  }, [tab]);

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
          <DispatchProblemsGrid />,
        </Panel>
      </LayoutContent>
    </>
  );
};

export default DispatchProblems;
