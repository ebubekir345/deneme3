import { ColumnSize, FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { StockCellStatusOutputDTO } from '../../../../services/swagger';
import { chipFormatter, ChipFormatterProps, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'PutAwayManagement.PutAwayManagementCellStatusGrid';
const titleKey = 'PutAwayManagement.PutAwayManagementCellStatusGrid.Title';

const PutAwayManagementCellStatusGrid: React.FC = () => {
  const { t } = useTranslation();
  const putAwayManagementCellStatusGridColumns: Array<any> = [
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
      name: geti18nName('CellLabel', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('CurrentStockZone', t, intlKey),
      key: 'currentStockZone',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('ProductAmount', t, intlKey),
      key: 'productAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductVariety', t, intlKey),
      key: 'productVariety',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('OperationCount', t, intlKey),
      key: 'operationCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Operations', t, intlKey),
      key: 'operations',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: StockCellStatusOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '15px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          list: row.operations?.map(operation => ({ name: operation.name, imageUrl: operation.imageUrl })),
          imageUrlPropertyOfListItem: 'imageUrl',
          isUpperCase: true,
        } as ChipFormatterProps;
      },
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.PutAwayManagementCellStatus}
      columns={putAwayManagementCellStatusGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default PutAwayManagementCellStatusGrid;
