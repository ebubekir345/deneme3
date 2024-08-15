import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { PseudoBox, Text } from '@oplog/express';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import { StockCountingListState, StockCountingType } from '../../../../services/swagger';
import {
  CountingListDetailsLinkFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { ProgressBar } from '../../../atoms/TouchScreen';

const intlKey = 'OtherCountings.ActiveCountingsGrid';
const titleKey = 'OtherCountings.ActiveCountingsGrid.Title';

const ActiveCountingsGrid: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const countingListsGridColumns: Array<any> = [
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
      name: geti18nName('ReferenceNumber', t, intlKey),
      key: 'referenceNumber',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.XLarge,
      formatter: CountingListDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'stockCountingListProcessedItemCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Bigger,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return (
          <ProgressBar
            label
            current={value}
            total={dependentValues.stockCountingListItemCount}
            barColor="palette.blue"
            containerColor="palette.grey_lighter"
            completeColor="palette.blue"
            borderRadius="lg"
            height="16px"
            withPercentage
            labelSize="13px"
          />
        );
      },
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
      name: geti18nName('Source', t, intlKey),
      key: 'source',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) =>
        props.value === 'N/A' ? '-' : props.value === 'System' ? 'Sistem' : props.value,
    },
    {
      name: geti18nName('Zone', t, intlKey),
      key: 'zoneName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('StockCountingPlanReferenceNumber', t, intlKey),
      key: 'stockCountingPlanReferenceNumber',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { stockCountingPlanId } = props.dependentValues;
        const { value } = props;
        if (value !== 'N/A')
          return (
            <PseudoBox
              onClick={() =>
                history.push(
                  urls.countingPlanDetails.replace(':referenceNumber', encodeURI(value)).replace(':id', encodeURI(stockCountingPlanId))
                )
              }
              color="text.link"
              width={1}
              _hover={{ cursor: 'pointer' }}
            >
              {value}
            </PseudoBox>
          );
        return '-';
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('CreatedByFullName', t, intlKey),
      key: 'processedByFullName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('StartedAt', t, intlKey),
      key: 'startedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('PriorityStatus', t, intlKey),
      key: 'isPrioritized',
      type: 'boolean',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        if (!dependentValues.isPrioritized) {
          return '-';
        } else if (dependentValues.state === StockCountingListState.Completed && dependentValues.isPrioritized) {
          return <Text fontWeight={700}>{t(`${intlKey}.Prioritized`)}</Text>;
        } else {
          return (
            <Text color="palette.orange" fontWeight={700}>
              {t(`${intlKey}.Prioritized`)}
            </Text>
          );
        }
      },
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.ActiveCountings}
      columns={countingListsGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default ActiveCountingsGrid;
