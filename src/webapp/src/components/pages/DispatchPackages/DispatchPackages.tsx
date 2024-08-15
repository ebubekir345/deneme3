import { LayoutContent, Panel } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DispatchPackagesGrid from './bones/DispatchPackagesGrid';
import ActionBar from '../../organisms/ActionBar';
import PredefinedFilters from './bones/PredefinedFilters';

const intlKey = 'DispatchPackages';

const DispatchPackages: React.FC = () => {
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
          <DispatchPackagesGrid />
        </Panel>
      </LayoutContent>
    </>
  );
};

export default DispatchPackages;
