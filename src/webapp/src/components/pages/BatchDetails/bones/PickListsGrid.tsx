import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import {
  PickingFlowTag,
  PickingMethod,
  PickingTrolleySelectionConfigurationPickingType,
  PickListState,
} from '../../../../services/swagger';
import {
  BatchDetailsPickListDetailsLinkFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { VehicleTypes } from '../../FlowManagement/bones/FlowManagementGrid';

const intlKey = 'BatchDetails.PickListsGrid';
const titleKey = 'BatchDetails.PickListsGrid.Title';

interface IPickListsGrid {
  batchId: string;
}

const PickListsGrid: FC<IPickListsGrid> = ({ batchId }) => {
  const { t } = useTranslation();

  const pickListsGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('PickListName', t, intlKey),
      key: 'name',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: BatchDetailsPickListDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickListState),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('VehicleVariation', t, intlKey),
      key: 'vehicleVariation',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) =>
        Object.keys(VehicleTypes).includes(props.value) ? enumFormatter(props) : props.value,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('Capacity', t, intlKey),
      key: 'capacity',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductAmount', t, intlKey),
      key: 'productCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PickingFlowTag', t, intlKey),
      key: 'flow',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickingFlowTag),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('PickingMethod', t, intlKey),
      key: 'method',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickingMethod),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('PickingType', t, intlKey),
      key: 'pickingType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickingTrolleySelectionConfigurationPickingType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ZoneName', t, intlKey),
      key: 'zoneLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PickingTrolleyLabel', t, intlKey),
      key: 'pickingTrolley',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('OperatorFullName', t, intlKey),
      key: 'operator',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
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
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.PickListRequestPickListDetails}
      columns={pickListsGridColumns}
      apiArgs={[batchId]}
      predefinedFilters={[]}
    />
  );
};

export default PickListsGrid;
