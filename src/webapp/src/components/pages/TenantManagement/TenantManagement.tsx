import { ColumnSize, gridActions } from '@oplog/data-grid';
import { Button, LayoutContent, Panel } from '@oplog/express';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { GridType } from '../../../models';
import { geti18nName } from '../../../utils/formatters/nameFormatter';
import GenericDataGrid from '../../atoms/GenericDataGrid';
import CreateTenantForm from '../../molecules/CreateTenantForm';
import DeleteTenantForm from '../../molecules/DeleteTenantForm';
import ActionBar from '../../organisms/ActionBar';

const intlKey = 'TenantManagement';
const titleKey = 'TenantManagement.Grid.Title';
const dataGridActionsIntlKey = 'DataGrid.Actions';

const tenantsGridInitalSort: SortField = new SortField({
  property: 'createdAt',
  by: SortDirection.DESC,
});

const TenantManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isCreateTenantFormOpen, setIsCreateTenantFormOpen] = useState<boolean>(false);
  const [isDeleteTenantFormOpen, setIsDeleteTenantFormOpen] = useState<boolean>(false);
  const [willDeleteTenantName, setWillDeleteTenantName] = useState<string>('');

  const refreshTenantGrid = () => {
    dispatch(gridActions.gridFetchRequested(GridType.Tenants));
  };

  const closeDeleteTenantFormModal = (isSuccess: boolean) => {
    setIsDeleteTenantFormOpen(false);
    setWillDeleteTenantName('');
    if (isSuccess) {
      refreshTenantGrid();
    }
  };

  const closeCreateTenantFormModal = (isSuccess: boolean) => {
    setIsCreateTenantFormOpen(false);
    if (isSuccess) {
      refreshTenantGrid();
    }
  };

  const openCreateTenantFormModal = () => {
    setIsCreateTenantFormOpen(true);
  };

  const tenantsGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      cellClass: 'index-column',
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('TenantName', t, intlKey),
      key: 'name',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('CompanyName', t, intlKey),
      key: 'companyName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PhoneNumber', t, intlKey),
      key: 'phoneNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Email', t, intlKey),
      key: 'companyEmail',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
  ];

  return (
    <>
      <ActionBar breadcrumb={[{ title: t(`${intlKey}.Title`) }]} title={t(`${intlKey}.Title`)}>
        <Button size="large" key="create" marginLeft="auto" variant="dark" onClick={() => openCreateTenantFormModal()}>
          {t(`${intlKey}.CreateTenant`)}
        </Button>
      </ActionBar>
      <LayoutContent>
        <Panel title={t(`${intlKey}.Title`)}>
          <GenericDataGrid
            titleKey={t(titleKey)}
            intlKey={intlKey}
            gridKey={GridType.Tenants}
            columns={tenantsGridColumns}
            predefinedFilters={[]}
            sortField={tenantsGridInitalSort}
          />
        </Panel>

        <CreateTenantForm
          isOpen={isCreateTenantFormOpen}
          onClose={(isSuccess: boolean) => closeCreateTenantFormModal(isSuccess)}
        />
        <DeleteTenantForm
          isOpen={isDeleteTenantFormOpen && willDeleteTenantName !== ''}
          onClose={(isSuccess: boolean) => closeDeleteTenantFormModal(isSuccess)}
          tenantName={willDeleteTenantName}
        />
      </LayoutContent>
    </>
  );
};

export default TenantManagement;
