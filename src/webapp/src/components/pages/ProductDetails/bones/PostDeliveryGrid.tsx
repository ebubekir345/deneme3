import { ColumnSize, FormatterProps, gridActions, gridSelectors, PredefinedFilter } from '@oplog/data-grid';
import { Box, Flex, Image, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import {
  BooleanFilter,
  BooleanFilterOperation,
  StringFilter,
  StringFilterOperation,
} from 'dynamic-query-builder-client';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { PackageType, ProductDetailsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { columnProps } from '../../../../utils/columnProps';
import { geti18nName } from '../../../../utils/formatters';
import { expirationDateFormatter } from '../../../../utils/formatters/expirationDateFormatter';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import QuickFilterBar from '../../../molecules/QuickFilterBar';
import { ProductsByAllStockGridProps } from './ProductsByAllStockGrid';

enum Filters {
  All_Ops = 'All_Ops',
  Dispatch = 'Dispatch',
  Delivered = 'Delivered',
}

const intlKey = 'ProductDetails.PostDeliveryGrid';
const titleKey = 'ProductDetails.PostDeliveryGrid.Title';

const postDeliveryGridPredefinedFilters: PredefinedFilter[] = [
  {
    filter: new StringFilter({
      property: 'cargoPackageLabel',
      op: StringFilterOperation.NotEqual,
      value: Filters.All_Ops,
      id: Filters.All_Ops,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new BooleanFilter({
      property: 'isDelivered',
      op: BooleanFilterOperation.Equals,
      value: false,
      id: Filters.Dispatch,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new BooleanFilter({
      property: 'isDelivered',
      op: BooleanFilterOperation.Equals,
      value: true,
      id: Filters.Delivered,
    }),
    selected: false,
    visibility: false,
  },
];

const PostDeliveryGrid: FC<ProductsByAllStockGridProps> = ({ productIdFromRoute }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeQuickFilters, setActiveQuickFilters] = useState(['']);
  const productDetailsResource: Resource<ProductDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetProduct]
  );
  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.QueryShippingItemsByProduct, state.grid)
  );
  const appliedPredefinedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.QueryShippingItemsByProduct, state.grid)
  );

  const quickFilterButtons = Object.keys(Filters).map(status => ({
    key: status,
    title: t(`Enum.${status}`),
    isSelected: activeQuickFilters.includes(status),
    onClick: () => {
      if (!isGridBusy) {
        let filters = appliedPredefinedFilters.map(filter => ({
          ...filter,
          selected: filter.filter.id === status,
          visibility: filter.filter.id === status && filter.filter.valueToString() !== Filters.All_Ops,
        }));

        filters.length && applyQuickFilter(filters);
      }
    },
  }));

  const applyQuickFilter = (filters: PredefinedFilter[]) => {
    dispatch(gridActions.gridPaginationOffsetReset(GridType.QueryShippingItemsByProduct));
    dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.QueryShippingItemsByProduct, filters));
    dispatch(gridActions.gridFetchRequested(GridType.QueryShippingItemsByProduct, [decodeURI(productIdFromRoute)]));
  };

  useEffect(() => {
    const appliedQuickFilters = appliedPredefinedFilters
      .filter(filter => filter.selected)
      .map(filter => filter.filter.id);
    setActiveQuickFilters(appliedQuickFilters.length ? appliedQuickFilters : ['']);
  }, [appliedPredefinedFilters]);

  const postDeliveryGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      cellClass: 'index-column',
      locked: true,
      filterable: false,
      sortable: false,
      visibility: true,
      width: ColumnSize.Medium,
    },
    {
      name: '',
      key: 'isDelivered',
      type: 'boolean',
      filterable: false,
      sortable: false,
      visibility: false,
    },
    {
      name: geti18nName('CargoPackageLabel', t, intlKey),
      key: 'cargoPackageLabel',
      type: 'string',
      ...columnProps,
    },
    {
      name: geti18nName('CargoPackageName', t, intlKey),
      key: 'cargoPackageName',
      type: 'string',
      ...columnProps,
    },
    {
      name: geti18nName('PackageType', t, intlKey),
      key: 'cargoPackageType',
      type: 'enum',
      ...columnProps,
      options: Object.keys(PackageType)
        .filter(e => e !== PackageType.None)
        .map(e => {
          return {
            label: t(`TouchScreen.PackingStation.CargoPackagePickerModal.${PackageType[e]}`),
            value: PackageType[e],
          };
        }),
      formatter: (props: FormatterProps) => (
        <Text>{t(`TouchScreen.PackingStation.CargoPackagePickerModal.${props.value}`)}</Text>
      ),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('Weight', t, intlKey),
      key: 'cargoPackageVolumetricWeight',
      type: 'number',
      ...columnProps,
    },
    {
      name: geti18nName('Barcode', t, intlKey),
      key: 'cargoPackageBarcode',
      type: 'string',
      ...columnProps,
    },
    {
      name: geti18nName('Quantity', t, intlKey),
      key: 'amount',
      type: 'number',
      ...columnProps,
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
    {
      name: geti18nName('SerialNumber', t, intlKey),
      key: 'serialNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: productDetailsResource?.data?.isTrackSerialNumber,
    },
  ];

  return (
    <>
      <QuickFilterBar filterButtons={quickFilterButtons} />{' '}
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.QueryShippingItemsByProduct}
        columns={postDeliveryGridColumns}
        apiArgs={[productIdFromRoute]}
        predefinedFilters={postDeliveryGridPredefinedFilters}
        noRowsView={() =>
          appliedPredefinedFilters.some(i => i.selected) ? (
            <Box marginY="12" borderRadius="sm" boxShadow="small" paddingY="30" paddingX="60" bg="palette.white">
              {t(`DataGrid.NoRows.NoMatch`)}
            </Box>
          ) : (
            <Flex flexDirection="column" alignItems="center">
              <Image width={471} height={351} src="/images/create-cargo-plan.png" alt="create-cargo-plan" />
              <Text color="palette.grey_darker" fontWeight={600} fontSize={14} mt={32}>
                {t(`${intlKey}.EmptyFilterMessage`)}
              </Text>
            </Flex>
          )
        }
      />
    </>
  );
};
export default PostDeliveryGrid;
