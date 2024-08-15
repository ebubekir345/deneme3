import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Box, Text } from '@oplog/express';
import { StringFilterOperation } from 'dynamic-query-builder-client';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { WallToWallStockCountingListIndex, WallToWallStockUpdateState } from '../../../../services/swagger';
import { filterApplier } from '../../../../utils/filterApplier';
import { coloredBadgeFormatter, enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { W2WPlanReportsTabs } from '../W2WPlanReports';
import { WallToWallStockUpdateStateColors } from './W2WPlanReportsOperationGrid';

const intlKey = 'W2WPlanReports.W2WPlanReportsListsGrid';
const titleKey = 'W2WPlanReports.W2WPlanReportsListsGrid.Title';

interface IW2WPlanReportsListsGrid {
  stockCountingPlanId: string;
}

const W2WPlanReportsListsGrid: FC<IW2WPlanReportsListsGrid> = ({ stockCountingPlanId }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    filterApplier(GridType.QueryWallToWallStockCountingListsReport, dispatch, history, stockCountingPlanId);
  }, []);

  const W2WPlanReportsListsGridColumns: Array<any> = [
    {
      name: geti18nName('Lists', t, intlKey),
      key: 'stockCountingListName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ListIndex', t, intlKey),
      key: 'listIndex',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, WallToWallStockCountingListIndex),
      formatter: props => enumFormatter(props),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('CountedCell', t, intlKey),
      key: 'countedCells',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
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
                    property: 'stockCountingListNames',
                    op: StringFilterOperation.Contains,
                    value: dependentValues.stockCountingListName,
                  },
                ])
              );
            }}
            to={location.pathname.replace(location.pathname.split('/')[3], W2WPlanReportsTabs.Address)}
            target="_blank"
          >
            {value}
          </Link>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Operator', t, intlKey),
      key: 'operator',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
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
                    property: 'stockCountingListName',
                    op: StringFilterOperation.Equals,
                    value: dependentValues.stockCountingListName,
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
      name: geti18nName('CompletionTime', t, intlKey),
      key: 'completeDuration',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        let durInSec = props.value;
        const hours = Math.floor(durInSec / 3600);
        durInSec %= 3600;
        const minutes = Math.floor(durInSec / 60);
        const seconds = Math.floor(durInSec % 60);
        return (
          <Box>{`${hours.toString().length === 1 ? `0${hours}` : hours}:${minutes.toString().length === 1 ? `0${minutes}` : minutes
            }:${seconds.toString().length === 1 ? `0${seconds}` : seconds}`}</Box>
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
      gridKey={GridType.QueryWallToWallStockCountingListsReport}
      columns={W2WPlanReportsListsGridColumns}
      predefinedFilters={[]}
      apiArgs={[stockCountingPlanId]}
    />
  );
};

export default W2WPlanReportsListsGrid;
