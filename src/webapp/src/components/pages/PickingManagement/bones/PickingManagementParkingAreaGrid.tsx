import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import TrolleyModal from '../../../organisms/TrolleyModal';
import { VehicleTypes } from '../../FlowManagement/bones/FlowManagementGrid';

const intlKey = 'PickingManagement.ParkingAreaGrid';
const titleKey = 'PickingManagement.ParkingAreaGrid.Title';

const PickingParkingAreaGrid: React.FC = () => {
  const { t } = useTranslation();
  const [isTrolleyModalOpen, setIsTrolleyModalOpen] = useState(false);
  const [trolleyLabel, setTrolleyLabel] = useState('');
  const handleLabelClick = (value: string) => {
    setTrolleyLabel(value);
    setIsTrolleyModalOpen(true);
  };
  const parkingAreaGridColumns: Array<any> = [
    {
      name: geti18nName('TrolleyAddress', t, intlKey),
      key: 'pickingTrolleyLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        return (
          <PseudoBox
            onClick={() => handleLabelClick(value)}
            color="text.link"
            display="inline"
            _hover={{ cursor: 'pointer' }}
          >
            {value}
          </PseudoBox>
        );
      },
    },
    {
      name: geti18nName('TrolleyType', t, intlKey),
      key: 'vehicleType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      columnSize: ColumnSize.Mini,
      options: getEnumOptions(t, VehicleTypes),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ToteCount', t, intlKey),
      key: 'vehicleToteCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('StagedZone', t, intlKey),
      key: 'stagedZone',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('StagedSalesOrderCount', t, intlKey),
      key: 'stagedSalesOrderCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('StagedAt', t, intlKey),
      key: 'stagedAt',
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
        gridKey={GridType.PickingManagementParkingArea}
        columns={parkingAreaGridColumns}
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

export default PickingParkingAreaGrid;
