import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { VehicleType } from '../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import TrolleyModal from '../../../organisms/TrolleyModal';
import { VehicleTypes } from '../../FlowManagement/bones/FlowManagementGrid';

const intlKey = 'WarehouseManagement.TrolleysGrid';
const titleKey = 'WarehouseManagement.TrolleysGrid.Title';

const trolleysGridInitialSort: SortField = new SortField({
  property: 'label',
  by: SortDirection.ASC,
});

const TrolleysGrid: React.FC = () => {
  const { t } = useTranslation();
  const [isTrolleyModalOpen, setIsTrolleyModalOpen] = useState(false);
  const [trolleyLabel, setTrolleyLabel] = useState('');
  const handleLabelClick = (value: string) => {
    setTrolleyLabel(value);
    setIsTrolleyModalOpen(true);
  };

  const trolleysGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      cellClass: 'index-column',
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('Label', t, intlKey),
      key: 'label',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        if ([VehicleType.PickingTrolley, VehicleType.RebinTrolley].includes(dependentValues.type)) {
          return (
            <PseudoBox
              onClick={() => handleLabelClick(value)}
              color="text.link"
              width={1}
              _hover={{ cursor: 'pointer' }}
            >
              {value}
            </PseudoBox>
          );
        }
        return value;
      },
    },
    {
      name: geti18nName('Type', t, intlKey),
      key: 'type',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, VehicleType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('Variation', t, intlKey),
      key: 'variation',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, VehicleTypes),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ContainerCount', t, intlKey),
      key: 'containerCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('LastSeenAddress', t, intlKey),
      key: 'lastSeenAddress',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('LastSeenAt', t, intlKey),
      key: 'lastSeenAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
  ];

  return (
    <>
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.Trolleys}
        columns={trolleysGridColumns}
        sortField={trolleysGridInitialSort}
        predefinedFilters={[]}
      />
      <TrolleyModal
        trolleyLabel={trolleyLabel}
        isOpen={isTrolleyModalOpen}
        onClose={() => setIsTrolleyModalOpen(false)}
      />
    </>
  );
};

export default TrolleysGrid;
