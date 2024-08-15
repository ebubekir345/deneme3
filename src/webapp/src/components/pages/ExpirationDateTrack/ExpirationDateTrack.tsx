import { LayoutContent, Panel } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ActionBar from '../../organisms/ActionBar';
import ExpirationDateTrackGrid from './bones/ExpirationDateTrackGrid';
import PredefinedFilters from './bones/PredefinedFilters';

const intlKey = 'ExpirationDateTrack';

export const ExpirationDateTrack: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Breadcrumb.Title`)}
      />
      <LayoutContent>
        <Panel>
        <PredefinedFilters />
          <ExpirationDateTrackGrid />
        </Panel>
      </LayoutContent>
    </>
  );
};

export default ExpirationDateTrack;
