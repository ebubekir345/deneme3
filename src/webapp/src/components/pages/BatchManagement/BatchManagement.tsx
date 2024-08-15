import { Box, Flex, Icon, LayoutContent, Panel } from '@oplog/express';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import BatchManagementGrid from './bones/BatchManagementGrid';
import BatchPickingRulesModal from './bones/BatchPickingRulesModal';

const intlKey = 'BatchManagement';

export const BatchManagement: React.FC = () => {
  const { t } = useTranslation();
  const routeProps = useRouteProps();
  const [isBatchPickingRulesModalOpen, setIsBatchPickingRulesModalOpen] = useState(false)

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
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Icon
          name="fas fa-cog"
          fontSize={26}
          m={16}
          cursor="pointer"
          color="text.h1"
          onClick={() => setIsBatchPickingRulesModalOpen(true)}
        />
      </ActionBar>
      <LayoutContent>
        <Panel>
          <BatchManagementGrid />
        </Panel>
      </LayoutContent>
      <BatchPickingRulesModal isOpen={isBatchPickingRulesModalOpen} setIsOpen={setIsBatchPickingRulesModalOpen} />
    </>
  );
};

export default BatchManagement;
