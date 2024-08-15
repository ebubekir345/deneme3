import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import { Box, Icon, Text } from '@oplog/express';
import { StringFilterOperation } from 'dynamic-query-builder-client';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { StockCountingCellState } from '../../../../services/swagger';
import { columnProps } from '../../../../utils/columnProps';
import { filterApplier } from '../../../../utils/filterApplier';
import {
  coloredBadgeFormatter,
  getEnumOptions,
  geti18nName,
  InventoryCellLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { SearchBar } from '../../../molecules/SearchBar/SearchBar';
import { TrackW2WPlanTabs } from '../TrackW2WPlan';
import QuickFilters, { initialFilters } from './QuickFilters';
import SkuModal from './SkuModal';

const intlKey = 'TrackW2WPlan.TrackW2WPlanCountingAddressesGrid';
const titleKey = 'TrackW2WPlan.TrackW2WPlanCountingAddressesGrid.Title';

export enum CountingAddressStateColors {
  WaitingForCounting = 'palette.yellow',
  Completed = 'palette.hardGreen',
  Created = 'palette.grey',
  InProgress = 'palette.softBlue',
}

interface ITrackW2WPlanCountingAddressesGrid {
  stockCountingPlanId: string;
}

const TrackW2WPlanCountingAddressesGrid: FC<ITrackW2WPlanCountingAddressesGrid> = ({ stockCountingPlanId }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isSkuModalOpen, setIsSkuModalOpen] = useState<boolean>(false);
  const [cellId, setCellId] = useState<string>('');

  const handleBg = (value, dependentValue) => (
    <Text
      color={dependentValue !== 'None' && 'palette.white'}
      p="4"
      borderRadius="md"
      bg={`palette.${dependentValue.toLowerCase()}`}
    >
      {value}
    </Text>
  );

  useEffect(() => {
    filterApplier(GridType.QueryWallToWallStockCountingAddresses, dispatch, history, stockCountingPlanId);
  }, []);

  const trackW2WPlanCountingAddressesGridColumns: Array<any> = [
    {
      name: geti18nName('IncorrectCounted', t, intlKey),
      key: 'incorrectCounted',
      type: 'boolean',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: false,
    },
    {
      name: geti18nName('CellAddress', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      width: ColumnSize.XLarge,
      ...columnProps,
      formatter: InventoryCellLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      width: ColumnSize.XLarge,
      ...columnProps,
      options: getEnumOptions(t, StockCountingCellState),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, CountingAddressStateColors),
      getRowMetaData: () => t,
    },
    {
      name: geti18nName('SKUQuantity', t, intlKey),
      key: 'skuCount',
      type: 'number',
      ...columnProps,
      formatter: (props: FormatterProps) => (
        <Text
          color="text.link"
          textDecoration="underline"
          width={1}
          _hover={{ cursor: 'pointer' }}
          onClick={() => {
            setCellId(props.dependentValues.cellId);
            setIsSkuModalOpen(true);
          }}
        >
          {props.value}
        </Text>
      ),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('StockQuantityBeforeCount', t, intlKey),
      key: 'beforeCountingAmount',
      type: 'number',
      ...columnProps,
      formatter: (props: FormatterProps) => handleBg(props.value, props.dependentValues.beforeCountStatus),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('1stCountResult', t, intlKey),
      key: 'firstCountAmount',
      type: 'number',
      ...columnProps,
      formatter: (props: FormatterProps) => handleBg(props.value, props.dependentValues.firstCountStatus),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('2ndCountResult', t, intlKey),
      key: 'secondCountAmount',
      type: 'number',
      ...columnProps,
      formatter: (props: FormatterProps) => handleBg(props.value, props.dependentValues.secondCountStatus),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('3rdCountResult', t, intlKey),
      key: 'thirdCountAmount',
      type: 'number',
      ...columnProps,
      formatter: (props: FormatterProps) => handleBg(props.value, props.dependentValues.thirdCountStatus),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('CheckCountResult', t, intlKey),
      key: 'controlCountAmount',
      type: 'number',
      ...columnProps,
      formatter: (props: FormatterProps) => handleBg(props.value, props.dependentValues.controlCountStatus),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('FinalCountResult', t, intlKey),
      key: 'afterCountingAmount',
      type: 'number',
      ...columnProps,
    },
    {
      name: geti18nName('Lists', t, intlKey),
      key: 'stockCountingListNames',
      type: 'string',
      ...columnProps,
      formatter: (props: FormatterProps) => (
        <Box
          onClick={() => {
            localStorage.setItem(
              'filters',
              JSON.stringify([
                {
                  type: 'StringFilter',
                  property: 'name',
                  op: StringFilterOperation.In,
                  value: props.value,
                },
              ])
            );
            window.open(
              location.pathname.replace(location.pathname.split('/')[3], TrackW2WPlanTabs.CountingLists),
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
      name: geti18nName('NumberOfDamagedItems', t, intlKey),
      key: 'damagedItemCount',
      type: 'number',
      ...columnProps,
      formatter: (props: FormatterProps) => (
        <Link
          onClick={() => {
            localStorage.setItem(
              'filters',
              JSON.stringify([
                {
                  type: 'StringFilter',
                  property: 'cellLabel',
                  op: StringFilterOperation.Equals,
                  value: props.dependentValues.cellLabel,
                },
              ])
            );
          }}
          to={location.pathname.replace(location.pathname.split('/')[3], TrackW2WPlanTabs.DamagedProducts)}
          target="_blank"
        >
          {props.value}
        </Link>
      ),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ManualEntry', t, intlKey),
      key: 'allowManualEntry',
      type: 'boolean',
      ...columnProps,
      formatter: (props: FormatterProps) => (
        <Icon
          fontSize="26"
          color={props.value ? 'palette.green' : 'palette.red'}
          name={props.value ? 'fas fa-check-circle' : 'fas fa-times-circle'}
        />
      ),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('SignificantAddress', t, intlKey),
      key: 'significant',
      type: 'boolean',
      ...columnProps,
      formatter: (props: FormatterProps) => (
        <Icon
          fontSize="26"
          color={props.value ? 'palette.green' : 'palette.red'}
          name={props.value ? 'fas fa-check-circle' : 'fas fa-times-circle'}
        />
      ),
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];

  return (
    <>
      <QuickFilters grid={GridType.QueryWallToWallStockCountingAddresses} stockCountingPlanId={stockCountingPlanId} />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.QueryWallToWallStockCountingAddresses}
        columns={trackW2WPlanCountingAddressesGridColumns}
        predefinedFilters={initialFilters}
        apiArgs={[stockCountingPlanId]}
        headerContent={
          <SearchBar
            grid={GridType.QueryWallToWallStockCountingAddresses}
            searchProperty={'cellLabel'}
            placeholder={t(`${intlKey}.Placeholder`)}
            width={320}
            apiArg={stockCountingPlanId}
          />
        }
      />
      <SkuModal
        cellId={cellId}
        stockCountingPlanId={stockCountingPlanId}
        isOpen={isSkuModalOpen}
        onClose={() => setIsSkuModalOpen(false)}
      />
    </>
  );
};

export default TrackW2WPlanCountingAddressesGrid;
