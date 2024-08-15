import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import { Ellipsis, PseudoBox } from '@oplog/express';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import { ActiveInboundBoxesOutputDTO, ReceivingState } from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  getEnumOptions,
  geti18nName,
  purchaseOrdersStatusBadgeFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import PackageModal from '../../../organisms/PackageModal/PackageModal';

const intlKey = 'ActiveReceivingPurchaseOrders.Grid';
const titleKey = 'ActiveReceivingPurchaseOrders.Title';

const ActiveReceivingPurchaseOrdersGrid = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [packageLabel, setPackageLabel] = useState('');

  const handleLabelClick = (value: string) => {
    setPackageLabel(value);
    setIsPackageModalOpen(true);
  };

  const ActiveReceivingPurchaseOrdersGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: ActiveInboundBoxesOutputDTO) => {
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
      name: geti18nName('OrderId', t, intlKey),
      key: 'purchaseOrderReferenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { operationId, operationName, purchaseOrderId, source } = props.dependentValues;
        const { value } = props;
        return (
          <PseudoBox
            onClick={() =>
              history.push(
                urls.receivingOrderDetails
                  .replace(':operationId', encodeURI(operationId))
                  .replace(':operationName', encodeURI(operationName))
                  .replace(':id', encodeURI(purchaseOrderId))
                  .replace(':referenceNumber', encodeURI(value))
                  .replace(':source', encodeURI(source))
              )
            }
            color="text.link"
            width={1}
            _hover={{ cursor: 'pointer' }}
          >
            {value}
          </PseudoBox>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('WaybillReferenceNumber', t, intlKey),
      key: 'waybillReferenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const {
          operationId,
          operationName,
          purchaseOrderId,
          waybillReferenceNumber,
          source,
          waybillId,
        } = props.dependentValues;
        const { value } = props;
        return (
          <PseudoBox
            onClick={() =>
              history.push(
                urls.receivingWaybillDetails
                  .replace(':operationId', encodeURI(operationId))
                  .replace(':operationName', encodeURI(operationName))
                  .replace(':orderId', encodeURI(purchaseOrderId))
                  .replace(':referenceNumber', encodeURI(waybillReferenceNumber))
                  .replace(':source', encodeURI(source))
                  .replace(':id', encodeURI(waybillId))
              )
            }
            color="text.link"
            width={1}
            _hover={{ cursor: 'pointer' }}
          >
            {value}
          </PseudoBox>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('PackageId', t, intlKey),
      key: 'inboundBoxLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
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
      name: geti18nName('ToteLabel', t, intlKey),
      key: 'toteLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('QuarantineToteLabel', t, intlKey),
      key: 'quarantineToteLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('AddressLabel', t, intlKey),
      key: 'inboundAddressLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('OperatorName', t, intlKey),
      key: 'operatorName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
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
      formatter: (props: FormatterProps) =>
        props.value === 'N/A' ? (
          props.value
        ) : (
          <Ellipsis>
            {moment(props.value)
              .add(3, 'hours')
              .format('DD.MM.YYYY HH:mm')}
          </Ellipsis>
        ),
    },
    {
      name: geti18nName('Status', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      options: getEnumOptions(t, ReceivingState),
      width: ColumnSize.Big,
      formatter: (props: FormatterProps) => purchaseOrdersStatusBadgeFormatter(t, props),
    },
  ];

  return (
    <>
      <GenericDataGrid
        intlKey={intlKey}
        titleKey={t(titleKey)}
        gridKey={GridType.ActiveReceivingPurchaseOrders}
        columns={ActiveReceivingPurchaseOrdersGridColumns}
        predefinedFilters={[]}
      />
      <PackageModal label={packageLabel} isOpen={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} />
    </>
  );
};

export default ActiveReceivingPurchaseOrdersGrid;
