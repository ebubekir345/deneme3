import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Badge, formatUtcToLocal, PseudoBox } from '@oplog/express';
import { SortDirection, SortField } from 'dynamic-query-builder-client';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
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
import { clearDqbFromUrl } from '../../../../utils/url-utils';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import PackageModal from '../../../organisms/PackageModal/PackageModal';

const intlKey = 'ReceivingPurchasePackages.Grid';
const titleKey = 'ReceivingPurchasePackages.Title';

const ReceivingPurchasePackagesGridInitialSort: SortField = new SortField({
  property: 'targetedRecivingCompletionDateTime',
  by: SortDirection.ASC,
});

const ReceivingPurchasePackagesGrid = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [packageLabel, setPackageLabel] = useState('');

  const handleLabelClick = (value: string) => {
    setPackageLabel(value);
    history.replace(clearDqbFromUrl(location.pathname));
    setIsPackageModalOpen(true);
  };

  const ReceivingPurchasePackagesGridColumns: Array<any> = [
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
      name: geti18nName('ArrivedAt', t, intlKey),
      key: 'arrivedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('LastSeenAddress', t, intlKey),
      key: 'addressLabel',
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
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('OperatorName', t, intlKey),
      key: 'operatorName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
    {
      name: geti18nName('ExpectedProcessDate', t, intlKey),
      key: 'expectedDeliveryDate',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('TargetedRecivingCompletionDateTime', t, intlKey),
      key: 'targetedRecivingCompletionDateTime',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        const isTargetDatePassed = moment(value).isBefore(moment());
        if (isTargetDatePassed) {
          return (
            <Badge bg="palette.red" label={formatUtcToLocal(value)} styleProps={{ fontSize: '13px', height: '22px' }} />
          );
        } else {
          return dateTimeFormatter(props);
        }
      },
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
    {
      name: geti18nName('ContainerType', t, intlKey),
      key: 'isPallet',
      type: 'boolean',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        return (
          <Badge
            bg={props.value ? 'palette.green' : 'palette.blue'}
            label={props.value ? t(`${intlKey}.Pallet`) : t(`${intlKey}.Box`)}
          />
        );
      },
    },
  ];

  return (
    <>
      <GenericDataGrid
        intlKey={intlKey}
        titleKey={t(titleKey)}
        gridKey={GridType.ReceivingPurchasePackages}
        columns={ReceivingPurchasePackagesGridColumns}
        sortField={ReceivingPurchasePackagesGridInitialSort}
        predefinedFilters={[]}
      />
      <PackageModal label={packageLabel} isOpen={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} />
    </>
  );
};

export default ReceivingPurchasePackagesGrid;
