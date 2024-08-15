import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps, gridActions } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import { StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { GridType } from '../../../../models';
import { VehicleType } from '../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import TransferTrolleyModal from '../../../organisms/TransferTrolleyModal';
import TrolleyModal from '../../../organisms/TrolleyModal';
import QuickFilterBar from '../../../molecules/QuickFilterBar';

const intlKey = 'Problems.PickingProblems.TransferTrolleysGrid';
const titleKey = 'Problems.PickingProblems.TransferTrolleysGrid.Title';

const TrolleyLabelFilters = {
  All: 'All',
  PickingTrolley: VehicleType.PickingTrolley,
  TransferTrolley: VehicleType.TransferTrolley,
};

const TransferTrolleysGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [modalData, setModalData] = useState<{ value?: string; trolleyType?: string }>({
    value: undefined,
    trolleyType: undefined,
  });
  const [activeQuickFilters, setActiveQuickFilters] = useState(TrolleyLabelFilters.All);

  const quickFilterButtons = Object.keys(TrolleyLabelFilters).map(status => ({
    key: status,
    title: t(`Problems.PickingProblems.QuickFilters.${status}`),
    isSelected: activeQuickFilters === status,
    onClick: () => {
      setActiveQuickFilters(status);
      applyQuickFilter(status);
    },
  }));

  const applyQuickFilter = (status: string) => {
    let appliedFilter = status === 'All' ? [] : [
      new StringFilter({
        property: 'trolleyType',
        op: StringFilterOperation.Equals,
        value: status,
        id: status,
      }),
    ];

    dispatch(gridActions.gridPaginationOffsetReset(GridType.TransferTrolleys));
    dispatch(gridActions.gridFiltersSubmitted(GridType.TransferTrolleys, appliedFilter, []));
    dispatch(gridActions.gridFetchRequested(GridType.TransferTrolleys));
  };

  const handleLabelClick = (value: string, trolleyType: VehicleType) => {
    setModalData({
      value,
      trolleyType,
    });
  };

  const transferTrolleysGridColumns: Array<any> = [
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
      name: geti18nName('TransferTrolleyLabel', t, intlKey),
      key: 'transferTrolleyLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return (
          <PseudoBox
            onClick={() => handleLabelClick(value, dependentValues.trolleyType)}
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
      name: geti18nName('TrolleyType', t, intlKey),
      key: 'trolleyType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, VehicleType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('LastSeenAddress', t, intlKey),
      key: 'lastSeenAddress',
      type: 'string',
      filterable: false,
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
  ];

  return (
    <>
      <QuickFilterBar filterButtons={quickFilterButtons} />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.TransferTrolleys}
        columns={transferTrolleysGridColumns}
        predefinedFilters={[]}
      />
      <TransferTrolleyModal
        trolleyLabel={modalData.value || ''}
        isOpen={modalData.trolleyType === VehicleType.TransferTrolley}
        onClose={() => setModalData({ value: undefined, trolleyType: undefined })}
      />
      <TrolleyModal
        trolleyLabel={modalData.value || ''}
        isOpen={modalData.trolleyType === VehicleType.PickingTrolley}
        onClose={() => setModalData({ value: undefined, trolleyType: undefined })}
      />
    </>
  );
};

export default TransferTrolleysGrid;
