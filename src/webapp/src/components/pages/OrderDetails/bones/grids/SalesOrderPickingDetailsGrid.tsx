import { ColumnSize, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Box, Ellipsis, formatUtcToLocal, Widget } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../../models';
import {
  ActualPickingItemState,
  GetPickListDetailsBySalesOrderIdOutputDTO,
  PickListItemOutputDTO,
} from '../../../../../services/swagger';
import { StoreState } from '../../../../../store/initState';
import {
  chipFormatter,
  ChipFormatterProps,
  enumFormatter,
  getEnumOptions,
  geti18nName,
} from '../../../../../utils/formatters';
import GenericDataGrid from '../../../../atoms/GenericDataGrid';

const intlKey = 'OrderDetails.SalesOrderPickingDetailsGrid';
const titleKey = 'OrderDetails.SalesOrderPickingDetailsGrid.Title';

const SalesOrderPickingDetailsGridInitialSort: SortField = new SortField({
  property: 'pickedAt',
  by: SortDirection.ASC,
});
interface ISalesOrderPickingDetailsGrid {
  orderId: string;
}

function withEllipsis(text?: string): JSX.Element {
  if (text === undefined || text === '') {
    return <div>-</div>;
  }
  return (
    <div style={{ maxWidth: '200px' }}>
      <Ellipsis hasTooltip>
        {text}
      </Ellipsis>
    </div>
  );
}

const SalesOrderPickingDetailsGrid: React.FC<ISalesOrderPickingDetailsGrid> = ({ orderId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.SalesOrderGetPickListDetails, {
        salesOrderId: orderId,
      })
    );
  }, []);

  const salesOrderGetPickListDetailsResponse: Resource<GetPickListDetailsBySalesOrderIdOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SalesOrderGetPickListDetails]
  );

  const salesOrderPickingDetailsGridColumns: Array<any> = [
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
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Big,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: PickListItemOutputDTO) => {
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
      name: geti18nName('SKU', t, intlKey),
      key: 'sku',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'barcodes',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ExpectedCellLabel', t, intlKey),
      key: 'expectedCellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ActualCellLabel', t, intlKey),
      key: 'actualCellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, ActualPickingItemState),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('UserFullName', t, intlKey),
      key: 'userFullName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PickedAt', t, intlKey),
      key: 'pickedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
  ];

  const widgetFields = [
    { title: t(`${intlKey}.BatchName`), value: salesOrderGetPickListDetailsResponse?.data?.batchName || '-' },
    {
      title: t(`${intlKey}.PickingTrolleyLabel`),
      value: withEllipsis(salesOrderGetPickListDetailsResponse?.data?.pickingTrolleyLabel),
    },
    { title: t(`${intlKey}.PickListName`), value: withEllipsis(salesOrderGetPickListDetailsResponse?.data?.pickListName) },
    {
      title: t(`${intlKey}.PickingToteLabel`),
      value: withEllipsis(salesOrderGetPickListDetailsResponse?.data?.pickingToteLabel),
    },
    {
      title: t(`${intlKey}.PickingStartedAt`),
      value: salesOrderGetPickListDetailsResponse?.data?.pickingStartedAt
        ? formatUtcToLocal(salesOrderGetPickListDetailsResponse?.data?.pickingStartedAt as any)
        : '-',
    },
    {
      title: t(`${intlKey}.PickingCompletedAt`),
      value: salesOrderGetPickListDetailsResponse?.data?.pickingCompletedAt
        ? formatUtcToLocal(salesOrderGetPickListDetailsResponse?.data?.pickingCompletedAt as any)
        : '-',
    },
    { title: t(`${intlKey}.MissingPickListName`), value: salesOrderGetPickListDetailsResponse?.data?.missingPickListName || '-' },
    {
      title: t(`${intlKey}.MissingPickingToteLabel`),
      value: salesOrderGetPickListDetailsResponse?.data?.missingPickingToteLabel || '-',
    },
  ];

  const filteredWidgetFields = salesOrderGetPickListDetailsResponse?.data?.hasLostItemProblem
    ? widgetFields
    : widgetFields.filter(field =>
      field.title !== t(`${intlKey}.MissingPickListName`) && field.title !== t(`${intlKey}.MissingPickingToteLabel`)
    );

  return (
    <>
      <Box width={1} mb={16}>
        <Widget.One column={4} fields={filteredWidgetFields} isLoading={salesOrderGetPickListDetailsResponse?.isBusy} />
      </Box>
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.PickListItems}
        columns={salesOrderPickingDetailsGridColumns}
        predefinedFilters={[]}
        apiArgs={[orderId]}
        sortField={SalesOrderPickingDetailsGridInitialSort}
      />
    </>
  );
};

export default SalesOrderPickingDetailsGrid;
