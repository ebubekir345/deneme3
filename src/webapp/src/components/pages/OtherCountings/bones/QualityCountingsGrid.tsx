import {
  ColumnSize,
  DataGridRow,
  dateTimeFormatter,
  FormatterProps,
  gridActions,
  gridSelectors,
  PredefinedFilter,
} from '@oplog/data-grid';
import { Box, Flex, Icon } from '@oplog/express';
import { StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType } from '../../../../models';
import {
  AutomaticStockCountingState,
  QualityStockCountingListSourceProcess,
  QueryQualityStockCountingTasksOutputDTO,
  StockCountingType,
} from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import {
  chipFormatter,
  ChipFormatterProps,
  coloredDifferenceFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  InventoryCellLinkFormatter,
  ProductDetailsLinkFormatterForOtherRoutes,
  SystemCountingListDetailsLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { ActionButton } from '../../../atoms/TouchScreen';
import QuickFilterBar from '../../../molecules/QuickFilterBar';

const intlKey = 'OtherCountings.QualityCountingsGrid';
const titleKey = 'OtherCountings.QualityCountingsGrid.Title';

const initialFilters = [
  ...Object.values(AutomaticStockCountingState).map(filter => ({
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

const CountingStatusFilters = {
  All: 'All',
  Completed: 'Completed',
  InProgress: 'InProgress',
  Created: 'Created',
};

const QualityCountingsGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeQuickFilters, setActiveQuickFilters] = useState([CountingStatusFilters.All]);

  const appliedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.QualityCountings, state.grid)
  );

  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.QualityCountings, state.grid)
  );

  const quickFilterButtons = Object.keys(CountingStatusFilters).map(status => ({
    key: status,
    title: t(`${intlKey}.QuickFilters.${status}`),
    isSelected: activeQuickFilters.includes(status),
    onClick: () => {
      if (!isGridBusy) {
        const filters = appliedFilters.map(filter => {
          return {
            ...filter,
            selected: filter.filter.id === status,
            visibility: filter.filter.id === status,
          };
        });
        filters.length && applyQuickFilter(filters);
        setActiveQuickFilters([status]);
      }
    },
  }));

  const applyQuickFilter = (filters: PredefinedFilter[]) => {
    dispatch(gridActions.gridPaginationOffsetReset(GridType.QualityCountings));
    dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.QualityCountings, filters));
    dispatch(gridActions.gridFetchRequested(GridType.QualityCountings));
  };

  useEffect(() => {
    const appliedQuickFilters = appliedFilters
      .filter(filter => filter.filter.property === 'state' && filter.selected)
      .map(filter => filter.filter.id);

    setActiveQuickFilters(appliedQuickFilters.length ? appliedQuickFilters : [CountingStatusFilters.All]);
  }, [appliedFilters]);

  const qualityCountingsGridColumns: Array<any> = [
    {
      name: geti18nName('CellLabel', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: InventoryCellLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ProductSKU', t, intlKey),
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
      width: ColumnSize.XLarge,
      formatter: ProductDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('OperationName', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: QueryQualityStockCountingTasksOutputDTO) => {
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
      name: geti18nName('ReferenceNumber', t, intlKey),
      key: 'stockCountingListReferenceNumber',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: SystemCountingListDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('StockCountingType', t, intlKey),
      key: 'stockCountingType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, StockCountingType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, AutomaticStockCountingState),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('TotalAmountBeforeCounting', t, intlKey),
      key: 'beforeCountingAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('TotalAmountAfterCounting', t, intlKey),
      key: 'afterCountingAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('TotalDifferenceInAmount', t, intlKey),
      key: 'totalDifferenceInAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : coloredDifferenceFormatter(props)),
    },
    {
      name: geti18nName('ProcessedByFullName', t, intlKey),
      key: 'operatorFullName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('CountedAt', t, intlKey),
      key: 'countedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : dateTimeFormatter(props)),
    },
    {
      name: geti18nName('Variation', t, intlKey),
      key: 'qualityStockCountingListSourceProcess',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, QualityStockCountingListSourceProcess),
      formatter: (props: FormatterProps) => {
        return t(`Enum.${props.value}`);
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('PutAwayOperator', t, intlKey),
      key: 'processOperatorFullName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
      formatter: (props: FormatterProps) => {
        return (
          <Flex justifyContent="space-between" alignItems="center">
            <Box>{props.value === 'N/A' ? '-' : props.value}</Box>
            <ActionButton
              onClick={() =>
                window.open(
                  `https://search.oplog.app/?q=${props.dependentValues.logId}&size=n_60_n&sort-field=createdat&sort-direction=desc`,
                  '_blank'
                )
              }
              width={40}
              height={30}
              borderTopRightRadius={8}
              borderBottomRightRadius={8}
              backgroundColor="palette.softBlue"
              border="none"
              color="palette.white"
              fontWeight={500}
              _hover={{
                backgroundColor: 'palette.lime',
              }}
            >
              <Icon name="far fa-search" fontSize={14} />
            </ActionButton>
          </Flex>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];

  return (
    <>
      <QuickFilterBar filterButtons={quickFilterButtons} />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.QualityCountings}
        columns={qualityCountingsGridColumns}
        predefinedFilters={initialFilters}
      />
    </>
  );
};

export default QualityCountingsGrid;
