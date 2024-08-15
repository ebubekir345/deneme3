import { ColumnSize, FormatterProps, PredefinedFilter } from '@oplog/data-grid';
import { Resource } from '@oplog/resource-redux';
import { SortDirection, SortField, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { AddressType, LogicalOperator, ProductDetailsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { InventoryItemTypeForQueries } from '../../../../typings/globalStore/enums';
import { coloredBadgeFormatter, enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import { expirationDateFormatter } from '../../../../utils/formatters/expirationDateFormatter';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { ProductStateColors } from '../../../molecules/StocksNoStockGrid/StocksNoStockGrid';
import QuickFilters from './AllStockGridQuickFilters';

const intlKey = 'ProductDetails.ProductsByAllStockGrid';
const titleKey = 'ProductDetails.ProductsByAllStockGrid.Title';

const productsByAllStockGridInitialSort: SortField = new SortField({
  property: 'containerLabel',
  by: SortDirection.ASC,
});

export const ProductStatusFilters = { All_Ops: 'All_Ops', ...InventoryItemTypeForQueries };

const productByAllStockGridPredefinedFilters: PredefinedFilter[] = [
  ...Object.values(InventoryItemTypeForQueries).map(filter => ({
    filter: new StringFilter({
      property: 'itemType',
      op: StringFilterOperation.Equals,
      value: filter,
      id: filter,
    }),
    selected: false,
    visibility: false,
  })),
  {
    filter: new StringFilter({
      property: 'itemType',
      op: StringFilterOperation.NotEqual,
      value: [ProductStatusFilters.FoundItem],
      id: 'preAppliedFoundandLost',
      logicalOperator: LogicalOperator.AndAlso,
    }),
    selected: true,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: 'itemType',
      op: StringFilterOperation.NotEqual,
      value: [ProductStatusFilters.LostItem],
      id: 'preAppliedFoundandLost',
    }),
    selected: true,
    visibility: false,
  },
];

export interface ProductsByAllStockGridProps {
  productIdFromRoute: string;
}

const ProductsByAllStockGrid: React.FC<ProductsByAllStockGridProps> = ({ productIdFromRoute }) => {
  const { t } = useTranslation();
  const productDetailsResource: Resource<ProductDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetProduct]
  );

  const productsByAllStockGridColumns: Array<any> = [
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
      name: geti18nName('AddressLabel', t, intlKey),
      key: 'addressLabel',
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
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, AddressType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ContainerLabel', t, intlKey),
      key: 'containerLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'itemType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, InventoryItemTypeForQueries),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, ProductStateColors),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('Quantity', t, intlKey),
      key: 'amount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Large,
    },
    {
      name: geti18nName('ExpirationDate', t, intlKey),
      key: 'expirationDate',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: productDetailsResource?.data?.isTrackExpirationDate,
      formatter: expirationDateFormatter,
    },
  ];

  return (
    <>
      <QuickFilters productIdFromRoute={productIdFromRoute} />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.ProductsByAllStock}
        columns={productsByAllStockGridColumns}
        apiArgs={[productIdFromRoute]}
        sortField={productsByAllStockGridInitialSort}
        predefinedFilters={productByAllStockGridPredefinedFilters}
      />
    </>
  );
};
export default ProductsByAllStockGrid;
