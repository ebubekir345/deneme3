import { ColumnSize, dateTimeFormatter, FormatterProps, ImageFormatter } from '@oplog/data-grid';
import { ArrayFilterOperation } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { ProductQueryOutputDTO, ProductType } from '../../../../services/swagger';
import {
  barcodeFormatter,
  chipFormatter,
  ChipFormatterProps,
  enumFormatter,
  getEnumOptions,
  geti18nName,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'ZoneDetails.ZoneDetailsProductsGrid';
const titleKey = 'ZoneDetails.ZoneDetailsProductsGrid.Title';

interface IZoneDetailsProductsGrid {
  zoneId: string;
}

const ZoneDetailsProductsGrid: React.FC<IZoneDetailsProductsGrid> = ({ zoneId }) => {
  const { t } = useTranslation();
  const ZoneDetailsProductsGridColumns: Array<any> = [
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
      getRowMetaData: (row: ProductQueryOutputDTO) => {
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
      name: geti18nName('Sku', t, intlKey),
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
      fieldType: 'array',
      searchField: '_',
      outerOp: ArrayFilterOperation.Any,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: barcodeFormatter,
    },
    {
      name: geti18nName('ImageUrl', t, intlKey),
      key: 'imageURL',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: ImageFormatter,
    },
    {
      name: geti18nName('ProductName', t, intlKey),
      key: 'name',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductType', t, intlKey),
      key: 'type',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, ProductType),
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
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.ZoneDetailsProductsGrid}
      columns={ZoneDetailsProductsGridColumns}
      predefinedFilters={[]}
      apiArgs={[zoneId]}
    />
  );
};

export default ZoneDetailsProductsGrid;
