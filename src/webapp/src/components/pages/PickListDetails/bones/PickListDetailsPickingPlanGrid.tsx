import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { ExpectedPickingItemState, PickListPickingPlanOutputDTO } from '../../../../services/swagger';
import { chipFormatter, ChipFormatterProps, enumFormatter, getEnumOptions, geti18nName, OrderDetailsLinkFormatterForOtherRoutes } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'PickListDetails.PickListDetailsPickingPlanGrid';
const titleKey = 'PickListDetails.PickListDetailsPickingPlanGrid.Title';

interface IPickListDetailsPickingPlanGrid {
  pickListId: string;
}

const PickListDetailsPickingPlanGrid: React.FC<IPickListDetailsPickingPlanGrid> = ({ pickListId }) => {
  const { t } = useTranslation();
  const PickListDetailsPickingPlanGridColumns: Array<any> = [
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
      name: geti18nName('TargetCellLabel', t, intlKey),
      key: 'targetCellLabel',
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
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: PickListPickingPlanOutputDTO) => {
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
      name: geti18nName('ReferenceNumber', t, intlKey),
      key: 'salesOrderReferenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: OrderDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
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
      name: geti18nName('ExpectedProductCount', t, intlKey),
      key: 'expectedProductCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ExpectedPickingItemState', t, intlKey),
      key: 'expectedPickingItemState',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, ExpectedPickingItemState),
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
      gridKey={GridType.PickListDetailsPickingPlan}
      columns={PickListDetailsPickingPlanGridColumns}
      predefinedFilters={[]}
      apiArgs={[pickListId]}
    />
  );
};

export default PickListDetailsPickingPlanGrid;
