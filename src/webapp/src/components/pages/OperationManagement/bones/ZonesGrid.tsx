import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { ZoneType } from '../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { useHistory } from 'react-router-dom';
import { urls } from '../../../../routers/urls';

const intlKey = 'OperationManagement.ZonesGrid';
const titleKey = 'OperationManagement.ZonesGrid.Title';

const ZonesGrid: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const zonesGridColumns: Array<any> = [
    {
      name: geti18nName('ZoneAddress', t, intlKey),
      key: 'label',
      locked: true,
      sortable: true,
      type: 'string',
      visibility: true,
      columnSize: ColumnSize.Bigger,
      filterable: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return (
          <PseudoBox
            onClick={() => history.push(urls.zoneDetails.replace(':id', encodeURI(dependentValues?.zoneId)))}
            color="text.link"
            width={1}
            _hover={{ cursor: 'pointer' }}
            fontSize={11}
          >
            {value}
          </PseudoBox>
        );
      },
    },
    {
      name: geti18nName('ZoneLabel', t, intlKey),
      key: 'name',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ZoneType', t, intlKey),
      key: 'type',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      options: getEnumOptions(t, ZoneType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('Priority', t, intlKey),
      key: 'priority',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Capacity', t, intlKey),
      key: 'maxPickingCapacity',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('AddressCount', t, intlKey),
      key: 'zoneAdressesCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductsCount', t, intlKey),
      key: 'zoneProductsCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.ZonesGrid}
      columns={zonesGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default ZonesGrid;
