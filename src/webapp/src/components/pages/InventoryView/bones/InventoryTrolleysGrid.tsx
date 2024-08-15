import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Text } from '@oplog/express';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { Availability, VehicleType } from '../../../../services/swagger';
import {
  enumFormatter,
  getEnumOptions,
  geti18nName,
  InventoryTrolleyLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { VehicleTypes } from '../../FlowManagement/bones/FlowManagementGrid';

const intlKey = 'InventoryManagement.InventoryView.InventoryTrolleysGrid';
const titleKey = 'InventoryManagement.InventoryView.InventoryTrolleysGrid.Title';

const trolleysGridInitialSort: SortField = new SortField({
  property: 'label',
  by: SortDirection.ASC,
});

const InventoryTrolleysGrid: React.FC = () => {
  const { t } = useTranslation();

  const inventoryViewTrolleysGridColumns: Array<any> = [
    {
      name: geti18nName('Label', t, intlKey),
      key: 'label',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: InventoryTrolleyLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Type', t, intlKey),
      key: 'type',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: Object.keys(VehicleType).map(e => {
        return {
          label: t(`InventoryManagement.InventoryView.InventoryTrolleysGrid.${VehicleType[e]}`),
          value: VehicleType[e],
        };
      }),
      formatter: (props: FormatterProps) => {
        const { value } = props;
        return <Text>{t(`InventoryManagement.InventoryView.InventoryTrolleysGrid.${value}`)}</Text>;
      },
    },
    {
      name: geti18nName('Variation', t, intlKey),
      key: 'variation',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, VehicleTypes),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ContainerCount', t, intlKey),
      key: 'containerCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { dependentValues } = props;
        if (
          dependentValues.containerCount !== 'N/A' &&
          dependentValues.containerCount !== undefined &&
          dependentValues.containerCount !== ''
        ) {
          return dependentValues.containerCount;
        } else {
          return '-';
        }
      },
    },
    {
      name: geti18nName('LastSeenAddress', t, intlKey),
      key: 'lastSeenAddress',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { dependentValues } = props;
        if (
          dependentValues.lastSeenAddress !== 'N/A' &&
          dependentValues.lastSeenAddress !== undefined &&
          dependentValues.lastSeenAddress !== ''
        ) {
          return dependentValues.lastSeenAddress;
        } else {
          return '-';
        }
      },
    },
    {
      name: geti18nName('LastSeenAt', t, intlKey),
      key: 'lastSeenAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { dependentValues } = props;
        if (
          dependentValues.lastSeenAt !== 'N/A' &&
          dependentValues.lastSeenAt !== undefined &&
          dependentValues.lastSeenAt !== ''
        ) {
          return dateTimeFormatter(props);
        } else {
          return '-';
        }
      },
    },
    {
      name: geti18nName('OperatorName', t, intlKey),
      key: 'operatorName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { dependentValues } = props;
        if (
          dependentValues.operatorName !== 'N/A' &&
          dependentValues.operatorName !== undefined &&
          dependentValues.operatorName !== ''
        ) {
          return dependentValues.operatorName;
        } else {
          return '-';
        }
      },
    },
    {
      name: geti18nName('Availability', t, intlKey),
      key: 'availability',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: Object.keys(Availability).map(e => {
        return {
          label: t(`InventoryManagement.InventoryView.InventoryTrolleysGrid.${Availability[e]}`),
          value: Availability[e],
        };
      }),
      formatter: (props: FormatterProps) => {
        const { value } = props;
        return <Text>{t(`InventoryManagement.InventoryView.InventoryTrolleysGrid.${value}`)}</Text>;
      },
    },
  ];

  return (
    <>
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.InventoryTrolleys}
        columns={inventoryViewTrolleysGridColumns}
        sortField={trolleysGridInitialSort}
        predefinedFilters={[]}
      />
    </>
  );
};

export default InventoryTrolleysGrid;
