import { ColumnSize, FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { AddressType } from '../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'QuarantineManagement.DamagedGrid';
const titleKey = 'QuarantineManagement.DamagedGrid.Title';

const QuarantineDamagedGrid: React.FC = () => {
  const { t } = useTranslation();
  const QuarantineDamagedGridColumns: Array<any> = [
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
      name: geti18nName('Label', t, intlKey),
      key: 'label',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('AddressType', t, intlKey),
      key: 'addressType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: enumFormatter,
      options: getEnumOptions(t, AddressType),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ContainedItemCount', t, intlKey),
      key: 'containedItemCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        return `${value} ${t(`QuarantineManagement.${value === 1 ? 'Item' : 'Items'}`)}`;
      },
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.QuarantineDamaged}
      columns={QuarantineDamagedGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default QuarantineDamagedGrid;
