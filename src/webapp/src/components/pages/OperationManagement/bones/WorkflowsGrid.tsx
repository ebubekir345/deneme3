import { ColumnSize, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { WorkflowActionType, WorkflowState } from '../../../../services/swagger';
import {
  coloredBadgeFormatter,
  dqbStringToChipFormatter,
  ellipsisFormatterWithIntlKey,
  enumFormatter,
  getEnumOptions,
  geti18nName,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'OperationManagement.WorkflowsGrid';
const titleKey = 'OperationManagement.WorkflowsGrid.Title';
const workflowsGridInitialSort: SortField = new SortField({
  property: 'createdAt',
  by: SortDirection.DESC,
});

export enum WorkflowStateColors {
  Active = 'palette.green',
  Passive = 'palette.red',
}

export interface WorkflowsProps {
  openDeleteConfirmationModal: (id: string) => void;
}

const WorkflowsGrid: React.FC<WorkflowsProps> = ({ openDeleteConfirmationModal }) => {
  const { t } = useTranslation();
  const getCellActions = [
    {
      icon: 'fal fa-trash-alt',
      text: t(`${intlKey}.Actions.Remove`),
      callback: (values, dependentValues) => openDeleteConfirmationModal(dependentValues.id as string),
    },
  ];

  const workflowsGridColumns: Array<any> = [
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
      name: geti18nName('Name', t, intlKey),
      key: 'name',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
    },
    {
      name: geti18nName('TriggerEvent', t, intlKey),
      key: 'triggerEvent',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => ellipsisFormatterWithIntlKey(props, 'WebhookEvents'),
      getRowMetaData: () => {
        return t;
      },
      width: ColumnSize.XLarge,
    },
    {
      name: geti18nName('Filter', t, intlKey),
      key: 'filter',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dqbStringToChipFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('Action', t, intlKey),
      key: 'action',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, WorkflowActionType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
      width: ColumnSize.XLarge,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, WorkflowState),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, WorkflowStateColors),
      getRowMetaData: () => {
        return t;
      },
      width: ColumnSize.XLarge,
    },
    {
      name: geti18nName('CreatedAt', t, intlKey),
      key: 'createdAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
      width: ColumnSize.XLarge,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.Workflows}
      columns={workflowsGridColumns}
      sortField={workflowsGridInitialSort}
      predefinedFilters={[]}
      getCellActions={getCellActions}
    />
  );
};

export default WorkflowsGrid;
