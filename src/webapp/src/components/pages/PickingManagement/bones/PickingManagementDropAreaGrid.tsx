import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { GridType } from '../../../../models';
import { PickingFlowTag, PickingMethod, PickingType } from '../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName, PickListDetailsLinkFormatter } from '../../../../utils/formatters';
import { clearDqbFromUrl } from '../../../../utils/url-utils';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { ProgressBar } from '../../../atoms/TouchScreen';
import SingleItemPickingToteModal from '../../../organisms/SingleItemPickingToteModal';

const intlKey = 'PickingManagement.DropAreaGrid';
const titleKey = 'PickingManagement.DropAreaGrid.Title';

const PickingManagementDropAreaGrid: React.FC = () => {
  const { t } = useTranslation();
  const [isToteModalOpen, setIsToteModalOpen] = useState(false);
  const [toteLabel, setToteLabel] = useState('');
  const history = useHistory();

  const handleLabelClick = (value: string) => {
    setToteLabel(value);
    history.replace(clearDqbFromUrl(location.pathname));
    setIsToteModalOpen(true);
  };

  const dropAreaGridColumns: Array<any> = [
    {
      name: geti18nName('ToteLabel', t, intlKey),
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
      name: geti18nName('ToteAddress', t, intlKey),
      key: 'addressLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ItemCount', t, intlKey),
      key: 'itemCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('PackingProgress', t, intlKey),
      key: 'packingPercentage',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: true,
      visibility: true,
      width: ColumnSize.Bigger,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        return (
          <ProgressBar
            label
            current={value}
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
    },
    {
      name: geti18nName('PickListName', t, intlKey),
      key: 'pickListName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : PickListDetailsLinkFormatter(props)),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('PickingFlowTag', t, intlKey),
      key: 'pickingFlow',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickingFlowTag),
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : enumFormatter(props)),
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
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : enumFormatter(props)),
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
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : enumFormatter(props)),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('PickedAt', t, intlKey),
      key: 'zoneLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : props.value),
    },
  ];

  return (
    <>
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.PickingManagementDropArea}
        columns={dropAreaGridColumns}
        predefinedFilters={[]}
      />
      <SingleItemPickingToteModal
        toteLabel={toteLabel}
        isOpen={isToteModalOpen}
        onClose={() => setIsToteModalOpen(false)}
      />
    </>
  );
};

export default PickingManagementDropAreaGrid;
