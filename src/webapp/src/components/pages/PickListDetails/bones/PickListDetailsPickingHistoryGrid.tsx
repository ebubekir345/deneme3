import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { ActualPickingItemState, PickListPickingHistoryOutputDTO } from '../../../../services/swagger';
import { chipFormatter, ChipFormatterProps, enumFormatter, getEnumOptions, geti18nName, ProductDetailsLinkFormatterForOtherRoutes } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'PickListDetails.PickListDetailsPickingHistoryGrid';
const titleKey = 'PickListDetails.PickListDetailsPickingHistoryGrid.Title';

interface IPickListDetailsPickingHistoryGrid {
  pickListId: string;
}

const PickListDetailsPickingHistoryGrid: React.FC<IPickListDetailsPickingHistoryGrid> = ({ pickListId }) => {
  const { t } = useTranslation();
  const PickListDetailsPickingHistoryGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      filterable: false,
      cellClass: 'index-column',
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('OperationName', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Big,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: PickListPickingHistoryOutputDTO) => {
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
      sortable: false,
      visibility: true,
      formatter: ((props: FormatterProps) => props.dependentValues.sku || t(`${intlKey}.NotDefined`)),
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
      name: geti18nName('CellLabel', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PickedProductCount', t, intlKey),
      key: 'pickedProductCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ActualPickingItemState', t, intlKey),
      key: 'actualPickingItemState',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, ActualPickingItemState),
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
      gridKey={GridType.PickListDetailsPickingHistory}
      columns={PickListDetailsPickingHistoryGridColumns}
      predefinedFilters={[]}
      apiArgs={[pickListId]}
    />
  );
};

export default PickListDetailsPickingHistoryGrid;
