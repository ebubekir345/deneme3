import { DataGridRow, FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import {
  AddressType,
  ContainerType,
  StockItemQueryOutputDTO,
} from '../../../../services/swagger';
import { InventoryItemTypeForQueries } from '../../../../typings/globalStore/enums';
import {
  chipFormatter,
  ChipFormatterProps,
  coloredBadgeFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
  StocksCellLinkFormatter,
  StocksToteLinkFormatter,
  StocksTrolleyLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { ProductStateColors } from '../../../molecules/StocksNoStockGrid/StocksNoStockGrid';

const intlKey = 'SerialNumberTrack.StockGrid';
const titleKey = 'SerialNumberTrack.StockGrid.Title';

const SNStockGrid: React.FC = () => {
  const { t } = useTranslation();
  const serialNumberTrackGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: StockItemQueryOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '16px',
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
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'barcodes',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('ProductName', t, intlKey),
      key: 'productName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: ProductDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Address', t, intlKey),
      key: 'addressLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) =>
        props.dependentValues.isVehicle ? StocksTrolleyLinkFormatter(props) : props.value,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('AddressType', t, intlKey),
      key: 'addressType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, AddressType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ContainerLabel', t, intlKey),
      key: 'containerLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        return props.dependentValues.containerType === ContainerType.Tote
          ? StocksToteLinkFormatter(props)
          : props.dependentValues.containerType === ContainerType.PrimeCell ||
            props.dependentValues.containerType === ContainerType.ReservedCell
            ? StocksCellLinkFormatter(props)
            : props.value;
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ContainerType', t, intlKey),
      key: 'containerType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, ContainerType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ItemType', t, intlKey),
      key: 'itemType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, InventoryItemTypeForQueries),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, ProductStateColors),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('SerialNumber', t, intlKey),
      key: 'serialNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.SerialNumberTrack}
      columns={serialNumberTrackGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default SNStockGrid;
