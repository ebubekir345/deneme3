import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import { Ellipsis, formatUtcToLocal } from '@oplog/express';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import { Link } from 'react-router-dom';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { geti18nName, appendImageToTextFieldFormatter, openImageOnNewTabFormatter } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { urls } from '../../../../routers/urls';

const intlKey = 'DispatchHistory.Grid';
const titleKey = 'DispatchHistory.Grid.Title';

const DispatchHistoryInitialSort: SortField = new SortField({
  property: 'createdAt',
  by: SortDirection.DESC,
});

const DispatchHistory: React.FC = () => {
  const { t } = useTranslation();
  const DispatchHistoryColumns: Array<any> = [
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
      name: geti18nName('CreatedAt', t, intlKey),
      key: 'createdAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return (
          <Link to={urls.dispatchDetails.replace(':id', encodeURI(dependentValues.dispatchProcessId))}>
            <Ellipsis>{formatUtcToLocal(value)}</Ellipsis>
          </Link>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Carrier', t, intlKey),
      key: 'carrierName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => appendImageToTextFieldFormatter(props, 'carrierLogoURL'),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('SalesOrdersCount', t, intlKey),
      key: 'salesOrdersCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('CargoPackagesCount', t, intlKey),
      key: 'cargoPackagesCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('DocumentImage', t, intlKey),
      key: 'documentImageURL',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: openImageOnNewTabFormatter,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.DispatchHistory}
      columns={DispatchHistoryColumns}
      predefinedFilters={[]}
      sortField={DispatchHistoryInitialSort}
    />
  );
};

export default DispatchHistory;
