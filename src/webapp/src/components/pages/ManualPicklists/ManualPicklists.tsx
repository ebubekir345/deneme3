import { gridActions } from '@oplog/data-grid';
import { Button, Flex, Icon, LayoutContent, Panel } from '@oplog/express';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { GridType } from '../../../models';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import ManualPicklistsGrid from './bones/ManualPicklistsGrid';

const intlKey = 'ManualPicklists';

export const ManualPicklists: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isRefreshButtonClickable, setIsRefreshButtonClickable] = useState(true);
  const routeProps = useRouteProps();

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!isRefreshButtonClickable) {
      setTimeout(() => {
        setIsRefreshButtonClickable(true);
      }, 5000);
    }
  }, [isRefreshButtonClickable]);

  const forceFetchCurrentGrid = () => {
    setIsRefreshButtonClickable(false);
    dispatch(gridActions.gridFetchRequested(GridType.ManualPicklists));
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
        <Button
          variant="alternative"
          disabled={!isRefreshButtonClickable}
          ml="auto"
          onClick={() => isRefreshButtonClickable && forceFetchCurrentGrid()}
          fontWeight={700}
        >
          <Icon name="far fa-redo" mr={11} />
          {t(`${intlKey}.ActionBar.Breadcrumb.Button`)}
        </Button>
      </ActionBar>
      <LayoutContent>
        <Panel>
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
            <Icon name="fas fa-info-circle" fontSize={18} mr={11} color="palette.softBlue_dark" />
            <Trans i18nKey={`${intlKey}.InfoBar`} />
          </Flex>
          <ManualPicklistsGrid />
        </Panel>
      </LayoutContent>
    </>
  );
};

export default ManualPicklists;
