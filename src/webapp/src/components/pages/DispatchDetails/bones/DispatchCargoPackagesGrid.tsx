import { ColumnSize, DataGridRow } from '@oplog/data-grid';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { geti18nName, OrderDetailsLinkFormatter } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'DispatchDetails.CargoPackagesGrid';
const titleKey = 'DispatchDetails.CargoPackagesGrid.Title';

const DispatchCargoPackagesInitialSort: SortField = new SortField({
  property: 'referenceNumber',
  by: SortDirection.DESC,
});

interface IDispatchCargoPackagesGrid {
  dispatchProcessId: string;
}

const DispatchCargoPackagesGrid: React.FC<IDispatchCargoPackagesGrid> = ({ dispatchProcessId }) => {
  const { t } = useTranslation();
  const dispatchCargoPackagesGridColumns: Array<any> = [
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
      name: geti18nName('ReferenceNumber', t, intlKey),
      key: 'referenceNumber',
      locked: true,
      sortable: true,
      type: 'string',
      visibility: true,
      filterable: true,
      formatter: OrderDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('CargoPackageLabel', t, intlKey),
      key: 'cargoPackageLabel',
      locked: true,
      sortable: true,
      type: 'string',
      visibility: true,
      filterable: true,
    },
    {
      name: geti18nName('CargoPackageItemsCount', t, intlKey),
      key: 'cargoPackageItemsCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.DispatchCargoPackages}
      columns={dispatchCargoPackagesGridColumns}
      sortField={DispatchCargoPackagesInitialSort}
      apiArgs={[dispatchProcessId]}
      predefinedFilters={[]}
    />
  );
};

export default DispatchCargoPackagesGrid;
