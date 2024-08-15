import { ColumnSize, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Ellipsis } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../../models';
import { VASState, VASType } from '../../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../../utils/formatters';
import GenericDataGrid from '../../../../atoms/GenericDataGrid';

const intlKey = 'OrderDetails.SalesOrderValueAddedServicesGrid';
const titleKey = 'OrderDetails.SalesOrderValueAddedServicesGrid.Title';

interface ISalesOrderValueAddedServicesGrid {
  orderId: string;
}

const SalesOrderValueAddedServicesGrid: React.FC<ISalesOrderValueAddedServicesGrid> = ({ orderId }) => {
  const { t } = useTranslation();

  const salesOrderValueAddedServicesGridColumns: Array<any> = [
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
      name: geti18nName('VasType', t, intlKey),
      key: 'vasType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
      options: getEnumOptions(t, VASType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
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
    {
      name: geti18nName('Content', t, intlKey),
      key: 'content',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Bigger,
      formatter: (props: FormatterProps) => (props.value ? <Ellipsis maxWidth={10000}>{props.value}</Ellipsis> : '-'),
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
      options: getEnumOptions(t, VASState),
      formatter: (props: FormatterProps) => (props.value === VASState.Created ? 'Yaratıldı' : enumFormatter(props)),
      getRowMetaData: () => {
        return t;
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
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('CompletedAt', t, intlKey),
      key: 'completedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : dateTimeFormatter(props)),
    },
    {
      name: geti18nName('CompletedAtAddress', t, intlKey),
      key: 'completedAtAddress',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.VasItems}
      columns={salesOrderValueAddedServicesGridColumns}
      predefinedFilters={[]}
      apiArgs={[orderId]}
    />
  );
};

export default SalesOrderValueAddedServicesGrid;
