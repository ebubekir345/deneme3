import { ColumnSize, DataGridRow, FormatterProps, gridSelectors } from '@oplog/data-grid';
import { Image } from '@oplog/express';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GridType } from '../../../../models';
import { SalesOrderPackingState, SingleItemSalesOrdersToteDetailsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import {
  chipFormatter,
  ChipFormatterProps,
  getEnumOptions,
  geti18nName,
  salesOrderStatusBadgeFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'TouchScreen.SingleItemPackingStation.SingleItemPackingToteGrid';
const titleKey = 'TouchScreen.SingleItemPackingStation.SingleItemPackingToteGrid.Title';

interface ISingleItemPackingToteGrid {
  processId: string;
}

const SingleItemPackingToteGrid: React.FC<ISingleItemPackingToteGrid> = ({ processId }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);

  const gridData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.SingleItemSalesOrdersToteDetails, state.grid)
  );

  useEffect(() => {
    setData(gridData?.map(row => row));
  }, [gridData]);

  const singleItemPackingToteGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operation',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: SingleItemSalesOrdersToteDetailsOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '15px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          text: row.operation?.name,
          imageUrl: row.operation?.imageUrl,
          isUpperCase: true,
        } as ChipFormatterProps;
      },
    },
    {
      name: geti18nName('ReferenceNumber', t, intlKey),
      key: 'referenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('SKU', t, intlKey),
      key: 'singleItemSalesOrderLineItem',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) =>
        props.dependentValues.singleItemSalesOrderLineItem.sku === 'N/A'
          ? '-'
          : props.dependentValues.singleItemSalesOrderLineItem.sku,
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'singleItemSalesOrderLineItem',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) =>
        props.dependentValues.singleItemSalesOrderLineItem.barcodes === 'N/A'
          ? '-'
          : props.dependentValues.singleItemSalesOrderLineItem.barcodes,
    },
    {
      name: geti18nName('ProductName', t, intlKey),
      key: 'singleItemSalesOrderLineItem',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) =>
        props.dependentValues.singleItemSalesOrderLineItem.productName === 'N/A'
          ? '-'
          : props.dependentValues.singleItemSalesOrderLineItem.productName,
    },
    {
      name: geti18nName('ProductImageUrl', t, intlKey),
      key: 'singleItemSalesOrderLineItem',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => (
        <Image src={props.dependentValues.singleItemSalesOrderLineItem.imageUrl || ''} width={24} height={24} />
      ),
    },
    {
      name: geti18nName('SalesOrderState', t, intlKey),
      key: 'salesOrderPackingState',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      options: getEnumOptions(t, SalesOrderPackingState),
      formatter: (props: FormatterProps) => salesOrderStatusBadgeFormatter(t, props),
    },
    {
      name: geti18nName('SerialNumber', t, intlKey),
      key: 'serialNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      width: ColumnSize.Bigger,
      visibility: Boolean(data?.filter((row: object) => row['serialNumber'] !== 'N/A')?.length),
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.SingleItemSalesOrdersToteDetails}
      columns={singleItemPackingToteGridColumns}
      predefinedFilters={[]}
      apiArgs={[processId]}
      hideHeader
      filtersDisabled
      gridCss={`
      .react-grid-Container .react-grid-Main .react-grid-Grid {
        min-height: 500px !important;
      }
      .react-grid-Header {
        top: 0px !important;
      }
      `}
    />
  );
};

export default SingleItemPackingToteGrid;
