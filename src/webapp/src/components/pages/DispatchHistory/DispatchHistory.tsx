import { Panel, LayoutContent } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DispatchHistoryGrid from './bones/DispatchHistoryGrid';
import ActionBar from '../../organisms/ActionBar';

const intlKey = 'DispatchHistory';

const DispatchHistory: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Title`)}
      />
      <LayoutContent>
        <Panel title={t(`${intlKey}.Grid.Title`)}>
          <DispatchHistoryGrid />
        </Panel>
      </LayoutContent>
    </>
  );
};
export default DispatchHistory;
