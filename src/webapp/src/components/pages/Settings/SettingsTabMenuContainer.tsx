// TODO: Rewrite this!!
import { ColumnSize, DataGridRow, dateTimeFormatter } from '@oplog/data-grid';
import { Panel, Tab, TabItem, TabProps } from '@oplog/express';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { GridType } from '../../../models';
import { StoreState } from '../../../store/initState';
import { geti18nName } from '../../../utils/formatters';
import { onTabChange, resolveActiveIndex } from '../../../utils/url-utils';
import GenericDataGrid from '../../atoms/GenericDataGrid';

const intlKey = 'Settings';
const titleKey = 'Settings.Grid.Title';

const settingsGridInitalSort: SortField = new SortField({
  property: 'createdAt',
  by: SortDirection.DESC,
});

export enum Tabs {
  Users = 'users',
  CompanyInfo = 'company-info',
}

export interface SettingsTabMenuContainerProps extends RouteComponentProps {
  getCellActions: any;
  t: any;
}

export interface TabMenuPropsWithIntl extends TabProps {
  getCellActions: any;
}

function mapStateToProps(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { resources }: StoreState,
  ownProps: SettingsTabMenuContainerProps
): Partial<TabMenuPropsWithIntl> {
  let tabItems: Array<TabItem> = [];

  const settingsGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      filterable: false,
      cellClass: 'index-column',
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('FirstName', ownProps.t, intlKey),
      key: 'firstName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('LastName', ownProps.t, intlKey),
      key: 'lastName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Email', ownProps.t, intlKey),
      key: 'email',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('PhoneNumber', ownProps.t, intlKey),
      key: 'phoneNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('CreatedAt', ownProps.t, intlKey),
      key: 'createdAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('Role', ownProps.t, intlKey),
      key: 'role',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];

  tabItems = [
    {
      id: Tabs.Users,
      title: ownProps.t(`${intlKey}.Grid.User`),
      component: (
        <Panel title={ownProps.t(`${intlKey}.Grid.User`)}>
          <GenericDataGrid
            titleKey={ownProps.t(titleKey)}
            intlKey={intlKey}
            gridKey={GridType.Settings}
            columns={settingsGridColumns}
            predefinedFilters={[]}
            sortField={settingsGridInitalSort}
            getCellActions={ownProps.getCellActions}
          />
        </Panel>
      ),
    },
  ];

  return {
    tabs: tabItems,
    activeIndex: resolveActiveIndex(tabItems, Tabs, ownProps),
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  routeProps: SettingsTabMenuContainerProps
): Partial<TabMenuPropsWithIntl> {
  return {
    onTabChange: (activeIndex: number) => {
      switch (activeIndex) {
        case 0:
          onTabChange(Tabs.Users, routeProps);
          break;
        case 1:
          onTabChange(Tabs.CompanyInfo, routeProps);
          break;
        default:
          onTabChange(Tabs.Users, routeProps);
      }
    },
  };
}

export const SettingsTabMenuContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Tab))
);
