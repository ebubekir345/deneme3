import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Flex, formatUtcToLocal, PseudoBox } from '@oplog/express';
import { ArrayFilterOperation, SortDirection, SortField } from 'dynamic-query-builder-client';
import moment from 'moment';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import { PurchaseOrderQueryOutputDTO, PurchaseOrderSource, ReceivingState } from '../../../../services/swagger';
import {
  barcodeFormatter,
  chipFormatter,
  ChipFormatterProps,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  purchaseOrdersStatusBadgeFormatter,
} from '../../../../utils/formatters';
import Badge from '../../../atoms/Badge';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { initialFilters } from '../../ReceivingOperations/bones/QuickFilters';

const intlKey = 'ProductDetails.ProductDetailsPurchaseOrders.Grid';
const titleKey = 'ProductDetails.ProductDetailsPurchaseOrders.Grid.Title';

export interface IProductDetailsPurchaseOrdersGrid {
  productIdFromRoute: string;
}

const ProductDetailsPurchaseOrdersGridInitialSort: SortField = new SortField({
  property: 'CreatedAt',
  by: SortDirection.DESC,
});

const ProductDetailsPurchaseOrdersGrid: React.FC<IProductDetailsPurchaseOrdersGrid> = ({ productIdFromRoute }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const ProductDetailsPurchaseOrdersGridColumns: Array<any> = [
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
      name: geti18nName('OrderId', t, intlKey),
      key: 'referenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { operationId, operationName, id, source } = props.dependentValues;
        const { value } = props;
        return (
          <PseudoBox
            onClick={() =>
              history.push(
                urls.receivingOrderDetails
                  .replace(':operationId', encodeURI(operationId))
                  .replace(':operationName', encodeURI(operationName))
                  .replace(':id', encodeURI(id))
                  .replace(':referenceNumber', encodeURI(value))
                  .replace(':source', encodeURI(source))
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
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: PurchaseOrderQueryOutputDTO) => {
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
      name: geti18nName('WaybillReferenceNumbers', t, intlKey),
      key: 'waybillReferenceNumbers',
      type: 'string',
      filterable: true,
      fieldType: 'array',
      searchField: '_',
      outerOp: ArrayFilterOperation.Any,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: barcodeFormatter,
    },
    {
      name: geti18nName('WaybillCount', t, intlKey),
      key: 'waybillCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('TotalExpectedAmount', t, intlKey),
      key: 'totalExpectedAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('Source', t, intlKey),
      key: 'source',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      options: getEnumOptions(t, PurchaseOrderSource),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('CreatedAt', t, intlKey),
      key: 'createdAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('ArrivedAt', t, intlKey),
      key: 'arrivedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('ExpectedDeliveryDate', t, intlKey),
      key: 'expectedDeliveryDate',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('TargetedRecivingCompletionDateTime', t, intlKey),
      key: 'targetedRecivingCompletionDateTime',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        const isTargetDatePassed = moment(value).isBefore(moment());
        if (isTargetDatePassed) {
          return (
            <Badge bg="palette.red" label={formatUtcToLocal(value)} styleProps={{ fontSize: '13px', height: '22px' }} />
          );
        } else {
          return dateTimeFormatter(props);
        }
      },
    },
    {
      name: geti18nName('Status', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      options: getEnumOptions(t, ReceivingState),
      width: ColumnSize.Big,
      formatter: (props: FormatterProps) => purchaseOrdersStatusBadgeFormatter(t, props),
    },
    {
      name: geti18nName('ProblemCount', t, intlKey),
      key: 'problemCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        return (
          <Flex
            bg={value > 0 ? '#ffd986' : '#9ad6a6'}
            justifyContent="center"
            alignItems="center"
            color="palette.white"
            borderRadius={10}
            fontWeight={700}
          >
            {value}
          </Flex>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.PurchaseOrdersProductDetail}
      columns={ProductDetailsPurchaseOrdersGridColumns}
      sortField={ProductDetailsPurchaseOrdersGridInitialSort}
      predefinedFilters={[]}
      apiArgs={[productIdFromRoute]}
    />
  );
};

export default ProductDetailsPurchaseOrdersGrid;
