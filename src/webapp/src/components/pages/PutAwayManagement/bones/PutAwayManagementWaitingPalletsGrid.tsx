import { ColumnSize, DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { Flex, Icon, PseudoBox, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { ArrayFilterOperation } from 'dynamic-query-builder-client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { GridType, ResourceType } from '../../../../models';
import { CheckWaitingPutAwayPalletsOutputDTO, WaitingPutAwayPalletsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { chipFormatter, ChipFormatterProps, geti18nName } from '../../../../utils/formatters';
import { clearDqbFromUrl } from '../../../../utils/url-utils';
import Badge from '../../../atoms/Badge';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import PutAwayPalletModal from '../../../organisms/PutAwayPalletModal/PutAwayPalletModal';

const intlKey = 'PutAwayManagement.PutAwayManagementWaitingPalletsGrid';
const titleKey = 'PutAwayManagement.PutAwayManagementWaitingPalletsGrid.Title';

const PutAwayManagementWaitingPalletsGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [isToteModalOpen, setIsToteModalOpen] = useState(false);
  const [palletLabel, setPalletLabel] = useState('');

  const checkWaitingPallets: Resource<CheckWaitingPutAwayPalletsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CheckWaitingPallets]
  );

  const handleLabelClick = (value: string) => {
    setPalletLabel(value);
    history.replace(clearDqbFromUrl(location.pathname));
    setIsToteModalOpen(true);
  };

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.CheckWaitingPallets));
  }, []);

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
      name: geti18nName('PalletLabel', t, intlKey),
      key: 'palletLabel',
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
      getRowMetaData: (row: WaitingPutAwayPalletsOutputDTO) => {
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
    {
      name: geti18nName('Problem', t, intlKey),
      key: '',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        if (props.dependentValues.hasZoneProblem || props.dependentValues.hasExpirationDateProblem) {
          return (
            <Flex>
              {props.dependentValues.hasZoneProblem && <Badge label={t(`${intlKey}.Zone`)} bg="palette.red" />}
              {props.dependentValues.hasExpirationDateProblem && (
                <Badge styleProps={{ ml: '16' }} label={t(`${intlKey}.Exp`)} bg="palette.red" />
              )}
            </Flex>
          );
        }
        return '-';
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];

  return (
    <>
      {checkWaitingPallets?.data?.hasProblems && (
        <Flex
          height={38}
          justifyContent="center"
          alignItems="center"
          borderRadius="sm"
          bg="palette.yellow"
          color="palette.white"
          mb={16}
          fontFamily="heading"
          fontWeight={500}
          letterSpacing="small"
          fontSize={14}
        >
          <Icon name="fas fa-engine-warning" fontSize={22} mr={11} color="palette.white" />
          <Text>
            <Trans i18nKey={`${intlKey}.InfoBar`} />
          </Text>
        </Flex>
      )}
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.WaitingPallets}
        columns={putAwayManagementWaitingTotesGridColumns}
        predefinedFilters={[]}
      />
      <PutAwayPalletModal
        palletLabel={palletLabel}
        isOpen={isToteModalOpen}
        onClose={() => setIsToteModalOpen(false)}
      />
    </>
  );
};

export default PutAwayManagementWaitingPalletsGrid;
