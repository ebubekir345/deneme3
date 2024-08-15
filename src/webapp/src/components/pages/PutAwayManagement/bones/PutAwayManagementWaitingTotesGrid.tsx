import { ColumnSize, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import { ArrayFilterOperation } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { GridType } from '../../../../models';
import { WaitingPutAwayTotesOutputDTO } from '../../../../services/swagger';
import { chipFormatter, ChipFormatterProps, geti18nName } from '../../../../utils/formatters';
import { clearDqbFromUrl } from '../../../../utils/url-utils';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import PutAwayToteModal from '../../../organisms/PutAwayToteModal';

const intlKey = 'PutAwayManagement.PutAwayManagementWaitingTotesGrid';
const titleKey = 'PutAwayManagement.PutAwayManagementWaitingTotesGrid.Title';

const PutAwayManagementWaitingTotesGrid: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const [isToteModalOpen, setIsToteModalOpen] = useState(false);
  const [toteLabel, setToteLabel] = useState('');

  const handleLabelClick = (value: string) => {
    setToteLabel(value);
    history.replace(clearDqbFromUrl(location.pathname));
    setIsToteModalOpen(true);
  };
  const putAwayManagementWaitingTotesGridColumns: Array<any> = [
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
      name: geti18nName('ToteLabel', t, intlKey),
      key: 'toteLabel',
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
      name: geti18nName('ProductAmount', t, intlKey),
      key: 'productAmount',
      type: 'number',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('ProductVariety', t, intlKey),
      key: 'productVariety',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Operations', t, intlKey),
      key: 'operations',
      type: 'string',
      filterable: false,
      fieldType: 'array',
      searchField: 'name',
      outerOp: ArrayFilterOperation.Any,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: WaitingPutAwayTotesOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '15px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          list: row.operations?.map(operation => ({ name: operation.name, imageUrl: operation.imageUrl })),
          imageUrlPropertyOfListItem: 'imageUrl',
          isUpperCase: true,
        } as ChipFormatterProps;
      },
    },
    {
      name: geti18nName('Address', t, intlKey),
      key: 'lastSeenAddress',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('LastProcessDate', t, intlKey),
      key: 'lastSeenAt',
      type: 'moment',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: dateTimeFormatter,
    },
  ];

  return (
    <>
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.PutAwayManagementWaitingTotes}
        columns={putAwayManagementWaitingTotesGridColumns}
        predefinedFilters={[]}
      />
      <PutAwayToteModal toteLabel={toteLabel} isOpen={isToteModalOpen} onClose={() => setIsToteModalOpen(false)} />
    </>
  );
};

export default PutAwayManagementWaitingTotesGrid;
