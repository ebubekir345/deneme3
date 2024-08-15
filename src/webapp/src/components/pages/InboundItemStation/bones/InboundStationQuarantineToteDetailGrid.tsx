import { DataGridRow, FormatterProps } from '@oplog/data-grid';
import { Image } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { InboundProblemType, QuarantineToteDetailsForWebReceivingOutputDTO } from '../../../../services/swagger/api';
import useInboundItemStationStore from '../../../../store/global/inboundItemStationStore';
import {
  chipFormatter,
  ChipFormatterProps,
  enumFormatter,
  getEnumOptions,
  geti18nName,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'TouchScreen.InboundItemStation.Grids';
const titleKey = 'TouchScreen.InboundItemStation.Grids.ToteTitle';

const InboundStationQuarantineToteDetailGrid: React.FC = () => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();

  const inboundStationQuarantineToteGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operation',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: QuarantineToteDetailsForWebReceivingOutputDTO) => {
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
      formatter: (props: FormatterProps) => (props.dependentValues.barcodes == 'N/A' ? '-' : props.dependentValues.sku),
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
      formatter: (props: FormatterProps) =>
        props.dependentValues.barcodes == 'N/A' ? '-' : props.dependentValues.barcodes,
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
      formatter: (props: FormatterProps) =>
        props.dependentValues.barcodes == 'N/A' ? '-' : props.dependentValues.productName,
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
      formatter: (props: FormatterProps) =>
        props.dependentValues.barcodes == 'N/A' ? (
          '-'
        ) : (
          <Image src={props.dependentValues.productImageURL} width={24} height={24} />
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
    {
      name: geti18nName('QuarantineReason', t, intlKey),
      key: 'inboundProblemType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, InboundProblemType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.GetQuarantineToteDetails}
      columns={inboundStationQuarantineToteGridColumns}
      predefinedFilters={[]}
      apiArgs={[inboundStationState.quarantineToteLabel]}
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

export default InboundStationQuarantineToteDetailGrid;
