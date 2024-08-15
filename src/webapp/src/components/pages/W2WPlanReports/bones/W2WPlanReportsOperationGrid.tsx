import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Text } from '@oplog/express';
import { StringFilterOperation } from 'dynamic-query-builder-client';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GridType } from '../../../../models';
import { WallToWallStockUpdateState } from '../../../../services/swagger';
import { coloredBadgeFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { W2WPlanReportsTabs } from '../W2WPlanReports';

const intlKey = 'W2WPlanReports.W2WPlanReportsOperationGrid';
const titleKey = 'W2WPlanReports.W2WPlanReportsOperationGrid.Title';

export enum WallToWallStockUpdateStateColors {
  None = 'palette.grey',
  Awaiting = 'palette.blue',
  InProgress = 'palette.hardBlue',
  Completed = 'palette.green',
}

interface IW2WPlanReportsOperationGrid {
  stockCountingPlanId: string;
}

const W2WPlanReportsOperationGrid: FC<IW2WPlanReportsOperationGrid> = ({ stockCountingPlanId }) => {
  const { t } = useTranslation();

  const W2WPlanReportsOperationGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
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
                    property: 'operationName',
                    op: StringFilterOperation.Equals,
                    value: dependentValues.operationName,
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
                    property: 'operationName',
                    op: StringFilterOperation.Equals,
                    value: dependentValues.operationName,
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
      gridKey={GridType.QueryWallToWallStockCountingOperationsReport}
      columns={W2WPlanReportsOperationGridColumns}
      predefinedFilters={[]}
      apiArgs={[stockCountingPlanId]}
    />
  );
};

export default W2WPlanReportsOperationGrid;
