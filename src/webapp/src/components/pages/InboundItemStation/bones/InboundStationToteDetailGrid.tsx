import { DataGridRow, FormatterProps } from '@oplog/data-grid';
import { Image } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { ReceivingToteDetailsForWebReceivingOutputDTO } from '../../../../services/swagger/api';
import useInboundItemStationStore from '../../../../store/global/inboundItemStationStore';
import {
  chipFormatter,
  ChipFormatterProps,
  geti18nName,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'TouchScreen.InboundItemStation.Grids';
const titleKey = 'TouchScreen.InboundItemStation.Grids.ToteTitle';

const InboundStationToteDetailGrid: React.FC = () => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();

  const inboundStationToteGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operation',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: ReceivingToteDetailsForWebReceivingOutputDTO) => {
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
      }
    },
    {
      name: geti18nName('ReferenceNumber', t, intlKey),
      key: 'purchaseOrdeReferenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => props.dependentValues.purchaseOrdeReferenceNumber || '-',
    },
    {
      name: geti18nName('SKU', t, intlKey),
      key: 'sku',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => props.dependentValues.sku || '-',
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'barcodes',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => props.dependentValues.barcodes || '-',
    },
    {
      name: geti18nName('ProductName', t, intlKey),
      key: 'productName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => props.dependentValues.productName || '-',
    },
    {
      name: geti18nName('ProductImageUrl', t, intlKey),
      key: 'productImageURL',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => (
        <Image src={props.dependentValues.productImageURL || '-'} width={24} height={24} />
      ),
    },
    {
      name: geti18nName('TotalAmount', t, intlKey),
      key: 'totalAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => props.dependentValues.totalAmount || '-',
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.GetReceivingToteDetails}
      columns={inboundStationToteGridColumns}
      predefinedFilters={[]}
      apiArgs={[inboundStationState.toteLabel]}
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

export default InboundStationToteDetailGrid;
