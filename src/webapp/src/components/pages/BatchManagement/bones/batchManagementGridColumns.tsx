import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Box, Button, Ellipsis, Icon } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { BatchType, PickListQrCodeOutputDTO, PickListRequestType } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import {
  BatchDetailsLinkFormatter,
  coloredBadgeFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
} from '../../../../utils/formatters';

const intlKey = 'BatchManagement';

export enum BatchState {
  PickingNotStarted = 'PickingNotStarted',
  PickingStarted = 'PickingStarted',
  PickingCompleted = 'PickingCompleted',
  Sorting = 'Sorting',
  Packing = 'Packing',
  Packed = 'Packed',
  Failed = 'Failed',
}

enum BatchStateColors {
  PickingCompleted = 'palette.green',
  PickingNotStarted = 'palette.grey',
  PickingStarted = 'palette.blue',
  Sorting = 'palette.softBlue',
  Packing = 'palette.hardBlue',
  Packed = 'palette.green_darker',
  Failed = 'palette.red',
}

export const batchManagementGridColumns = (
  setQRCode: Function,
  setIsQRCodeOpen: Function,
  setIsWarningModalOpen: Function,
  setBatchName: Function
) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const pickListRequestsGetBatchNextQrCodeResponse: Resource<PickListQrCodeOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PickListRequestsGetBatchNextQrCode]
  );

  useEffect(() => {
    if (pickListRequestsGetBatchNextQrCodeResponse?.data) {
      setQRCode(pickListRequestsGetBatchNextQrCodeResponse.data.qrCode);
      setIsQRCodeOpen(true);
    } else if (pickListRequestsGetBatchNextQrCodeResponse?.error?.code === 404) setIsWarningModalOpen(true);
  }, [pickListRequestsGetBatchNextQrCodeResponse]);

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.PickListRequestsGetBatchNextQrCode));
    };
  }, []);

  return [
    {
      name: geti18nName('BatchName', t, intlKey),
      key: 'name',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: BatchDetailsLinkFormatter,
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
      options: getEnumOptions(t, BatchState),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, BatchStateColors),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('', t, intlKey),
      key: 'batchPickingState',
      type: 'string',
      filterable: false,
      locked: false,
      sortable: false,
      visibility: false,
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
      name: geti18nName('OrderCount', t, intlKey),
      key: 'prioritizedOrdersInBatch',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => <Box>{`${props.value} / ${props.dependentValues.ordersInBatch}`}</Box>,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('PickListCount', t, intlKey),
      key: 'startedListCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => <Box>{`${props.value} / ${props.dependentValues.pickListsInBatch}`}</Box>,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Priority', t, intlKey),
      key: 'prioritized',
      type: 'boolean',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (
        <Icon
          fontSize="26"
          color={props.value ? 'palette.green' : 'palette.red'}
          name={props.value ? 'fas fa-check-circle' : 'fas fa-times-circle'}
        />
      ),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('BatchType', t, intlKey),
      key: 'batchType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, BatchType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('CreationType', t, intlKey),
      key: 'creationType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickListRequestType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('Zone', t, intlKey),
      key: 'stockZones',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) =>
        props.value === 'N/A' ? '-' : <Ellipsis maxWidth={1000}>{props.value}</Ellipsis>,
    },
    {
      name: geti18nName('QR', t, intlKey),
      key: 'referenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Large,
      formatter: (props: FormatterProps) => {
        return props.dependentValues.pickListsInBatch ? (
          <Button
            onClick={() => {
              setBatchName(props.dependentValues.name);
              dispatch(
                resourceActions.resourceRequested(ResourceType.PickListRequestsGetBatchNextQrCode, {
                  referenceNumber: props.value,
                })
              );
            }}
            variant="alternative"
            _hover={{
              backgroundColor: 'palette.lime',
            }}
          >
            <Icon name="far fa-qrcode" />
          </Button>
        ) : (
          '-'
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];
};
