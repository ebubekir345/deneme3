import { LayoutContent, Panel } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ActionBar from '../../organisms/ActionBar';
import DispatchManagementGrid from './bones/DispatchManagementGrid';
import PredefinedFilters from './bones/PredefinedFilters';

const intlKey = 'DispatchManagement';

const DispatchManagement: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Breadcrumb.Title`)}
        boxShadow="none"
        fontFamily="heading"
        pb={16}
      ></ActionBar>
      <PredefinedFilters />
      <LayoutContent>
        <Panel>
          <DispatchManagementGrid />
        </Panel>
      </LayoutContent>
    </>
  );
};

export default DispatchManagement;
