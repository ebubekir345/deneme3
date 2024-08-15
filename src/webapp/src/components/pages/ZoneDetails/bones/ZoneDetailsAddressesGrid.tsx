import { dateTimeFormatter } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { AddressType } from '../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'ZoneDetails.ZoneDetailsAddressesGrid';
const titleKey = 'ZoneDetails.ZoneDetailsAddressesGrid.Title';

interface IZoneDetailsAddressesGrid {
  zoneId: string;
}

const ZoneDetailsAddressesGrid: React.FC<IZoneDetailsAddressesGrid> = ({ zoneId }) => {
  const { t } = useTranslation();
  const ZoneDetailsAddressesGridColumns: Array<any> = [
    {
      name: geti18nName('Cell', t, intlKey),
      key: 'label',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ContainedIn', t, intlKey),
      key: 'containedIn',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('AddressType', t, intlKey),
      key: 'addressType',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, AddressType),
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
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.ZoneDetailsAddressesGrid}
      columns={ZoneDetailsAddressesGridColumns}
      predefinedFilters={[]}
      apiArgs={[zoneId]}
    />
  );
};

export default ZoneDetailsAddressesGrid;
