import { ColumnSize, DataGridRow, FormatterProps, gridSelectors, ImageFormatter } from '@oplog/data-grid';
import { Resource } from '@oplog/resource-redux';
import { ArrayFilterOperation } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../../models';
import { SalesOrderOutputCreatedStateEnum, SalesOrdersStateDetailsOutputDTO } from '../../../../../services/swagger';
import { StoreState } from '../../../../../store/initState';
import { geti18nName, ProductDetailsLinkFormatterForOtherRoutes } from '../../../../../utils/formatters';
import { barcodeFormatter } from '../../../../../utils/formatters/barcodeFormatter';
import Badge from '../../../../atoms/Badge';
import GenericDataGrid from '../../../../atoms/GenericDataGrid';

const intlKey = 'OrderDetails.SalesOrderGrid';
const titleKey = 'OrderDetails.SalesOrderGrid.Title';

interface SalesOrderGridProps {
  orderId: string;
}

const SalesOrderGrid: React.FC<SalesOrderGridProps> = ({ orderId }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);

  const pipelineResource: Resource<SalesOrdersStateDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrderStateDetail]
  );

  const gridData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.SalesOrderQueryLineItems, state.grid)
  );

  useEffect(() => {
    setData(gridData?.map(row => row));
  }, [gridData]);

  const inboundsGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('Picture', t, intlKey),
      key: 'productImageUrl',
      locked: true,
      sortable: false,
      type: 'string',
      visibility: true,
      filterable: false,
      formatter: ImageFormatter,
      width: ColumnSize.Large,
    },
    {
      name: geti18nName('AmountInOrder', t, intlKey),
      key: 'amountInOrder',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('MissingItemAmount', t, intlKey),
      key: 'missingItemAmount',
      type: 'number',
      filterable: pipelineResource?.data?.created?.state === SalesOrderOutputCreatedStateEnum.OutOfStock,
      locked: true,
      sortable: false,
      visibility: pipelineResource?.data?.created?.state === SalesOrderOutputCreatedStateEnum.OutOfStock,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        if (value !== undefined) {
          return (
            <Badge
              bg="palette.red"
              label={t(`${intlKey}.MissingCount`, { count: value })}
              styleProps={{ fontSize: 12, height: 22 }}
            />
          );
        }
        return '-';
      },
    },
    {
      name: geti18nName('LostItemsAmount', t, intlKey),
      key: 'outOfStockMissingItemAmount',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: pipelineResource?.data?.isSendingAsMissing,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        if (value) {
          return <Badge label={t(`${intlKey}.MissingCount`, { count: value })} bg="palette.red" />;
        }
        return "-";
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('WaitingForPutAwayProductCount', t, intlKey),
      key: 'waitingForPutAwayProductCount',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: Boolean(data?.filter(row => row.waitingForPutAwayProductCount)?.length),
      formatter: (props: FormatterProps) => {
        const { value } = props;
        if (value) {
          return <Badge label={t(`${intlKey}.PutAwayCount`, { count: value })} bg="palette.red" />;
        }
        return '-';
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('WaitingForFeedingProductCount', t, intlKey),
      key: 'waitingForFeedingProductCount',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: Boolean(data?.filter(row => row.waitingForFeedingProductCount)?.length),
      formatter: (props: FormatterProps) => {
        const { value } = props;
        if (value) {
          return <Badge label={t(`${intlKey}.FeedingCount`, { count: value })} bg="palette.red" />;
        }
        return '-';
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ProductName', t, intlKey),
      key: 'productName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: ProductDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('SKU', t, intlKey),
      key: 'sku',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('Barcode', t, intlKey),
      key: 'barcodes',
      type: 'string',
      fieldType: 'array',
      searchField: '_',
      outerOp: ArrayFilterOperation.Any,
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: barcodeFormatter,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.SalesOrderQueryLineItems}
      columns={inboundsGridColumns}
      apiArgs={[orderId]}
      predefinedFilters={[]}
    />
  );
};

export default SalesOrderGrid;
