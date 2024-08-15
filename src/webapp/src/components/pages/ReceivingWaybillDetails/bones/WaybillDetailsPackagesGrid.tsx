import { dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { PackageModal } from '../../../organisms/PackageModal/PackageModal';

interface IWaybillDetailsPackagesGrid {
  id: string;
}

const intlKey = 'ReceivingWaybillDetails.WaybillDetailsPackagesGrid';
const titleKey = 'ReceivingWaybillDetails.WaybillDetailsPackagesGrid.Title';

const WaybillDetailsPackagesGrid: React.FC<IWaybillDetailsPackagesGrid> = ({ id }) => {
  const { t } = useTranslation();
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [packageLabel, setPackageLabel] = useState('');
  const handleLabelClick = (value: string) => {
    setPackageLabel(value);
    setIsPackageModalOpen(true);
  };

  const WaybillDetailsPackagesGridColumns: Array<any> = [
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
        gridKey={GridType.WaybillDetailsPackagesGrid}
        columns={WaybillDetailsPackagesGridColumns}
        apiArgs={[id]}
        predefinedFilters={[]}
      />
      <PackageModal label={packageLabel} isOpen={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} />
    </>
  );
};

export default WaybillDetailsPackagesGrid;
