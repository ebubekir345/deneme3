import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Button, Icon, Modal } from '@oplog/express';
import { BooleanFilterOperation, StringFilterOperation } from 'dynamic-query-builder-client';
import { QRCodeSVG } from 'qrcode.react';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { StockCountingListState, WallToWallStockCountingListIndex } from '../../../../services/swagger';
import { columnProps } from '../../../../utils/columnProps';
import { filterApplier } from '../../../../utils/filterApplier';
import { coloredBadgeFormatter, enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { SearchBar } from '../../../molecules/SearchBar/SearchBar';
import { TrackW2WPlanTabs } from '../TrackW2WPlan';
import QuickFilters, { initialFilters } from './QuickFilters';

const intlKey = 'TrackW2WPlan.TrackW2WPlanCountingListsGrid';
const titleKey = 'TrackW2WPlan.TrackW2WPlanCountingListsGrid.Title';

enum CountingListStateColors {
  Completed = 'palette.hardGreen',
  Created = 'palette.grey',
  InProgres = 'palette.softBlue',
}

interface ITrackW2WPlanCountingListsGrid {
  stockCountingPlanId: string;
}

const TrackW2WPlanCountingListsGrid: FC<ITrackW2WPlanCountingListsGrid> = ({ stockCountingPlanId }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false);
  const [qrCode, setQRCode] = useState<string>('');

  useEffect(() => {
    filterApplier(GridType.QueryWallToWallStockCountingLists, dispatch, history, stockCountingPlanId);
  }, []);

  const trackW2WPlanCountingListsGridColumns: Array<any> = [
    {
      name: geti18nName('List', t, intlKey),
      key: 'name',
      type: 'string',
      ...columnProps,
    },
    {
      name: geti18nName('Section', t, intlKey),
      key: 'sections',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('ListIndex', t, intlKey),
      key: 'listIndex',
      type: 'enum',
      ...columnProps,
      options: getEnumOptions(t, WallToWallStockCountingListIndex),
      formatter: props => enumFormatter(props),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('CountedCellAddress', t, intlKey),
      key: 'countedAddresses',
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
                    property: 'stockCountingListNames',
                    op: StringFilterOperation.Contains,
                    value: dependentValues.name,
                  },
                ])
              );
            }}
            to={location.pathname.replace(location.pathname.split('/')[3], TrackW2WPlanTabs.CountingAddresses)}
            target="_blank"
          >
            {`${value}/${dependentValues.totalAddresses}`}
          </Link>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      width: ColumnSize.XLarge,
      ...columnProps,
      options: getEnumOptions(t, StockCountingListState),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, CountingListStateColors),
      getRowMetaData: () => t,
    },
    {
      name: geti18nName('Operator', t, intlKey),
      key: 'operator',
      type: 'string',
      ...columnProps,
      sortable: false,
      filterable: false,
    },
    {
      name: geti18nName('NumberOfItemExpectedToCount', t, intlKey),
      key: 'stockAmountToBeCounted',
      type: 'number',
      ...columnProps,
    },
    {
      name: geti18nName('NumberOfAddressesCountedAsIncorrect', t, intlKey),
      key: 'incorrectCountedCellCount',
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
                    property: 'stockCountingListNames',
                    op: StringFilterOperation.Equals,
                    value: dependentValues.name,
                  },
                  {
                    type: 'BooleanFilter',
                    property: 'incorrectCounted',
                    op: BooleanFilterOperation.Equals,
                    value: true,
                  },
                ])
              );
            }}
            to={location.pathname.replace(location.pathname.split('/')[3], TrackW2WPlanTabs.CountingAddresses)}
            target="_blank"
          >
            {value}
          </Link>
        );
      },
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
      name: geti18nName('Significant', t, intlKey),
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
    {
      name: geti18nName('CreatedAt', t, intlKey),
      key: 'createdAt',
      type: 'moment',
      ...columnProps,
      formatter: dateTimeFormatter,
      width: ColumnSize.XLarge,
    },
    {
      name: geti18nName('QR', t, intlKey),
      key: 'qrCode',
      type: 'string',
      ...columnProps,
      width: ColumnSize.Large,
      formatter: (props: FormatterProps) => {
        return (
          <Button
            onClick={() => {
              setQRCode(props.value);
              setIsQRCodeOpen(true);
            }}
            variant="alternative"
            _hover={{
              backgroundColor: 'palette.lime',
            }}
          >
            <Icon name="far fa-qrcode" />
          </Button>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];

  return (
    <>
      <QuickFilters grid={GridType.QueryWallToWallStockCountingLists} stockCountingPlanId={stockCountingPlanId} />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.QueryWallToWallStockCountingLists}
        columns={trackW2WPlanCountingListsGridColumns}
        predefinedFilters={initialFilters}
        apiArgs={[stockCountingPlanId]}
        headerContent={
          <SearchBar
            grid={GridType.QueryWallToWallStockCountingLists}
            searchProperty={'name'}
            placeholder={t(`${intlKey}.Placeholder`)}
            width={320}
            apiArg={stockCountingPlanId}
          />
        }
      />
      <Modal
        showCloseButton={true}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.6,
        }}
        closeButton={<Icon color="palette.steel_darker" fontSize="22" name="fas fa-times" />}
        isOpen={isQRCodeOpen}
        onClose={() => setIsQRCodeOpen(false)}
      >
        <QRCodeSVG value={qrCode} size={600} includeMargin={true} />
      </Modal>
    </>
  );
};

export default TrackW2WPlanCountingListsGrid;
