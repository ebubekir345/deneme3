import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Button, Icon } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  PickingCapacityUnit,
  PickingFlowTag,
  PickingMethod,
  PickingType,
  PickListGenerationType,
  PickListState,
} from '../../../../../services/swagger';
import {
  enumFormatter,
  getEnumOptions,
  geti18nName,
  PickListDetailsLinkFormatter,
} from '../../../../../utils/formatters';
import { VehicleTypes } from '../../../FlowManagement/bones/FlowManagementGrid';

const intlKey = 'PickingManagement.PickingListsGrid';

export const pickingListsColumns = (setQRCode: Function, setIsQRCodeOpen: Function) => {
  const { t } = useTranslation();

  return [
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
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickListState),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('VehicleVariation', t, intlKey),
      key: 'vehicleVariation',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) =>
        Object.keys(VehicleTypes).includes(props.value) ? enumFormatter(props) : props.value,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('Capacity', t, intlKey),
      key: 'capacity',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('SalesOrderCount', t, intlKey),
      key: 'salesOrderCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
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
      name: geti18nName('CapacityUnit', t, intlKey),
      key: 'capacityUnit',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickingCapacityUnit),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
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
    {
      name: geti18nName('ZoneName', t, intlKey),
      key: 'zoneName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('TargetedDispatchDate', t, intlKey),
      key: 'targetDispatchDateTime',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('PickingTrolleyLabel', t, intlKey),
      key: 'pickingTrolleyLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
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
      name: geti18nName('CreatedAt', t, intlKey),
      key: 'createdAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('CreationType', t, intlKey),
      key: 'pickListGenerationType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickListGenerationType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('QRCode', t, intlKey),
      key: 'qrCode',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Large,
      formatter: (props: FormatterProps) => {
        return (
          <Button
            onClick={() => {
              setQRCode(props.value);
              setIsQRCodeOpen(true);
            }}
            variant="alternative"
            _hover={{
              backgroundColor: 'palette.lime',
            }}
          >
            <Icon name="far fa-qrcode" />
          </Button>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];
};
