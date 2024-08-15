import { DataGridRow } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import {
  geti18nName, InventoryTrolleyDetailstoTotesLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'InventoryTrolleyListDetails.InventoryTrolleyListDetailsGrid';
const titleKey = 'InventoryTrolleyListDetails.InventoryTrolleyListDetailsGrid.Title';

interface IInventoryTrolleyListDetailsGrid {
  trolleyLabel: string;
}

const InventoryTrolleyListDetailsGrid: React.FC<IInventoryTrolleyListDetailsGrid> = ({ trolleyLabel }) => {
  const { t } = useTranslation();
  const PickListDetailsSalesOrdersGridColumns: Array<any> = [
    {
      name: geti18nName('Label', t, intlKey),
      key: 'label',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: InventoryTrolleyDetailstoTotesLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
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
      name: geti18nName('ProductVariety', t, intlKey),
      key: 'productVariety',
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
      gridKey={GridType.InventoryTrolleyListDetailsGrid}
      columns={PickListDetailsSalesOrdersGridColumns}
      predefinedFilters={[]}
      apiArgs={[trolleyLabel]}
    />
  );
};

export default InventoryTrolleyListDetailsGrid;
