import { DataGridRow, FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import {
  AddressType,
  ContainerType,
  ProductStockCountingListsOutputDTO,
} from '../../../../services/swagger';
import { InventoryItemTypeForQueries } from '../../../../typings/globalStore/enums';
import {
  chipFormatter,
  ChipFormatterProps,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  ProductDetailSerialCellLinkFormatter,
  ProductDetailSerialToteLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'ProductDetails.ProductDetailsSerialNumberGrid';
const titleKey = 'ProductDetails.ProductDetailsSerialNumberGrid.Title';

export interface IProductDetailsSerialNumberTrackingGrid {
  productIdFromRoute: string;
}

const ProductDetailsSerialNumberGrid: React.FC<IProductDetailsSerialNumberTrackingGrid> = ({ productIdFromRoute }) => {
  const { t } = useTranslation();

  const productDetailsSerialNumberTrackingGridColumns: Array<any> = [
    {
      name: geti18nName('OperationName', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: ProductStockCountingListsOutputDTO) => {
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
      name: geti18nName('Address', t, intlKey),
      key: 'addressLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('AddressType', t, intlKey),
      key: 'addressType',
      locked: true,
      sortable: true,
      type: 'enum',
      visibility: true,
      filterable: true,
      formatter: enumFormatter,
      options: getEnumOptions(t, AddressType),
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
          ? ProductDetailSerialToteLinkFormatter(props)
          : props.dependentValues.containerType === ContainerType.PrimeCell
            ? ProductDetailSerialCellLinkFormatter(props)
            : props.value;
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ContainerType', t, intlKey),
      key: 'containerType',
      locked: true,
      sortable: true,
      type: 'enum',
      visibility: true,
      filterable: true,
      formatter: enumFormatter,
      options: getEnumOptions(t, ContainerType),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'itemType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, InventoryItemTypeForQueries),
      formatter: enumFormatter,
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
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.InventoryItemsByProductWithSerialNumber}
      columns={productDetailsSerialNumberTrackingGridColumns}
      predefinedFilters={[]}
      apiArgs={[productIdFromRoute]}
    />
  );
};

export default ProductDetailsSerialNumberGrid;
