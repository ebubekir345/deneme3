import { DataGridRow, FormatterProps, gridActions, gridSelectors, PredefinedFilter } from '@oplog/data-grid';
import { Box, Ellipsis, Flex, Image, PseudoBox, Text } from '@oplog/express';
import { StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import { StockItemQueryOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import {
  chipFormatter,
  ChipFormatterProps,
  coloredBadgeFormatter,
  getEnumOptions,
  geti18nName,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import QuickFilterBar from '../../../molecules/QuickFilterBar';
import { SearchBar } from '../../../molecules/SearchBar/SearchBar';

const intlKey = 'SerialNumberTrack.PackagedProductsGrid';
const titleKey = 'SerialNumberTrack.PackagedProductsGrid.Title';

enum Filters {
  Packing = 'Packing',
  SLAM = 'SLAM',
  Dispatch = 'Dispatch',
  Delivered = 'Delivered',
}

enum SalesOrderStateColors {
  Packing = 'palette.violet_dark',
  SLAM = 'palette.lime_dark',
  Dispatch = 'palette.purple_dark',
  Delivered = 'palette.teal_dark',
}

const packagedProductsGridPredefinedFilters: PredefinedFilter[] = [
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
  ...Object.values(Filters).map(filter => ({
    filter: new StringFilter({
      property: 'state',
      op: StringFilterOperation.Equals,
      value: filter,
      id: filter,
    }),
    selected: false,
    visibility: false,
  })),
];

const SNPackagedProductGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [activeQuickFilters, setActiveQuickFilters] = useState(['']);
  const ProductStatusFilters = { All_Ops: 'All_Ops', ...Filters };

  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.SimpleSerialNumberTrack, state.grid)
  );
  const appliedPredefinedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.SimpleSerialNumberTrack, state.grid)
  );

  const quickFilterButtons = Object.keys(ProductStatusFilters).map(status => ({
    key: status,
    title: t(`Enum.${status}`),
    isSelected: activeQuickFilters.includes(status),
    onClick: () => {
      if (!isGridBusy) {
        let filters = appliedPredefinedFilters.map(filter => ({
          ...filter,
          selected: filter.filter.valueToString() === status,
          visibility:
            filter.filter.valueToString() === status && filter.filter.valueToString() !== ProductStatusFilters.All_Ops,
        }));

        filters.length && applyQuickFilter(filters);
      }
    },
  }));

  const applyQuickFilter = (filters: PredefinedFilter[]) => {
    dispatch(gridActions.gridPaginationOffsetReset(GridType.SimpleSerialNumberTrack));
    dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.SimpleSerialNumberTrack, filters));
    dispatch(gridActions.gridFetchRequested(GridType.SimpleSerialNumberTrack));
  };

  useEffect(() => {
    const appliedQuickFilters = appliedPredefinedFilters
      .filter(filter => filter.selected)
      .map(filter => filter.filter.valueToString());
    setActiveQuickFilters(appliedQuickFilters.length ? appliedQuickFilters : ['']);
  }, [appliedPredefinedFilters]);

  const packagedProductGridGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: StockItemQueryOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '16px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          text: row.operationName,
          imageUrl: row.operationImageUrl,
          isUpperCase: true,
        } as ChipFormatterProps;
      },
    },
    {
      name: geti18nName('SKU', t, intlKey),
      key: 'sku',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'barcodes',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('SalesOrderReferenceNumber', t, intlKey),
      key: 'salesOrderReferenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return (
          <PseudoBox
            onClick={() => history.push(urls.orderDetails.replace(':id', dependentValues.salesOrderId))}
            color="text.link"
            width={1}
            _hover={{ cursor: 'pointer' }}
          >
            {value}
          </PseudoBox>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, Filters),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, SalesOrderStateColors),
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
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('SerialNumbers', t, intlKey),
      key: 'serialNumbers',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) =>
        props.value === 'N/A' ? '-' : <Ellipsis maxWidth={1000}>{props.value}</Ellipsis>,
    },
  ];

  return (
    <>
      <QuickFilterBar filterButtons={quickFilterButtons} />{' '}
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.SimpleSerialNumberTrack}
        columns={packagedProductGridGridColumns}
        predefinedFilters={packagedProductsGridPredefinedFilters}
        headerContent={
          <SearchBar
            grid={GridType.SimpleSerialNumberTrack}
            searchProperty={'serialNumbers'}
            placeholder={t(`${intlKey}.Placeholder`)}
          />
        }
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

export default SNPackagedProductGrid;
