import { ColumnSize, dateTimeFormatter, ImageFormatter } from '@oplog/data-grid';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import { useTranslation } from 'react-i18next';
import * as React from 'react';
import { GridType } from '../../../../models';
import { geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'ProductDetails.ProductsByProductDefinitionGrid';
const titleKey = 'ProductDetails.ProductsByProductDefinitionGrid.Title';

const productsByProductDefinitionGridInitialSort: SortField = new SortField({
  property: 'createdAt',
  by: SortDirection.DESC,
});

export interface IProductsByProductDefinitionGrid {
  productIdFromRoute: string;
}

const ProductsByProductDefinitionGrid: React.FC<IProductsByProductDefinitionGrid> = ({ productIdFromRoute }) => {
  const { t } = useTranslation();
  const productsByProductDefinitionGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      locked: true,
      sortable: false,
      type: 'number',
      visibility: true,
      filterable: false,
      cellClass: 'index-column',
      width: ColumnSize.Medium,
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
      gridKey={GridType.ProductsByProductDefinition}
      columns={productsByProductDefinitionGridColumns}
      apiArgs={[productIdFromRoute]}
      sortField={productsByProductDefinitionGridInitialSort}
      predefinedFilters={[]}
    />
  );
};

export default ProductsByProductDefinitionGrid;
