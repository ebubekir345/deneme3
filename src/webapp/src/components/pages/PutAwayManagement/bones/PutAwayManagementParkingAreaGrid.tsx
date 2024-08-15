import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps, ImageFormatter } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { ProductType, StockItemQueryOutputDTO } from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'PutAwayManagement.PutAwayManagementParkingAreaGrid';
const titleKey = 'PutAwayManagement.PutAwayManagementParkingAreaGrid.Title';

const PutAwayManagementParkingAreaGrid: React.FC = () => {
  const { t } = useTranslation();
  const putAwayManagementParkingAreaGridColumns: Array<any> = [
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
      name: geti18nName('TrolleyLabel', t, intlKey),
      key: 'trolleyLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('CurrentAddress', t, intlKey),
      key: 'currentAddress',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ParkingAt', t, intlKey),
      key: 'parkingAt',
      type: 'moment',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: dateTimeFormatter,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.PutAwayManagementAvailablePutAwayTrolleys}
      columns={putAwayManagementParkingAreaGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default PutAwayManagementParkingAreaGrid;
