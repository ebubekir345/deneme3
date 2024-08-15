import {
  ColumnSize,
  DataGridRow,
  FormatterProps,
  gridSelectors,
  ImageFormatter,
  PredefinedFilter,
} from '@oplog/data-grid';
import { Box, Ellipsis, Flex, Image, Text } from '@oplog/express';
import { SortDirection, SortField, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GridType } from '../../../../models';
import { AddressType, ContainerType, InventoryQueryOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { InventoryItemTypeForQueries } from '../../../../typings/globalStore/enums';
import {
  chipFormatter,
  ChipFormatterProps,
  coloredBadgeFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
  StocksCellLinkFormatter,
  StocksToteLinkFormatter,
  StocksTrolleyLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { ProductStateColors } from '../../../molecules/StocksNoStockGrid/StocksNoStockGrid';
import QuickFilters from './QuickFilters';

const intlKey = 'StockManagement.StocksCurrentStatusGrid';
const titleKey = 'StockManagement.StocksCurrentStatusGrid.Title';

const stocksCurrentStatusGridInitialSort: SortField = new SortField({
  property: 'containerLabel',
  by: SortDirection.ASC,
});

const stockCurrentStatusGridPredefinedFilters: PredefinedFilter[] = [
  {
    filter: new StringFilter({
      property: 'operationName',
      op: StringFilterOperation.NotEqual,
      value: 'All_Ops',
      id: 'All_Ops',
    }),
    selected: false,
    visibility: false,
  },
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
];

const StocksCurrentStatusGrid: React.FC = () => {
  const { t } = useTranslation();

  const appliedPredefinedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.StocksCurrentStatus, state.grid)
  );

  const stocksCurrentStatusGridColumns: Array<any> = [
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
      formatter: (props: FormatterProps) =>
        props.dependentValues.isVehicle ? StocksTrolleyLinkFormatter(props) : props.value,
      getRowMetaData: (row: DataGridRow) => row,
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
      formatter: (props: FormatterProps) => {
        return props.dependentValues.containerType === ContainerType.Tote
          ? StocksToteLinkFormatter(props)
          : props.dependentValues.containerType === ContainerType.PrimeCell ||
            props.dependentValues.containerType === ContainerType.ReservedCell
            ? StocksCellLinkFormatter(props)
            : props.value;
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ContainerType', t, intlKey),
      key: 'containerType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: enumFormatter,
      options: getEnumOptions(t, ContainerType),
      getRowMetaData: () => {
        return t;
      },
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
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: InventoryQueryOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '15px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          text: row.operationName,
          imageUrl: row.operationImageUrl,
          isUpperCase: true,
        } as ChipFormatterProps;
      },
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'barcodes',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ImageUrl', t, intlKey),
      key: 'productImageUrl',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: ImageFormatter,
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('SKU', t, intlKey),
      key: 'sku',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductName', t, intlKey),
      key: 'productName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: ProductDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
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
      visibility: true,
      formatter: (props: FormatterProps) =>
        props.value === 'N/A' ? '-' : <Ellipsis>{moment(props.value).format('DD.MM.YYYY')}</Ellipsis>,
    },
  ];

  return (
    <>
      <QuickFilters />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.StocksCurrentStatus}
        columns={stocksCurrentStatusGridColumns}
        sortField={stocksCurrentStatusGridInitialSort}
        predefinedFilters={stockCurrentStatusGridPredefinedFilters}
        noRowsView={() =>
          appliedPredefinedFilters.some(i => i.selected) ? (
            <Box marginY="12" borderRadius="sm" boxShadow="small" paddingY="30" paddingX="60" bg="palette.white">
              {t(`DataGrid.NoRows.NoData`)}
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

export default StocksCurrentStatusGrid;
