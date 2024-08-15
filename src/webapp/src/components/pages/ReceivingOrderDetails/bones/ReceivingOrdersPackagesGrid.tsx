import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { geti18nName, ReceivingWaybillDetailsLinkFormatterWithWaybillId } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { PackageModal } from '../../../organisms/PackageModal/PackageModal';

interface IReceivingOrdersPackagesGrid {
  purchaseOrderId: string;
  operationId: string;
  operationName: string;
  orderId: string;
  referenceNumber: string;
  source: string;
}

const intlKey = 'ReceivingOrderDetails.ReceivingOrdersPackagesGrid';
const titleKey = 'ReceivingOrderDetails.ReceivingOrdersPackagesGrid.Title';

const ReceivingOrdersPackagesGrid: React.FC<IReceivingOrdersPackagesGrid> = ({
  purchaseOrderId,
  operationId,
  operationName,
  orderId,
  referenceNumber,
  source,
}) => {
  const { t } = useTranslation();
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [packageLabel, setPackageLabel] = useState('');
  const handleLabelClick = (value: string) => {
    setPackageLabel(value);
    setIsPackageModalOpen(true);
  };

  const ReceivingOrdersPackagesGridColumns: Array<any> = [
    {
      name: geti18nName('Waybill', t, intlKey),
      key: 'waybillReferenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) =>
        ReceivingWaybillDetailsLinkFormatterWithWaybillId(
          props.dependentValues.waybillId,
          operationId,
          operationName,
          orderId,
          referenceNumber,
          source
        )(props),
    },
    {
      name: geti18nName('PackageLabel', t, intlKey),
      key: 'label',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
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
      name: geti18nName('CreatedAt', t, intlKey),
      key: 'createdAt',
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
        gridKey={GridType.ReceivingOrdersPackagesGrid}
        columns={ReceivingOrdersPackagesGridColumns}
        apiArgs={[purchaseOrderId]}
        predefinedFilters={[]}
      />
      <PackageModal label={packageLabel} isOpen={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} />
    </>
  );
};

export default ReceivingOrdersPackagesGrid;
