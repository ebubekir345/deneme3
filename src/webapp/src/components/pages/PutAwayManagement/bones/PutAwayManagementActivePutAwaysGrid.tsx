import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { ProgressBar } from '../../../atoms/TouchScreen';
import PutAwayTrolleyModal from '../../../organisms/PutAwayTrolleyModal';

const intlKey = 'PutAwayManagement.PutAwayManagementActivePutAwaysGrid';
const titleKey = 'PutAwayManagement.PutAwayManagementActivePutAwaysGrid.Title';

const PutAwayManagementActivePutAwaysGrid: React.FC = () => {
  const { t } = useTranslation();
  const [isTrolleyModalOpen, setIsTrolleyModalOpen] = useState(false);
  const [trolleyLabel, setTrolleyLabel] = useState('');
  const handleLabelClick = (value: string) => {
    setTrolleyLabel(value);
    setIsTrolleyModalOpen(true);
  };
  const putAwayManagementActivePutAwaysGridColumns: Array<any> = [
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
      name: geti18nName('TrolleyLabel', t, intlKey),
      key: 'trolleyLabel',
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
      name: geti18nName('VehicleToteCount', t, intlKey),
      key: 'vehicleToteCount',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('TotalItemsCount', t, intlKey),
      key: 'totalItemsCount',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('ContainedItemsCount', t, intlKey),
      key: 'containedItemsCount',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('PutAwayStartedAt', t, intlKey),
      key: 'putAwayStartedAt',
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
      name: geti18nName('PutAwayProgress', t, intlKey),
      key: 'percentage',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.Bigger,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return (
          <ProgressBar
            label
            current={dependentValues.percentage}
            total={100}
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
  ];

  return (
    <>
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.PutAwayManagementActivePutAways}
        columns={putAwayManagementActivePutAwaysGridColumns}
        predefinedFilters={[]}
      />
      <PutAwayTrolleyModal
        trolleyLabel={trolleyLabel}
        isOpen={isTrolleyModalOpen}
        onClose={() => setIsTrolleyModalOpen(false)}
      />
    </>
  );
};

export default PutAwayManagementActivePutAwaysGrid;
