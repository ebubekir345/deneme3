import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import { Box } from '@oplog/express';
import { StringFilterOperation } from 'dynamic-query-builder-client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GridType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import { columnProps } from '../../../../utils/columnProps';
import { geti18nName } from '../../../../utils/formatters';
import Badge from '../../../atoms/Badge';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { PickingManagementTabs } from '../../PickingManagement/PickingManagement';

const intlKey = 'OrderPickListProblems.ZoneListCapacityGrid';
const titleKey = 'OrderPickListProblems.ZoneListCapacityGrid.Title';

const ZoneListCapacityGrid: React.FC = () => {
  const { t } = useTranslation();

  const columnGenerator = (key: string) => {
    return {
      name: geti18nName(key.includes('Awaiting') ? 'Awaiting' : key.charAt(0).toUpperCase() + key.slice(1), t, intlKey),
      key: key,
      type: 'number',
      ...columnProps,
      ...(key.includes('Awaiting') ? null : { getRowMetaData: (row: DataGridRow) => row }),
    };
  };

  const capacityFormatter = (value: number, capacity: number) =>
    value >= capacity ? (
      <Badge bg="palette.red" label={`${value} / ${capacity}`} />
    ) : (
      <Box>{`${value} / ${capacity}`}</Box>
    );

  const zoneListCapacityGridColumns: Array<any> = [
    {
      name: geti18nName('ZoneLabel', t, intlKey),
      key: 'zoneLabel',
      type: 'string',
      ...columnProps,
      columnSize: ColumnSize.Bigger,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => (
        <Link
          onClick={() =>
            localStorage.setItem(
              'filters',
              JSON.stringify([
                {
                  type: 'StringFilter',
                  property: 'zoneName',
                  op: StringFilterOperation.Equals,
                  value: props.value,
                },
              ])
            )
          }
          to={urls.pickingManagement.replace(':tab', PickingManagementTabs.PickingLists)}
          target="_blank"
        >
          {props.value}
        </Link>
      ),
    },
    {
      ...columnGenerator('multiItemPickListCount'),
      formatter: (props: FormatterProps) =>
        capacityFormatter(props.value, props.dependentValues.multiItemPickListCapacity),
    },
    columnGenerator('multiItemPickListAwaiting'),
    {
      ...columnGenerator('singleItemPickListCount'),
      formatter: (props: FormatterProps) =>
        capacityFormatter(props.value, props.dependentValues.singleItemPickListCapacity),
    },
    columnGenerator('singleItemPickListAwaiting'),
    {
      ...columnGenerator('hovPickListCount'),
      formatter: (props: FormatterProps) => capacityFormatter(props.value, props.dependentValues.hovPickListCapacity),
    },
    columnGenerator('hovPickListAwaiting'),
    {
      ...columnGenerator('oversizePickListCount'),
      formatter: (props: FormatterProps) =>
        capacityFormatter(props.value, props.dependentValues.oversizePickListCapacity),
    },
    columnGenerator('oversizePickListAwaiting'),
    {
      ...columnGenerator('siocPickListCount'),
      formatter: (props: FormatterProps) => capacityFormatter(props.value, props.dependentValues.siocPickListCapacity),
    },
    columnGenerator('siocPickListAwaiting'),
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.QueryStockZonePickListCapacity}
      columns={zoneListCapacityGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default ZoneListCapacityGrid;
