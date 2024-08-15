import { Panel, Flex, LayoutContent, Button } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { urls } from '../../../routers/urls';
import LostItemsGrid from './bones/LostItemsGrid';
import ActionBar from '../../organisms/ActionBar';

const intlKey = 'LostItems';

const LostItems: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Title`)}
      >
        <Flex marginLeft="auto">
          <Button size="large" variant="dark" onClick={() => history.push(urls.quarantineManagement)}>
            {t(`${intlKey}.QuarantineManagement`)}
          </Button>
        </Flex>
      </ActionBar>
      <LayoutContent>
        <Panel>
          <LostItemsGrid />
        </Panel>
      </LayoutContent>
    </>
  );
};
export default LostItems;
