import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { PickingFlowTag, PickingMethod, PickingType } from '../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName, PickListDetailsLinkFormatter } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { ProgressBar } from '../../../atoms/TouchScreen';
import TrolleyModal from '../../../organisms/TrolleyModal';
import { VehicleTypes } from '../../FlowManagement/bones/FlowManagementGrid';

const intlKey = 'PickingManagement.ActivePickingsGrid';
const titleKey = 'PickingManagement.ActivePickingsGrid.Title';

const PickingActivePickingsGrid: React.FC = () => {
  const { t } = useTranslation();
  const [isTrolleyModalOpen, setIsTrolleyModalOpen] = useState(false);
  const [trolleyLabel, setTrolleyLabel] = useState('');
  const handleLabelClick = (value: string) => {
    setTrolleyLabel(value);
    setIsTrolleyModalOpen(true);
  };
  const activePickingsGridColumns: Array<any> = [
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
          <PseudoBox onClick={() => handleLabelClick(value)} color="text.link" width={1} _hover={{ cursor: 'pointer' }}>
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
      name: geti18nName('PickingStartedAt', t, intlKey),
      key: 'pickingStartedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('OperatorFullName', t, intlKey),
      key: 'operatorFullName',
      type: 'string',
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
    {
      name: geti18nName('PickingProgress', t, intlKey),
      key: 'pickingTrolleyPickedItemsCount',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Bigger,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return (
          <ProgressBar
            label
            current={value}
            total={dependentValues.pickingTrolleyItemsCount}
            barColor="palette.blue"
            containerColor="palette.grey_lighter"
            completeColor="palette.blue"
            borderRadius="lg"
            height="16px"
            withPercentage
            labelSize="13px"
          />
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('PickingTrolleyItemsCount', t, intlKey),
      key: 'pickingTrolleyItemsCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PickingZone', t, intlKey),
      key: 'pickingZone',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PickListName', t, intlKey),
      key: 'pickListName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: PickListDetailsLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('PickingFlowTag', t, intlKey),
      key: 'pickingFlowTag',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickingFlowTag),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('PickingMethod', t, intlKey),
      key: 'pickingMethod',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickingMethod),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('PickingType', t, intlKey),
      key: 'pickingType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickingType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
  ];

  return (
    <>
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.PickingManagementActivePickings}
        columns={activePickingsGridColumns}
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

export default PickingActivePickingsGrid;
