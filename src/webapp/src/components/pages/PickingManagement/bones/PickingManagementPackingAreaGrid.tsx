import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import { PseudoBox, Text } from '@oplog/express';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { PickingFlowTag, PickingMethod, PickingType } from '../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName, PickListDetailsLinkFormatter } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { ProgressBar } from '../../../atoms/TouchScreen';
import TrolleyModal from '../../../organisms/TrolleyModal';
import { VehicleTypes } from '../../FlowManagement/bones/FlowManagementGrid';

const intlKey = 'PickingManagement.PackingAreaGrid';
const titleKey = 'PickingManagement.PackingAreaGrid.Title';

const PickingManagementPackingAreaGridInitialSort: SortField = new SortField({
  property: 'timePassedSincePickingCompleted',
  by: SortDirection.DESC,
});

const PickingPackingAreaGrid: React.FC = () => {
  const { t } = useTranslation();
  const [isTrolleyModalOpen, setIsTrolleyModalOpen] = useState(false);
  const [trolleyLabel, setTrolleyLabel] = useState('');
  const handleLabelClick = (value: string) => {
    setTrolleyLabel(value);
    setIsTrolleyModalOpen(true);
  };

  let valueCheck: string = '';

  const packingAreaGridColumns: Array<any> = [
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
        valueCheck = value;
        return (
          <PseudoBox onClick={() => handleLabelClick(value)} color="text.link" width={1} _hover={{ cursor: 'pointer' }}>
            {value}
          </PseudoBox>
        );
      },
    },
    {
      name: geti18nName('WaitingPeriod', t, intlKey),
      key: 'timePassedSincePickingCompleted',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const hours = Math.floor(props.value);
        const alertHourThreshold = 8;
        return <span
          style={{
            color: hours > alertHourThreshold ? "#FFFFFF" : undefined,
            fontSize: hours > alertHourThreshold ? "10px" : undefined,
            fontFamily: hours > alertHourThreshold ? "Montserrat, Helvetica, Arial, sans-serif" : undefined,
            backgroundColor: hours > alertHourThreshold ? "#EF7D8D" : undefined,
            padding: hours > alertHourThreshold ? "2px 6px" : undefined
          }}
        >
          {`${hours} ${t("General.HoursLong")}`}
        </span>
          ;
      }
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
      name: geti18nName('PackingTableAddress', t, intlKey),
      key: 'packingAddressLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('WaitingForPackingOrderCount', t, intlKey),
      key: 'waitingPackingSalesOrdersCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('WaitingForPackingLineItemCount', t, intlKey),
      key: 'waitingPackingSalesOrdersLineItemsCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PackingProgress', t, intlKey),
      key: 'pickingTrolleyPackedItemsCount',
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
            total={dependentValues.pickingTrolleyLineItemsAmount}
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
      name: geti18nName('PickListName', t, intlKey),
      key: 'pickListName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) =>
        valueCheck.startsWith('TRNS') ? <Text>-</Text> : PickListDetailsLinkFormatter(props),
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
      formatter: (props: FormatterProps) => (valueCheck.startsWith('TRNS') ? <Text>-</Text> : enumFormatter(props)),
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
      formatter: (props: FormatterProps) => (valueCheck.startsWith('TRNS') ? <Text>-</Text> : enumFormatter(props)),
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
      formatter: (props: FormatterProps) => (valueCheck.startsWith('TRNS') ? <Text>-</Text> : enumFormatter(props)),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('PickedAt', t, intlKey),
      key: 'pickingZone',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        if (valueCheck.startsWith('TRNS')) return <Text>-</Text>;
        else {
          const { value } = props;
          return <Text>{value}</Text>;
        }
      },
    },
  ];

  return (
    <>
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.PickingManagementPackingArea}
        columns={packingAreaGridColumns}
        predefinedFilters={[]}
        sortField={PickingManagementPackingAreaGridInitialSort}
      />
      <TrolleyModal
        trolleyLabel={trolleyLabel}
        isOpen={isTrolleyModalOpen}
        onClose={() => setIsTrolleyModalOpen(false)}
      />
    </>
  );
};

export default PickingPackingAreaGrid;
