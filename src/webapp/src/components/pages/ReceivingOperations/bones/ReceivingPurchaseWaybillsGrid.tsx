import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import {
  ArrayFilterOperation,
  DateFilter,
  DateFilterOperation,
  StringFilter,
  StringFilterOperation,
} from 'dynamic-query-builder-client';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import { ActiveInboundBoxesOutputDTO, PurchaseOrderSource, ReceivingState } from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  getEnumOptions,
  geti18nName,
  openImageOnNewTabFormatter,
  purchaseOrdersStatusBadgeFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import QuickFilters, { FilterIds, FilterProperties } from './QuickFilters';

const intlKey = 'ReceivingPurchaseWaybills.Grid';
const titleKey = 'ReceivingPurchaseWaybills.Title';

const initialFilters = [
  {
    filter: new StringFilter({
      property: FilterProperties.State,
      op: StringFilterOperation.NotEqual,
      value: ReceivingState.ReceivingCompleted,
      id: FilterIds.ReceivingNotCompleted,
    }),
    selected: true,
    visibility: false,
  },
  {
    filter: new DateFilter({
      property: FilterProperties.TargetedRecivingCompletionDateTime,
      op: DateFilterOperation.LessThan,
      value: moment().toISOString(),
      dateFormat: 'YYYY-MM-DDTHH:mm',
      id: FilterIds.Date,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.State,
      op: StringFilterOperation.NotEqual,
      value: ReceivingState.AwaitingInventory,
      id: FilterIds.AwaitingInventory,
    }),
    selected: true,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.State,
      op: StringFilterOperation.NotEqual,
      value: ReceivingState.ReceivingOnHold,
      id: FilterIds.ReceivingOnHold,
    }),
    selected: true,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.State,
      op: StringFilterOperation.Equals,
      value: ReceivingState.ReceivingOnHold,
      id: FilterIds.ReceivingOnHoldEquals,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: FilterProperties.State,
      op: StringFilterOperation.Equals,
      value: ReceivingState.ReceivingCompleted,
      id: FilterIds.ReceivingCompletedEquals,
    }),
    selected: false,
    visibility: false,
  },
];

const ReceivingPurchaseWaybillsGrid = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const ReceivingPurchaseWaybillsGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: ActiveInboundBoxesOutputDTO) => {
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
      name: geti18nName('Source', t, intlKey),
      key: 'purchaseOrderSource',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PurchaseOrderSource),
    },
    {
      name: geti18nName('SupplierCompany', t, intlKey),
      key: 'supplierCompany',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PurchaseOrderReferenceNumber', t, intlKey),
      key: 'purchaseOrderReferenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { operationId, operationName, purchaseOrderId, purchaseOrderSource } = props.dependentValues;
        const { value } = props;
        return (
          <PseudoBox
            onClick={() =>
              history.push(
                urls.receivingOrderDetails
                  .replace(':operationId', encodeURI(operationId))
                  .replace(':operationName', encodeURI(operationName))
                  .replace(':id', encodeURI(purchaseOrderId))
                  .replace(':referenceNumber', encodeURI(value))
                  .replace(':source', encodeURI(purchaseOrderSource))
              )
            }
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
      name: geti18nName('WaybillReferenceNumber', t, intlKey),
      key: 'referenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { operationId, operationName, purchaseOrderId, purchaseOrderSource, id } = props.dependentValues;
        const { value } = props;
        return (
          <PseudoBox
            onClick={() =>
              history.push(
                urls.receivingWaybillDetails
                  .replace(':operationId', encodeURI(operationId))
                  .replace(':operationName', encodeURI(operationName))
                  .replace(':orderId', encodeURI(purchaseOrderId))
                  .replace(':referenceNumber', encodeURI(value))
                  .replace(':source', encodeURI(purchaseOrderSource))
                  .replace(':id', encodeURI(id))
              )
            }
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
      name: geti18nName('WaybillCreatedAt', t, intlKey),
      key: 'waybillCreatedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('WaybillImage', t, intlKey),
      key: 'documentImageURL',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: openImageOnNewTabFormatter,
    },
    {
      name: geti18nName('OperationDateTime', t, intlKey),
      key: 'operationDateTime',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : dateTimeFormatter(props)),
    },
    {
      name: geti18nName('OperatorFullName', t, intlKey),
      key: 'operatorFullName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('InboundBoxCount', t, intlKey),
      key: 'inboundBoxCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Status', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, ReceivingState),
      width: ColumnSize.Big,
      formatter: (props: FormatterProps) => purchaseOrdersStatusBadgeFormatter(t, props),
    },
    {
      name: geti18nName('TargetedRecivingCompletionDateTime', t, intlKey),
      key: 'targetedRecivingCompletionDateTime',
      type: 'moment',
      filterable: false,
      locked: true,
      sortable: true,
      visibility: false,
      formatter: dateTimeFormatter
    },
  ];

  return (
    <>
      <QuickFilters grid={GridType.ReceivingPurchaseWaybills} />
      <GenericDataGrid
        intlKey={intlKey}
        titleKey={t(titleKey)}
        gridKey={GridType.ReceivingPurchaseWaybills}
        columns={ReceivingPurchaseWaybillsGridColumns}
        predefinedFilters={initialFilters}
      />
    </>
  );
};

export default ReceivingPurchaseWaybillsGrid;
