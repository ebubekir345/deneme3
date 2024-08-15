import { DataGridRow, FormatterProps } from '@oplog/data-grid';
import { Image } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { SalesOrderPackingState, SingleItemPickingToteDetailsOutputDTO } from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  getEnumOptions,
  geti18nName,
  salesOrderStatusBadgeFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'PickingManagement.SingleItemPickingToteGrid';
const titleKey = 'PickingManagement.SingleItemPickingToteGrid.Title';

interface ISingleItemPickingToteGrid {
  toteLabel: string;
}

const SingleItemPickingToteGrid: React.FC<ISingleItemPickingToteGrid> = ({ toteLabel }) => {
  const { t } = useTranslation();

  const singleItemPickingToteGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operation',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: SingleItemPickingToteDetailsOutputDTO) => {
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
      key: 'salesOrderLineItem',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => props.dependentValues.salesOrderLineItem.sku || '-',
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'salesOrderLineItem',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => props.dependentValues.salesOrderLineItem.barcodes || '-',
    },
    {
      name: geti18nName('ProductName', t, intlKey),
      key: 'salesOrderLineItem',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => props.dependentValues.salesOrderLineItem.productName || '-',
    },
    {
      name: geti18nName('ProductImageUrl', t, intlKey),
      key: 'salesOrderLineItem',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => (
        <Image src={props.dependentValues.salesOrderLineItem.imageUrl || ''} width={24} height={24} />
      ),
    },
    {
      name: geti18nName('SalesOrderState', t, intlKey),
      key: 'salesOrderPackingState',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, SalesOrderPackingState),
      formatter: (props: FormatterProps) => salesOrderStatusBadgeFormatter(t, props),
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.SingleItemPickingToteDetails}
      columns={singleItemPickingToteGridColumns}
      predefinedFilters={[]}
      apiArgs={[toteLabel]}
      isModalGrid={true}
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

export default SingleItemPickingToteGrid;
