import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Text } from '@oplog/express';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { Availability, ToteProcessType } from '../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName, InventoryToteLinkFormatter } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'InventoryManagement.InventoryView.InventoryTotesGrid';
const titleKey = 'InventoryManagement.InventoryView.Title';

const totesGridInitialSort: SortField = new SortField({
  property: 'toteLabel',
  by: SortDirection.ASC,
});

const InventoryTotesGrid: React.FC = () => {
  const { t } = useTranslation();
  const totesGridColumns: Array<any> = [
    {
      name: geti18nName('ToteLabel', t, intlKey),
      key: 'toteLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: InventoryToteLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Address', t, intlKey),
      key: 'address',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProcessType', t, intlKey),
      key: 'processType',
      locked: true,
      sortable: true,
      type: 'enum',
      visibility: true,
      filterable: true,
      formatter: enumFormatter,
      options: getEnumOptions(t, ToteProcessType),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ProductVariety', t, intlKey),
      key: 'productVariety',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductAmount', t, intlKey),
      key: 'productAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
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
          console.log(dependentValues.operatorName);

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
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.InventoryToteStatus}
      columns={totesGridColumns}
      sortField={totesGridInitialSort}
      predefinedFilters={[]}
    />
  );
};

export default InventoryTotesGrid;
