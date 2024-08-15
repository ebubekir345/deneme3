import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import { Image, Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../models';
import { geti18nName } from '../../../utils/formatters';
import GenericDataGrid from '../../atoms/GenericDataGrid';

const intlKey = 'PackageGrid';
const titleKey = 'PackageGrid.Title';

interface IPackageGrid {
  label: string;
}

const PackageGrid: React.FC<IPackageGrid> = ({ label }) => {
  const { t } = useTranslation();

  const packageGridColumns: Array<any> = [
    {
      name: geti18nName('ProductSKU', t, intlKey),
      key: 'productSKU',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'barcodes',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('ProductName', t, intlKey),
      key: 'productName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.XLarge,
    },
    {
      name: geti18nName('ProductImage', t, intlKey),
      key: 'productImageUrl',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) =>
        props.value === 'N/A' ? <Text ml={32}>-</Text> : <Image src={props.value} ml={32} width={24} height={24} />,
    },
    {
      name: geti18nName('ReceivedAmount', t, intlKey),
      key: 'receivedAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.XLarge,
      formatter: (props: FormatterProps) => <Text ml={64}>{props.value}</Text>,
    },
    {
      name: geti18nName('QuarantineAmount', t, intlKey),
      key: 'quarantineAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => <Text ml={64}>{props.value === 'N/A' ? '-' : props.value}</Text>,
    },
    {
      name: geti18nName('TotalAmount', t, intlKey),
      key: 'totalAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => <Text ml={64}>{props.value}</Text>,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.PackageGridDetails}
      columns={packageGridColumns}
      predefinedFilters={[]}
      apiArgs={[label]}
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

export default PackageGrid;
