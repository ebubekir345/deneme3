import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Box, Icon, Text } from '@oplog/express';
import { StringFilterOperation } from 'dynamic-query-builder-client';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GridType } from '../../../../models';
import { WallToWallStockUpdateState } from '../../../../services/swagger';
import {
  coloredBadgeFormatter,
  getEnumOptions,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { W2WPlanReportsTabs } from '../W2WPlanReports';
import { WallToWallStockUpdateStateColors } from './W2WPlanReportsOperationGrid';

const intlKey = 'W2WPlanReports.W2WPlanReportsSKUGrid';
const titleKey = 'W2WPlanReports.W2WPlanReportsSKUGrid.Title';

interface IW2WPlanReportsSKUGrid {
  stockCountingPlanId: string;
}

const W2WPlanReportsSKUGrid: FC<IW2WPlanReportsSKUGrid> = ({ stockCountingPlanId }) => {
  const { t } = useTranslation();

  const W2WPlanReportsSKUGridColumns: Array<any> = [
    {
      name: geti18nName('SKU', t, intlKey),
      key: 'sku',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: ProductDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('StockBeforeCount', t, intlKey),
      key: 'stockCountBeforeCounting',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('StockAfterCount', t, intlKey),
      key: 'stockCountAfterCounting',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('StockDifferences', t, intlKey),
      key: 'stockDifference',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) =>
        props.value === 'N/A' ? (
          '-'
        ) : (
          <Text color="palette.white" p="4" borderRadius="md" bg="palette.red">
            {props.value}
          </Text>
        ),
    },
    {
      name: geti18nName('CountDate', t, intlKey),
      key: 'stockCountingDateTime',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('Addresses', t, intlKey),
      key: 'cellLabels',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (
        <Box
          onClick={() => {
            localStorage.setItem(
              'filters',
              JSON.stringify([
                {
                  type: 'StringFilter',
                  property: 'cellLabel',
                  op: StringFilterOperation.In,
                  value: props.value,
                },
              ])
            );
            window.open(
              location.pathname.replace(location.pathname.split('/')[3], W2WPlanReportsTabs.Address),
              '_blank'
            );
          }}
          cursor="pointer"
          borderRadius="lg"
          py={4}
          bg="palette.blue_darker"
          color="palette.black"
          width="fit-content"
        >
          <Icon name="fal fa-search" fontSize={16} fontWeight={500} mx={32} />
        </Box>
      ),
    },
    {
      name: geti18nName('DamagedItemQuantity', t, intlKey),
      key: 'damagedItemCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return (
          <Link
            onClick={() => {
              localStorage.setItem(
                'filters',
                JSON.stringify([
                  {
                    type: 'StringFilter',
                    property: 'sku',
                    op: StringFilterOperation.Equals,
                    value: dependentValues.sku,
                  },
                ])
              );
            }}
            to={location.pathname.replace(location.pathname.split('/')[3], W2WPlanReportsTabs.DamagedItems)}
            target="_blank"
          >
            {value}
          </Link>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Lists', t, intlKey),
      key: 'stockCountingListNames',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        return (
          <Box
            onClick={() => {
              localStorage.setItem(
                'filters',
                JSON.stringify([
                  {
                    type: 'StringFilter',
                    property: 'stockCountingListName',
                    op: StringFilterOperation.In,
                    value: value,
                  },
                ])
              );
              window.open(
                location.pathname.replace(location.pathname.split('/')[3], W2WPlanReportsTabs.Lists),
                '_blank'
              );
            }}
            cursor="pointer"
            borderRadius="lg"
            py={4}
            bg="palette.blue_darker"
            color="palette.black"
            width="fit-content"
          >
            <Icon name="fal fa-search" fontSize={16} fontWeight={500} mx={32} />
          </Box>
        );
      },
    },
    {
      name: geti18nName('StockUpdateState', t, intlKey),
      key: 'stockUpdateState',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, WallToWallStockUpdateState),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, WallToWallStockUpdateStateColors),
      getRowMetaData: () => {
        return t;
      },
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.QueryWallToWallStockCountingProductsReport}
      columns={W2WPlanReportsSKUGridColumns}
      predefinedFilters={[]}
      apiArgs={[stockCountingPlanId]}
    />
  );
};

export default W2WPlanReportsSKUGrid;
