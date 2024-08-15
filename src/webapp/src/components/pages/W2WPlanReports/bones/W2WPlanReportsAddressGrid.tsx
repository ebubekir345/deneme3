import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Box, Icon, Text } from '@oplog/express';
import { StringFilterOperation } from 'dynamic-query-builder-client';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { WallToWallStockUpdateState } from '../../../../services/swagger';
import { columnProps } from '../../../../utils/columnProps';
import { filterApplier } from '../../../../utils/filterApplier';
import {
  coloredBadgeFormatter,
  getEnumOptions,
  geti18nName,
  InventoryCellLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { W2WPlanReportsTabs } from '../W2WPlanReports';
import { WallToWallStockUpdateStateColors } from './W2WPlanReportsOperationGrid';

const intlKey = 'W2WPlanReports.W2WPlanReportsAddressGrid';
const titleKey = 'W2WPlanReports.W2WPlanReportsAddressGrid.Title';

interface IW2WPlanReportsAddressGrid {
  stockCountingPlanId: string;
}

const W2WPlanReportsAddressGrid: FC<IW2WPlanReportsAddressGrid> = ({ stockCountingPlanId }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    filterApplier(GridType.QueryWallToWallStockCountingAddressesReport, dispatch, history, stockCountingPlanId);
  }, []);

  const W2WPlanReportsAddressGridColumns: Array<any> = [
    {
      name: geti18nName('CellAddress', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      ...columnProps,
      formatter: InventoryCellLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('SKUCountBeforeCounting', t, intlKey),
      key: 'skuCountBeforeCounting',
      type: 'number',
      ...columnProps,
    },
    {
      name: geti18nName('StockBeforeCount', t, intlKey),
      key: 'stockCountBeforeCounting',
      type: 'number',
      ...columnProps,
    },
    {
      name: geti18nName('1stCountResult', t, intlKey),
      key: 'firstCountAmount',
      type: 'number',
      ...columnProps,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('2ndCountResult', t, intlKey),
      key: 'secondCountAmount',
      type: 'number',
      ...columnProps,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('3rdCountResult', t, intlKey),
      key: 'thirdCountAmount',
      type: 'number',
      ...columnProps,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('CheckCountResult', t, intlKey),
      key: 'controlCountAmount',
      type: 'number',
      ...columnProps,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('SKUCountAfterCounting', t, intlKey),
      key: 'skuCountAfterCounting',
      type: 'number',
      ...columnProps,
    },
    {
      name: geti18nName('StockAfterCount', t, intlKey),
      key: 'stockCountAfterCounting',
      type: 'number',
      ...columnProps,
    },
    {
      name: geti18nName('SKUDifference', t, intlKey),
      key: 'skuDifference',
      type: 'number',
      ...columnProps,
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
      name: geti18nName('StockDifference', t, intlKey),
      key: 'stockDifference',
      type: 'number',
      ...columnProps,
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
      ...columnProps,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('DamagedItemQuantity', t, intlKey),
      key: 'damagedItemCount',
      type: 'number',
      ...columnProps,
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
                    property: 'cellLabel',
                    op: StringFilterOperation.Equals,
                    value: dependentValues.cellLabel,
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
      ...columnProps,
      sortable: false,
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
      ...columnProps,
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
      gridKey={GridType.QueryWallToWallStockCountingAddressesReport}
      columns={W2WPlanReportsAddressGridColumns}
      predefinedFilters={[]}
      apiArgs={[stockCountingPlanId]}
    />
  );
};

export default W2WPlanReportsAddressGrid;
